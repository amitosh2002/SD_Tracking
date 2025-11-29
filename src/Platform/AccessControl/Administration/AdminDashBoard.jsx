import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, FolderKanban, Activity, Settings, 
  TrendingUp, UserCheck, AlertCircle, Clock, Calendar,
  CheckCircle, XCircle, BarChart3, PieChart, Search,
  Bell, LogOut, ChevronDown, Plus, Filter, Download
} from 'lucide-react';
import './styles/adminDashboard.scss';

const HoraAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeProjects: 89,
    totalTasks: 3456,
    systemHealth: 98
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    // Mock data - replace with actual API calls
    setRecentActivity([
      { id: 1, user: 'John Doe', action: 'Created project', project: 'Website Redesign', time: '2 mins ago' },
      { id: 2, user: 'Jane Smith', action: 'Completed task', project: 'Mobile App', time: '15 mins ago' },
      { id: 3, user: 'Mike Johnson', action: 'Invited team member', project: 'AI Research', time: '1 hour ago' },
      { id: 4, user: 'Sarah Williams', action: 'Updated settings', project: 'Marketing Campaign', time: '2 hours ago' },
      { id: 5, user: 'Tom Brown', action: 'Deleted project', project: 'Old Website', time: '3 hours ago' }
    ]);

    setUsers([
      { id: 1, name: 'John Doe', email: 'john@hora.com', role: 'Admin', status: 'active', projects: 12, lastActive: '2 mins ago' },
      { id: 2, name: 'Jane Smith', email: 'jane@hora.com', role: 'Manager', status: 'active', projects: 8, lastActive: '15 mins ago' },
      { id: 3, name: 'Mike Johnson', email: 'mike@hora.com', role: 'Member', status: 'active', projects: 5, lastActive: '1 hour ago' },
      { id: 4, name: 'Sarah Williams', email: 'sarah@hora.com', role: 'Manager', status: 'inactive', projects: 10, lastActive: '2 days ago' },
      { id: 5, name: 'Tom Brown', email: 'tom@hora.com', role: 'Member', status: 'active', projects: 3, lastActive: '5 mins ago' }
    ]);

    setProjects([
      { id: 1, name: 'Website Redesign', owner: 'John Doe', members: 8, tasks: 45, progress: 67, status: 'active', deadline: '2025-02-15' },
      { id: 2, name: 'Mobile App Development', owner: 'Jane Smith', members: 12, tasks: 89, progress: 34, status: 'active', deadline: '2025-03-20' },
      { id: 3, name: 'AI Research Project', owner: 'Mike Johnson', members: 6, tasks: 23, progress: 78, status: 'active', deadline: '2025-01-30' },
      { id: 4, name: 'Marketing Campaign', owner: 'Sarah Williams', members: 15, tasks: 56, progress: 92, status: 'active', deadline: '2025-01-25' },
      { id: 5, name: 'Data Analytics Platform', owner: 'Tom Brown', members: 10, tasks: 67, progress: 45, status: 'paused', deadline: '2025-04-10' }
    ]);
  };

  const renderOverview = () => (
    <div className="overview-content">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card--primary">
          <div className="stat-card__icon">
            <Users size={32} />
          </div>
          <div className="stat-card__content">
            <h3 className="stat-card__value">{stats.totalUsers.toLocaleString()}</h3>
            <p className="stat-card__label">Total Users</p>
            <span className="stat-card__trend stat-card__trend--up">
              <TrendingUp size={16} /> +12.5% from last month
            </span>
          </div>
        </div>

        <div className="stat-card stat-card--success">
          <div className="stat-card__icon">
            <FolderKanban size={32} />
          </div>
          <div className="stat-card__content">
            <h3 className="stat-card__value">{stats.activeProjects}</h3>
            <p className="stat-card__label">Active Projects</p>
            <span className="stat-card__trend stat-card__trend--up">
              <TrendingUp size={16} /> +8.3% from last month
            </span>
          </div>
        </div>

        <div className="stat-card stat-card--warning">
          <div className="stat-card__icon">
            <CheckCircle size={32} />
          </div>
          <div className="stat-card__content">
            <h3 className="stat-card__value">{stats.totalTasks.toLocaleString()}</h3>
            <p className="stat-card__label">Total Tasks</p>
            <span className="stat-card__trend stat-card__trend--up">
              <TrendingUp size={16} /> +23.1% from last month
            </span>
          </div>
        </div>

        <div className="stat-card stat-card--info">
          <div className="stat-card__icon">
            <Activity size={32} />
          </div>
          <div className="stat-card__content">
            <h3 className="stat-card__value">{stats.systemHealth}%</h3>
            <p className="stat-card__label">System Health</p>
            <span className="stat-card__trend stat-card__trend--stable">
              <Activity size={16} /> All systems operational
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card chart-card--large">
          <div className="chart-card__header">
            <h3 className="chart-card__title">User Growth</h3>
            <select className="chart-card__filter">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="chart-card__body">
            <div className="mock-chart">
              <BarChart3 size={48} />
              <p>User growth chart visualization</p>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">Project Status</h3>
          </div>
          <div className="chart-card__body">
            <div className="mock-chart">
              <PieChart size={48} />
              <p>Project distribution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="section-header">
          <h3 className="section-title">Recent Activity</h3>
          <button className="btn btn--ghost">View All</button>
        </div>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-item__icon">
                <Activity size={18} />
              </div>
              <div className="activity-item__content">
                <p className="activity-item__text">
                  <strong>{activity.user}</strong> {activity.action} in{' '}
                  <span className="activity-item__project">{activity.project}</span>
                </p>
                <span className="activity-item__time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="users-content">
      <div className="content-header">
        <div className="content-header__left">
          <h2 className="content-title">User Management</h2>
          <p className="content-subtitle">Manage and monitor all users</p>
        </div>
        <div className="content-header__right">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search users..." />
          </div>
          <button className="btn btn--outline">
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn--primary">
            <Plus size={18} />
            Add User
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Projects</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">{user.name.charAt(0)}</div>
                    <span className="user-name">{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-badge--${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.projects}</td>
                <td>
                  <span className={`status-badge status-badge--${user.status}`}>
                    {user.status === 'active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {user.status}
                  </span>
                </td>
                <td>{user.lastActive}</td>
                <td>
                  <div className="table-actions">
                    <button className="action-btn" title="Edit">✏️</button>
                    <button className="action-btn" title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="projects-content">
      <div className="content-header">
        <div className="content-header__left">
          <h2 className="content-title">Project Management</h2>
          <p className="content-subtitle">Monitor all active projects</p>
        </div>
        <div className="content-header__right">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search projects..." />
          </div>
          <button className="btn btn--outline">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-card__header">
              <h3 className="project-card__title">{project.name}</h3>
              <span className={`project-status project-status--${project.status}`}>
                {project.status}
              </span>
            </div>
            <div className="project-card__meta">
              <div className="meta-item">
                <Users size={16} />
                <span>{project.members} members</span>
              </div>
              <div className="meta-item">
                <CheckCircle size={16} />
                <span>{project.tasks} tasks</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>{project.deadline}</span>
              </div>
            </div>
            <div className="project-card__progress">
              <div className="progress-info">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar__fill" 
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
            <div className="project-card__footer">
              <span className="project-owner">Owner: {project.owner}</span>
              <button className="btn btn--sm btn--outline">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-content">
      <h2 className="content-title">System Settings</h2>
      <div className="settings-sections">
        <div className="settings-card">
          <h3 className="settings-card__title">General Settings</h3>
          <div className="settings-group">
            <label className="settings-label">Application Name</label>
            <input type="text" className="settings-input" defaultValue="Hora" />
          </div>
          <div className="settings-group">
            <label className="settings-label">Time Zone</label>
            <select className="settings-input">
              <option>UTC +5:30 (IST)</option>
              <option>UTC +0:00 (GMT)</option>
              <option>UTC -5:00 (EST)</option>
            </select>
          </div>
        </div>

        <div className="settings-card">
          <h3 className="settings-card__title">Security Settings</h3>
          <div className="settings-toggle">
            <label>Two-Factor Authentication</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="settings-toggle">
            <label>Email Notifications</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="settings-toggle">
            <label>Allow Guest Access</label>
            <input type="checkbox" />
          </div>
        </div>

        <div className="settings-card">
          <h3 className="settings-card__title">System Maintenance</h3>
          <button className="btn btn--outline btn--full">Clear Cache</button>
          <button className="btn btn--outline btn--full">Database Backup</button>
          <button className="btn btn--danger btn--full">Reset System</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">H</div>
            <div className="logo-text">
              <h1>Hora</h1>
              <p>Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-section__title">Main</p>
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'nav-item--active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={20} />
              <span>Overview</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'users' ? 'nav-item--active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={20} />
              <span>Users</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'projects' ? 'nav-item--active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <FolderKanban size={20} />
              <span>Projects</span>
            </button>
            <button className="nav-item">
              <Activity size={20} />
              <span>Analytics</span>
            </button>
          </div>

          <div className="nav-section">
            <p className="nav-section__title">System</p>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'nav-item--active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <button className="nav-item">
              <AlertCircle size={20} />
              <span>Logs</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div className="admin-info">
              <p className="admin-name">Admin User</p>
              <p className="admin-email">admin@hora.com</p>
            </div>
          </div>
          <button className="btn btn--ghost btn--icon">
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header__left">
            <h1 className="page-title">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'projects' && 'Project Management'}
              {activeTab === 'settings' && 'System Settings'}
            </h1>
          </div>
          <div className="admin-header__right">
            <button className="btn btn--icon">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="header-divider" />
            <div className="date-display">
              <Clock size={18} />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>
    </div>
  );
};

export default HoraAdminDashboard;