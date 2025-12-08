import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './SprintManagement.scss';
import { getAllProjects } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import { createSprintForPartner } from '../../Redux/Actions/SprintActions/sprintActionsV1';

const SprintManagement = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);


  useEffect(()=>{
    dispatch(getAllProjects(userDetails?.id))
  },[dispatch,userDetails])
//   const { projects } = useSelector((state) => state.project);
//   const { sprints, loading } = useSelector((state) => state.sprint);
  const {projectWithAccess,sucessFetchProjects,projects}= useSelector((state)=>state.projects)

  const [activeTab, setActiveTab] = useState('active');
  const [selectedProject, setSelectedProject] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    projectId: '',
    startDate: '',
    endDate: '',
    goal: '',
    duration: 2,
  });

  // Mock projects data
  const [projectsData] = useState([
    { id: 'proj-1', name: 'E-Commerce Platform', key: 'ECP', color: '#6366f1' },
    { id: 'proj-2', name: 'Mobile App', key: 'MOB', color: '#10b981' },
    { id: 'proj-3', name: 'Analytics Dashboard', key: 'ANA', color: '#f59e0b' },
    { id: 'proj-4', name: 'API Gateway', key: 'API', color: '#ec4899' },
  ]);

  // Mock sprints data with project association
  const [sprintsData, setSprintsData] = useState([
    {
      id: 'sprint-1',
      name: 'Sprint 23 - Nov 2025',
      projectId: 'proj-1',
      projectName: 'E-Commerce Platform',
      projectKey: 'ECP',
      projectColor: '#6366f1',
      status: 'active',
      startDate: '2025-11-01',
      endDate: '2025-11-15',
      goal: 'Complete user authentication and dashboard improvements',
      tickets: 15,
      completed: 8,
      inProgress: 5,
      todo: 2,
      storyPoints: 45,
      completedPoints: 28,
      velocity: 3.2,
      health: 'good'
    },
    {
      id: 'sprint-2',
      name: 'Sprint 24 - Dec 2025',
      projectId: 'proj-1',
      projectName: 'E-Commerce Platform',
      projectKey: 'ECP',
      projectColor: '#6366f1',
      status: 'planned',
      startDate: '2025-12-01',
      endDate: '2025-12-15',
      goal: 'API integration and mobile responsiveness',
      tickets: 12,
      completed: 0,
      inProgress: 0,
      todo: 12,
      storyPoints: 38,
      completedPoints: 0,
      velocity: 0,
      health: 'pending'
    },
    {
      id: 'sprint-3',
      name: 'Sprint 15 - Nov 2025',
      projectId: 'proj-2',
      projectName: 'Mobile App',
      projectKey: 'MOB',
      projectColor: '#10b981',
      status: 'active',
      startDate: '2025-11-01',
      endDate: '2025-11-15',
      goal: 'Implement push notifications and offline mode',
      tickets: 10,
      completed: 7,
      inProgress: 2,
      todo: 1,
      storyPoints: 32,
      completedPoints: 24,
      velocity: 2.8,
      health: 'excellent'
    },
    {
      id: 'sprint-4',
      name: 'Sprint 8 - Oct 2025',
      projectId: 'proj-3',
      projectName: 'Analytics Dashboard',
      projectKey: 'ANA',
      projectColor: '#f59e0b',
      status: 'completed',
      startDate: '2025-10-15',
      endDate: '2025-10-31',
      goal: 'Data visualization and export features',
      tickets: 18,
      completed: 16,
      inProgress: 0,
      todo: 2,
      storyPoints: 52,
      completedPoints: 48,
      velocity: 4.1,
      health: 'excellent'
    },
  ]);

  const filteredSprints = sprintsData.filter((sprint) => {
    const matchesTab = sprint.status === activeTab;
    const matchesProject = selectedProject === 'all' || sprint.projectId === selectedProject;
    const matchesSearch = sprint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sprint.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesProject && matchesSearch;
  });
  // Calculate stats based on selected project
  const getStatsForProject = () => {
    const filteredByProject = selectedProject === 'all' 
      ? sprintsData 
      : sprintsData.filter(s => s.projectId === selectedProject);

    return {
      active: filteredByProject.filter(s => s.status === 'active').length,
      planned: filteredByProject.filter(s => s.status === 'planned').length,
      completed: filteredByProject.filter(s => s.status === 'completed').length,
      avgVelocity: (filteredByProject.reduce((sum, s) => sum + s.velocity, 0) / filteredByProject.length || 0).toFixed(1)
    };
  };
  console.log(projects)
  const stats = getStatsForProject();

  const handleCreateSprint = () => {
    const selectedProj = projectsData.find(p => p.id === formData.projectId);
    console.log(formData)
    const newSprint = {
      id: `sprint-${Date.now()}`,
      ...formData,
      projectName: selectedProj?.name,
      projectKey: selectedProj?.key,
      projectColor: selectedProj?.color,
      status: 'planned',
      tickets: 0,
      completed: 0,
      inProgress: 0,
      todo: 0,
      storyPoints: 0,
      completedPoints: 0,
      velocity: 0,
      health: 'pending'
    };
    console.log(newSprint)
    setSprintsData([...sprintsData, newSprint]);
    setShowCreateModal(false);
    dispatch(createSprintForPartner(formData.startDate,formData.endDate,formData.projectId,formData.name))
    resetForm();
  };

  const handleUpdateSprint = () => {
    const selectedProj = projectsData.find(p => p.id === formData.projectId);
    setSprintsData(
      sprintsData.map((sprint) =>
        sprint.id === selectedSprint.id
          ? { 
              ...sprint, 
              ...formData,
              projectName: selectedProj?.name,
              projectKey: selectedProj?.key,
              projectColor: selectedProj?.color,
            }
          : sprint
      )
    );
    setShowEditModal(false);
    setSelectedSprint(null);
    resetForm();
  };

  const handleStartSprint = (sprintId) => {
    setSprintsData(
      sprintsData.map((sprint) =>
        sprint.id === sprintId
          ? { ...sprint, status: 'active' }
          : sprint
      )
    );
  };

  const handleCompleteSprint = (sprintId) => {
    setSprintsData(
      sprintsData.map((sprint) =>
        sprint.id === sprintId
          ? { ...sprint, status: 'completed' }
          : sprint
      )
    );
  };

  const handleDeleteSprint = (sprintId) => {
    if (window.confirm('Are you sure you want to delete this sprint?')) {
      setSprintsData(sprintsData.filter((sprint) => sprint.id !== sprintId));
    }
  };

  const openEditModal = (sprint) => {
    setSelectedSprint(sprint);
    setFormData({
      name: sprint.name,
      projectId: sprint.projectId,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      goal: sprint.goal,
      duration: calculateDuration(sprint.startDate, sprint.endDate)
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      projectId: '',
      startDate: '',
      endDate: '',
      goal: '',
      duration: 2,
    });
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'excellent': return 'health-excellent';
      case 'good': return 'health-good';
      case 'warning': return 'health-warning';
      case 'critical': return 'health-critical';
      default: return 'health-pending';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'badge-active';
      case 'planned': return 'badge-planned';
      case 'completed': return 'badge-completed';
      default: return 'badge-default';
    }
  };

  return (
    <div className="sprint-management">
      <div className="sprint-header">
        <div className="header-content">
          <h1 className="page-title">Sprint Management</h1>
          <p className="page-subtitle">Manage sprints across all your projects</p>
        </div>
        <button className="btn-create" onClick={() => setShowCreateModal(true)}>
          <span className="btn-icon">+</span>
          Create Sprint
        </button>
      </div>

      {/* Project Filter */}
      <div className="project-filter">
        <label className="filter-label">Filter by Project:</label>
        <div className="project-pills">
          <button
            className={`project-pill ${selectedProject === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedProject('all')}
          >
            <span className="pill-icon">📊</span>
            All Projects
          </button>
          {Array.isArray(projects) &&projects?.map((project) => (
            
            <button
              key={project._id}
              className={`project-pill ${selectedProject === project._id ? 'active' : ''}`}
              onClick={() => setSelectedProject(project._id)}
              style={{
                '--project-color': project.color,
                borderColor: selectedProject === project._id ? project.color : '#e0e7ff'
              }}
            >
              <span className="pill-key" style={{ backgroundColor: project.color }}>
                {project.key}
              </span>
              {project.name ??project.projectName}
                      {project.partnerCode}

              {projectWithAccess}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-active">
          <div className="stat-icon">🏃</div>
          <div className="stat-content">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active Sprints</div>
          </div>
        </div>
        <div className="stat-card stat-planned">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.planned}</div>
            <div className="stat-label">Planned Sprints</div>
          </div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed Sprints</div>
          </div>
        </div>
        <div className="stat-card stat-velocity">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-value">{stats.avgVelocity}</div>
            <div className="stat-label">Avg Velocity</div>
          </div>
        </div>
      </div>

      <div className="controls-bar">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active ({sprintsData.filter(s => s.status === 'active' && (selectedProject === 'all' || s.projectId === selectedProject)).length})
          </button>
          <button
            className={`tab ${activeTab === 'planned' ? 'active' : ''}`}
            onClick={() => setActiveTab('planned')}
          >
            Planned ({sprintsData.filter(s => s.status === 'planned' && (selectedProject === 'all' || s.projectId === selectedProject)).length})
          </button>
          <button
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({sprintsData.filter(s => s.status === 'completed' && (selectedProject === 'all' || s.projectId === selectedProject)).length})
          </button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search sprints or projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {filteredSprints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No sprints found</h3>
          <p>Try adjusting your filters or create a new sprint</p>
        </div>
      ) : (
        <div className="sprint-grid">
          {filteredSprints.map((sprint) => (
            <div key={sprint.id} className={`sprint-card ${getHealthColor(sprint.health)}`}>
              <div className="card-header">
                <div className="card-title-section">
                  <div className="project-badge" style={{ backgroundColor: sprint.projectColor }}>
                    {sprint.projectKey}
                  </div>
                  <div>
                    <h3 className="card-title">{sprint.name}</h3>
                    <p className="project-name">{sprint.projectName}</p>
                  </div>
                  <span className={`status-badge ${getStatusBadge(sprint.status)}`}>
                    {sprint.status}
                  </span>
                </div>
                <div className="card-actions">
                  <button className="action-btn" onClick={() => openEditModal(sprint)}>
                    ✏️
                  </button>
                  <button className="action-btn" onClick={() => handleDeleteSprint(sprint.id)}>
                    🗑️
                  </button>
                </div>
              </div>

              <p className="sprint-goal">{sprint.goal}</p>

              <div className="sprint-dates">
                <span>📅 {new Date(sprint.startDate).toLocaleDateString()}</span>
                <span>→</span>
                <span>{new Date(sprint.endDate).toLocaleDateString()}</span>
              </div>

              <div className="progress-section">
                <div className="progress-header">
                  <span className="progress-label">Progress</span>
                  <span className="progress-value">
                    {sprint.completed}/{sprint.tickets} tickets
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(sprint.completed / sprint.tickets) * 100 || 0}%`,
                      backgroundColor: sprint.projectColor
                    }}
                  ></div>
                </div>
              </div>

              <div className="sprint-metrics">
                <div className="metric">
                  <span className="metric-label">Story Points</span>
                  <span className="metric-value">
                    {sprint.completedPoints}/{sprint.storyPoints}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Velocity</span>
                  <span className="metric-value">{sprint.velocity}</span>
                </div>
              </div>

              <div className="ticket-breakdown">
                <div className="breakdown-item done">
                  <span className="breakdown-dot"></span>
                  <span>{sprint.completed} Done</span>
                </div>
                <div className="breakdown-item progress">
                  <span className="breakdown-dot"></span>
                  <span>{sprint.inProgress} In Progress</span>
                </div>
                <div className="breakdown-item todo">
                  <span className="breakdown-dot"></span>
                  <span>{sprint.todo} To Do</span>
                </div>
              </div>

              <div className="card-footer">
                {sprint.status === 'planned' && (
                  <button
                    className="btn-primary"
                    onClick={() => handleStartSprint(sprint.id)}
                  >
                    Start Sprint
                  </button>
                )}
                {sprint.status === 'active' && (
                  <button
                    className="btn-secondary"
                    onClick={() => handleCompleteSprint(sprint.id)}
                  >
                    Complete Sprint
                  </button>
                )}
                {sprint.status === 'completed' && (
                  <button className="btn-view">View Report</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Sprint</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Project *</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="project-select"
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project.projectId}>
                      {project.name?? project.projectName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Sprint Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sprint 25 - Jan 2026"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Duration (weeks)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  min="1"
                  max="4"
                />
              </div>
              <div className="form-group">
                <label>Sprint Goal</label>
                <textarea
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="What do you want to achieve?"
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button 
                  className="btn-submit" 
                  onClick={handleCreateSprint}
                  disabled={!formData.projectId || !formData.name}
                >
                  Create Sprint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Sprint</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Project *</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="project-select"
                >
                  {projectsData.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.key} - {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Sprint Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Sprint Goal</label>
                <textarea
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button className="btn-submit" onClick={handleUpdateSprint}>
                  Update Sprint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintManagement;