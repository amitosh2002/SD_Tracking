import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './SprintManagement.scss';
import { getAllProjects, getProjectWithHigherAccess } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import { createSprintForPartner, fetchProjectSprintOverview } from '../../Redux/Actions/SprintActions/sprintActionsV1';
import CreateSprint from './component/createSprint';
import SprintCard from './component/sprintCard';
import EditSprint from './component/EditSprint';

const SprintManagement = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);


  useEffect(()=>{
    dispatch(getAllProjects(userDetails?.id))

    dispatch(fetchProjectSprintOverview())
  },[dispatch,userDetails])
//   const { projects } = useSelector((state) => state.project);
//   const { sprints, loading } = useSelector((state) => state.sprint);
  const {projectWithAccess,sucessFetchProjects,projects}= useSelector((state)=>state.projects)
  const {sprintOverview}= useSelector((state)=>state.sprint)

console.log(projectWithAccess)
  const [activeTab, setActiveTab] = useState('active');
  const [selectedProject, setSelectedProject] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData,setFormData]=useState({
       projectId: '',       // Required - from dropdown
  sprintName: '',      // Optional - auto-generated if empty
  startDate: '',       // Required - YYYY-MM-DD
  endDate: '' 
  })


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
      active: filteredByProject.filter(s => s.status === 'ACTIVE').length,
      planned: filteredByProject.filter(s => s.status === 'PLANNED').length,
      completed: filteredByProject.filter(s => s.status === 'COMPLETED').length,
      avgVelocity: (filteredByProject.reduce((sum, s) => sum + s.velocity, 0) / filteredByProject.length || 0).toFixed(1)
    };
  };

  // fetch project details 
  const getProjectDetails = (projectId) => {
    return projects.find(
      (project) => project.projectId === projectId
    )
  };


  const stats = getStatsForProject();

  const handleCreateSprint = () => {
   
    // setSprintsData([...sprintsData, newSprint]);
    setShowCreateModal(false);
    console.log(formData)
    dispatch(createSprintForPartner(formData.startDate,formData.endDate,formData.projectId,formData.sprintName))
    resetForm();
  };

  const handleUpdateSprint = () => {
    const selectedProj = projectWithAccess.find(p => p.id === formData.projectId) || projects.find(p => p.projectId === formData.projectId || p._id === formData.projectId);
    setSprintsData(
      sprintsData.map((sprint) =>
        (sprint.id === selectedSprint?.id || sprint.id === selectedSprint?.sprintId || sprint.sprintId === selectedSprint?.sprintId)
          ? { 
              ...sprint, 
              ...formData,
              sprintName: formData.name || formData.sprintName || sprint.sprintName,
              projectName: selectedProj?.name || selectedProj?.projectName,
              projectKey: selectedProj?.key || selectedProj?.partnerCode,
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

  const openEditModal = (sprint, projectIdFromCard) => {
    setSelectedSprint(sprint);
    console.log('openEditModal sprint:', sprint, 'projectIdFromCard:', projectIdFromCard)
    const resolvedProjectId = projectIdFromCard || sprint?.projectId || sprint?.projectId;
    setFormData({
      projectId: resolvedProjectId || '',
      name: sprint?.sprintName || sprint?.name || '',
      startDate: sprint?.startDate || '',
      endDate: sprint?.endDate || '',
      goal: sprint?.goal || ''
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

  // const getHealthColor = (health) => {
  //   switch (health) {
  //     case 'excellent': return 'health-excellent';
  //     case 'good': return 'health-good';
  //     case 'warning': return 'health-warning';
  //     case 'critical': return 'health-critical';
  //     default: return 'health-pending';
  //   }
  // };

  // const getStatusBadge = (status) => {
  //   switch (status) {
  //     case 'active': return 'badge-active';
  //     case 'planned': return 'badge-planned';
  //     case 'completed': return 'badge-completed';
  //     default: return 'badge-default';
  //   }
  // };

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

              {/* {projectWithAccess} */}
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
      {sprintOverview.map((project) =>
          project.sprints.map((sprint) => (
            <SprintCard
              key={sprint.sprintId}
              project={getProjectDetails(project?.projectId)}
              sprint={sprint}
              setFormData={setFormData}
              projectId={project.projectId}
              openEditModal={openEditModal}
              handleDeleteSprint={handleDeleteSprint}
              handleStartSprint={handleStartSprint}
              handleCompleteSprint={handleCompleteSprint}
            />
          ))
        )}

        </div>
      )}

      {showCreateModal && (
        <CreateSprint formData={formData} projects={projects} setShowCreateModal={setShowCreateModal} setFormData={setFormData} handleCreateSprint={handleCreateSprint} />
      )}

      {showEditModal && (
        <EditSprint setFormData={setFormData} setShowEditModal={setShowEditModal} formData={formData} projectsData={projects} handleUpdateSprint={handleUpdateSprint} />
      )}
    </div>
  );
};

export default SprintManagement;