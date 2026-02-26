import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  Github, Key, CheckCircle, AlertCircle, Loader, RefreshCw, 
  GitBranch, GitPullRequest, Users, Settings, Info, ExternalLink, 
  Play, Shield, Database, Zap, X, Copy, Terminal, Monitor, Code,
  ChevronRight, Search, Globe, Lock, Clock, FolderKanban, Activity
} from 'lucide-react';
import { getAllProjects } from '../../../Redux/Actions/PlatformActions.js/projectsActions';
import { SHOW_SNACKBAR } from '../../../Redux/Constants/PlatformConstatnt/platformConstant';
import './styles/GitHubAdminPanel.scss';
import apiClient from '../../../utils/axiosConfig';

const GitHubAdminPanel = () => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const { userDetails } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState('overview');
  const [projectInstallations, setProjectInstallations] = useState([]);
  const [repoStats, setRepoStats] = useState({
    totalProjects: 0,
    totalRepos: 0,
    totalBranches: 0,
    openPRs: 0,
    totalCommits: 0
  });

  useEffect(() => {
    if (userDetails?.id) {
      dispatch(getAllProjects(userDetails.id));
    }
    fetchInstallations(projectId);
    fetchSystemStats(projectId);
  }, [userDetails, dispatch, projectId]);

  const fetchInstallations = async (pid = '') => {
    try {
      const url = pid ? `/api/auth/github/installations?projectId=${pid}` : '/api/auth/github/installations';
      const res = await apiClient.get(url);
      if (res.data.success) {
        setProjectInstallations(res.data.installations || []);
      }
    } catch (err) {
      console.error("Failed to fetch installations", err);
    }
  };

  const fetchSystemStats = async (pid = '') => {
    try {
      const url = pid ? `/api/auth/github/stats?projectId=${pid}` : '/api/auth/github/stats';
      const res = await apiClient.get(url);
      if (res.data.success) {
        setRepoStats(res.data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch system stats", err);
    }
  };




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
              {projectInstallations.length > 0 ? (
                <div className="status-badge-header">
                  <CheckCircle size={20} color="#10b981" />
                  <span style={{ fontWeight: 600, color: '#111827' }}>Installed</span>
                </div>
              ) : (
                <button
                  className="connect-button"
                  onClick={() => {
                    window.location.href = `https://github.com/apps/themysticsquadapp/installations/new?state=${projectId}`;
                  }}
                >
                  <Zap size={20} />
                  Install App
                </button>
              )}
            </div>
          </div>
        </div>



        <div className="section-title-simple">
          <Activity size={20} />
          <h2>Project GitHub Statistics</h2>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><Database size={24} /></div>
            <div className="stat-value">{repoStats.totalProjects}</div>
            <div className="stat-label">Projects Connected</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><Monitor size={24} /></div>
            <div className="stat-value">{repoStats.totalRepos}</div>
            <div className="stat-label">Tracked Repositories</div>
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
                <Shield size={24} />
                <h3>Active Installations</h3>
              </div>

              <div className="installations-list">
                {projectInstallations.length > 0 ? (
                  projectInstallations.map((inst) => (
                    <div key={inst._id} className="installation-item">
                      <div className="inst-main-info">
                        <div className="inst-avatar">
                          <Github size={24} />
                        </div>
                        <div className="inst-details">
                          <div className="inst-title-row">
                            <h4>Installation #{inst.installationId}</h4>
                            <span className={`status-tag ${inst.suspended ? 'suspended' : 'active'}`}>
                              {inst.suspended ? 'Suspended' : 'Active'}
                            </span>
                          </div>
                          <div className="inst-meta">
                            <span><Database size={14} /> {inst.repositoryCount || 0} Repositories</span>
                            <span><Monitor size={14} /> {inst.projectName}</span>
                            <span><Clock size={14} /> {new Date(inst.installedAt || inst.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="inst-actions">
                        <button 
                          className="action-btn-outline" 
                          onClick={() => window.open(`https://github.com/settings/installations/${inst.installationId}`, '_blank')}
                        >
                          <ExternalLink size={16} /> Manage on GitHub
                        </button>
                        <button 
                          className="action-btn-primary"
                          onClick={() => {
                            window.location.href = `https://github.com/apps/themysticsquadapp/installations/new?state=${inst.projectId}`;
                          }}
                        >
                          <Settings size={16} /> Configure
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon"><Github size={48} /></div>
                    <h4>No Installations Found</h4>
                    <p>Connect your GitHub account to start tracking repositories and automated branching.</p>
                  </div>
                )}
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
                <div className="setup-method-card featured" style={{ gridColumn: 'span 2' }}>
                  <div className="badge">Recommended</div>
                  <div className="method-icon"><Zap size={32} /></div>
                  <h4>GitHub App Connection</h4>
                  <p className="description">
                    Organization-wide connection. Install the Hora GitHub App to enable automated branching, 
                    PR tracking, and developer velocity metrics across all your repositories.
                  </p>
                  <div className=" "  style={{zIndex:"9999",width:"100%"}}  >
                   <button
                        type="button"
                        className="action-button primary"
                        onClick={() => {
                          window.location.href = `https://github.com/apps/themysticsquadapp/installations/new`;
                        }}
                      >
                        <Github size={20} />
                        Install GitHub App
                      </button>
                  </div>
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

    </div>
  );
};

export default GitHubAdminPanel;