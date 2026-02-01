import React, { useState, useEffect, useRef } from 'react';
import { Calendar, CheckSquare, Clock, BarChart3, Target, FolderKanban, Settings, Users, Bell, Tag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProjects } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import { EmptyStateGraphic } from '../../customFiles/customComponent/emptyState';
import "./styles/herosection.scss";
import { useNavigate } from 'react-router-dom';
import ProjectCreationFlow from '../GenerailForms/projectCreationFlow';
import TeamInvitationPage from '../AccessControl/invitationPage';
import TimeLogTracker from './Components/TimeLogTracker';
import AnimatedEmptyState from '../../customFiles/customComponent/EmptyStateAnimated';
import TeamDirectory from './Components/TeamDirectory';
import TeamsPage from './TeamsPage';
import UserCalendar from './Components/UserCalendar';
import ProjectCard from './Components/projectCard';
import { SHOW_SNACKBAR } from '../../Redux/Constants/PlatformConstatnt/platformConstant';

const HoraDashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [timer, setTimer] = useState("00:00:00");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [createProject, setCreateProject] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Better selectors
  const userDetails = useSelector((state) => state.user.userDetails);
  const projects = useSelector((state) => state.projects.projects);
  const projectCreateSucess = useSelector((state) => state.projects.projectCreateSucess);
  
  // Track if we've fetched projects
  const hasFetchedProjects = useRef(false);

  // Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      setTimer(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch Projects - Only once when user is available
  useEffect(() => {
    if (userDetails?.id && !hasFetchedProjects.current) {
      hasFetchedProjects.current = true;
      dispatch(getAllProjects(userDetails.id));
    }
  }, [userDetails?.id, dispatch]);

  // Handle project creation success - Separate effect
  useEffect(() => {
    if (projectCreateSucess) {
      setCreateProject(false);
      // Optionally refetch projects
      if (userDetails?.id) {
        dispatch(getAllProjects(userDetails.id));
      }
    }
  }, [projectCreateSucess, userDetails?.id, dispatch]);

    const handleSignOut = () => {
      dispatch(logoutAction());
      navigate('/');
    };
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'timer', icon: Clock, label: 'Time Tracker' },
    { id: 'projects', icon: FolderKanban, label: 'Projects' },
    // { id: 'goals', icon: Target, label: 'Goals' },
    // { id: 'tags', icon: Tag, label: 'Tags' },
  ];

  const componentMap = {
    tasks: EmptyStateGraphic, 
    calendar: UserCalendar,
    timer: TimeLogTracker,
    projects: TeamInvitationPage,
    goals: EmptyStateGraphic,
    tags: EmptyStateGraphic,
    teams:TeamsPage,
  };

  const ActiveComponent = componentMap[activeItem] || EmptyStateGraphic;

  const secondaryItems = [
    { id: 'teams', icon: Users, label: 'Team' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const renderContent = () => {
    if (activeItem === 'dashboard') {
      return (
        <>
          <section className="projects">
            <div className="projects__header">
              <h2 className="projects__title">My Recent Projects</h2>
            </div>

            {projects && !createProject && projects.length > 0 ? (
              <div className="projects__grid">
                {projects.map((project) => (
                  <div 
                    key={project._id} 
                    onClick={() => {
                      navigate(`/projects/${project?.projectId}/tasks`);
                    }}
                  >
              
                    <ProjectCard project={project}/>
                  
                  </div>
                ))}
              </div>
            ) : (
              !createProject && <ProjectCreationFlow />
            )}

            {createProject && <ProjectCreationFlow createNew={createProject} />}
          </section>
        </>
      );
    }

    // Other sections
    return (
      <section className="projects">
        <div className="projects__header">
          <h2 className="projects__title">
            {menuItems.find(item => item.id === activeItem)?.label || 
             secondaryItems.find(item => item.id === activeItem)?.label}
          </h2>
        </div>
        <ActiveComponent />
      </section>
    );
  };

  return (
    <div className="dashboard">
      <button 
        className="mobile-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <div 
        className={`overlay ${isSidebarOpen ? 'overlay--visible' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={`sidebar ${isSidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__brand-logo-container">
             <div className="sidebar__brand-icon">
                {/* <div className="sidebar__brand-icon-inner"></div> */}
             </div>
             <h1 className="sidebar__logo">Hora</h1>
          </div>  
          <button className="sidebar__collapse-btn">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
             </svg>
          </button>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__section-title">OVERVIEW</div>
          <ul className="sidebar__menu">
            {menuItems.slice(0, 4).map((item) => { // Dashboard, Tasks, Calendar, Time Tracker
              const Icon = item.icon;
              return (
                <li 
                  key={item.id}
                  className={`sidebar__item ${activeItem === item.id ? 'sidebar__item--active' : ''}`}
                  onClick={() => {
                    setActiveItem(item.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <Icon className="sidebar__icon-svg" size={20} />
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
          
           <ul className="sidebar__menu">
             {menuItems.slice(4).map((item) => { // Projects, Goals, Tags (Simulating Marketplace/Orders group)
                const Icon = item.icon;
                return (
                 <li 
                    key={item.id}
                    className={`sidebar__item ${activeItem === item.id ? 'sidebar__item--active' : ''}`}
                    onClick={() => {
                      setActiveItem(item.id);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <Icon className="sidebar__icon-svg" size={20} />
                    <span>{item.label}</span>
                  </li>
                )
             })}
           </ul>

          <div className="sidebar__section-title">ACTIVITY</div>
           <ul className="sidebar__menu">
             <li className="sidebar__item">
                <BarChart3 className="sidebar__icon-svg" size={20} />
                <span>Ledger</span>
             </li>
             <li className="sidebar__item">
                <Target className="sidebar__icon-svg" size={20} />
                <span>Taxes</span>
             </li>
           </ul>


          <div className="sidebar__section-title">SYSTEM</div>
          <ul className="sidebar__menu">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <li 
                  key={item.id}
                  className={`sidebar__item ${activeItem === item.id ? 'sidebar__item--active' : ''}`}
                  onClick={() => {
                    setActiveItem(item.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <Icon className="sidebar__icon-svg" size={20} />
                  <span>{item.label}</span>
                </li>
              );
            })}
             <li className="sidebar__item sidebar__item--toggle">
                <div style={{display: 'flex', gap: '12px', alignItems: 'center', flex: 1}} onClick={() => dispatch({
                  type:SHOW_SNACKBAR,
                  payload:{
                    message:"Dark mode is comming soon",
                    type:"success"
                  }
                })}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sidebar__icon-svg">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <span>Dark mode</span>
                </div>
                <div className="toggle-switch"></div>
            </li>
          </ul>
        </nav>

        <div className="sidebar__footer">
            <div className="sidebar__profile">
            <div className="sidebar__avatar">

              {
                userDetails?.profile.avatar ? <img src={userDetails?.profile.avatar} alt="" />:
                 userDetails?.profile.firstName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="sidebar__user-info">
                <div className="sidebar__user-name">
                {userDetails?.profile?.firstName + ' ' + userDetails?.profile?.lastName || 'User'}
                </div>
                <div className="sidebar__user-email">
                {userDetails?.email || 'User'}
                </div>
            </div>
            </div>
            <div className="logout_button_container">

            <button className="sidebar__logout" onClick={handleSignOut}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Log out</span>
            </button>
            </div>

        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div className="header__top">
            <div className="header__brand">
              <h1 className="header__title">
                Hora - {menuItems.find(item => item.id === activeItem)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="header__actions">
              <button className="btn btn--outline" onClick={()=>{navigate("/work-space/confrigurator")}}>Workspace Confrigure</button>
              <button className="btn btn--outline">EXPORT</button>
              <button 
                className="btn btn--primary" 
                onClick={() => {
                  setActiveItem('dashboard');
                  setCreateProject(true);
                }}
              >
                NEW PROJECT
              </button>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* <div className="timer">
        <div className="timer__status" />
        <div>
          <div className="timer__display">{timer}</div>
          <div className="timer__info">Managed Project Active - Receiving updates</div>
        </div>
      </div> */}
    </div>
  );
};

export default HoraDashboard;