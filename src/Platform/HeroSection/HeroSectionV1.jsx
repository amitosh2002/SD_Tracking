
import { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  CheckSquare,
  Clock,
  BarChart3,
  Target,
  FolderKanban,
  Settings,
  Users,
  Bell,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getAllProjects } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import { SHOW_SNACKBAR } from '../../Redux/Constants/PlatformConstatnt/platformConstant';
import { EmptyStateGraphic } from '../../customFiles/customComponent/emptyState';
import AnimatedEmptyState from '../../customFiles/customComponent/EmptyStateAnimated';

import ProjectCreationFlow from '../GenerailForms/projectCreationFlow';
import TimeLogTracker from './Components/TimeLogTracker';
import UserCalendar from './Components/UserCalendar';
import ProjectCard from './Components/projectCard';
import WorkSpace from './Components/WorkSpace';
import TeamsPage from './TeamsPage';
import Navbar from '../Navbar';

import horalogo from "../../assets/platformIcons/Hora-logo.svg";
import "./styles/herosection.scss";
import TeamInvitationPage from '../AccessControl/invitationPage';
import UserDashboard from './Components/userDashboard';
import { logoutAction } from '../../Redux/Actions/Auth/AuthActions';
import SettingPageV1 from './Components/settingPage';
import InAppNotifications from './Components/inAppNotification';

const HoraDashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.user.userDetails);
  // const projects = useSelector((state) => state.projects.projects);
  const projectCreateSucess = useSelector((state) => state.projects.projectCreateSucess);

  const hasFetchedProjects = useRef(false);

  /* ---------- responsive sidebar ---------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 754) setIsCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ---------- fetch projects ---------- */
  useEffect(() => {
    if (userDetails?.id && !hasFetchedProjects.current) {
      hasFetchedProjects.current = true;
      dispatch(getAllProjects(userDetails.id));
    }
  }, [userDetails?.id, dispatch]);

  useEffect(() => {
    if (projectCreateSucess && userDetails?.id) {
      dispatch(getAllProjects(userDetails.id));
    }
  }, [projectCreateSucess, userDetails?.id, dispatch]);

  /* ---------- menu ---------- */
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'timer', icon: Clock, label: 'Time Tracker' },
    {
      id: 'workspace',
      icon: FolderKanban,
      label: 'Workspace',
      route: '/work-space/confrigurator',
    },
    { id: 'projects', icon: FolderKanban, label: 'Projects' },
  ];

  const secondaryItems = [
    { id: 'teams', icon: Users, label: 'Team' },
    { id: 'invite', icon: Users, label: 'Invite' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleNavClick = (item) => {
    if (item.route) {
      navigate(item.route);
      return;
    }
    setActiveItem(item.id);
  };

  const componentMap = {
    tasks: EmptyStateGraphic,
    calendar: UserCalendar,
    timer: TimeLogTracker,
    projects: WorkSpace,
    teams: TeamsPage,
    invite:TeamInvitationPage,
    notifications:InAppNotifications,
    settings:SettingPageV1

  };

  const ActiveComponent = componentMap[activeItem] || AnimatedEmptyState;

  const handleSignOut = () => {
    dispatch(logoutAction());
    navigate('/');
  };

  const renderContent = () => {
    if (activeItem === 'dashboard') {
      return <UserDashboard />;
    }

    return (
      <section className="projects">
        <div className="projects__header">
          {/* <h2 className="projects__title">
            {menuItems.find(i => i.id === activeItem)?.label ||
              secondaryItems.find(i => i.id === activeItem)?.label}
          </h2> */}
        </div>
        <ActiveComponent />
      </section>
    );
  };

  return (
    <div className="dashboard">
      <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
        <div className="sidebar__brand">
          {/* <img src={horalogo} alt="Hora" style={{ width: "5rem" }} /> */}
             <div className="sidebar__brand-logo-container">
             <div className="sidebar__brand-icon">
                {/* <Clock size={18} /> */}
                <img src={horalogo} alt="" style={{width:"5rem"}}/>
             </div>
             <h1 className="sidebar__logo">Hora</h1>
          </div>  
          {/* <button
            className="sidebar__toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button> */}
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
                  className={`sidebar__item ${activeItem === item.id ? 'sidebar__item--active' : ''}`}
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
                  className={`sidebar__item ${activeItem === item.id ? 'sidebar__item--active' : ''}`}
                  onClick={() => setActiveItem(item.id)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ---------- FOOTER (RESTORED) ---------- */}
        <div className="sidebar__footer">
          <div className="sidebar__profile">
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

      <main className={`main ${isCollapsed ? 'main--collapsed' : ''}`}>
        <Navbar />
        <div className="main__content">{renderContent()}</div>
      </main>
    </div>
  );
};

export default HoraDashboard;
