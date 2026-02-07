import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Github, Key, CheckCircle, AlertCircle, Loader, RefreshCw, 
  GitBranch, GitPullRequest, Users, Settings, Info, ExternalLink, 
  Play, Shield, Database, Zap, X, Copy, Terminal, Monitor, Code,
  ChevronRight, Search, Globe, Lock
} from 'lucide-react';
import { getAllProjects } from '../../../Redux/Actions/PlatformActions.js/projectsActions';
import { SHOW_SNACKBAR } from '../../../Redux/Constants/PlatformConstatnt/platformConstant';
import './styles/GitHubAdminPanel.scss';
import apiClient from '../../../utils/axiosConfig';

const GitHubAdminPanel = ({projectId}) => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { userDetails } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [targetProjectId, setTargetProjectId] = useState('');
  const [sourceProjectId, setSourceProjectId] = useState('');
  const [isCopyMode, setIsCopyMode] = useState(false);
  const [projectConfigs, setProjectConfigs] = useState([]);
  const [repoStats, setRepoStats] = useState({
    totalRepos: 12,
    totalBranches: 48,
    openPRs: 7,
    totalCommits: 1243
  });

  useEffect(() => {
    if (userDetails?.id) {
      dispatch(getAllProjects(userDetails.id));
    }
    fetchProjectConfigs();
  }, [userDetails, dispatch]);

  const fetchProjectConfigs = async () => {
    try {
      const res = await apiClient.get('/api/gihub-repo/config/all');
      if (res.data.success) {
        setProjectConfigs(res.data.configs || []);
      }
    } catch (err) {
      console.error("Failed to fetch configs", err);
    }
  };

  const handleConnect = async () => {
    if (!tokenInput || !targetProjectId) {
      dispatch({ 
        type: SHOW_SNACKBAR, 
        payload: { message: "Project and Token are required", type: "error" } 
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await apiClient.post('/api/gihub-repo/config', {
        projectId: targetProjectId,
        githubSecretCode: tokenInput
      });

      if (res.data.success) {
        dispatch({ 
          type: SHOW_SNACKBAR, 
          payload: { message: "GitHub connected to project!", type: "success" } 
        });
        setTokenInput('');
        setShowTokenModal(false);
        fetchProjectConfigs();
      }
    } catch (err) {
      dispatch({ 
        type: SHOW_SNACKBAR, 
        payload: { message: err.response?.data?.message || "Connection failed", type: "error" } 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyConfig = async () => {
    if (!sourceProjectId || !targetProjectId) {
      dispatch({ 
        type: SHOW_SNACKBAR, 
        payload: { message: "Select source and target projects", type: "error" } 
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.post('/api/gihub-repo/config/copy', {
        sourceProjectId,
        targetProjectId
      });

      if (res.data.success) {
        dispatch({ 
          type: SHOW_SNACKBAR, 
          payload: { message: "Configuration copied successfully!", type: "success" } 
        });
        setShowTokenModal(false);
        fetchProjectConfigs();
      }
    } catch (err) {
      dispatch({ 
        type: SHOW_SNACKBAR, 
        payload: { message: "Copy failed", type: "error" } 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const projectConnList = useMemo(() => {
    return projects?.map(p => {
      const config = projectConfigs.find(c => c.projectId === p._id);
      return {
        ...p,
        isConnected: !!config,
        updatedAt: config?.updatedAt
      };
    }) || [];
  }, [projects, projectConfigs]);

  const stats = useMemo(() => {
    const connectedCount = projectConnList.filter(p => p.isConnected).length;
    return {
      connectedCount,
      totalCount: projectConnList.length
    };
  }, [projectConnList]);

  return (
    <div className="github-admin-panel">
      <div className="panel-container">
        {/* Header */}
        <div className="panel-header">
          <div className="header-content">
            <div className="header-left">
              <div className="github-icon">
                <Github />
              </div>
              <div className="header-info">
                <h1>GitHub Admin Panel</h1>
                <p>Manage project-level GitHub integrations and credentials</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                className="connect-button"
                onClick={() => {
                  setIsCopyMode(false);
                  setShowTokenModal(true);
                }}
              >
                <Key size={20} />
                Connect New Project
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><Database size={24} /></div>
            <div className="stat-value">{stats.connectedCount}/{stats.totalCount}</div>
            <div className="stat-label">Projects Connected</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><GitBranch size={24} /></div>
            <div className="stat-value">{repoStats.totalBranches}</div>
            <div className="stat-label">Active Branches</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><GitPullRequest size={24} /></div>
            <div className="stat-value">{repoStats.openPRs}</div>
            <div className="stat-label">Open Pull Requests</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><Zap size={24} /></div>
            <div className="stat-value">{repoStats.totalCommits}</div>
            <div className="stat-label">Total Commits</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="panel-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Info size={18} /> Connectivity Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'setup' ? 'active' : ''}`}
            onClick={() => setActiveTab('setup')}
          >
            <Settings size={18} /> Setup Guide
          </button>
          <button
            className={`tab-button ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            <Zap size={18} /> Features
          </button>
          <button
            className={`tab-button ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            <Play size={18} /> System Actions
          </button>
        </div>

        {/* Content */}
        <div className="content-panel">
          {activeTab === 'overview' && (
            <div className="connectivity-section">
              <div className="section-header">
                <Globe size={24} />
                <h3>Project Connectivity</h3>
                <div className="header-actions">
                    <button className="text-btn" onClick={() => {
                        setIsCopyMode(true);
                        setShowTokenModal(true);
                    }}>
                        <Copy size={16} /> Copy Configuration
                    </button>
                </div>
              </div>

              <div className="project-list">
                {projectConnList.map((project) => (
                  <div key={project._id} className="project-item">
                    <div className="project-info">
                      <div className="project-avatar">
                        {project.projectName?.charAt(0)}
                      </div>
                      <div>
                        <h4>{project.projectName}</h4>
                        <p className="project-id">ID: {project._id}</p>
                      </div>
                    </div>

                    <div className="connection-tag-group">
                      {project.isConnected ? (
                        <div className="status-badge connected">
                          <CheckCircle size={14} /> Connected
                        </div>
                      ) : (
                        <div className="status-badge disconnected">
                          <AlertCircle size={14} /> Not Linked
                        </div>
                      )}
                    </div>

                    <div className="project-actions">
                      <button 
                        className="icon-btn" 
                        title="Configure GitHub"
                        onClick={() => {
                            setTargetProjectId(project._id);
                            setIsCopyMode(false);
                            setShowTokenModal(true);
                        }}
                      >
                        <Settings size={18} />
                      </button>
                      <button 
                         className="icon-btn" 
                         title="Copy Config to this project"
                         onClick={() => {
                             setTargetProjectId(project._id);
                             setIsCopyMode(true);
                             setShowTokenModal(true);
                         }}
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="setup-guide">
              <div className="section-header">
                <Settings size={24} />
                <h3>Choose Connection Method</h3>
              </div>
              
              <div className="setup-methods-grid">
                <div className="setup-method-card featured">
                  <div className="badge">Scaling</div>
                  <div className="method-icon"><Zap size={32} /></div>
                  <h4>GitHub App Connection</h4>
                  <p className="description">
                    Organization-wide connection. Install once and manage access for all repositories. 
                    Recommended for large teams.
                  </p>
                  <div className=" "  style={{zIndex:"9999",width:"100%"}}  >
                   <button
                        type="button"
                        className="action-button primary"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          try {
                            window.location.href = "https://github.com/apps/themysticsquadapp/installations/new";
                          } catch (error) {
                            console.error("Redirect failed:", error);
                            // Fallback: open in new tab
                            window.open("https://github.com/apps/themysticsquadapp/installations/new", "_blank");
                          }
                        }}
                      >
                        Install Provider App
                      </button>
                  </div>
                </div>
                <div className="setup-method-card">
                  <div className="method-icon"><Shield size={32} /></div>
                  <h4>PAT (User Control)</h4>
                  <p className="description">
                    Link individual projects using Personal Access Tokens. 
                    Best for granular permissions and private repos.
                  </p>
                  <button 
                    className="action-button secondary"
                    onClick={() => {
                        setIsCopyMode(false);
                        setShowTokenModal(true);
                        
                    }}
                  >
                    Connect with Token
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="features-list">
              <div className="section-header">
                <Zap size={24} />
                <h3>Enabled Integration Features</h3>
              </div>

              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-check"><CheckCircle size={18} /></div>
                  <div className="feature-content">
                    <h5>Automated Branching</h5>
                    <p>Create feature branches directly from tickets with pre-defined naming conventions.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-check"><CheckCircle size={18} /></div>
                  <div className="feature-content">
                    <h5>PR Tracking</h5>
                    <p>Sync pull request status with your project board columns automatically.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-check"><CheckCircle size={18} /></div>
                  <div className="feature-content">
                    <h5>Commit Visibility</h5>
                    <p>View relevant commits directly within the ticket details modal.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-check"><CheckCircle size={18} /></div>
                  <div className="feature-content">
                    <h5>Developer Velocity Matrix</h5>
                    <p>Track DORA metrics, cycle time, and team throughput with automated GitHub data sync.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-check"><CheckCircle size={18} /></div>
                  <div className="feature-content">
                    <h5>Repository Sync</h5>
                    <p>Keep your repository list up to date and manage project links easily.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-check"><CheckCircle size={18} /></div>
                  <div className="feature-content">
                    <h5>Code Reviews</h5>
                    <p>Get notified of review requests and comments directly in Hora.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="quick-actions">
              <div className="section-header">
                <Play size={24} />
                <h3>Repository & System Management</h3>
              </div>

              <div className="action-cards">
                <div className="action-card">
                  <div className="action-card-header">
                    <div className="action-icon"><RefreshCw size={24} /></div>
                    <div>
                      <h4>Sync Repositories</h4>
                      <p>Global Metadata Sync</p>
                    </div>
                  </div>
                  <p className="card-description">
                    Fetch the latest repository information, branch lists, and visibility states 
                    from GitHub for all projects.
                  </p>
                  <button className="action-button primary">
                    <RefreshCw size={18} />
                    Run Global Sync
                  </button>
                </div>

                <div className="action-card">
                  <div className="action-card-header">
                    <div className="action-icon"><Database size={24} /></div>
                    <div>
                      <h4>Cleanup Cache</h4>
                      <p>Maintain System Integrity</p>
                    </div>
                  </div>
                  <p className="card-description">
                    Purge cached GitHub data for projects that no longer have valid tokens 
                    or have been disconnected from the organization.
                  </p>
                  <button className="action-button secondary">
                    <Shield size={18} />
                    Execute Cleanup
                  </button>
                </div>

                <div className="action-card">
                  <div className="action-card-header">
                    <div className="action-icon"><GitPullRequest size={24} /></div>
                    <div>
                      <h4>Manual PR Sync</h4>
                      <p>Real-time Board Update</p>
                    </div>
                  </div>
                  <p className="card-description">
                    Force a refresh of pull request data across all active repositories 
                    to ensure project boards are perfectly in sync.
                  </p>
                  <button className="action-button primary">
                    <GitPullRequest size={18} />
                    Sync PR Status
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unified Connection / Copy Modal */}
      {showTokenModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-icon">
                {isCopyMode ? <Copy size={28} /> : <Key size={28} />}
              </div>
              <h2>{isCopyMode ? 'Copy Configuration' : 'Connect GitHub Token'}</h2>
              <button className="close-btn" onClick={() => setShowTokenModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Target Project</label>
                <select 
                  className="form-input"
                  value={targetProjectId}
                  onChange={(e) => setTargetProjectId(e.target.value)}
                >
                  <option value="">-- Select Project --</option>
                  {projects?.map(p => (
                    <option key={p._id} value={p._id}>{p.projectName}</option>
                  ))}
                </select>
              </div>

              {isCopyMode ? (
                <div className="form-group">
                  <label className="form-label">Source Configuration</label>
                  <select 
                    className="form-input"
                    value={sourceProjectId}
                    onChange={(e) => setSourceProjectId(e.target.value)}
                  >
                    <option value="">-- Select Source Project --</option>
                    {projectConfigs.map(c => (
                      <option key={c.projectId} value={c.projectId}>
                        {projects.find(p => p._id === c.projectId)?.projectName || 'Unknown Project'}
                      </option>
                    ))}
                  </select>
                  <div className="form-hint">
                    <Info size={14} />
                    <span>Copying will apply the same GitHub token and settings to the target project.</span>
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Personal Access Token</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                  />
                  <div className="form-hint">
                    <Info size={14} />
                    <span>Ensure token has 'repo' scopes for proper sync.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowTokenModal(false)}>Cancel</button>
              <button 
                className="btn btn-primary"
                onClick={isCopyMode ? handleCopyConfig : handleConnect}
                disabled={isLoading}
              >
                {isLoading ? <Loader className="spin" size={20} /> : (isCopyMode ? 'Copy Config' : 'Save Connection')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubAdminPanel;