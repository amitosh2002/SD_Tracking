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
  const {projects}= useSelector((state)=>state.projects)
  const {sprintOverview,loading}= useSelector((state)=>state.sprint)

  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState('all');
  const [projectId, setProjectId] = useState('');
  const [selectedSprintId, setSelectedSprintId] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  // const [selectedSprint, setSelectedSprint] = useState(null);
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
    // setSelectedSprint(null);
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
  // setSelectedSprint(sprint);
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
//============================== For Project initials color schema ================================


function getProjectColor(projectName) {
  const colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722', '#795548', '#607D8B'
  ];
  
  const index = projectName
    ? projectName.charCodeAt(0) % colors.length
    : 0;
    
  return colors[index];
}


//============================== For Project initials color schema  ================================
return (
  <div className="sprint-management">

    {/* ================= HEADER ================= */}
    <div className="page-header">
      <div className="page-header-left">
        <h1>Sprint Management</h1>
        <p>Plan, track, and execute sprints across projects</p>
      </div>

      <button
        className="primary-action-btn"
        onClick={() => setShowCreateModal(true)}
      >
        + Create Sprint
      </button>
    </div>

    {/* ================= PROJECT FILTER ================= */}
    <div className="project-filter-bar">
      <span className="filter-title">Filter sprints by project. Stats and sprint cards update automatically.</span>

      <div className="project-chip-row">
        <button
          className={`project-chip ${selectedProject === 'all' ? 'active' : ''}`}
          onClick={() => {
            setSelectedProject('all');
            setProjectId(null);
          }}
        >
          All Projects
        </button>

        {Array.isArray(projects) &&
          projects.map(project => (
            <button
              key={project._id}
              className={`project-chip ${
                selectedProject === project._id ? 'active' : ''
              }`}
              onClick={() => {
                setSelectedProject(project._id);
                setProjectId(project.projectId);
              }}
              style={{
                '--chip-color': project.color
              }}
            >
              <span
                className="project-key"
                style={{ backgroundColor: getProjectColor(project.name ?? project.projectName) }}
              >
                {/* {project.name[0] ?? project.projectName[0]} */}
                {(project.name?.[0]) ?? (project.projectName?.[0]) ?? ''}

              </span>
              {project.projectName ?? project.name}
            </button>
          ))}
      </div>
    </div>

    {/* ================= STATS ================= */}
    <div className="stats-row">
      <div className="stat-tile">
        <span className="stat-number">{localSprints.length}</span>
        <span className="stat-label">Total number of sprints created for selected project(s)</span>
      </div>

      <div className="stat-tile active">
        <span className="stat-number">{ActiveSprint.length}</span>
        {/* <span className="stat-label">Total Active</span> */}
        <span className="stat-label">Sprints currently in progress</span>
      </div>

      <div className="stat-tile planned">
        <span className="stat-number">{PlannedSprint.length}</span>
        {/* <span className="stat-label">Total Planned</span> */}
        <span className="stat-label">Sprints scheduled but not started yet</span>
      </div>

      <div className="stat-tile completed">
        <span className="stat-number">{CompletedSprint.length}</span>
        {/* <span className="stat-label"> Total Completed</span> */}
        <span className="stat-label"> Finished sprints with final metrics</span>
      </div>

      <div className="stat-tile velocity">
        <span className="stat-number">{stats.avgVelocity} % </span>
        <span className="stat-label">Average story points completed per sprint</span>
      </div>
    </div>

    {/* ================= TOOLBAR ================= */}
    <div className="toolbar">
      <div className="tab-group">
        <button
          className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          All
        </button>

        <button
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active
        </button>

        <button
          className={`tab-btn ${activeTab === 'planned' ? 'active' : ''}`}
          onClick={() => setActiveTab('planned')}
        >
          Planned
        </button>

        <button
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>

      <div className="search-input">
        <input
          type="text"
          placeholder="Search sprint name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>
    </div>

    {/* ================= CONTENT ================= */}
    {loading ? (
      <CircularLoader />
    ) : localSprints.length === 0 ? (
      <div className="empty-state">
        <div className="empty-illustration">📭</div>
        <h3>No sprints found</h3>
        <p>Create a sprint or adjust your filters</p>
      </div>
    ) : (
      <div className="sprint-card-grid">
        {localSprints.map(sprint => (
          <SprintCard
            key={sprint.sprintId}
            sprint={sprint}
            openEditModal={openEditModal}
            handleDeleteSprint={handleDeleteSprint}
            handleStartSprint={handleStartSprint}
            handleCompleteSprint={handleCompleteSprint}
          />
        ))}
      </div>
    )}

    {/* ================= MODALS ================= */}
    {showCreateModal && (
      <CreateSprint
        formData={formData}
        projects={projects}
        setShowCreateModal={setShowCreateModal}
        setFormData={setFormData}
        handleCreateSprint={handleCreateSprint}
      />
    )}

    {showEditModal && (
      <EditSprint
        setFormData={setFormData}
        setShowEditModal={setShowEditModal}
        formData={formData}
        projectsData={projects}
        handleUpdateSprint={handleUpdateSprint}
      />
    )}
  </div>
);

};

export default SprintManagement;