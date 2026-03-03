
import { useDispatch, useSelector } from 'react-redux';
import './SprintCard.scss';
import { SHOW_SNACKBAR } from '../../../Redux/Constants/PlatformConstatnt/platformConstant';

const SprintCard = ({
  sprint,
  project,
  openEditModal,
  handleDeleteSprint,
  handleCompleteSprint,
  handleStartSprint,
}) => {
  const { analytics } = sprint;
  const {projects}= useSelector((state)=>state.projects)
    const getProjectDetails = (projectId) => {
    return projects.find(
      (project) => project.projectId === projectId
    )
  };

  const dispatch = useDispatch();
  const getHealthColor = () => {
    // Calculate health based on metrics
    if (!analytics) return 'health-pending';
    
    const completionRate = parseFloat(analytics.taskCompletionPercent);
    const daysRemaining = analytics.daysRemaining;
    
    if (completionRate >= 80) return 'health-excellent';
    if (completionRate >= 60) return 'health-good';
    if (completionRate >= 40 || daysRemaining < 3) return 'health-warning';
    if (daysRemaining < 0) return 'health-critical';
    return 'health-good';
  };

  const getStatusBadge = (isActive) => {
    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    
    if (isActive && now >= startDate && now <= endDate) {
      return 'badge-active';
    }
    if (now < startDate) {
      return 'badge-planned';
    }
    if (now > endDate || !isActive) {
      return 'badge-completed';
    }
    return 'badge-default';
  };

  const getStatusText = (isActive) => {
    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    
    if (isActive && now >= startDate && now <= endDate) {
      return 'Active';
    }
    if (now < startDate) {
      return 'Planned';
    }
    if (now > endDate || !isActive) {
      return 'Completed';
    }
    return 'Unknown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemainingText = (days) => {
    if (days < 0) {
      return `Overdue by ${Math.abs(days)} days`;
    }
    if (days === 0) {
      return 'Last day';
    }
    if (days === 1) {
      return '1 day remaining';
    }
    return `${days} days remaining`;
  };

  const getProgressColor = () => {
    const completionRate = parseFloat(analytics?.taskCompletionPercent || 0);
    if (completionRate >= 75) return '#10b981'; // Green
    if (completionRate >= 50) return '#3b82f6'; // Blue
    if (completionRate >= 25) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  return (
    // <div className={`sprint-card ${getHealthColor}`}>
    //   <div className="card-header">
    //     <div className="card-title-section">
    //       <div className="sprint-info-header">
    //         <h3 className="card-title">{project?.projectName ?? getProjectDetails(sprint?.projectId)?.projectName}</h3>
    //         <span className="sprint-number">Sprint #{sprint?.sprintName}</span>
    //       </div>
    //       <span className={`status-badge ${getStatusBadge(sprint?.isActive)}`}>
    //         {getStatusText(sprint.isActive)}
    //       </span>
    //     </div>
    //     <div className="card-actions">
    //       <button className="action-btn" onClick={() => openEditModal(sprint, sprint?.projectId,sprint?.sprintId)} title="Edit">
    //         ✏️
    //       </button>
    //       <button className="action-btn" onClick={() => handleDeleteSprint(sprint?.sprintId)} title="Delete">
    //         🗑️
    //       </button>
    //     </div>
    //   </div>

    //   <div className="sprint-dates">
    //     <span>📅 {formatDate(sprint?.startDate)}</span>
    //     <span className="date-separator">→</span>
    //     <span>{formatDate(sprint.endDate)}</span>
    //   </div>

    //   {analytics && (
    //     <>
    //       {/* Days Remaining Badge */}
    //       <div className={`days-remaining ${analytics.daysRemaining < 0 ? 'overdue' : ''}`}>
    //         <span className="days-icon">⏱️</span>
    //         <span className="days-text">{getDaysRemainingText(analytics?.daysRemaining)}</span>
    //       </div>

    //       {/* Progress Section */}
    //       <div className="progress-section">
    //         <div className="progress-header">
    //           <span className="progress-label">Task Progress</span>
    //           <span className="progress-value">
    //             {analytics?.completedTaskInSprint}/{analytics?.totalTaskInSprint} tasks
    //           </span>
    //         </div>
    //         <div className="progress-bar">
    //           <div
    //             className="progress-fill"
    //             style={{
    //               width: `${analytics?.taskCompletionPercent}%`,
    //               backgroundColor: getProgressColor()
    //             }}
    //           ></div>
    //         </div>
    //         <div className="progress-percentage">{analytics?.taskCompletionPercent}%</div>
    //       </div>

    //       {/* Sprint Metrics */}
    //       <div className="sprint-metrics">
    //         <div className="metric">
    //           <span className="metric-label">Story Points</span>
    //           <span className="metric-value">
    //             {analytics?.completedStoryPoint}/{analytics?.totalStoryPoint}
    //           </span>
    //         </div>
    //         <div className="metric">
    //           <span className="metric-label " style={{background:getHealthColor(analytics?.velocityPercent)}}>Velocity</span>
    //           <span className="metric-value">{analytics?.velocityPercent}%</span>
    //         </div>
    //         <div className="metric">
    //           <span className="metric-label">Avg Points/Task</span>
    //           <span className="metric-value">{analytics?.avgStoryPointPerTask}</span>
    //         </div>
    //       </div>

    //       {/* Ticket Breakdown */}
    //       <div className="ticket-breakdown">
    //         <div className="breakdown-item done">
    //           <span className="breakdown-dot"></span>
    //           <span>{analytics?.totalClosedTaskInSprint} Done</span>
    //         </div>
    //         <div className="breakdown-item progress">
    //           <span className="breakdown-dot"></span>
    //           <span>{analytics?.totalInProgressTaskInSprint} In Progress</span>
    //         </div>
    //         <div className="breakdown-item testing">
    //           <span className="breakdown-dot"></span>
    //           <span>{analytics?.totalTicketInTestingInSprint} Testing</span>
    //         </div>
    //         <div className="breakdown-item todo">
    //           <span className="breakdown-dot"></span>
    //           <span>{analytics?.totalOpenTaskInSprint} To Do</span>
    //         </div>
    //       </div>

    //       {/* Additional Stats */}
    //       <div className="additional-stats">
    //         <div className="stat-chip">
    //           <span className="stat-label">Resolved:</span>
    //           <span className="stat-value">{analytics?.resolvedTaskInSprint}</span>
    //         </div>
    //         <div className="stat-chip">
    //           <span className="stat-label">Remaining Points:</span>
    //           <span className="stat-value">{analytics?.remainingStoryPoint}</span>
    //         </div>
    //       </div>
    //     </>
    //   )}

    //   {/* Action Buttons */}
    //   <div className="card-footer">
    //     {!sprint?.isActive && new Date() < new Date(sprint?.startDate) && (
    //       <button
    //         className="btn-primary"
    //         onClick={() => handleStartSprint(sprint?.sprintId)}
    //       >
    //         Start Sprint
    //       </button>
    //     )}
    //     {sprint?.isActive && new Date() <= new Date(sprint?.endDate) && (
    //       <button
    //         className="btn-secondary"
    //         onClick={() => handleCompleteSprint(sprint?.sprintId)}
    //       >
    //         Complete Sprint
    //       </button>
    //     )}
    //     {(!sprint?.isActive && new Date() > new Date(sprint?.endDate) ) && (
    //       <button className="btn-view" onClick={()=>{
    //             dispatch({
    //                type:SHOW_SNACKBAR,
    //                payload:{
    //                  type:'success',
    //                  message:"Feature comming soon !"
    //                }
    //              })
                  
    //       }}>View Report</button>
    //     )}
    //   </div>
    // </div>
    <div className="sprint-dashboard-card">
  {/* HEADER */}
  <div className="card-top">
    <div>
      <h3 className="project-name">
        {project?.projectName ?? getProjectDetails(sprint?.projectId)?.projectName}
      </h3>
      <p className="sprint-name">{sprint?.sprintName}</p>
    </div>

    <span className={`status-pill ${getStatusBadge(sprint?.isActive)}`}>
      {getStatusText(sprint?.isActive)}
    </span>
  </div>

  {/* DATE RANGE */}
  <div className="date-range">
    <span>{formatDate(sprint?.startDate)}</span>
    <span>→</span>
    <span>{formatDate(sprint?.endDate)}</span>
  </div>

  {/* PROGRESS */}
  {analytics && (
    <>
      <div className="progress-wrapper">
        <div className="progress-info">
          <span>Progress</span>
          <span>{analytics.taskCompletionPercent}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${analytics.taskCompletionPercent}%`,
              backgroundColor: getProgressColor()
            }}
          />
        </div>

        <p className="days-remaining">
          {getDaysRemainingText(analytics.daysRemaining)}
        </p>
      </div>

      {/* METRICS GRID */}
      <div className="metrics-sprint-grid">
        <div>
          <p>Story Points</p>
          <h4>
            {analytics.completedStoryPoint}/{analytics.totalStoryPoint}
          </h4>
        </div>

        <div>
          <p>Velocity</p>
          <h4>{analytics.velocityPercent}%</h4>
        </div>

        <div>
          <p>Tasks</p>
          <h4>
            {analytics.completedTaskInSprint}/{analytics.totalTaskInSprint}
          </h4>
        </div>
      </div>

      {/* TICKET BREAKDOWN */}
      <div className="ticket-row">
        <span className="done">{analytics.totalClosedTaskInSprint} Done</span>
        <span className="progress">
          {analytics.totalInProgressTaskInSprint} Progress
        </span>
        <span className="testing">
          {analytics.totalTicketInTestingInSprint} Testing
        </span>
        <span className="todo">
          {analytics.totalOpenTaskInSprint} To Do
        </span>
      </div>
    </>
  )}

  {/* ACTIONS */}
  <div className="card-actions-row">
    <div className="left-actions">
      <button onClick={() => openEditModal(sprint, sprint?.projectId, sprint?.sprintId)}>✏️</button>
      <button onClick={() => handleDeleteSprint(sprint?.sprintId)}>🗑️</button>
    </div>

    <div className="right-actions">
      {!sprint?.isActive && new Date() < new Date(sprint?.startDate) && (
        <button className="btn-primary" onClick={() => handleStartSprint(sprint?.sprintId)}>
          Start Sprint
        </button>
      )}

      {sprint?.isActive && new Date() <= new Date(sprint?.endDate) && (
        <button className="btn-secondary" onClick={() => handleCompleteSprint(sprint?.sprintId)}>
          Complete Sprint
        </button>
      )}

      {!sprint?.isActive && new Date() > new Date(sprint?.endDate) && (
        <button
          className="btn-view"
          onClick={() =>
            dispatch({
              type: SHOW_SNACKBAR,
              payload: {
                type: 'success',
                message: 'Feature coming soon!',
              },
            })
          }
        >
          View Report
        </button>
      )}
    </div>
  </div>
</div>

  );
};

export default SprintCard;