import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';
import { projectInsightApi } from '../../Api/Plat/projectApi';
import {
  Plus,
  Download,
  MoreHorizontal,
  Calendar,
  ArrowUpRight,
  Filter,
  LayoutGrid,
  List,
  Clock,
  Paperclip,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Ticket,
  ArrowLeft,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import './styles/ProjectInsight.scss';
import { OPEN_CREATE_TICKET_POPUP } from '../../Redux/Constants/ticketReducerConstants';
import { useDispatch } from 'react-redux';

export default function ProjectInsight() {
  const { projectId } = useParams();
  const [viewMode, setViewMode] = useState('kanban'); // kanban, table, timeline
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [loading, setLoading] = useState(false);
  const [insightData, setInsightData] = useState({
    projectBoard: [],
    taskStatusOverview: {},
    users: [],
    project: null
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInsights = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const response = await apiClient.post(projectInsightApi, { projectId });
        if (response.data.success) {
          setInsightData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching project insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [projectId]);

  const toggleGroup = (groupName) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };


  const stats = [
    { 
      label: 'Total Tasks', 
      value: Object.values(insightData.taskStatusOverview).reduce((a, b) => a + b, 0), 
      change: '', trend: 'up', from: 'across all statuses' 
    },
 
    { 
      label: 'Unique Statuses', 
      value: Object.keys(insightData.taskStatusOverview).length, 
      change: '', trend: 'up', from: 'in the board' 
    },
       { 
      label: 'Team Members', 
      value: insightData.users.length, 
      change: '', trend: 'up', from: 'active members' 
    },
  ];

  const getColorByStatus = (status) => {
    const s = status.toUpperCase();
    if (s.includes('DONE') || s.includes('CLOSED') || s.includes('COMPLETED')) return '#10b981';
    if (s.includes('PROGRESS')) return '#f59e0b';
    if (s.includes('REVIEW')) return '#6366f1';
    return '#6b7280';
  };

  const totalTasks = Object.values(insightData.taskStatusOverview).reduce((a, b) => a + b, 0);
  const statusBreakdown = Object.entries(insightData.taskStatusOverview).map(([status, count]) => ({
    status,
    color: getColorByStatus(status),
    percentage: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0,
    tasks: count
  }));

  const getPriorityFlag = (priority, color) => {
    return (
      <div 
        className="priority-indicator" 
        style={{ backgroundColor: color || '#6b7280' }}
        title={priority}
      />
    );
  };

  const kanbanColumns = insightData.projectBoard.map((col, index) => ({
    id: `col-${index}`,
    title: col.Name,
    count: col.tickets.length,
    color: getColorByStatus(col.Name),
    tasks: col.tickets.map(ticket => ({
      id: ticket.ticketKey,
      title: ticket.title,
      project: ticket.ticketKey.split('-')[0], // Extract prefix as project name fallback
      dueDate: ticket.eta ? new Date(ticket.eta).toLocaleDateString() : 'No date',
      progress: (ticket.status.toUpperCase().includes('DONE') || ticket.status.toUpperCase().includes('CLOSED')) ? 100 : 
                 (ticket.status.toUpperCase().includes('PROGRESS') ? 50 : 0),
      attachments: 0,
      comments: 0,
      priority: ticket.priority,
      priorityColor: ticket.priorityColor,
      labels: ticket.labels,
      assignee: { 
        name: ticket.assignee ? ticket.assignee.split(' ').map(n => n[0]).join('') : 'UN', 
        image: ticket.assigneeImage || null 
      },
      fullAssignee: ticket.assignee
    }))
  }));

  // Get current week dates (next 7 days starting from today)
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      full: d.toISOString().split('T')[0],
      display: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    };
  });

  const calendarEvents = insightData.projectBoard.flatMap(col => 
    col.tickets.filter(t => t.eta).map(ticket => {
      const ticketDate = new Date(ticket.eta).toISOString().split('T')[0];
      const weekDay = currentWeek.find(d => d.full === ticketDate);
      
      if (!weekDay) return null;

      return {
        date: weekDay.display,
        dateIndex: currentWeek.indexOf(weekDay),
        title: ticket.title,
        color: getColorByStatus(ticket.status)
      };
    }).filter(Boolean)
  );

  if (loading) {
    return (
      <div className="task-dashboard loading">
        <div className="loader">Loading insights...</div>
      </div>
    );
  }

  return (
    <div className="task-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header__left">
          <p className=""style={{textAlign:"center",cursor:"pointer",display:"flex",alignItems:"center",gap:"8px", marginBottom:"8px"}} onClick={()=>navigate(`/projects`)}>
            <ArrowLeft size={18} />
            Back to Workspace
          </p>

          <div className="project-badge">Project: {insightData.project?.projectName || 'General'}</div>
          <h1 className="dashboard-title">Tasks Overview</h1>
          <p className="dashboard-sync">
            <Clock size={14} />
            Last sync: <strong>Just now</strong>
          </p>
        </div>


        <div className="dashboard-header__right">
          <button className="btn btn--secondary" onClick={()=>navigate(`/projects/${projectId}/tasks`)}>
            <Ticket size={18} />
            All Tasks
          </button>
          <button className="btn btn--primary"  onClick={() => dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: true })}>
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-section">
        {/* Status Overview Card */}
        <div className="stats-card stats-card--large">
          <div className="stats-card__header">
            <h3>Task Status Overview</h3>
            <button className="btn-icon">
              <MoreHorizontal size={18} />
            </button>
          </div>
          
          {/* Status Bars */}
          <div className="status-bars">
            {statusBreakdown.map((item, index) => (
              <div key={index} className="status-bar-group">
                <div className="status-label">
                  <span className="percentage">{item.percentage > 0 ? '+' : ''}{item.percentage}%</span>
                </div>
                <div className="status-bars-container">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="status-bar" style={{ backgroundColor: item.color }}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="status-legend">
            {statusBreakdown.map((item, index) => (
              <div key={index} className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
                <span>{item.status}</span>
              </div>
            ))}
          </div>

          {/* Breakdown Stats */}
          <div className="breakdown-stats">
            <div className="breakdown-row">
              {statusBreakdown.slice(0, 2).map((item, index) => (
                <div key={index} className="breakdown-item">
                  <div className="breakdown-badge" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                    {item.status}
                  </div>
                  <div className="breakdown-value">
                    <span className="percentage">{item.percentage}%</span>
                    <span className="count">{item.tasks} tasks</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="breakdown-row">
              {statusBreakdown.slice(2, 4).map((item, index) => (
                <div key={index} className="breakdown-item">
                  <div className="breakdown-badge" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                    {item.status}
                  </div>
                  <div className="breakdown-value">
                    <span className="percentage">{item.percentage}%</span>
                    <span className="count">{item.tasks} tasks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Column for Small Stats and Members */}
        <div className="stats-column">
          {stats.map((stat, index) => (
            <div key={index} className={`stats-card ${stat.label === 'Team Members' ? 'stats-card--members' : ''}`}>
              <div className="stats-card__main">
                <div className="stats-card__header">
                  <h3>{stat.label}</h3>
                  <button className="btn-link">
                    <ArrowUpRight size={16} />
                  </button>
                </div>
                <div className="stats-card__value">
                  <span className="value">{stat.value}</span>
                  <div className={`trend trend--${stat.trend}`}>
                    {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {stat.change}
                  </div>
                </div>
                <p className="stats-card__subtitle">{stat.from}</p>
              </div>

              {stat.label === 'Team Members' && (
                <div className="stats-card__members-list">
                  <div className="members-mini-list">
                    {insightData.users && insightData.users.length > 0 ? (
                      insightData.users.map((user, idx) => (
                        <div key={user.userId || idx} className="member-mini-item">
                          <div className="member-avatar member-avatar--sm">
                            {user.image ? (
                              <img src={user.image} alt={user.name} />
                            ) : (
                              <span>{user.name ? user.name.split(' ').map(n => n[0]).join('') : 'UN'}</span>
                            )}
                          </div>
                          <div className="member-info">
                            <div className="member-name">{user.name || 'Unknown'}</div>
                            <div className="member-email">{user.email}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-members-small">No members</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Task Calendar */}
      <div className="calendar-section">
        <div className="calendar-header">
          <h3>Task Calendar</h3>
          <button className="btn-icon">
            <MoreHorizontal size={18} />
          </button>
        </div>
        <div className="calendar-timeline">
          <div className="timeline-dates">
            {currentWeek.map((day, i) => (
              <div key={i} className="timeline-date">{day.display}</div>
            ))}
          </div>
          <div className="timeline-events">
            {calendarEvents.map((event, index) => (
              <div 
                key={index} 
                className="timeline-event"
                style={{ 
                  gridColumnStart: event.dateIndex + 1,
                  backgroundColor: event.color
                }}
              >
                <span className="event-date">{event.date}</span>
                <span className="event-title">{event.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board Header */}
      <div className="board-header">
        <h2>All Tasks</h2>
        <div className="board-actions">
          <div className="filter-badge">
            <Filter size={14} />
            Urgent
            <button className="filter-close">×</button>
          </div>
          <button className="btn btn--secondary btn--sm">
            <Filter size={16} />
            Sort
          </button>
          <div className="view-toggle">
            <button 
              className={viewMode === 'table' ? 'active' : ''} 
              onClick={() => setViewMode('table')}
            >
              <List size={16} />
              Table
            </button>
            <button 
              className={viewMode === 'kanban' ? 'active' : ''} 
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid size={16} />
              Kanban
            </button>
            <button 
              className={viewMode === 'timeline' ? 'active' : ''} 
              onClick={() => setViewMode('timeline')}
            >
              <Calendar size={16} />
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {/* Task Content */}
      {viewMode === 'kanban' ? (
        <div className="kanban-board">
          {kanbanColumns.map((column) => (
            <div key={column.id} className="kanban-column">
              <div className="column-header">
                <div className="column-title">
                  <div className="column-indicator" style={{ backgroundColor: column.color }}></div>
                  <span className="column-count">{column.count}</span>
                  <span className="column-name">{column.title}</span>
                </div>
                <button className="btn-icon">
                  <Plus size={18} />
                </button>
              </div>

              <div className="column-tasks">
                {column.tasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-card__header">
                      <Clock size={14} />
                      <span className="task-due">Due: {task.dueDate}</span>
                      <button className="btn-icon">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    <h4 className="task-title">
                      <span className="task-flag">{getPriorityFlag(task.priority, task.priorityColor)}</span>
                      {task.id}
                    </h4>
                    <div className="task-info">
                      <p className="task-project">
                      {task.title}
                        
                        </p>
                      {task.labels && task.labels.length > 0 && (
                        <div className="task-labels">
                          {task.labels.map((label, i) => (
                            <span 
                              key={i} 
                              className="label-badge" 
                              style={{ backgroundColor: `${label.color}20`, color: label.color, borderColor: label.color }}
                            >
                              {label.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {task.progress > 0 && (
                      <div className="task-progress">
                        <div className="progress-label">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="task-card__footer">
                      <div className="task-assignee">
                        <div className="avatar">
                          {task.assignee.image ? (
                            <img src={task.assignee.image} alt={task.fullAssignee || 'Unassigned'} />
                          ) : (
                            task.assignee.name || 'UN'
                          )}
                        </div>
                        <span className="assignee-name">{task.fullAssignee || 'Unassigned'}</span>
                      </div>
                      <div className="task-meta">
                        {task.attachments > 0 && (
                          <span className="meta-item">
                            <Paperclip size={14} />
                            {task.attachments}
                          </span>
                        )}
                        {task.comments > 0 && (
                          <span className="meta-item">
                            <MessageSquare size={14} />
                            {task.comments}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'table' ? (
        <div className="table-view">
          <div className="task-list">
            <div className="task-header">
              <div className="header-cell th-toggle"></div>
              <div className="header-cell th-id">Task ID</div>
              <div className="header-cell th-title">Title</div>
              <div className="header-cell th-status">Status</div>
              <div className="header-cell th-assignee">Assignee</div>
              <div className="header-cell th-priority">Priority</div>
              <div className="header-cell th-date">Due Date</div>
            </div>

            {kanbanColumns.map((column) => (
              <div key={column.id} className={`task-group ${collapsedGroups[column.title] ? 'collapsed' : ''}`}>
                <div 
                  className="group-header" 
                  onClick={() => toggleGroup(column.title)}
                  style={{ borderLeft: `4px solid ${column.color}` }}
                >
                  <div className="task-cell th-toggle">
                    {collapsedGroups[column.title] ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                  </div>
                  <div className="group-info-cell">
                    <span className="group-name">{column.title}</span>
                    <span className="group-count">{column.count} tasks</span>
                  </div>
                </div>

                {!collapsedGroups[column.title] && column.tasks.map((task) => (
                  <div key={task.id} className="task-row">
                    <div className="task-cell th-toggle"></div>
                    <div className="task-cell task-key-cell">
                      <span className="key-badge">{task.id}</span>
                    </div>
                    <div className="task-cell task-title-cell">
                      <div className="title-wrapper">
                        {getPriorityFlag(task.priority, task.priorityColor)}
                        <span className="task-title-text">{task.title}</span>
                      </div>
                    </div>
                    <div className="task-cell task-status-cell">
                      <div className="status-cell-wrapper">
                        <div className="dot" style={{ backgroundColor: column.color }}></div>
                        {column.title}
                      </div>
                    </div>
                    <div className="task-cell task-assignee-cell">
                      <div className="assignee-cell-wrapper">
                        <div className="mini-avatar">
                          {task.assignee.image ? <img src={task.assignee.image} alt="" /> : task.assignee.name}
                        </div>
                        <span className="assignee-name">{task.fullAssignee || 'Unassigned'}</span>
                      </div>
                    </div>
                    <div className="task-cell task-priority-cell">
                      <span 
                        className="priority-tag" 
                        style={{ color: task.priorityColor, backgroundColor: `${task.priorityColor}15` }}
                      >
                        {task.priority || 'Medium'}
                      </span>
                    </div>
                    <div className="task-cell task-date-cell">{task.dueDate}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="timeline-empty">Timeline view coming soon...</div>
      )}
    </div>
  );
}
