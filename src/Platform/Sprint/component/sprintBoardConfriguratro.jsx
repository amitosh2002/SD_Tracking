import React, { useEffect } from "react";
import "./style/ScrumMasterDashboard.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProjectWithHigherAccess } from "../../../Redux/Actions/PlatformActions.js/projectsActions";

const ScrumMasterDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { projectWithAccess, loading } = useSelector(
    (state) => state.projects
  );
  const { userDetails } = useSelector((state) => state.user);

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    if (userDetails?.id) {
      dispatch(getProjectWithHigherAccess(userDetails.id));
    }
  }, [dispatch, userDetails?.id]);

  /* ================= NAVIGATION ================= */
  const navigateToConfigurator = (projectId, type) => {
    navigate(`/scrum/configurator/${projectId}?type=${type}`);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="scrum-dashboard-container scrum-loading">
        <div className="scrum-spinner" />
        <p>Loading projects…</p>
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (!projectWithAccess || projectWithAccess.length === 0) {
    return (
      <div className="scrum-dashboard-container">
        <div className="scrum-empty-state">
          <div className="scrum-empty-icon">🚀</div>
          <h1>No Projects Found</h1>
          <p>Create a project to configure workflows and sprint boards</p>

          <button
            className="scrum-btn-primary"
            onClick={() => navigate("/projects/create")}
          >
            + Create Project
          </button>
        </div>
      </div>
    );
  }

  /* ================= PROJECT LIST ================= */
  return (
    <div className="scrum-dashboard-container">
      <div className="scrum-wrapper">

        {/* HEADER */}
        <div className="scrum-dashboard-header">
          <div>
            <h1 className="scrum-dashboard-title">Scrum Master Dashboard</h1>
            <p className="scrum-dashboard-subtitle">
              Configure workflows and sprint boards
            </p>
          </div>

          <button
            className="scrum-btn-secondary"
            onClick={() => navigate("/projects")}
          >
            View All Projects
          </button>
        </div>

        {/* PROJECT CARDS */}
        <div className="scrum-projects-grid">
          {projectWithAccess.map((project) => (
            <div key={project.id} className="scrum-project-card">

              <h3 className="scrum-project-name">{project.name}</h3>

              <div className="scrum-project-actions">
                <button
                  className="scrum-project-btn workflow"
                  onClick={() =>
                    navigateToConfigurator(project.id, "FLOW")
                  }
                >
                  ⚡ Create Workflow
                </button>

                <button
                  className="scrum-project-btn board"
                  onClick={() =>
                    navigateToConfigurator(project.id, "BOARD")
                  }
                >
                  📊 Create Board
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ScrumMasterDashboard;
