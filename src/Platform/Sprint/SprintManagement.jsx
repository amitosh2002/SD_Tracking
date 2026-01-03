import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './SprintManagement.scss';
import { getAllProjects } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import { completeSprint, createSprintForPartner, fetchProjectSprintOverview, startSprintAction, updateSprintAction } from '../../Redux/Actions/SprintActions/sprintActionsV1';
import CreateSprint from './component/createSprint';
import SprintCard from './component/sprintCard';
import EditSprint from './component/EditSprint';
import { useMemo } from 'react';
import CircularLoader from '../../customFiles/customComponent/Loader/circularLoader';

const SprintManagement = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  // useEffect(()=>{
  //   dispatch(getAllProjects(userDetails?.id))

  //   dispatch(fetchProjectSprintOverview(projectId))
  // },[dispatch,userDetails,projectId])
//   const { projects } = useSelector((state) => state.project);
//   const { sprints, loading } = useSelector((state) => state.sprint);
  const {projectWithAccess,projects}= useSelector((state)=>state.projects)
  const {sprintOverview,loading}= useSelector((state)=>state.sprint)

  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState('all');
  const [projectId, setProjectId] = useState('');
  const [selectedSprintId, setSelectedSprintId] = useState('');
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

  useEffect(()=>{
    dispatch(getAllProjects(userDetails?.id))

    dispatch(fetchProjectSprintOverview(projectId))
  },[dispatch,userDetails,projectId])

  console.log(projectId,"project id for id")
  // Mock sprints data with project association
  const [sprintsData, setSprintsData] = useState([]);

  // const filteredSprints = sprintsData.filter((sprint) => {
  //   const matchesTab = sprint.status === activeTab;
  //   const matchesProject = selectedProject === 'all' || sprint.projectId === selectedProject;
  //   const matchesSearch = sprint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //                        sprint.projectName.toLowerCase().includes(searchQuery.toLowerCase());
  //   return matchesTab && matchesProject && matchesSearch;
  // });
  // Calculate stats based on selected project
  const getStatsForProject = () => {
  const allSprints = sprintOverview.flatMap(project => 
    project.sprints.map(sprint => ({
      ...sprint,
      projectId: project.projectId
    }))
  );
  
  const filteredByProject = selectedProject === 'all' 
    ? allSprints 
    : allSprints.filter(s => s.projectId === selectedProject);

  return {
    active: filteredByProject.filter(s => s.status === 'ACTIVE').length,
    planned: filteredByProject.filter(s => s.status === 'PLANNED').length,
    completed: filteredByProject.filter(s => s.status === 'COMPLETED').length,
    avgVelocity: (filteredByProject.reduce((sum, s) => sum + (s.velocity || 0), 0) / filteredByProject.length || 0).toFixed(1)
  };
};

  // // fetch project details 
  // const getProjectDetails = (projectId) => {
  //   return projects.find(
  //     (project) => project.projectId === projectId
  //   )
  // };


  const stats = getStatsForProject();

  const handleCreateSprint = () => {
   
    // setSprintsData([...sprintsData, newSprint]);
    setShowCreateModal(false);
    console.log(formData)
    dispatch(createSprintForPartner(formData.startDate,formData.endDate,formData.projectId,formData.sprintName))
    resetForm();
  };

  const handleUpdateSprint = () => {
    console.log(sprintsData,formData)
    dispatch(updateSprintAction(selectedSprintId,formData))
    setShowEditModal(false);
    setSelectedSprint(null);
    resetForm();
  };

  const handleStartSprint = (sprintId) => {
    dispatch(startSprintAction(sprintId))
  };

  const handleCompleteSprint = (sprintId) => {
    dispatch(completeSprint(sprintId))
    dispatch(fetchProjectSprintOverview(projectId))
  };

  const handleDeleteSprint = (sprintId) => {
    if (window.confirm('Are you sure you want to delete this sprint?')) {
      setSprintsData(sprintsData.filter((sprint) => sprint.id !== sprintId));
    }
  };

 const openEditModal = (sprint, projectIdFromCard,sprintId) => {
  setSelectedSprintId(sprintId)
  const resolvedProjectId =
    projectIdFromCard || sprint?.projectId || "";

  const normalizedFormData = {
    projectId: resolvedProjectId,
    name: sprint?.sprintName || sprint?.name || "",
    startDate: sprint?.startDate
      ? sprint.startDate.split("T")[0]
      : "",
    endDate: sprint?.endDate
      ? sprint.endDate.split("T")[0]
      : "",
    goal: sprint?.goal || ""
  };
  setSelectedSprint(sprint);
  setFormData(normalizedFormData);
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
const localSprints = useMemo(() => {
  if (!Array.isArray(sprintOverview)) return [];

  // 1️⃣ Collect unique sprints
  const sprintMap = new Map();

  sprintOverview.forEach(project => {
    project?.sprints?.forEach(sprint => {
      let projectId= project['projectId'];
      if (!sprint?.sprintId) return;
      sprintMap.set(sprint.sprintId, {...sprint,projectId});
    });
  });

  let sprints = [...sprintMap.values()];

  // 2️⃣ Filter by active tab (status)
  if (activeTab && activeTab !== "ALL") {
    sprints = sprints.filter(
      sprint => sprint.status?.toLowerCase() === activeTab.toLowerCase()
    );
  }

  // 3️⃣ Search filter
  const query = searchQuery.trim().toLowerCase();

  if (query) {
    sprints = sprints.filter(sprint =>
      sprint.sprintName?.toLowerCase().includes(query)
    );
  }

  // 4️⃣ Sorting (ACTIVE → PLANNED → COMPLETED)
  const statusOrder = {
    ALL:1,
    ACTIVE: 2,
    PLANNED: 3,
    COMPLETED: 4
  };

  sprints.sort(
    (a, b) =>
      (statusOrder[a.status] || 99) -
      (statusOrder[b.status] || 99)
  );

  return sprints;
}, [sprintOverview, searchQuery, activeTab]);



  // =============================Memorized Sprint Data============================








  //============================== For sorting and searching memorized the sprints ================================

const { ActiveSprint, PlannedSprint, CompletedSprint } = useMemo(() => {
  const result = {
    ActiveSprint: [],
    PlannedSprint: [],
    CompletedSprint: []
  };

  localSprints.forEach(sprint => {
    if (sprint.status === 'ACTIVE') {
      result.ActiveSprint.push(sprint);
    } else if (sprint.status === 'PLANNED') {
      result.PlannedSprint.push(sprint);
    } else if (sprint.status === 'COMPLETED') {
      result.CompletedSprint.push(sprint);
    }
  });

  return result;
}, [localSprints]);


//============================== For sorting and searching memorized the sprints ================================
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
            onClick={() => {setSelectedProject('all'),setProjectId(null)}}
          >
            <span className="pill-icon">📊</span>
            All Projects
          </button>
          {Array.isArray(projects) &&projects?.map((project) => (
            
            <button
              key={project._id}
              className={`project-pill ${selectedProject === project._id ? 'active' : ''}`}
              onClick={() => {setSelectedProject(project._id),setProjectId(project?.projectId)
              }}
              style={{
                '--project-color': project.color,
                borderColor: selectedProject === project._id ? project.color : '#e0e7ff'
              }}
            >
              <span className="pill-key" style={{ backgroundColor: project.color }}>
                {project.key}
              </span>
              {project.name ??project.projectName}
              {/* {projectWithAccess} */}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-active">
          <div className="stat-icon">🏃</div>
          <div className="stat-content">
            <div className="stat-value">{localSprints.length}</div>
            <div className="stat-label">All Sprints</div>
          </div>
        </div>
        <div className="stat-card stat-active">
          <div className="stat-icon">🏃</div>
          <div className="stat-content">
            <div className="stat-value">{ActiveSprint.length}</div>
            <div className="stat-label">Active Sprints</div>
          </div>
        </div>
        <div className="stat-card stat-planned">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{PlannedSprint.length}</div>
            <div className="stat-label">Planned Sprints</div>
          </div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{CompletedSprint.length}</div>
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
            className={`tab ${activeTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveTab('ALL')}
          >
            ALL ({localSprints.length})
          </button>
          <button
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active ({ActiveSprint.length})
          </button>
          <button
            className={`tab ${activeTab === 'planned' ? 'active' : ''}`}
            onClick={() => setActiveTab('planned')}
          >
            Planned ({PlannedSprint.length})
          </button>
          <button
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({CompletedSprint.length})
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

{/* // Then render filteredSprints */}
{localSprints.length === 0 ? (
  <div className="empty-state">
    <div className="empty-icon">📭</div>
    <h3>No sprints found</h3>
    <p>Try adjusting your filters or create a new sprint</p>
  </div>
) : (
  <div className="sprint-grid">
    {
    loading ? <CircularLoader/>:
    
    localSprints.map((sprint) => {
      return (
        <SprintCard
          key={sprint.sprintId}
          sprint={sprint}
          setFormData={setFormData}
          openEditModal={openEditModal}
          handleDeleteSprint={handleDeleteSprint}
          handleStartSprint={handleStartSprint}
          handleCompleteSprint={handleCompleteSprint}
        />
      );
    })
    
    }
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