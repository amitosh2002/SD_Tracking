

import React, { useState, useEffect } from 'react';
import './styles/TimeLogTracker.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProjectAggreation } from '../../../Redux/Actions/PlatformActions.js/projectsActions';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  X,
  BarChart3,
  FolderOpen,
  GitBranch
} from 'lucide-react';

const TimeLogTracker = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedTicket, setSelectedTicket] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userProjectAgg, loadingUserProjectAgg } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getUserProjectAggreation(dateRange.startDate, dateRange.endDate));
  }, [dispatch, dateRange.startDate, dateRange.endDate]);

  const formatMinutes = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const totalTime = userProjectAgg?.reduce((acc, proj) => acc + (proj.totalTimeProject || 0), 0) || 0;
  const totalTickets = userProjectAgg?.reduce((acc, proj) => 
    acc + (proj.sprints?.reduce((sprintAcc, sprint) => 
      sprintAcc + (sprint.tickets?.length || 0), 0) || 0), 0) || 0;
  const totalProjects = userProjectAgg?.length || 0;

  if (loadingUserProjectAgg) {
    return (
      <div className="timelog-container">
        <div className="timelog-loading">
          <div className="loading-spinner" />
          <p>Loading time logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="timelog-container">
      {/* Page Header */}
      <div className="timelog-header">
        <div className="header-content">
          <h1 className="header-title">Time Logs</h1>
          <p className="header-description">Track time across your projects and tickets</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="timelog-filters">
        <div className="filters-group">
          <div className="filter-field">
            <label className="filter-label">From</label>
            <input
              type="date"
              className="filter-input"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              max={dateRange.endDate}
            />
          </div>
          <div className="filter-field">
            <label className="filter-label">To</label>
            <input
              type="date"
              className="filter-input"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              min={dateRange.startDate}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        <button 
          className="filter-refresh"
          onClick={() => dispatch(getUserProjectAggreation(dateRange.startDate, dateRange.endDate))}
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="timelog-stats">
        <StatCard 
          icon={<Clock size={20} />}
          label="Total Time"
          value={formatMinutes(totalTime)}
        />
        <StatCard 
          icon={<FolderOpen size={20} />}
          label="Projects"
          value={totalProjects}
        />
        <StatCard 
          icon={<BarChart3 size={20} />}
          label="Tickets"
          value={totalTickets}
        />
      </div>

      {/* Main Content */}
      {!userProjectAgg || userProjectAgg.length === 0 ? (
        <div className="timelog-empty">
          <Clock size={48} />
          <h3>No time logs found</h3>
          <p>No time has been logged for the selected date range</p>
        </div>
      ) : (
        <div className="timelog-content">
          {userProjectAgg.map((project) => (
            <ProjectCard 
              key={project._id}
              project={project}
              formatMinutes={formatMinutes}
              onTicketClick={setSelectedTicket}
              navigate={navigate}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          formatMinutes={formatMinutes}
        />
      )}
    </div>
  );
};

// ============================================================================
// Stat Card Component
// ============================================================================
const StatCard = ({ icon, label, value }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  </div>
);

// ============================================================================
// Project Card Component
// ============================================================================
const ProjectCard = ({ project, formatMinutes, onTicketClick, navigate }) => {
  const totalSprints = project.sprints?.length || 0;
  const totalTickets = project.sprints?.reduce((acc, sprint) => acc + (sprint.tickets?.length || 0), 0) || 0;

  return (
    <div className="project-card">
      <div className="project-header">
        <div className="project-info">
          <div className="project-title-row">
            <FolderOpen size={20} />
            <h2 className="project-name">{project.projectName || 'Unknown Project'}</h2>
          </div>
          <div className="project-meta">
            <span>{totalSprints} {totalSprints === 1 ? 'sprint' : 'sprints'}</span>
            <span className="separator">•</span>
            <span>{totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'}</span>
          </div>
        </div>
        <div className="project-time">
          <Clock size={16} />
          <span>{formatMinutes(project.totalTimeProject)}</span>
        </div>
      </div>

      <div className="project-sprints">
        {project.sprints?.map((sprint) => (
          <SprintSection
            key={sprint.sprintId}
            sprint={sprint}
            formatMinutes={formatMinutes}
            onTicketClick={onTicketClick}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Sprint Section Component
// ============================================================================
const SprintSection = ({ sprint, formatMinutes, onTicketClick, navigate }) => {
  const scrollCarousel = (direction) => {
    const container = document.getElementById(`sprint-${sprint.sprintId}`);
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -340 : 340, behavior: 'smooth' });
    }
  };

  return (
    <div className="sprint-section">
      <div className="sprint-header">
        <div className="sprint-info">
          <GitBranch size={16} />
          <h3 className="sprint-name">{sprint.sprintName || 'Unknown Sprint'}</h3>
          <span className="sprint-count">{sprint.tickets?.length || 0}</span>
        </div>
        <div className="sprint-time">
          <Clock size={14} />
          <span>{formatMinutes(sprint.totalTime)}</span>
        </div>
      </div>

      <div className="sprint-carousel-wrapper">
        <button 
          className="carousel-nav carousel-nav-left"
          onClick={() => scrollCarousel('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>

        <div id={`sprint-${sprint.sprintId}`} className="sprint-carousel">
          {sprint.tickets?.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              formatMinutes={formatMinutes}
              onView={onTicketClick}
              navigate={navigate}
            />
          ))}
        </div>

        <button 
          className="carousel-nav carousel-nav-right"
          onClick={() => scrollCarousel('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// Ticket Card Component
// ============================================================================
const TicketCard = ({ ticket, formatMinutes, onView, navigate }) => {
  const getStatusStyle = (status) => {
    const styles = {
      'Done': { bg: '#f0fdf4', text: '#166534', border: '#22c55e' },
      'In Progress': { bg: '#eff6ff', text: '#1e40af', border: '#3b82f6' },
      'To Do': { bg: '#f4f4f5', text: '#6b7280', border: '#d1d5db' },
    };
    return styles[status] || { bg: '#f4f4f5', text: '#6b7280', border: '#d1d5db' };
  };

  const statusStyle = getStatusStyle(ticket.status);

  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <span className="ticket-key">{ticket.ticketKey || ticket._id}</span>
        <span 
          className="ticket-status"
          style={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
            borderColor: statusStyle.border
          }}
        >
          {ticket.status}
        </span>
      </div>

      <h4 
        className="ticket-title"
        onClick={() => navigate(`/tickets/${ticket._id}`)}
        title={ticket.title}
      >
        {ticket.title}
      </h4>

      <div className="ticket-footer">
        <div className="ticket-time">
          <span className="time-value">{formatMinutes(ticket.totalTimeLogged)}</span>
          <span className="time-label">{ticket.totalTimeAdded?.length || 0} entries</span>
        </div>
        <button 
          className="ticket-details-btn"
          onClick={() => onView(ticket)}
        >
          Details
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// Ticket Details Modal Component
// ============================================================================
const TicketDetailsModal = ({ ticket, onClose, formatMinutes }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">{ticket.title}</h2>
            <span className="modal-ticket-key">{ticket.ticketKey || ticket._id}</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-stats">
            <div className="modal-stat">
              <span className="stat-label">Status</span>
              <span className="stat-value">{ticket.status}</span>
            </div>
            <div className="modal-stat">
              <span className="stat-label">Story Points</span>
              <span className="stat-value">{ticket.storyPoints || 'N/A'}</span>
            </div>
            <div className="modal-stat">
              <span className="stat-label">Total Time</span>
              <span className="stat-value">{formatMinutes(ticket.totalTimeLogged || 0)}</span>
            </div>
            <div className="modal-stat">
              <span className="stat-label">Entries</span>
              <span className="stat-value">{ticket.timeLogs?.length || 0}</span>
            </div>
          </div>

          <div className="modal-section">
            <h3 className="section-title">Time Entries</h3>
            {ticket.timeLogs && ticket.timeLogs.length > 0 ? (
              <div className="time-entries">
                {ticket.timeLogs.map((log, index) => (
                  <div key={index} className="time-entry">
                    <div className="entry-header">
                      <span className="entry-time">{formatMinutes(log.minutes)}</span>
                      <span className="entry-date">{formatDate(log.at)}</span>
                    </div>
                    {log.loggedBy && (
                      <div className="entry-user">By {log.loggedBy}</div>
                    )}
                    {log.note && (
                      <div className="entry-note">{log.note}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No time entries recorded</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeLogTracker;