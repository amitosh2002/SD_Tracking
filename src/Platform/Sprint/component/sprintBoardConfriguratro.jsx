
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Search, Briefcase, Plus, ArrowRight, Layers, 
  Layout, X, ExternalLink, Settings, AlertCircle 
} from "lucide-react";
import { getProjectWithHigherAccess } from "../../../Redux/Actions/PlatformActions.js/projectsActions";
import "./style/ScrumMasterDashboard.scss";

const ScrumMasterDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Local State for Search
  const [searchTerm, setSearchTerm] = useState("");

  const { projectWithAccess, loading } = useSelector((state) => state.projects);
  const { userDetails } = useSelector((state) => state.user);

  useEffect(() => {
    if (userDetails?.id) {
      dispatch(getProjectWithHigherAccess(userDetails.id));
    }
  }, [dispatch, userDetails?.id]);

  // Search Logic
  const filteredProjects = useMemo(() => {
    if (!projectWithAccess) return [];
    return projectWithAccess.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toString().includes(searchTerm)
    );
  }, [projectWithAccess, searchTerm]);

  const navigateToConfigurator = (projectId, type) => {
    navigate(`/scrum/configurator/${projectId}?type=${type}`);
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="scrum-dashboard-container centered">
        <div className="loader-wrapper">
          <div className="multi-ripple"><div></div><div></div></div>
          <p>Syncing Workspaces...</p>
        </div>
      </div>
    );
  }

  /* ================= EMPTY STATE (NO PROJECTS AT ALL) ================= */
  if (!projectWithAccess || projectWithAccess.length === 0) {
    return (
      <div className="scrum-dashboard-container centered">
        <div className="empty-state-card">
          <div className="svg-wrapper">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#E0E7FF" d="M47.5,-62.1C59.6,-54.2,66.2,-37.9,69.5,-21.5C72.8,-5.1,72.8,11.4,66.8,25.4C60.8,39.4,48.8,50.8,35.1,59.2C21.4,67.6,6,73,-9.4,71.5C-24.8,70,-40.1,61.7,-51.7,49.8C-63.3,37.9,-71.2,22.4,-73,6.2C-74.8,-10.1,-70.5,-27.1,-60.7,-40.1C-50.9,-53.1,-35.6,-62.1,-19.9,-66.4C-4.1,-70.7,12.2,-70.3,27.5,-67.6C35.4,-66.2,42.5,-64.8,47.5,-62.1Z" transform="translate(100 100)" />
              <rect x="65" y="75" width="70" height="50" rx="8" fill="#6366F1" opacity="0.8" />
              <path d="M85 95H115M85 105H105" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <h1>No Projects Assigned</h1>
          <p>You haven't been assigned to any projects yet. Create a new one to start configuring boards.</p>
          <button className="btn-primary" onClick={() => navigate("/projects/create")}>
            <Plus size={18} /> Create Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="scrum-dashboard-container">
      <header className="dashboard-header">
        <div className="header-text">
          <h1>Scrum Master Dashboard</h1>
          <p>Welcome back, <b>{userDetails?.name || 'User'}</b>. Manage your agile ecosystem.</p>
        </div>
        <div className="header-actions">
           <button className="btn-primary" onClick={() => navigate("/projects/create")}>
            <Plus size={18} /> New Project
          </button>
        </div>
      </header>

      {/* SEARCH BAR SECTION */}
      <div className="search-filter-section">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search projects by name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && <X className="clear-icon" size={18} onClick={() => setSearchTerm("")} />}
        </div>
        <div className="filter-stats">
          <span>Found <b>{filteredProjects.length}</b> Projects</span>
        </div>
      </div>

      {/* PROJECT GRID / NO SEARCH RESULTS */}
      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-glass-card">
              <div className="card-top">
                <div className="icon-box">
                  <Briefcase size={20} />
                </div>
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <span className="id-tag">ID: {project.id.toString().slice(0, 8)}</span>
                </div>
              </div>

              <div className="card-actions">
                {/* PRIMARY ACTION: WORKSPACE */}
                <button 
                  className="action-link primary-action" 
                  onClick={() => navigate(`/workspace/${project.id}`)}
                >
                  <div className="icon-circle workspace"><ExternalLink size={16} /></div>
                  <span>Go to Workspace</span>
                  <ArrowRight size={14} className="arrow" />
                </button>

                <div className="action-divider"><span>Configuration</span></div>

                <button 
                  className="action-link secondary-action" 
                  onClick={() => navigateToConfigurator(project.id, "FLOW")}
                >
                  <div className="icon-circle flow"><Layers size={16} /></div>
                  <span>Workflow Config</span>
                  <ArrowRight size={14} className="arrow" />
                </button>

                <button 
                  className="action-link secondary-action" 
                  onClick={() => navigateToConfigurator(project.id, "BOARD")}
                >
                  <div className="icon-circle board"><Layout size={16} /></div>
                  <span>Sprint Board</span>
                  <ArrowRight size={14} className="arrow" />
                </button>
              </div>

              <div className="card-footer">
                 <Settings size={14} /> <span>Project Settings</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results-state">
           <div className="empty-icon-circle"><AlertCircle size={40} /></div>
           <h2>No matches found</h2>
           <p>We couldn't find any projects matching "{searchTerm}"</p>
           <button className="btn-outline" onClick={() => setSearchTerm("")}>Reset Search</button>
        </div>
      )}
    </div>
  );
};

export default ScrumMasterDashboard;