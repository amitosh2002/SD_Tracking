import React, { useState } from 'react';
import { Award, Target, Clock, Box } from 'lucide-react';
import './styles/TeamAnalytics.scss';

const TeamAnalytics = ({ data }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  console.log(data)

  return (
    <div className="team-analytics-page">
      <div className="team-main-list">
        <header>
          <h1>Team Analytics Matrix</h1>
        </header>

        {data?.map(user => (
          <div key={user.userId} className="team-user-card" onClick={() => setSelectedUser(user)}>
            <UserProfile 
              userDetails={user.userDetails} 
              isTopContributor={user.isTopContributor} 
            />

            <div className="user-stats-row">
              <Stat label="Total Points" val={user.totalStoryPoints} highlight />
              <div className="stat-divider"></div>
              <Stat label="Completed" val={user.totalCompleted} color="#10b981" />
              <Stat label="In Progress" val={user.totalInProgress} color="#3b82f6" />
              <button className="view-btn">Deep Dive →</button>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="analysis-sidebar">
          <div className="sidebar-header">
            <button className="close-btn" onClick={() => setSelectedUser(null)}>✕</button>
            <UserProfile userDetails={selectedUser.userDetails} />
          </div>
          
          <div className="stats-strip">
            <Stat label="Logged Time" val={`${Math.floor((selectedUser.totalMinutes || 0) / 60)}h`} highlight />
            <Stat label="Total SP" val={selectedUser.totalStoryPoints} color="#f59e0b" />
            <Stat label="Efficiency" val={`${((selectedUser.totalCompleted / (selectedUser.allTickets?.length || 1)) * 100).toFixed(0)}%`} color="#10b981" />
          </div>

          <div className="section-title">Invisible Labor (0 Point Tasks)</div>
          <div className="tickets-list">
            {(selectedUser.allTickets || []).filter(t => t.storyPoint === 0).map(t => (
              <TicketItem key={t.ticketKey} ticket={t} />
            ))}
          </div>

          <div className="section-title">Sprint Performance</div>
          <div className="tickets-list">
            {(selectedUser.allTickets || []).map(t => (
              <TicketItem key={t.ticketKey} ticket={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TicketItem = ({ ticket }) => {
  const totalMinutes = (ticket.timeLogs || []).reduce((acc, log) => acc + (log.minutes || 0), 0);
  const tag = ticket.tags?.[0];
  const priority = ticket.priority?.[0];
  
  return (
    <div className="premium-ticket-card">
      <div className="card-top-accent">
        <div className="ribbon-icon">
          <Award size={18} color="#7c3aed" />
        </div>
        <div className="pills-row">
          {priority && (
            <span className="pill" style={{'--pill-color': priority.color}}>{priority.name}</span>
          )}
          <span className="pill status-pill">{ticket.status}</span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="ticket-main-title">{ticket.title}</h3>
        <p className="ticket-subtitle">{ticket.ticketKey}</p>
        
        {tag && (
          <div className="tag-indicator" style={{'--tag-color': tag.color}}>
            <span className="dot" style={{ backgroundColor: tag.color }}></span>
            {tag.name}
          </div>
        )}
      </div>

      <div className="card-footer-visuals">
        <VisualStat icon={<Target size={14} />} label="Points" value={ticket.storyPoint || 0} color="#f59e0b" />
        <VisualStat icon={<Clock size={14} />} label="Time" value={`${Math.floor(totalMinutes / 60)}h`} color="#3b82f6" />
        <VisualStat icon={<Box size={14} />} label="Sprint" value={ticket.sprintName.replace('Sprint-', 'S')} color="#10b981" />
      </div>
    </div>
  );
};

const VisualStat = ({ icon, label, value, color }) => (
  <div className="visual-stat-item">
    <div className="stat-circle" style={{ borderColor: color, color: color }}>
      {icon}
    </div>
    <div className="stat-details">
      <span className="stat-val">{value}</span>
      <span className="stat-lbl">{label}</span>
    </div>
  </div>
);

const UserProfile = ({ userDetails, isTopContributor }) => {
  const { name, email, image } = userDetails || {};
  
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ").filter(p => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="user-profile-info">
      <div className="avatar-wrapper">
        {image ? (
          <img src={image} alt={name} className="user-avatar" />
        ) : (
          <div className="user-initials">{getInitials(name)}</div>
        )}
        {isTopContributor && <div className="crown-badge">👑</div>}
      </div>
      <div className="user-text-details">
        <h3 className="user-name">{name || "Unknown User"}</h3>
        <p className="user-email">{email || "No email"}</p>
      </div>
    </div>
  );
};

const Stat = ({ label, val, color, highlight }) => (
  <div className="matrix-stat-circle-wrapper">
    <div className="matrix-stat-circle" style={{ 
      background: highlight ? 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)' : '#fff', 
      borderColor: highlight ? 'transparent' : (color || '#e5e7eb'),
      color: highlight ? '#fff' : (color || '#111827')
    }}>
      <span className="matrix-stat-val">{val}</span>
    </div>
    <span className="matrix-stat-label">{label}</span>
  </div>
);

export default TeamAnalytics;