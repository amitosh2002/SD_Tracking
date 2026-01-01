import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import apiClient from "./utils/axiosConfig";
// import githubLogo from "./assets/platformIcons/TaskPlat/github.svg";
// import horaLogo from "./assets/platformIcons/horaLogo.svg";
// import "./Platform/styles/createBranch.scss"; // Reuse styles
import apiClient from "../utils/axiosConfig";
import { ButtonV1 } from "../customFiles/customComponent/CustomButtons";
import { SHOW_SNACKBAR } from "../Redux/Constants/PlatformConstatnt/platformConstant";

const GithubAdminConfig = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { projectId: initialProjectId } = location.state || {};

    const [configData, setConfigData] = useState({
        githubSecretCode: "",
        projectId: initialProjectId || "",
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialProjectId) {
            fetchExistingConfig(initialProjectId);
        }
    }, [initialProjectId]);

    const fetchExistingConfig = async (pid) => {
        try {
            const res = await apiClient.get(`/api/gihub-repo/config/${pid}`);
            if (res.data.success) {
                setConfigData({
                    githubSecretCode: "", // Don't show the hashed code
                    projectId: res.data.config.projectId,
                });
            }
        } catch (err) {
            console.log("No existing config found");
        }
    };

    const handleSave = async () => {
        if (!configData.projectId || !configData.githubSecretCode) {
            dispatch({
                type: SHOW_SNACKBAR,
                payload: { message: "Please fill all fields", type: "error" },
            });
            return;
        }

        setIsLoading(true);
        try {
            const res = await apiClient.post("/api/gihub-repo/config", {
                projectId: configData.projectId,
                githubSecretCode: configData.githubSecretCode,
            });

            if (res.data.success) {
                dispatch({
                    type: SHOW_SNACKBAR,
                    payload: { message: "Configuration Saved Successfully!", type: "success" },
                });
                setTimeout(() => navigate(-1), 1500);
            }
        } catch (err) {
            dispatch({
                type: SHOW_SNACKBAR,
                payload: {
                    message: err.response?.data?.message || "Failed to save configuration",
                    type: "error",
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="github_container">
            <div className="create-branch-container" style={{maxWidth: '500px'}}>
                <div className="icon_container">
                    {/* <img src={githubLogo} alt="github" />
                    <img src={horaLogo} alt="hora" /> */}
                </div>
                <h2 className="Lg_body_bold" style={{ marginTop: "20px" }}>Admin GitHub Configuration</h2>
                <p className="Sm_body_regular" style={{ color: "#666", marginBottom: "30px" }}>
                    Configure GitHub Personal Access Token for the project.
                </p>

                <div className="form_group" style={{width: '100%', textAlign: 'left'}}>
                    <label className="input_label">Project ID</label>
                    <input
                        type="text"
                        className="input_tag"
                        value={configData.projectId}
                        onChange={(e) => setConfigData({ ...configData, projectId: e.target.value })}
                        placeholder="Enter Project ID"
                    />
                </div>

                <div className="form_group" style={{width: '100%', textAlign: 'left', marginTop: '20px'}}>
                    <label className="input_label">GitHub Personal Access Token (PAT)</label>
                    <input
                        type="password"
                        className="input_tag"
                        value={configData.githubSecretCode}
                        onChange={(e) => setConfigData({ ...configData, githubSecretCode: e.target.value })}
                        placeholder="Paste your token here"
                    />
                    <p style={{fontSize: '11px', color: '#888', marginTop: '5px'}}>
                        Ensure token has 'repo' (classic) or 'Contents: Write' (fine-grained) permissions.
                    </p>
                </div>

                <div style={{ marginTop: "30px", width: "100%", display: 'flex', gap: '10px' }}>
                    <ButtonV1
                        text={isLoading ? "Saving..." : "Save Configuration"}
                        type="primary"
                        onClick={handleSave}
                        disabled={isLoading}
                        style={{flex: 1}}
                    />
                    <ButtonV1
                        text="Cancel"
                        type="secondary"
                        onClick={() => navigate(-1)}
                        style={{flex: 1}}
                    />
                </div>
            </div>
        </div>
    );
};

export default GithubAdminConfig;
