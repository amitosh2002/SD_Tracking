import React from 'react';
import './styles/projectCard.scss'; // Using the SCSS with colors.$gray-300 etc.

const ProjectCard = ({ project }) => {
 const { projectName, partnerCode, projectOverview } = project;
  const team = projectOverview?.teamMemberDetails || [];
  const workCount = projectOverview?.workCountForProject || 0;
  const todoCount = projectOverview?.todoCount || 0;
  const inProgressCount = projectOverview?.inProgressCount || 0;
  const doneCount = projectOverview?.doneCount || 0;
  const testingCount = projectOverview?.testingCount || 0;
  
  const displayLimit = 3;
  const members = team.slice(0, displayLimit);
  const extra = team.length > displayLimit ? team.length - displayLimit : 0;

  return (
    <div className="jira-space-card">
      <div className="space-header">
        <div className="icon-wrapper">
          {projectName.substring(0, 2).toUpperCase()}
        </div>
        <div className="more-actions">•••</div>
      </div>

      <div className="space-content">
        <h3>{projectName}</h3>
        {partnerCode &&<p>{partnerCode} </p>}
      </div>
            {/* Work details section before the divider */}
            {<div className="work-stats">
            <div className="stat-group">
                <span className="stat-value">{workCount}</span>
                <span className="stat-label">Total</span>
            </div>
            <div className="work-progress-bar">
                <div className="bar todo" style={{ width: `${(todoCount / workCount) * 100}%` }} title="To Do" />
                <div className="bar progress" style={{ width: `${(inProgressCount / workCount) * 100}%` }} title="In Progress" />
                <div className="bar testing" style={{ width: `${(testingCount / workCount) * 100}%` }} title="Testing" />
                <div className="bar done" style={{ width: `${(doneCount / workCount) * 100}%` }} title="Done" />
            </div>
            <div className="stat-summary">
                <span><strong>{inProgressCount}</strong> In Progress</span>
                <span><strong>{doneCount}</strong> Done</span>
            </div>
            </div>}
      <div className="space-divider" />

      <div className="space-footer">
        <div className="status-pill">Active</div>
        
        <div className="team-stack">
          {extra > 0 && <div className="avatar-circle remainder">+{extra}</div>}
          
          {[...members].reverse().map((m, i) => (
            <div className="avatar-circle" key={i} title={m.name}>
              {m.image ? (
                <img src={m.image} alt={m.name} />
              ) : (
                m.name.charAt(0)
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;