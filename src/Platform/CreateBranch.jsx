import React, { useReducer, useEffect, useState } from "react";
import "./styles/createBranch.scss";
import copyIcon from "../assets/platformIcons/TaskPlat/copyIcon.svg";
import { ButtonV1 } from "../customFiles/customComponent/CustomButtons";
import { useDispatch as useReduxDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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

const initialState = {
    repos: [],
    branches: [],
    selectedRepo: '',
    baseBranch: 'main',
    newBranchName: '',
    createdBranchUrl: '',
    isLoading: false,
    isFetchingBranches: false,
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
        default:
            return state;
    }
}

const CreateBranch = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const reduxDispatch = useReduxDispatch();
    const { ticketId, ticketTitle, ticketKey, projectId } = location.state || {};

    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        newBranchName: ticketKey || ''
    });

    const [focusedField, setFocusedField] = useState('welcome');
    const { repos, branches, selectedRepo, baseBranch, newBranchName, createdBranchUrl, isLoading, isFetchingBranches } = state;

    useEffect(() => {
        if (projectId) {
            fetchConfig(projectId);
        } else {
            reduxDispatch({ type: SHOW_SNACKBAR, payload: { message: "No project context found", type: "error" } });
            navigate(-1);
        }
    }, [projectId]);

    const fetchConfig = async (pid) => {
        try {
            const res = await apiClient.get(`/api/gihub-repo/config/${pid}`);
            if (res.data.success) {
                fetchRepos(pid);
            }
        } catch (err) {
            reduxDispatch({ type: SHOW_SNACKBAR, payload: { message: "GitHub not configured for this project", type: "error" } });
            navigate(-1);
        }
    };

    const fetchRepos = async (pid) => {
        try {
            const res = await apiClient.get(`/api/gihub-repo/repos?projectId=${pid}`);
            if (res.data.success) {
                dispatch({ type: 'SET_REPOS', payload: res.data.repos });
            }
        } catch (err) {
            console.error("Error fetching repos", err);
        }
    };

    const fetchBranches = async (repoFullName) => {
        if (!repoFullName) return;
        dispatch({ type: 'START_FETCHING_BRANCHES' });
        const [owner, repo] = repoFullName.split('/');
        try {
            const res = await apiClient.get(`/api/gihub-repo/repos/${owner}/${repo}/branches?projectId=${projectId}`);
            dispatch({ type: 'SET_BRANCHES', payload: Array.isArray(res.data) ? res.data : [] });
        } catch (err) {
            console.error("Error fetching branches", err);
            dispatch({ type: 'SET_BRANCHES', payload: [] });
        }
    };

    useEffect(() => {
        if (selectedRepo) {
            fetchBranches(selectedRepo);
        }
    }, [selectedRepo]);

    const handleCreateBranch = async () => {
        if (!selectedRepo || !baseBranch || !newBranchName) {
            reduxDispatch({ type: SHOW_SNACKBAR, payload: { message: "Please fill all fields", type: "error" } });
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        const [owner, repo] = selectedRepo.split('/');
        try {
            const res = await apiClient.post(`/api/gihub-repo/repos/${owner}/${repo}/branches`, {
                newBranchName,
                fromBranch: baseBranch,
                projectId,
                ticketId
            });

            if (res.data.success) {
                dispatch({ type: 'SET_CREATED_URL', payload: res.data.branchUrl });
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
                            <div className="input_container">
                                <Globe className="field_icon" size={20} />
                                <select 
                                    className="modern_input_tag"
                                    onChange={e => dispatch({ type: 'SET_SELECTED_REPO', payload: e.target.value })} 
                                    value={selectedRepo}
                                >
                                    <option value="">Select a repository</option>
                                    {repos.map(r => (
                                        <option key={r.id} value={r.full_name}>{r.full_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div 
                            className={`modern_field_group ${focusedField === 'base' ? 'active' : ''} ${!selectedRepo ? 'disabled' : ''}`}
                            onFocus={() => setFocusedField('base')}
                        >
                            <label className="field_label">Inherit from Base</label>
                            <div className="input_container">
                                <GitBranch className="field_icon" size={20} />
                                <select 
                                    className="modern_input_tag"
                                    onChange={e => dispatch({ type: 'SET_BASE_BRANCH', payload: e.target.value })} 
                                    value={baseBranch}
                                    disabled={!selectedRepo || isFetchingBranches}
                                >
                                    <option value="">{isFetchingBranches ? 'Scanning branches...' : 'Select base'}</option>
                                    {branches.map(b => (
                                        <option key={b.name} value={b.name}>{b.name}</option>
                                    ))}
                                </select>
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
                                text={isLoading ? "Generating..." : "Synchronize Repository"}
                                type="primary"
                                style={{ width: '100%', height: '54px', borderRadius: '16px', fontSize: '1.1rem' }}
                                disabled={isLoading}
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