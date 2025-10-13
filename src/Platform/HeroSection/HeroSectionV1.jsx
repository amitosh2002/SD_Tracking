import React, { useState } from 'react';
import "./styles/herosection.scss"

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timer, setTimer] = useState('01:23:45');

  const menuItems = [
    { icon: '📊', label: 'Pordilprna', active: true },
    { icon: '📈', label: 'Sesasfasd' },
    { icon: '📁', label: 'Fleblnaast' },
    { icon: '💎', label: 'Ronibera' },
    { icon: '📧', label: 'Revlioonain' },
    { icon: '❌', label: 'Client X' },
    { icon: '👤', label: 'Liecd por Meest' },
    { icon: '👥', label: 'Misense Miers' },
    { icon: '📍', label: 'Cienn natts' },
  ];

  const projects = [
    { id: 1, name: 'Project Alpha', client: 'Aloha', color: '#3b82f6', icon: 'A', tag: 'Initiative' },
    { id: 2, name: 'Beta', client: 'Initiative', color: '#1e293b', icon: 'B', tag: 'Initiative' },
    { id: 3, name: 'Project', client: 'lens Jong', color: '#f59e0b', icon: '👤', tag: 'Initiative' },
    { id: 4, name: 'Beta', client: 'Downtown', color: '#1e293b', icon: '📁', tag: 'Initiative' },
    { id: 5, name: 'Client X', client: 'Text Urban', color: '#1e293b', icon: 'X', tag: 'Initiative' },
    { id: 6, name: 'Client X', client: 'Aloha', color: '#10b981', icon: 'X', tag: 'Initiative' },
    { id: 7, name: 'Dnoitnitry', client: 'Miz Diesel', color: '#8b5cf6', icon: '💎', tag: 'Initiative' },
    { id: 8, name: 'Client X', client: 'Explosive', color: '#1e293b', icon: 'X', tag: 'Initiative' },
  ];

  return (
    <>
  

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
          <ul className="sidebar__menu">
            {menuItems.map((item, index) => (
              <li 
                key={index}
                className={`sidebar__item ${item.active ? 'sidebar__item--active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="sidebar__icon">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="main">
          <header className="header">
            <div className="header__top">
              <div className="header__brand">
                <div className="header__logo">M</div>
                <h1 className="header__title">Mittarv Company Projects</h1>
              </div>
              <div className="header__actions">
                <button className="btn btn--outline">VIEW ALL</button>
                <button className="btn btn--primary">VIEW ALL</button>
              </div>
            </div>
          </header>

          <section className="projects">
            <div className="projects__header">
              <h2 className="projects__title">My Recent Projects</h2>
            </div>

            <div className="projects__grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-card__header">
                    <div 
                      className="project-card__icon"
                      style={{ background: project.color }}
                    >
                      {project.icon}
                    </div>
                    <div className="project-card__info">
                      <h3 className="project-card__name">{project.name}</h3>
                      <p className="project-card__client">{project.client}</p>
                    </div>
                  </div>
                  <div className="project-card__footer">
                    <div className="project-card__meta">
                      <span>Initiative</span>
                      <span>•</span>
                      <span>Initiative</span>
                      <span>•</span>
                      <span>Initiative</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <div className="timer">
          <div className="timer__status" />
          <div>
            <div className="timer__display">{timer}</div>
            <div className="timer__info">Managed Project Active - Receiving updates</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;