/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  RefreshCw,
  Clock,
  Target,
  ChevronDown,
  TrendingUp
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import './styles/TimeLogTracker.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, getUserProjectAggreation } from '../../../Redux/Actions/PlatformActions.js/projectsActions';
import { CustomDropDownV3 } from '../../../customFiles/customComponent/DropDown';
// import { CustomDropDownV3 } from '../../../../customFiles/customComponent/DropDown';

const PROJECT_COLORS = [
  '#6366f1', // indigo
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#3b82f6', // blue
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
];

const TimeLogTracker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Initialize dates
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  });
  const [endDate, setEndDate] = useState(() => new Date());
  
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  const { userProjectAgg, loadingUserProjectAgg, projects } = useSelector((state) => state.projects);
  const { userDetails } = useSelector((state) => state.user);

  // Fetch projects if not available
  useEffect(() => {
        dispatch(getAllProjects(userDetails?._id));
  }, [dispatch, userDetails]);

  // Set default selected project
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
        // Select the first project by default
        const firstProject = projects[0];
        const firstId = firstProject.projectId || firstProject._id || firstProject.id;
        if(firstId) setSelectedProjectId(firstId);
    }
  }, [projects, selectedProjectId]);

  // Fetch data on date change or project change
  useEffect(() => {
    if (startDate && endDate && selectedProjectId) {
        // Pass projectId to the action
        dispatch(getUserProjectAggreation(startDate, endDate, selectedProjectId));
    }
  }, [dispatch, startDate, endDate, selectedProjectId]);

  const handleRefresh = () => {
    if (selectedProjectId) {
        dispatch(getUserProjectAggreation(startDate, endDate, selectedProjectId));
    }
  };

  const projectOptions = useMemo(() => {
    return (projects || []).map(p => ({
        label: p.projectName,
        value: p.projectId || p._id || p.id // Ensure we get the ID
    }));
  }, [projects]);

  // Helper: Format minutes
  const formatTime = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  // Derived state
  const data = userProjectAgg;
  
  // Calculate Stats
  const stats = useMemo(() => {
    if (!data) return { total: 0, active: 0, done: 0, points: 0 };
    
    const total = data.totalTickets || 0;
    const tickets = data.tickets || [];
    const active = tickets.filter(t => t.status === 'In Progress' || t.status === 'OPEN').length;
    const done = tickets.filter(t => t.status === 'Done').length;
    const points = Math.floor((data.totalTimeLog || 0) / 60); // Hours

    return { total, active, done, points };
  }, [data]);

  // Chart Data
  const pieData = useMemo(() => {
    if (!data?.projectTimelog) return [];
    return Object.entries(data.projectTimelog)
      .filter(([_, time]) => time > 0)
      .map(([name, time], index) => ({
        name,
        value: time,
        color: PROJECT_COLORS[index % PROJECT_COLORS.length]
      }));
  }, [data]);

  const barData = useMemo(() => {
    if (!data?.projectTimelog) return [];
    return Object.entries(data.projectTimelog)
      .filter(([_, time]) => time > 0)
      .map(([name, time]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        hours: Math.floor(time / 60),
        minutes: time % 60
      }));
  }, [data]);

  // Priority Class
  const getPriorityClass = (priority) => {
    if (!priority) return 'priority--medium';
    const p = priority.toLowerCase();
    if (p.includes('low')) return 'priority--low';
    if (p.includes('medium')) return 'priority--medium';
    if (p.includes('high')) return 'priority--high';
    if (p.includes('critical')) return 'priority--critical';
    return 'priority--medium';
  };

  // Status Class
  const getStatusClass = (status) => {
     if (!status) return 'status--open';
     const s = status.toLowerCase();
     if (s === 'open') return 'status--open';
     if (s === 'in progress') return 'status--progress';
     if (s === 'done' || s === 'completed') return 'status--done';
     if (s === 'rejected') return 'status--rejected';
     if (s.includes('review')) return 'status--review';
     if (s.includes('test')) return 'status--testing';
     return 'status--open';
  };

  // Filter Tickets
  const filteredTickets = useMemo(() => {
    if (!data?.tickets) return [];
    return data.tickets;
  }, [data]);


  if (loadingUserProjectAgg && !data) {
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  // // If we have no data yet (and not loading, e.g. initial null but projects might be loading)
  // if (!data && !loadingUserProjectAgg) {
  //     if (!selectedProjectId) {
  //         return (
  //            <div className="analytics-dashboard">
  //               <div className="analytics-loading">Select a project to view analytics.</div>
  //            </div>
  //         );
  //     }
  //     // If selectedProjectId but no data, likely first load or error, or empty.
  //     // We'll show the dashboard framework anyway so they can switch/refresh.
  // }

  return (
    <div className="analytics-dashboard">
      {/* Page Header */}
      <div className="analytics-page-header">
        <div>
          <h1 className="analytics-page-header__title">Time Tracking Analytics</h1>
          <p className="analytics-page-header__subtitle">
            Monitor your logged hours across projects and tickets. Filter by date range to analyze your productivity, track efficiency, and generate detailed reports.
          </p>
        </div>
      </div>

      {/* Header Controls */}
      <div className="analytics-header">
        <div className="analytics-header__filters">
          <div className="date-filter">
            <Calendar size={18} className="date-filter__icon" />
            <input
              type="date"
              value={startDate.toISOString().split('T')[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-filter__input"
              placeholder="Start Date"
            />
          </div>

          <div className="date-filter">
            <Calendar size={18} className="date-filter__icon" />
            <input
              type="date"
              value={endDate.toISOString().split('T')[0]}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-filter__input"
              placeholder="End Date"
            />
          </div>

          <button 
            className="refresh-btn" 
            onClick={handleRefresh}
            disabled={loadingUserProjectAgg || !selectedProjectId}
          >
            <RefreshCw size={18} className={loadingUserProjectAgg ? 'spinning' : ''} />
            Refresh
          </button>
                <div className="project-select-container" style={{ width: '250px'}}>
            {/* Using CustomDropDownV3 */}
            <CustomDropDownV3
                value={selectedProjectId}
                onChange={(value) => setSelectedProjectId(value)}
                options={projectOptions}
                placeholder="Select Project"
                searchable={true}
            />
          </div>
        </div>

    
      </div>

      {data ? (
      <>
      {/* Stats Cards */}
      <div className="stats-grid">
        {/* <div className="stat-card stat-card--gray">
          <div className="stat-card__value">{stats.total}</div>
          <div className="stat-card__label">TOTAL</div>
        </div>

        <div className="stat-card stat-card--yellow">
          <div className="stat-card__value">{stats.active}</div>
          <div className="stat-card__label">ACTIVE</div>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-card__value">{stats.done}</div>
          <div className="stat-card__label">DONE</div>
        </div> */}

        <div className="stat-card stat-card--blue">
          <div className="stat-card__value">{stats.points}</div>
          <div className="stat-card__label">HOURS in {projects.find((i)=>i?.projectId===selectedProjectId)?.projectName}</div>
        </div>
        
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Pie Chart */}
        <div className="chart-card">
          <h3 className="chart-card__title">
            <Target size={18} />
            Project Time Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatTime(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-card__title">
            <TrendingUp size={18} />
            Time Logged per Project
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [`${value}h`, 'Hours']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="hours" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Time List */}
      <div className="project-timelog-card">
          <h3 className="project-timelog-card__title">
            <Clock size={18} />
            Project Time Logs
          </h3>

   
        <div className="project-timelog-list">
          {Object.entries(data?.projectTimelog || {})
            // eslint-disable-next-line no-unused-vars
            .filter(([_, time]) => time > 0)
            .map(([project, time], index) => (
              <div key={index} className="project-timelog-item">
                <div className="project-timelog-item__dot" style={{ backgroundColor: PROJECT_COLORS[index % PROJECT_COLORS.length] }} />
                <div className="project-timelog-item__name">{project}</div>
                <div className="project-timelog-item__time">{formatTime(time)}</div>
              </div>
            ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="tickets-section">

        <div className="ticket-header">
          <h3 className="tickets-section__title">
            Tickets ({filteredTickets.length})
          </h3>

    
        </div>
     

        <div className="tickets-list">
          {filteredTickets.map((ticket) => (
            <div key={ticket._id} className="ticket-item" onClick={() => navigate(`/tickets/${ticket._id}`)}>
              <div className="ticket-item__header">
                <span className="ticket-item__key">{ticket.ticketKey || ticket._id}</span>
                {ticket.totalTimeLogged > 0 && (
                  <span className="ticket-item__badge">
                    {formatTime(ticket.totalTimeLogged)}
                  </span>
                )}
              </div>
              <h4 className="ticket-item__title">{ticket.title}</h4>
              <div className="ticket-item__meta">
                <span className={`ticket-badge ticket-badge--priority ${getPriorityClass(ticket.priority)}`}>
                  {ticket.priority || 'Medium'}
                </span>
                <span className={`ticket-badge ticket-badge--status ${getStatusClass(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>
      ) : (
        <div className="analytics-loading">
            {!loadingUserProjectAgg && selectedProjectId ? "No analytics data found for this selection." : ""}
        </div>
      )}
    </div>
  );
};

export default TimeLogTracker;