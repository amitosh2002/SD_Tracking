import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import apiClient from "./utils/axiosConfig";
// import githubLogo from "./assets/platformIcons/TaskPlat/github.svg";
// import horaLogo from "./assets/platformIcons/horaLogo.svg";
// import "./Platform/styles/createBranch.scss"; // Reuse styles
// import apiClient from "../utils/axiosConfig";
import { ButtonV1 } from "../customFiles/customComponent/CustomButtons";
import { SHOW_SNACKBAR } from "../Redux/Constants/PlatformConstatnt/platformConstant";
import { getAllProjects } from "../Redux/Actions/PlatformActions.js/projectsActions";
import apiClient from "../utils/axiosConfig";

// const GithubAdminConfig = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { projectId: initialProjectId } = location.state || {};

//     const [configData, setConfigData] = useState({
//         githubSecretCode: "",
//         projectId: initialProjectId || "",
//     });
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         if (initialProjectId) {
//             fetchExistingConfig(initialProjectId);
//         }
//     }, [initialProjectId]);

//     const fetchExistingConfig = async (pid) => {
//         try {
//             const res = await apiClient.get(`/api/gihub-repo/config/${pid}`);
//             if (res.data.success) {
//                 setConfigData({
//                     githubSecretCode: "", // Don't show the hashed code
//                     projectId: res.data.config.projectId,
//                 });
//             }
//         } catch (err) {
//             console.log("No existing config found");
//         }
//     };

//     const handleSave = async () => {
//         if (!configData.projectId || !configData.githubSecretCode) {
//             dispatch({
//                 type: SHOW_SNACKBAR,
//                 payload: { message: "Please fill all fields", type: "error" },
//             });
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const res = await apiClient.post("/api/gihub-repo/config", {
//                 projectId: configData.projectId,
//                 githubSecretCode: configData.githubSecretCode,
//             });

//             if (res.data.success) {
//                 dispatch({
//                     type: SHOW_SNACKBAR,
//                     payload: { message: "Configuration Saved Successfully!", type: "success" },
//                 });
//                 setTimeout(() => navigate(-1), 1500);
//             }
//         } catch (err) {
//             dispatch({
//                 type: SHOW_SNACKBAR,
//                 payload: {
//                     message: err.response?.data?.message || "Failed to save configuration",
//                     type: "error",
//                 },
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="github_container">
//             <div className="create-branch-container" style={{maxWidth: '500px'}}>
//                 <div className="icon_container">
//                     {/* <img src={githubLogo} alt="github" />
//                     <img src={horaLogo} alt="hora" /> */}
//                 </div>
//                 <h2 className="Lg_body_bold" style={{ marginTop: "20px" }}>Admin GitHub Configuration</h2>
//                 <p className="Sm_body_regular" style={{ color: "#666", marginBottom: "30px" }}>
//                     Configure GitHub Personal Access Token for the project.
//                 </p>

//                 <div className="form_group" style={{width: '100%', textAlign: 'left'}}>
//                     <label className="input_label">Project ID</label>
//                     <input
//                         type="text"
//                         className="input_tag"
//                         value={configData.projectId}
//                         onChange={(e) => setConfigData({ ...configData, projectId: e.target.value })}
//                         placeholder="Enter Project ID"
//                     />
//                 </div>

//                 <div className="form_group" style={{width: '100%', textAlign: 'left', marginTop: '20px'}}>
//                     <label className="input_label">GitHub Personal Access Token (PAT)</label>
//                     <input
//                         type="password"
//                         className="input_tag"
//                         value={configData.githubSecretCode}
//                         onChange={(e) => setConfigData({ ...configData, githubSecretCode: e.target.value })}
//                         placeholder="Paste your token here"
//                     />
//                     <p style={{fontSize: '11px', color: '#888', marginTop: '5px'}}>
//                         Ensure token has 'repo' (classic) or 'Contents: Write' (fine-grained) permissions.
//                     </p>
//                 </div>

//                 <div style={{ marginTop: "30px", width: "100%", display: 'flex', gap: '10px' }}>
//                     <ButtonV1
//                         text={isLoading ? "Saving..." : "Save Configuration"}
//                         type="primary"
//                         onClick={handleSave}
//                         disabled={isLoading}
//                         style={{flex: 1}}
//                     />
//                     <ButtonV1
//                         text="Cancel"
//                         type="secondary"
//                         onClick={() => navigate(-1)}
//                         style={{flex: 1}}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default GithubAdminConfig;
// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import apiClient from "../utils/axiosConfig";
// import { ButtonV1 } from "../customFiles/customComponent/CustomButtons";
// import { SHOW_SNACKBAR } from "../Redux/Constants/PlatformConstatnt/platformConstant";
// import { getAllProjects } from "../Redux/Actions/PlatformActions.js/projectsActions";
// import "./styles/GithubAdminConfig.scss";

const GithubAdminConfig = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { projectId: initialProjectId } = location.state || {};

    // Redux State
    const { projects } = useSelector((state) => state.projects);
    const { userDetails } = useSelector((state) => state.user);

    // Local State
    const [configData, setConfigData] = useState({
        githubSecretCode: "",
        projectId: initialProjectId || "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [existingConfigs, setExistingConfigs] = useState([]);
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [selectedSourceProject, setSelectedSourceProject] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (userDetails?.id) {
            dispatch(getAllProjects(userDetails.id));
        }
        fetchAllConfigs();
    }, [userDetails, dispatch]);

    const fetchAllConfigs = async () => {
        try {
            const res = await apiClient.get("/api/gihub-repo/config/all");
            if (res.data.success) {
                setExistingConfigs(res.data.configs || []);
            }
        } catch (err) {
            console.error("Failed to fetch existing configs");
        }
    };

    const handleCopyFromExisting = async () => {
        if (!selectedSourceProject || !configData.projectId) {
            dispatch({ type: SHOW_SNACKBAR, payload: { message: "Select source and target", type: "error" } });
            return;
        }

        setIsLoading(true);
        try {
            const res = await apiClient.post("/api/gihub-repo/config/copy", {
                sourceProjectId: selectedSourceProject,
                targetProjectId: configData.projectId,
            });

            if (res.data.success) {
                dispatch({ type: SHOW_SNACKBAR, payload: { message: "Config Copied!", type: "success" } });
                setShowCopyModal(false);
                fetchAllConfigs();
            }
        } catch (err) {
            dispatch({ type: SHOW_SNACKBAR, payload: { message: "Copy failed", type: "error" } });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!configData.projectId || !configData.githubSecretCode) {
            dispatch({ type: SHOW_SNACKBAR, payload: { message: "Missing fields", type: "error" } });
            return;
        }

        setIsLoading(true);
        try {
            const res = await apiClient.post("/api/gihub-repo/config", configData);
            if (res.data.success) {
                dispatch({ type: SHOW_SNACKBAR, payload: { message: "Saved!", type: "success" } });
                setTimeout(() => navigate(-1), 1500);
            }
        } catch (err) {
            dispatch({ type: SHOW_SNACKBAR, payload: { message: "Save failed", type: "error" } });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="github-admin-wrapper">
            <div className="admin-card">
                <div className="header-section">
                    <div className="icon-badge">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                    </div>
                    <h2>GitHub Admin Access</h2>
                    <p>Securely link Personal Access Tokens to your projects.</p>
                </div>

                <div className="form-content">
                    {/* Project Dropdown */}
                    <div className="form-item">
                        <label>Select Target Project</label>
                        <select 
                            className="admin-input"
                            value={configData.projectId}
                            onChange={(e) => setConfigData({...configData, projectId: e.target.value})}
                        >
                            <option value="">-- Choose a Project --</option>
                            {projects?.map(p => (
                                <option key={p._id} value={p._id}>{p.projectName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Token Input with Show/Hide */}
                    <div className="form-item">
                        <label>GitHub PAT</label>
                        <div className="input-with-icon">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="admin-input"
                                value={configData.githubSecretCode}
                                onChange={(e) => setConfigData({ ...configData, githubSecretCode: e.target.value })}
                                placeholder="ghp_xxxxxxxxxxxx"
                            />
                            <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Reuse Button */}
                    {existingConfigs.length > 0 && configData.projectId && (
                        <div className="reuse-section">
                            <button className="text-btn" onClick={() => setShowCopyModal(true)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                </svg>
                                Use token from another project
                            </button>
                        </div>
                    )}
                </div>

                <div className="footer-actions">
                    <ButtonV1 text={isLoading ? "Saving..." : "Save Config"} type="primary" onClick={handleSave} disabled={isLoading} />
                    <ButtonV1 text="Cancel" type="secondary" onClick={() => navigate(-1)} />
                </div>
            </div>

            {/* Copy Modal */}
            {showCopyModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>Copy Configuration</h3>
                        <p>Select a project that already has a verified token.</p>
                        <select 
                            className="admin-input"
                            onChange={(e) => setSelectedSourceProject(e.target.value)}
                        >
                            <option value="">-- Select Source --</option>
                            {existingConfigs.map(c => (
                                <option key={c.projectId} value={c.projectId}>
                                    {projects.find(p => p._id === c.projectId)?.projectName || c.projectId}
                                </option>
                            ))}
                        </select>
                        <div className="modal-btns">
                            <ButtonV1 text="Confirm Copy" onClick={handleCopyFromExisting} type="primary" />
                            <ButtonV1 text="Close" onClick={() => setShowCopyModal(false)} type="secondary" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GithubAdminConfig;