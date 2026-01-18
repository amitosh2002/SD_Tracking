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

  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'timer', icon: Clock, label: 'Time Tracker' },
    { id: 'projects', icon: FolderKanban, label: 'Projects' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'tags', icon: Tag, label: 'Tags' },
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
                    className="project-card"
                    onClick={() => {
                      navigate(`/projects/${project?.projectId}/tasks`);
                    }}
                  >
                    <div className="project-card__header">
                      <div className="project-card__icon">
                        {project.image && project.image !== "" ? (
                          <img src={project.image} alt={project.name} />
                        ) : (
                          <p>{project?.name?.charAt(0) ?? project?.projectName?.charAt(0)}</p>
                        )}
                      </div>
                      <div className="project-card__info">
                        <h3 className="project-card__name">{project.name ?? project?.projectName}</h3>
                        <p className="project-card__client">{project.partnerCode}</p>
                      </div>
                    </div>
                    <div className="project-card__footer">
                      <div className="project-card__meta">
                        <span>{project.category}</span>
                        <span>•</span>
                        <span>{project.status}</span>
                        <span>•</span>
                        <span>Initiative</span>
                      </div>
                    </div>
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
          <h1 className="sidebar__logo">Hora</h1>
          <p className="sidebar__subtitle">Time Management</p>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__section-title">Main Menu</div>
          <ul className="sidebar__menu">
            {menuItems.map((item) => {
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
                  {activeItem === item.id && <div className="sidebar__indicator" />}
                </li>
              );
            })}
          </ul>

          <div className="sidebar__section-title">Other</div>
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
                  {activeItem === item.id && <div className="sidebar__indicator" />}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar__profile">
          <div className="sidebar__avatar">
            {userDetails?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">
              {userDetails?.name || 'User'}
            </div>
            <div className="sidebar__user-email">
              {userDetails?.email || 'user@hora.app'}
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div className="header__top">
            <div className="header__brand">
              <div className="header__logo">H</div>
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

      <div className="timer">
        <div className="timer__status" />
        <div>
          <div className="timer__display">{timer}</div>
          <div className="timer__info">Managed Project Active - Receiving updates</div>
        </div>
      </div>
    </div>
  );
};

export default HoraDashboard;