
// import React, { useState, useEffect } from 'react';
// import './styles/TimeLogTracker.scss';

// const TimeLogTracker = () => {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [dateRange, setDateRange] = useState({
//     startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
//     endDate: new Date().toISOString().split('T')[0]
//   });
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   // Mock data - replace with actual API call
//   const mockTickets = [
//     {
//       "_id": "TICKET_101",
//       "title": "Implement Login",
//       "assignee": "USER_001",
//       "projectId": "64b8f4f5f1d2c926d8e4b8c1",
//       "sprintId": "SPRINT_12",
//       "status": "Done",
//       "storyPoints": 5,
//       "timeLogs": [
//         {
//           "loggedBy": "USER_001",
//           "minutes": 120,
//           "at": "2025-01-05T10:30:00.000Z"
//         },
//         {
//           "loggedBy": "USER_001",
//           "minutes": 90,
//           "at": "2025-01-06T11:00:00.000Z"
//         }
//       ]
//     },
//     {
//       "_id": "TICKET_102",
//       "title": "Fix Dashboard Bug",
//       "assignee": "USER_001",
//       "projectId": "64b8f4f5f1d2c926d8e4b8c1",
//       "sprintId": "SPRINT_12",
//       "status": "In Progress",
//       "storyPoints": 3,
//       "timeLogs": [
//         {
//           "loggedBy": "USER_001",
//           "minutes": 180,
//           "at": "2025-01-07T09:00:00.000Z"
//         }
//       ]
//     }
//   ];

//   useEffect(() => {
//     fetchTimeLogs();
//   }, [dateRange]);

//   const fetchTimeLogs = async () => {
//     setLoading(true);
//     try {
//       // Replace with actual API call
//       // const response = await fetch(`/api/tickets/time-logs?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
//       // const data = await response.json();
      
//       // Simulate API delay
//       setTimeout(() => {
//         setTickets(mockTickets);
//         setLoading(false);
//       }, 500);
//     } catch (error) {
//       console.error('Error fetching time logs:', error);
//       setLoading(false);
//     }
//   };

//   const formatMinutes = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     if (hours === 0) return `${mins}m`;
//     if (mins === 0) return `${hours}h`;
//     return `${hours}h ${mins}m`;
//   };

//   const getTotalTime = (timeLogs) => {
//     return timeLogs.reduce((total, log) => total + log.minutes, 0);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'Done': { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
//       'In Progress': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
//       'To Do': { bg: '#e5e7eb', text: '#374151', border: '#6b7280' },
//       'Blocked': { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' }
//     };
//     return colors[status] || colors['To Do'];
//   };

//   const handleDateChange = (field, value) => {
//     setDateRange(prev => ({ ...prev, [field]: value }));
//   };

//   const handleViewDetails = (ticket) => {
//     setSelectedTicket(ticket);
//     setShowModal(true);
//   };

//   const totalTimeAllTickets = tickets.reduce((total, ticket) => 
//     total + getTotalTime(ticket.timeLogs), 0
//   );

//   if (loading) {
//     return (
//       <div className="time-log-container loading">
//         <div className="loading-spinner"></div>
//         <p>Loading time logs...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="time-log-container">
//       <div className="time-log-wrapper">
//         {/* Header */}
//         <div className="tl-header">
//           <div>
//             <h1 className="tl-title">Time Log Tracker</h1>
//             <p className="tl-subtitle">Track and manage your work time across tickets</p>
//           </div>
//           <div className="tl-total-time">
//             <span className="tl-total-label">Total Time Logged</span>
//             <span className="tl-total-value">{formatMinutes(totalTimeAllTickets)}</span>
//           </div>
//         </div>

//         {/* Date Range Filter */}
//         <div className="tl-filters">
//           <div className="tl-filter-group">
//             <label>Start Date</label>
//             <input
//               type="date"
//               value={dateRange.startDate}
//               onChange={(e) => handleDateChange('startDate', e.target.value)}
//               max={dateRange.endDate}
//             />
//           </div>
//           <div className="tl-filter-group">
//             <label>End Date</label>
//             <input
//               type="date"
//               value={dateRange.endDate}
//               onChange={(e) => handleDateChange('endDate', e.target.value)}
//               min={dateRange.startDate}
//               max={new Date().toISOString().split('T')[0]}
//             />
//           </div>
//           <button onClick={fetchTimeLogs} className="tl-btn-refresh">
//             🔄 Refresh
//           </button>
//         </div>

//         {/* Content */}
//         {tickets.length === 0 ? (
//           <div className="tl-empty-state">
//             <div className="tl-empty-icon">⏱️</div>
//             <h3>No Time Logs Found</h3>
//             <p>No time logs were recorded for the selected date range.</p>
//             <p className="tl-empty-hint">Try adjusting the date range or start logging time on your tickets.</p>
//           </div>
//         ) : (
//           <div className="tl-content">
//             <div className="tl-summary-cards">
//               <div className="tl-summary-card">
//                 <div className="tl-summary-icon">🎫</div>
//                 <div className="tl-summary-info">
//                   <span className="tl-summary-label">Total Tickets</span>
//                   <span className="tl-summary-value">{tickets.length}</span>
//                 </div>
//               </div>
//               <div className="tl-summary-card">
//                 <div className="tl-summary-icon">📊</div>
//                 <div className="tl-summary-info">
//                   <span className="tl-summary-label">Total Story Points</span>
//                   <span className="tl-summary-value">
//                     {tickets.reduce((sum, t) => sum + (t.storyPoints || 0), 0)}
//                   </span>
//                 </div>
//               </div>
//               <div className="tl-summary-card">
//                 <div className="tl-summary-icon">⏰</div>
//                 <div className="tl-summary-info">
//                   <span className="tl-summary-label">Avg Time/Ticket</span>
//                   <span className="tl-summary-value">
//                     {formatMinutes(Math.round(totalTimeAllTickets / tickets.length))}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="tl-tickets-list">
//               {tickets.map((ticket) => {
//                 const statusColor = getStatusColor(ticket.status);
//                 const totalTime = getTotalTime(ticket.timeLogs);

//                 return (
//                   <div key={ticket._id} className="tl-ticket-card">
//                     <div className="tl-ticket-header">
//                       <div className="tl-ticket-info">
//                         <h3 className="tl-ticket-title">{ticket.title}</h3>
//                         <span className="tl-ticket-id">{ticket._id}</span>
//                       </div>
//                       <div className="tl-ticket-meta">
//                         <span
//                           className="tl-status-badge"
//                           style={{
//                             backgroundColor: statusColor.bg,
//                             color: statusColor.text,
//                             borderColor: statusColor.border
//                           }}
//                         >
//                           {ticket.status}
//                         </span>
//                         {ticket.storyPoints && (
//                           <span className="tl-story-points">
//                             {ticket.storyPoints} SP
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="tl-ticket-body">
//                       <div className="tl-time-summary">
//                         <div className="tl-time-info">
//                           <span className="tl-time-icon">⏱️</span>
//                           <div>
//                             <div className="tl-time-value">{formatMinutes(totalTime)}</div>
//                             <div className="tl-time-label">
//                               {ticket.timeLogs.length} log{ticket.timeLogs.length !== 1 ? 's' : ''}
//                             </div>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => handleViewDetails(ticket)}
//                           className="tl-btn-view-details"
//                         >
//                           View Details →
//                         </button>
//                       </div>

//                       <div className="tl-time-logs-preview">
//                         {ticket.timeLogs.slice(0, 2).map((log, index) => (
//                           <div key={index} className="tl-log-item-preview">
//                             <span className="tl-log-time">{formatMinutes(log.minutes)}</span>
//                             <span className="tl-log-date">{formatDate(log.at)}</span>
//                           </div>
//                         ))}
//                         {ticket.timeLogs.length > 2 && (
//                           <div className="tl-log-more">
//                             +{ticket.timeLogs.length - 2} more log{ticket.timeLogs.length - 2 !== 1 ? 's' : ''}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Details Modal */}
//       {showModal && selectedTicket && (
//         <div className="tl-modal-overlay" onClick={() => setShowModal(false)}>
//           <div className="tl-modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="tl-modal-header">
//               <div>
//                 <h2>{selectedTicket.title}</h2>
//                 <span className="tl-modal-ticket-id">{selectedTicket._id}</span>
//               </div>
//               <button onClick={() => setShowModal(false)} className="tl-close-btn">
//                 ✕
//               </button>
//             </div>

//             <div className="tl-modal-body">
//               <div className="tl-modal-summary">
//                 <div className="tl-modal-stat">
//                   <span className="tl-modal-stat-label">Status</span>
//                   <span
//                     className="tl-status-badge"
//                     style={{
//                       backgroundColor: getStatusColor(selectedTicket.status).bg,
//                       color: getStatusColor(selectedTicket.status).text,
//                       borderColor: getStatusColor(selectedTicket.status).border
//                     }}
//                   >
//                     {selectedTicket.status}
//                   </span>
//                 </div>
//                 <div className="tl-modal-stat">
//                   <span className="tl-modal-stat-label">Story Points</span>
//                   <span className="tl-modal-stat-value">{selectedTicket.storyPoints || 'N/A'}</span>
//                 </div>
//                 <div className="tl-modal-stat">
//                   <span className="tl-modal-stat-label">Total Time</span>
//                   <span className="tl-modal-stat-value">
//                     {formatMinutes(getTotalTime(selectedTicket.timeLogs))}
//                   </span>
//                 </div>
//               </div>

//               <h3 className="tl-modal-section-title">Time Logs</h3>
//               <div className="tl-modal-logs">
//                 {selectedTicket.timeLogs.map((log, index) => (
//                   <div key={index} className="tl-modal-log-item">
//                     <div className="tl-modal-log-header">
//                       <span className="tl-modal-log-time">{formatMinutes(log.minutes)}</span>
//                       <span className="tl-modal-log-date">{formatDate(log.at)}</span>
//                     </div>
//                     <div className="tl-modal-log-user">
//                       Logged by: <span>{log.loggedBy}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="tl-modal-footer">
//               <button onClick={() => setShowModal(false)} className="tl-btn-close">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TimeLogTracker;

import React, { useState, useEffect } from 'react';
import './styles/TimeLogTracker.scss';
import { useDispatch } from 'react-redux';
import { getUserProjectAggreation } from '../../../Redux/Actions/PlatformActions.js/projectsActions';

const TimeLogTracker = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);


  // ====================================== Api calls ==================================
    const dispatch =useDispatch()
    useEffect(()=>{
        dispatch(getUserProjectAggreation(dateRange?.startDate,dateRange?.endDate))
    },[dispatch,dateRange])


  // Mock data - replace with actual API call
  const mockTickets = [
    {
      "_id": "TICKET_101",
      "title": "Implement Login",
      "assignee": "USER_001",
      "projectId": "64b8f4f5f1d2c926d8e4b8c1",
      "projectName": "E-Commerce Platform",
      "sprintId": "SPRINT_12",
      "status": "Done",
      "storyPoints": 5,
      "timeLogs": [
        {
          "loggedBy": "USER_001",
          "minutes": 120,
          "at": "2025-01-05T10:30:00.000Z"
        },
        {
          "loggedBy": "USER_001",
          "minutes": 90,
          "at": "2025-01-06T11:00:00.000Z"
        }
      ]
    },
    {
      "_id": "TICKET_102",
      "title": "Fix Dashboard Bug",
      "assignee": "USER_001",
      "projectId": "64b8f4f5f1d2c926d8e4b8c1",
      "projectName": "E-Commerce Platform",
      "sprintId": "SPRINT_12",
      "status": "In Progress",
      "storyPoints": 3,
      "timeLogs": [
        {
          "loggedBy": "USER_001",
          "minutes": 180,
          "at": "2025-01-07T09:00:00.000Z"
        }
      ]
    },
    {
      "_id": "TICKET_201",
      "title": "Setup CI/CD Pipeline",
      "assignee": "USER_001",
      "projectId": "64b8f4f5f1d2c926d8e4b8c2",
      "projectName": "Mobile App Redesign",
      "sprintId": "SPRINT_08",
      "status": "Done",
      "storyPoints": 8,
      "timeLogs": [
        {
          "loggedBy": "USER_001",
          "minutes": 240,
          "at": "2025-01-05T14:00:00.000Z"
        }
      ]
    },
    {
      "_id": "TICKET_202",
      "title": "Update Design System",
      "assignee": "USER_001",
      "projectId": "64b8f4f5f1d2c926d8e4b8c2",
      "projectName": "Mobile App Redesign",
      "sprintId": "SPRINT_08",
      "status": "In Progress",
      "storyPoints": 5,
      "timeLogs": [
        {
          "loggedBy": "USER_001",
          "minutes": 150,
          "at": "2025-01-06T10:00:00.000Z"
        }
      ]
    }
  ];

  useEffect(() => {
    fetchTimeLogs();
  }, [dateRange]);

  const fetchTimeLogs = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch(`/api/tickets/time-logs?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      // const data = await response.json();
      
      // Simulate API delay
      setTimeout(() => {
        setTickets(mockTickets);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching time logs:', error);
      setLoading(false);
    }
  };

  const formatMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getTotalTime = (timeLogs) => {
    return timeLogs.reduce((total, log) => total + log.minutes, 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Done': { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
      'In Progress': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
      'To Do': { bg: '#e5e7eb', text: '#374151', border: '#6b7280' },
      'Blocked': { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' }
    };
    return colors[status] || colors['To Do'];
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const totalTimeAllTickets = tickets.reduce((total, ticket) => 
    total + getTotalTime(ticket.timeLogs), 0
  );

  // Group tickets by project
  const groupedByProject = tickets.reduce((acc, ticket) => {
    const projectId = ticket.projectId;
    if (!acc[projectId]) {
      acc[projectId] = {
        projectId: projectId,
        projectName: ticket.projectName || 'Unknown Project',
        tickets: []
      };
    }
    acc[projectId].tickets.push(ticket);
    return acc;
  }, {});

  const projects = Object.values(groupedByProject);

  if (loading) {
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
            <span className="tl-total-value">{formatMinutes(totalTimeAllTickets)}</span>
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
          <button onClick={fetchTimeLogs} className="tl-btn-refresh">
            🔄 Refresh
          </button>
        </div>

        {/* Content */}
        {tickets.length === 0 ? (
          <div className="tl-empty-state">
            <div className="tl-empty-icon">⏱️</div>
            <h3>No Time Logs Found</h3>
            <p>No time logs were recorded for the selected date range.</p>
            <p className="tl-empty-hint">Try adjusting the date range or start logging time on your tickets.</p>
          </div>
        ) : (
          <div className="tl-content">
            <div className="tl-summary-cards">
              <div className="tl-summary-card">
                <div className="tl-summary-icon">📁</div>
                <div className="tl-summary-info">
                  <span className="tl-summary-label">Total Projects</span>
                  <span className="tl-summary-value">{projects.length}</span>
                </div>
              </div>
              <div className="tl-summary-card">
                <div className="tl-summary-icon">🎫</div>
                <div className="tl-summary-info">
                  <span className="tl-summary-label">Total Tickets</span>
                  <span className="tl-summary-value">{tickets.length}</span>
                </div>
              </div>
              <div className="tl-summary-card">
                <div className="tl-summary-icon">📊</div>
                <div className="tl-summary-info">
                  <span className="tl-summary-label">Total Story Points</span>
                  <span className="tl-summary-value">
                    {tickets.reduce((sum, t) => sum + (t.storyPoints || 0), 0)}
                  </span>
                </div>
              </div>
              <div className="tl-summary-card">
                <div className="tl-summary-icon">⏰</div>
                <div className="tl-summary-info">
                  <span className="tl-summary-label">Avg Time/Ticket</span>
                  <span className="tl-summary-value">
                    {formatMinutes(Math.round(totalTimeAllTickets / tickets.length))}
                  </span>
                </div>
              </div>
            </div>

            {/* Projects with Tickets */}
            <div className="tl-projects-container">
              {projects.map((project) => {
                const projectTotalTime = project.tickets.reduce(
                  (total, ticket) => total + getTotalTime(ticket.timeLogs),
                  0
                );
                const projectStoryPoints = project.tickets.reduce(
                  (sum, ticket) => sum + (ticket.storyPoints || 0),
                  0
                );

                return (
                  <div key={project.projectId} className="tl-project-section">
                    <div className="tl-project-header">
                      <div className="tl-project-info">
                        <h2 className="tl-project-name">{project.projectName}</h2>
                        <span className="tl-project-id">{project.projectId}</span>
                      </div>
                      <div className="tl-project-stats">
                        <div className="tl-project-stat">
                          <span className="tl-project-stat-value">{project.tickets.length}</span>
                          <span className="tl-project-stat-label">Tickets</span>
                        </div>
                        <div className="tl-project-stat">
                          <span className="tl-project-stat-value">{projectStoryPoints}</span>
                          <span className="tl-project-stat-label">Story Points</span>
                        </div>
                        <div className="tl-project-stat">
                          <span className="tl-project-stat-value">{formatMinutes(projectTotalTime)}</span>
                          <span className="tl-project-stat-label">Total Time</span>
                        </div>
                      </div>
                    </div>

                    <div className="tl-tickets-list">
                      {project.tickets.map((ticket) => {
                        const statusColor = getStatusColor(ticket.status);
                        const totalTime = getTotalTime(ticket.timeLogs);

                        return (
                          <div key={ticket._id} className="tl-ticket-card">
                            <div className="tl-ticket-header">
                              <div className="tl-ticket-info">
                                <h3 className="tl-ticket-title">{ticket.title}</h3>
                                <span className="tl-ticket-id">{ticket._id}</span>
                              </div>
                              <div className="tl-ticket-meta">
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
                                {ticket.storyPoints && (
                                  <span className="tl-story-points">
                                    {ticket.storyPoints} SP
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="tl-ticket-body">
                              <div className="tl-time-summary">
                                <div className="tl-time-info">
                                  <span className="tl-time-icon">⏱️</span>
                                  <div>
                                    <div className="tl-time-value">{formatMinutes(totalTime)}</div>
                                    <div className="tl-time-label">
                                      {ticket.timeLogs.length} log{ticket.timeLogs.length !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleViewDetails(ticket)}
                                  className="tl-btn-view-details"
                                >
                                  View Details →
                                </button>
                              </div>

                              <div className="tl-time-logs-preview">
                                {ticket.timeLogs.slice(0, 2).map((log, index) => (
                                  <div key={index} className="tl-log-item-preview">
                                    <span className="tl-log-time">{formatMinutes(log.minutes)}</span>
                                    <span className="tl-log-date">{formatDate(log.at)}</span>
                                  </div>
                                ))}
                                {ticket.timeLogs.length > 2 && (
                                  <div className="tl-log-more">
                                    +{ticket.timeLogs.length - 2} more log{ticket.timeLogs.length - 2 !== 1 ? 's' : ''}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
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
                    {formatMinutes(getTotalTime(selectedTicket.timeLogs))}
                  </span>
                </div>
              </div>

              <h3 className="tl-modal-section-title">Time Logs</h3>
              <div className="tl-modal-logs">
                {selectedTicket.timeLogs.map((log, index) => (
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