import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/SprintHome.scss';
import axios from 'axios';

const SprintHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectsRes, sprintsRes] = await Promise.all([
        axios.get('/api/projects'),
        axios.get('/api/sprints')
      ]);

      setProjects(projectsRes.data);
      setSprints(sprintsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Mock data for demo
      setProjects([
        {
          projectId: 'proj-1',
          projectName: 'E-Commerce Platform',
          description: 'Building a modern e-commerce platform with React and Node.js',
          status: 'ACTIVE',
          teamSize: 8,
          startDate: '2024-01-15',
          progress: 65
        },
        {
          projectId: 'proj-2',
          projectName: 'Mobile Banking App',
          description: 'Secure mobile banking application for iOS and Android',
          status: 'ACTIVE',
          teamSize: 12,
          startDate: '2024-02-01',
          progress: 42
        },
        {
          projectId: 'proj-3',
          projectName: 'CRM System',
          description: 'Customer relationship management system for enterprise',
          status: 'PLANNING',
          teamSize: 6,
          startDate: '2024-03-10',
          progress: 15
        }
      ]);

      setSprints([
        { projectId: 'proj-1', sprintNumber: 3, status: 'ACTIVE', tasksCompleted: 23, totalTasks: 35 },
        { projectId: 'proj-2', sprintNumber: 2, status: 'ACTIVE', tasksCompleted: 18, totalTasks: 42 },
        { projectId: 'proj-3', sprintNumber: 1, status: 'PLANNING', tasksCompleted: 0, totalTasks: 28 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSprintInfo = (projectId) => {
    return sprints.find(s => s.projectId === projectId) || null;
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
      PLANNING: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
      COMPLETED: { bg: '#e0e7ff', text: '#3730a3', border: '#6366f1' },
      PAUSED: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' }
    };
    return colors[status] || colors.ACTIVE;
  };

  const handleProjectClick = (projectId) => {
    navigate(`/sprint/board?projectId=${projectId}&type=board`);
  };

  const handleWorkflowClick = (projectId, e) => {
    e.stopPropagation();
    navigate(`/sprint/board?projectId=${projectId}&type=workflow`);
  };

//   const filteredProjects = projects?.filter(project => {
//     const matchesSearch = project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          project.description?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
//     return matchesSearch && matchesFilter;
//   });
const filteredProjects =[]

  if (loading) {
    return (
      <div className="sprint-home-container sprint-home-loading">
        <div className="sprint-home-loading-content">
          <div className="sprint-home-spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sprint-home-container">
      <div className="sprint-home-wrapper">
        {/* Hero Header */}
        <div className="sprint-home-hero">
          <div className="sprint-hero-content">
            <h1 className="sprint-hero-title">Sprint Boards</h1>
            <p className="sprint-hero-subtitle">
              Manage your projects, track sprints, and collaborate with your team
            </p>
          </div>
          <div className="sprint-hero-stats">
            <div className="sprint-stat-item">
              <div className="sprint-stat-value">{projects.length}</div>
              <div className="sprint-stat-label">Projects</div>
            </div>
            <div className="sprint-stat-item">
              <div className="sprint-stat-value">
                {/* {projects.filter(p => p.status === 'ACTIVE').length} */}
              </div>
              <div className="sprint-stat-label">Active</div>
            </div>
            <div className="sprint-stat-item">
              <div className="sprint-stat-value">
                {/* {sprints.filter(s => s.status === 'ACTIVE').length} */}
              </div>
              <div className="sprint-stat-label">Sprints</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="sprint-home-controls">
          <div className="sprint-search-wrapper">
            <span className="sprint-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sprint-search-input"
            />
          </div>

          <div className="sprint-filters">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="sprint-filter-select"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PLANNING">Planning</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAUSED">Paused</option>
            </select>

            <div className="sprint-view-toggle">
              <button
                className={`sprint-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ⊞
              </button>
              <button
                className={`sprint-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="sprint-home-empty">
            <div className="sprint-empty-icon">📋</div>
            <h3>No Projects Found</h3>
            <p>
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first project to get started'}
            </p>
          </div>
        )}

        {/* Projects Grid/List */}
        <div className={`sprint-projects-container ${viewMode === 'list' ? 'sprint-list-view' : 'sprint-grid-view'}`}>
          {filteredProjects?.map((project) => {
            const sprintInfo = getSprintInfo(project.projectId);
            const statusColor = getStatusColor(project.status);

            return (
              <div
                key={project.projectId}
                className="sprint-project-card"
                onClick={() => handleProjectClick(project.projectId)}
              >
                {/* Project Header */}
                <div className="sprint-card-header">
                  <div className="sprint-card-title-section">
                    <h3 className="sprint-card-title">{project.projectName}</h3>
                    <span
                      className="sprint-status-badge"
                      style={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        borderColor: statusColor.border
                      }}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="sprint-card-actions">
                    <button
                      className="sprint-action-btn"
                      onClick={(e) => handleWorkflowClick(project.projectId, e)}
                      title="Manage Workflow"
                    >
                      ⚡
                    </button>
                  </div>
                </div>

                {/* Project Description */}
                <p className="sprint-card-description">{project.description}</p>

                {/* Project Metrics */}
                <div className="sprint-card-metrics">
                  <div className="sprint-metric">
                    <span className="sprint-metric-icon">👥</span>
                    <span className="sprint-metric-value">{project.teamSize}</span>
                    <span className="sprint-metric-label">Team</span>
                  </div>
                  {sprintInfo && (
                    <>
                      <div className="sprint-metric">
                        <span className="sprint-metric-icon">🏃</span>
                        <span className="sprint-metric-value">Sprint {sprintInfo.sprintNumber}</span>
                        <span className="sprint-metric-label">Current</span>
                      </div>
                      <div className="sprint-metric">
                        <span className="sprint-metric-icon">✓</span>
                        <span className="sprint-metric-value">
                          {sprintInfo.tasksCompleted}/{sprintInfo.totalTasks}
                        </span>
                        <span className="sprint-metric-label">Tasks</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Progress Bar */}
                {project.progress !== undefined && (
                  <div className="sprint-progress-section">
                    <div className="sprint-progress-header">
                      <span className="sprint-progress-label">Progress</span>
                      <span className="sprint-progress-value">{project.progress}%</span>
                    </div>
                    <div className="sprint-progress-bar">
                      <div
                        className="sprint-progress-fill"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="sprint-card-footer">
                  <div className="sprint-card-date">
                    <span className="sprint-date-icon">📅</span>
                    <span>Started {new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="sprint-card-cta">
                    <span className="sprint-cta-text">Open Board</span>
                    <span className="sprint-cta-arrow">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="sprint-quick-actions">
          <button className="sprint-fab" title="Create New Project">
            <span className="sprint-fab-icon">+</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SprintHome;