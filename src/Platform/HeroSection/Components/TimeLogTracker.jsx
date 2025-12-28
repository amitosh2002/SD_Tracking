import React, { useState, useEffect } from 'react';
import './styles/TimeLogTracker.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProjectAggreation } from '../../../Redux/Actions/PlatformActions.js/projectsActions';
import { useNavigate } from 'react-router-dom';

const TimeLogTracker = () => {
  // const [tickets, setTickets] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);


  // ====================================== Api calls ==================================
    const dispatch =useDispatch()
    const navigate = useNavigate()
    useEffect(()=>{
        dispatch(getUserProjectAggreation(dateRange?.startDate,dateRange?.endDate))
    },[dispatch,dateRange])


  // ====================================== Selectors ==================================
  const { userProjectAgg, loadingUserProjectAgg } = useSelector((state) => state.projects);

  const formatMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status) => {
    if (!status) return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    
    const palettes = [
      { bg: '#eff6ff', text: '#1e40af', border: '#3b82f6' }, // Blue
      { bg: '#f0fdf4', text: '#166534', border: '#22c55e' }, // Green
      { bg: '#faf5ff', text: '#6b21a8', border: '#a855f7' }, // Purple
      { bg: '#fff7ed', text: '#9a3412', border: '#f97316' }, // Orange
      { bg: '#fdf2f8', text: '#9d174d', border: '#ec4899' }, // Pink
      { bg: '#ecfccb', text: '#3f6212', border: '#84cc16' }, // Lime
      { bg: '#e0f2fe', text: '#075985', border: '#0ea5e9' }, // Sky
      { bg: '#f5f3ff', text: '#5b21b6', border: '#8b5cf6' }, // Violet
    ];

    let hash = 0;
    for (let i = 0; i < status.length; i++) {
        hash = status.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % palettes.length;
    return palettes[index];
  };



  // Carousel Scroll Logic
  const scrollContainer = (id, direction) => {
    const container = document.getElementById(id);
    if (container) {
      const scrollAmount = 300; // Adjust based on card width
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  // const getTotalTime = (timeLogs) => {
  //   return timeLogs?.reduce((total, log) => total + log.minutes, 0) || 0;
  // };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };
  
  const formatDate = (dateString) => {
     if(!dateString) return ""
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate total time across all projects
  const totalTimeAllProjects = userProjectAgg?.reduce((acc, proj) => acc + (proj.totalTimeProject || 0), 0) || 0;

  if (loadingUserProjectAgg) {
      return (
        <div className="time-log-container loading">
          <div className="loading-spinner"></div>
          <p>Loading time logs...</p>
        </div>
      );
    }

  return (
    <div className="time-log-container">
      <div className="time-log-wrapper">
        {/* Header */}
        <div className="tl-header">
          <div>
            <h1 className="tl-title">Time Log Tracker</h1>
            <p className="tl-subtitle">Track and manage your work time across tickets</p>
          </div>
          <div className="tl-total-time">
            <span className="tl-total-label">Total Time Logged</span>
            <span className="tl-total-value">{formatMinutes(totalTimeAllProjects)}</span>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="tl-filters">
          <div className="tl-filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              max={dateRange.endDate}
            />
          </div>
          <div className="tl-filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              min={dateRange.startDate}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <button onClick={() => dispatch(getUserProjectAggreation(dateRange?.startDate,dateRange?.endDate))} className="tl-btn-refresh">
            🔄 Refresh
          </button>
        </div>

        {/* Content */}
        {!userProjectAgg || userProjectAgg.length === 0 ? (
          <div className="tl-empty-state">
            <div className="tl-empty-icon">⏱️</div>
            <h3>No Time Logs Found</h3>
            <p>No time logs were recorded for the selected date range.</p>
            <p className="tl-empty-hint">Try adjusting the date range or start logging time on your tickets.</p>
          </div>
        ) : (
          <div className="tl-content">
             {/* Projects Iteration */}
             {userProjectAgg.map((project) => (
                <div key={project._id} className="tl-project-section">
                    <div className="tl-project-header">
                        <div className="tl-project-info">
                            <h2 className="tl-project-name">{project.projectName || 'Unknown Project'}</h2>
                            <span className="tl-project-stats-badge">{formatMinutes(project.totalTimeProject)}</span>
                        </div>
                    </div>

                    {/* Sprints Iteration */}
                    {project.sprints?.map((sprint) => (
                        <div key={sprint.sprintId} className="tl-sprint-section">
                            <div className="tl-sprint-header">
                                <h3>{sprint.sprintName || 'Unknown Sprint'}</h3>
                                <div className="tl-sprint-stats">
                                   <span>⏱️ {formatMinutes(sprint.totalTime)}</span>
                                   <span>🎫 {sprint.tickets?.length || 0} Tickets</span>
                                </div>
                            </div>

                            {/* Carousel Container */}
                            <div className="tl-carousel-wrapper">
                                <button 
                                  className="tl-carousel-btn left"
                                  onClick={() => scrollContainer(`carousel-${sprint.sprintId}`, 'left')}
                                >
                                  ‹
                                </button>
                                
                                <div id={`carousel-${sprint.sprintId}`} className="tl-tickets-carousel">
                                    {sprint.tickets?.map((ticket) => {
                                         const statusColor = getStatusColor(ticket.status);
                                         // Calculate total time for this ticket from its logs
                                         // Backend ensures logs are filtered, but aggregation might have summed them up.
                                         // The ticket object has filteredTimeLogs array.
                                        //  const ticketTotalTime = ticket.timeLogs?.reduce((sum, log) => sum + log.minutes, 0) || 0;
                                        
                                         return (
                                            <div 
                                              key={ticket._id} 
                                              className="tl-ticket-card-carousel"
                                              style={{ borderLeftColor: statusColor.border }}
                                            >
                                                <div className="tl-ticket-header" onClick={()=>navigate(`/tickets/${ticket._id}`)}>
                                                    <span className="tl-ticket-id">{ticket.ticketKey || ticket._id}</span>
                                                    <span
                                                        className="tl-status-badge"
                                                        style={{
                                                            backgroundColor: statusColor.bg,
                                                            color: statusColor.text,
                                                            borderColor: statusColor.border
                                                        }}
                                                        >
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                                <h4 className="tl-ticket-title" title={ticket.title}>{ticket.title}</h4>
                                                
                                                <div className="tl-ticket-footer">
                                                    <div className="tl-time-info">
                                                        <span className="tl-time-value">{formatMinutes(ticket?.totalTimeLogged)}</span>
                                                        <span className="tl-logs-count">{ticket.totalTimeAdded?.length} logs</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleViewDetails(ticket)}
                                                        className="tl-btn-view-details"
                                                        >
                                                        View →
                                                    </button>
                                                </div>
                                            </div>
                                         );
                                    })}
                                </div>

                                <button 
                                  className="tl-carousel-btn right"
                                  onClick={() => scrollContainer(`carousel-${sprint.sprintId}`, 'right')}
                                >
                                  ›
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
             ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedTicket && (
        <div className="tl-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="tl-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="tl-modal-header">
              <div>
                <h2>{selectedTicket.title}</h2>
                <span className="tl-modal-ticket-id">{selectedTicket._id}</span>
              </div>
              <button onClick={() => setShowModal(false)} className="tl-close-btn">
                ✕
              </button>
            </div>

            <div className="tl-modal-body">
              <div className="tl-modal-summary">
                <div className="tl-modal-stat">
                  <span className="tl-modal-stat-label">Status</span>
                  <span
                    className="tl-status-badge"
                    style={{
                      backgroundColor: getStatusColor(selectedTicket.status).bg,
                      color: getStatusColor(selectedTicket.status).text,
                      borderColor: getStatusColor(selectedTicket.status).border
                    }}
                  >
                    {selectedTicket.status}
                  </span>
                </div>
                <div className="tl-modal-stat">
                  <span className="tl-modal-stat-label">Story Points</span>
                  <span className="tl-modal-stat-value">{selectedTicket.storyPoints || 'N/A'}</span>
                </div>
                <div className="tl-modal-stat">
                  <span className="tl-modal-stat-label">Total Time</span>
                  <span className="tl-modal-stat-value">
                    {formatMinutes(selectedTicket.totalTimeLogged || 0)}
                  </span>
                </div>
              </div>

              <h3 className="tl-modal-section-title">Time Logs</h3>
              <div className="tl-modal-logs">
                {selectedTicket?.timeLogs?.map((log, index) => (
                  <div key={index} className="tl-modal-log-item">
                    <div className="tl-modal-log-header">
                      <span className="tl-modal-log-time">{formatMinutes(log.minutes)}</span>
                      <span className="tl-modal-log-date">{formatDate(log.at)}</span>
                    </div>
                    <div className="tl-modal-log-user">
                      Logged by: <span>{log.loggedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tl-modal-footer">
              <button onClick={() => setShowModal(false)} className="tl-btn-close">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeLogTracker;