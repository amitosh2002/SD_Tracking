
import React from 'react';
import {
  Calendar,
  CheckSquare,
  Clock,
  BarChart3,
  FolderKanban,
  Settings,
  Users,
  Bell,
  UserPlus,
  Layers2,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutAction } from '../../Redux/Actions/Auth/AuthActions';
import horalogo from "../../assets/platformIcons/Hora-logo.svg";
import "../HeroSection/styles/herosection.scss"; // Ensure styles are available

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = useSelector((state) => state.user.userDetails);

  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', route: '/' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks', route: '/user-work-space' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', route: '/calendar' },
    { id: 'timer', icon: Clock, label: 'Time Tracker', route: '/timer' },
    {
      id: 'workspace',
      icon: Layers2,
      label: 'Workspace',
      route: '/work-space/confrigurator',
    },
    { id: 'projects', icon: FolderKanban, label: 'Projects', route: '/projects' },
  ];

  const secondaryItems = [
    { id: 'teams', icon: Users, label: 'Team', route: '/teams' },
    { id: 'invite', icon: UserPlus, label: 'Invite', route: '/invite' },
    { id: 'notifications', icon: Bell, label: 'Notifications', route: '/notifications' },
    { id: 'settings', icon: Settings, label: 'Settings', route: '/settings' },
  ];

  const handleNavClick = (item) => {
    if (item.route) {
      navigate(item.route);
    }
  };

  const isActive = (route) => {
    if (route === '/' && location.pathname === '/') return true;
    if (route !== '/' && location.pathname.startsWith(route)) return true;
    return false;
  };

  const handleSignOut = () => {
    dispatch(logoutAction());
    navigate('/');
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__brand">
        <div className="sidebar__brand-logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="sidebar__brand-icon">
            <img src={horalogo} alt="" style={{ width: "5rem" }} />
          </div>
          <h1 className="sidebar__logo">Hora</h1>
        </div>
        <button
          className="sidebar__collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <nav className="sidebar__nav">
        <div className="sidebar__section-title">OVERVIEW</div>
        <ul className="sidebar__menu">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className={`sidebar__item ${isActive(item.route) ? 'sidebar__item--active' : ''}`}
                onClick={() => handleNavClick(item)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>

        <ul className="sidebar__menu">
          <div className="sidebar__section-title">Actions</div>
          {secondaryItems.map(item => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className={`sidebar__item ${isActive(item.route) ? 'sidebar__item--active' : ''}`}
                onClick={() => handleNavClick(item)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__profile" onClick={()=>navigate('/profile')} style={{cursor:'pointer'}}>
          <div className="sidebar__avatar">
            {userDetails?.profile?.avatar ? (
              <img src={userDetails.profile.avatar} alt="avatar" />
            ) : (
              userDetails?.profile?.firstName?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">
              {userDetails?.profile?.firstName} {userDetails?.profile?.lastName}
            </div>
            <div className="sidebar__user-email">
              {userDetails?.email}
            </div>
          </div>
        </div>

        <button className="sidebar__logout" onClick={handleSignOut}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className='sidebar__user-name'>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
