import { getAllProjects } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import {EmptyStateGraphic} from '../../customFiles/customComponent/emptyState';
import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Clock, BarChart3, Target, FolderKanban, Settings, Users, Bell, Tag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
// import { getAllProjects } from './Redux/Actions/PlatformActions.js/projectsActions';
// import { EmptyStateGraphic } from './customFiles/customComponent/emptyState';
import "./styles/herosection.scss";
// import { getAllProjects } from '../../Redux/Actions/PlatformActions/projectsActions.js';

const HoraDashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [timer, setTimer] = useState("00:00:00");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  const { projects } = useSelector((state) => state.projects);

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

  // Fetch Projects
  useEffect(() => {
    if (userDetails?.id) {
      dispatch(getAllProjects(userDetails.id));
    }
  }, [dispatch, userDetails]);

  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'timer', icon: Clock, label: 'Time Tracker' },
    { id: 'projects', icon: FolderKanban, label: 'Projects' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'tags', icon: Tag, label: 'Tags' },
  ];

  const secondaryItems = [
    { id: 'team', icon: Users, label: 'Team' },
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

            <div className="projects__grid">
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project._id} className="project-card">
                    <div className="project-card__header">
                      <div className="project-card__icon">
                        {project.image && project.image !== "" ? (
                          <img src={project.image} alt={project.name} />
                        ) : (
                          <p>{project.name.charAt(0)}</p>
                        )}
                      </div>
                      <div className="project-card__info">
                        <h3 className="project-card__name">{project.name}</h3>
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
                ))
              ) : (
                <EmptyStateGraphic message="No projects assigned" />
              )}
            </div>
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
        <EmptyStateGraphic 
          message="Under Development"
          submessage="This feature is being built and will be available soon"
        />
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
              <h1 className="header__title">Hora - {menuItems.find(item => item.id === activeItem)?.label || 'Dashboard'}</h1>
            </div>
            <div className="header__actions">
              <button className="btn btn--outline">EXPORT</button>
              <button className="btn btn--primary">NEW PROJECT</button>
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