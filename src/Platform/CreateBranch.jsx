import React, { useReducer, useEffect, useState, useCallback, useMemo } from "react";
import "./styles/createBranch.scss";
// import copyIcon from "../assets/platformIcons/TaskPlat/copyIcon.svg";
import { ButtonV1 } from "../customFiles/customComponent/CustomButtons";
import { useDispatch as useReduxDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import apiClient from "../utils/axiosConfig";
import { SHOW_SNACKBAR } from "../Redux/Constants/PlatformConstatnt/platformConstant";
import { 
    HelpCircle, 
    GitBranch, 
    Terminal, 
    Globe, 
    Info, 
    ShieldCheck, 
    Zap,
    ChevronRight,
    Lock
} from "lucide-react";
import { CustomDropDownV3 } from "../customFiles/customComponent/DropDown";

const initialState = {
    repos: [],
    branches: [],
    selectedRepo: '',
    baseBranch: 'main',
    newBranchName: '',
    createdBranchUrl: '',
    isLoading: false,
    isFetchingBranches: false,
    repositories:[],
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_REPOS':
            return { ...state, repos: action.payload };
        case 'SET_BRANCHES':
            return { ...state, branches: action.payload, isFetchingBranches: false };
        case 'SET_SELECTED_REPO':
            return { ...state, selectedRepo: action.payload, branches: [], baseBranch: 'main' };
        case 'SET_BASE_BRANCH':
            return { ...state, baseBranch: action.payload };
        case 'SET_NEW_BRANCH_NAME':
            return { ...state, newBranchName: action.payload };
        case 'SET_CREATED_URL':
            return { ...state, createdBranchUrl: action.payload, isLoading: false };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'START_FETCHING_BRANCHES':
            return { ...state, isFetchingBranches: true };
        case 'SET_REPOSITORIES':
            return { ...state, repositories: action.payload };
        default:
            return state;
    }
}

const CreateBranch = () => {
    const location = useLocation();
    // const navigate = useNavigate();
    const reduxDispatch = useReduxDispatch();
    
    // Support both state and query params
    const getParams = useCallback(() => {
        console.log("DEBUG: getParams called. location.state:", location.state, "location.search:", location.search);
        if (location.state && Object.keys(location.state).length > 0) {
            return location.state;
        }
        const searchParams = new URLSearchParams(location.search);
        const params = {
            ticketId: searchParams.get('ticketId'),
            ticketTitle: searchParams.get('ticketTitle'),
            ticketKey: searchParams.get('ticketKey'),
            projectId: searchParams.get('projectId')
        };
        console.log("DEBUG: Extracted search params:", params);
        return params;
    }, [location]);

    const params = getParams();
    const { ticketId, ticketKey, projectId } = params;
    const [hasCreated, setHasCreated] = useState(false);

    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        newBranchName: ticketKey || ''
    });

    const [focusedField, setFocusedField] = useState('welcome');
    const { branches, selectedRepo, baseBranch, newBranchName, createdBranchUrl, isLoading, isFetchingBranches } = state;

    const fetchRepos = useCallback(async (pid) => {
        console.log("DEBUG: fetchRepos triggered for pid:", pid);
        try {
            console.log("DEBUG: Making request to /api/auth/github/repos");
            const res = await apiClient.get(`/api/auth/github/repos?projectId=${pid}`);
            console.log("DEBUG: fetchRepos API response:", res.data);
            // dispatch({ type: 'SET_REPOS', payload: res.data.repos });
            if (res.data.success) {
                dispatch({ type: 'SET_REPOS', payload: res.data.repos });
            }
        } catch (err) {
            console.error("DEBUG: fetchRepos error:", err);
            reduxDispatch({ type: SHOW_SNACKBAR, payload: { message: "Failed to fetch repositories", type: "error" } });
        }
    }, [reduxDispatch]);
    const getProjectRepositories = useMemo(() => {
        return Array.isArray(state.repos) ? state.repos.map((repo) => ({
            value: repo.fullName || repo.full_name, // Backend use fullName, github API uses full_name
            label: repo.name
        })) : [];
    }, [state.repos]);

    const getProjectBranches = useMemo(() => {
        return Array.isArray(branches) ? branches.map((branch) => ({
            value: branch.name,
            label: branch.name
        })) : [];
    }, [branches]);

    const fetchConfig = useCallback(async (pid) => {
        try {
            console.log("DEBUG: fetchConfig started for pid:", pid);
            const res = await apiClient.get(`/api/platform/v1/projects/${pid}`);
            console.log("DEBUG: projects API raw response:", res.data);
            
            // The backend getProjectById returns an array [projectObj]
            const projectArray = Array.isArray(res.data) ? res.data : [];
            const projectData = projectArray.length > 0 ? projectArray[0] : null;
            
            console.log("DEBUG: Extracted projectData:", projectData);

            if (projectData && projectData.isGithubConnected) {
                console.log("DEBUG: isGithubConnected is TRUE. Calling fetchRepos...");
                fetchRepos(pid);
            } else {
                console.warn("DEBUG: GitHub connection blocked. isGithubConnected:", projectData?.isGithubConnected);
                reduxDispatch({ 
                    type: SHOW_SNACKBAR, 
                    payload: { message: "GitHub not connected for this project according to DB", type: "error" } 
                });
            }
        } catch (err) {
            console.error("DEBUG: fetchConfig CATCH error:", err);
            reduxDispatch({ type: SHOW_SNACKBAR, payload: { message: "Failed to verify project configuration", type: "error" } });
        }
    }, [fetchRepos, reduxDispatch]);

    const fetchBranches = useCallback(async (repoName) => {
        console.log("DEBUG: fetchBranches called with:", { projectId, repoName });
        if (!projectId || !repoName) {
            console.warn("DEBUG: Missing projectId or repoName", { projectId, repoName });
            return;
        }
        dispatch({ type: 'START_FETCHING_BRANCHES' });
        try {
            console.log("DEBUG: Making API call to fetch branches for:", repoName);
            const res = await apiClient.get(`/api/auth/github/branches?projectId=${projectId}&repoName=${repoName}`);
            console.log("DEBUG: Branches API response:", res.data);
            dispatch({ type: 'SET_BRANCHES', payload: Array.isArray(res.data.branches) ? res.data.branches : [] });
        } catch (err) {
            console.error("DEBUG: Fetch branches error:", err);
            dispatch({ type: 'SET_BRANCHES', payload: [] });
            reduxDispatch({ type: SHOW_SNACKBAR, payload: { message: "Failed to fetch branches", type: "error" } });
        }
    }, [projectId, reduxDispatch]);

    useEffect(() => {
        console.log("DEBUG: Config Effect running. projectId:", projectId);
        if (projectId) {
            fetchConfig(projectId);
        } else {
            console.error("DEBUG: No projectId found in params");
            reduxDispatch({ type: SHOW_SNACKBAR, payload: { message: "No project context found", type: "error" } });
            // navigate(-1);
        }
    }, [projectId, fetchConfig, reduxDispatch]);

    useEffect(() => {
        console.log("DEBUG: Branch fetch effect triggered. selectedRepo:", selectedRepo);
        if (selectedRepo) {
            fetchBranches(selectedRepo);
        }
    }, [selectedRepo, fetchBranches]);

    const handleCreateBranch = async () => {
        if (!selectedRepo || !baseBranch || !newBranchName) {
            reduxDispatch({ type: SHOW_SNACKBAR, payload: { message: "Please fill all fields", type: "error" } });
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await apiClient.post(`/api/auth/github/create-branch`, {
                newBranch: newBranchName, 
                baseBranch,
                projectId,
                repo: selectedRepo, // Added repo full name
                ticketId
            });

            if (res.data.success) {
                dispatch({ type: 'SET_CREATED_URL', payload: res.data.data.branchUrl });
                setHasCreated(true);
                reduxDispatch({ 
                    type: SHOW_SNACKBAR, 
                    payload: { message: `Branch created successfully!`, type: "success" } 
                });
                setFocusedField('success');
            }
        } catch (err) {
            dispatch({ type: 'SET_LOADING', payload: false });
            const errorMessage = err.response?.data?.message || err.message || "Failed to create branch";
            reduxDispatch({ type: SHOW_SNACKBAR, payload: { message: errorMessage, type: "error" } });
        }
    };

    const educationContent = {
        welcome: {
            title: "Branching Intelligence",
            icon: <Zap size={32} color="#7C3AED" />,
            desc: "Initialize your workflow by creating a dedicated environment for your task. Hora automates the Git choreography for you.",
            tips: ["Connects your task directly to code", "Automates branch protection compliance", "Pre-fills metadata for PRs"]
        },
        repo: {
            title: "Target Repository",
            icon: <Globe size={32} color="#3B82F6" />,
            desc: "Select the repository where your code resides. We've filtered these based on your project's configuration.",
            tips: ["Ensure you have write permissions", "Double-check the repository name", "CI/CD will trigger on this repo"]
        },
        base: {
            title: "Launch from Base",
            icon: <GitBranch size={32} color="#10B981" />,
            desc: "Your new branch will inherit all code from this base. Usually, this is 'main' for production or 'develop' for testing.",
            tips: ["Always branch from the latest code", "Confirm your base branch is up-to-date", "Avoid branching from stale feature branches"]
        },
        name: {
            title: "Naming Standard",
            icon: <Terminal size={32} color="#EF4444" />,
            desc: "We follow industry-standard naming conventions. Your branch name is pre-filled with the ticket namespace.",
            tips: ["Use hyphens instead of spaces", "Keep it concise but descriptive", "Convention: [NAMESPACE]-[ID]-[DESC]"]
        },
        success: {
            title: "Workflow Active!",
            icon: <ShieldCheck size={32} color="#059669" />,
            desc: "Your branch is live on GitHub. Your task and code are now synchronized.",
            tips: ["Click 'Open on GitHub' to view", "Start pushing code to this branch", "PRs will be automatically linked"]
        }
    };

    const currentEdu = educationContent[focusedField] || educationContent.welcome;

    return (
        <div className="github_creation_layout modern_theme">
            {/* Left Section: The Functional Form */}
            <div className="functional_section">
                <div className="form_wrapper">
                    <header className="form_header">
                        <div className="status_badge">Syncing with GitHub</div>
                        <h1 className="form_title">Create Task Branch</h1>
                        <p className="form_subtitle">Context: <span className="highlight">{ticketKey}</span></p>
                    </header>

                    <div className="modern_form">
                        <div 
                            className={`modern_field_group ${focusedField === 'repo' ? 'active' : ''}`}
                            onFocus={() => setFocusedField('repo')}
                        >
                            <label className="field_label">Destination Repository</label>
                            <div className="input_container_custom">
                                <CustomDropDownV3
                                    options={getProjectRepositories}
                                    value={selectedRepo}
                                    onChange={(val) => dispatch({ type: 'SET_SELECTED_REPO', payload: val })}
                                    placeholder="Select a repository"
                                    className="modern_dropdown_v3"
                                />
                            </div>
                        </div>

                        <div 
                            className={`modern_field_group ${focusedField === 'base' ? 'active' : ''} ${!selectedRepo ? 'disabled' : ''}`}
                            onFocus={() => setFocusedField('base')}
                        >
                            <label className="field_label">Inherit from Base</label>
                            <div className="input_container_custom">
                                <CustomDropDownV3
                                    options={getProjectBranches}
                                    value={baseBranch}
                                    onChange={(val) => dispatch({ type: 'SET_BASE_BRANCH', payload: val })}
                                    placeholder={isFetchingBranches ? "Scanning branches..." : "Select base branch"}
                                    disabled={!selectedRepo || isFetchingBranches}
                                    className="modern_dropdown_v3"
                                />
                            </div>
                        </div>

                        <div 
                            className={`modern_field_group ${focusedField === 'name' ? 'active' : ''}`}
                            onFocus={() => setFocusedField('name')}
                        >
                            <label className="field_label">System Branch Name</label>
                            <div className="input_container">
                                <Terminal className="field_icon" size={20} />
                                <input
                                    type="text"
                                    className="modern_input_tag"
                                    value={newBranchName}
                                    onChange={(e) => dispatch({ type: 'SET_NEW_BRANCH_NAME', payload: e.target.value })}
                                    placeholder="Enter identifier..."
                                />
                            </div>
                        </div>

                        <div className="button_row">
                            <ButtonV1 
                                onClick={handleCreateBranch}
                                text={hasCreated ? "Branch Created" : (isLoading ? "Generating..." : "Synchronize Repository")}
                                type="primary"
                                style={{ width: '100%', height: '54px', borderRadius: '16px', fontSize: '1.1rem' }}
                                disabled={isLoading || hasCreated}
                            />
                        </div>
                         {focusedField === 'success' && createdBranchUrl && (
                        <div className="success_action_box">
                            <div className="branch_url_display">
                                <span className="url_label">Branch URL:</span>
                                <code className="branch_url">{createdBranchUrl}</code>
                            </div>
                            <div className="pulse_glow"></div>
                            <a 
                                href={createdBranchUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="premium_link_btn"
                            >
                                <GitBranch size={18} />
                                Open Branch on GitHub
                            </a>
                        </div>
                    )}
                    </div>
                </div>
            </div>

            {/* Right Section: The Intelligence & Education Panel */}
            <div className="intelligence_section">
                <div className="glass_edu_card">
                    <div className="edu_icon_box">
                        {currentEdu.icon}
                    </div>
                    <div className="edu_text_content">
                        <h2 className="edu_title">{currentEdu.title}</h2>
                        <p className="edu_desc">{currentEdu.desc}</p>
                    </div>
                    
                    <div className="edu_tips_list">
                        {currentEdu.tips.map((tip, idx) => (
                            <div key={idx} className="edu_tip_item">
                                <ChevronRight size={16} />
                                <span>{tip}</span>
                            </div>
                        ))}
                    </div>

                    {/* {focusedField === 'success' && createdBranchUrl && (
                        <div className="success_action_box">
                            <div className="branch_url_display">
                                <span className="url_label">Branch URL:</span>
                                <code className="branch_url">{createdBranchUrl}</code>
                            </div>
                            <div className="pulse_glow"></div>
                            <a 
                                href={createdBranchUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="premium_link_btn"
                            >
                                <GitBranch size={18} />
                                Open Branch on GitHub
                            </a>
                        </div>
                    )} */}

                    <div className="edu_footer">
                        <div className="security_notice">
                            <Lock size={12} />
                            <span>Authenticated via Project Token</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Info Toggle for Mobile Intelligence */}
            <button className="mobile_edu_toggle" onClick={() => setFocusedField('welcome')}>
                <Info size={24} />
            </button>
        </div>
    );
};

export default CreateBranch;