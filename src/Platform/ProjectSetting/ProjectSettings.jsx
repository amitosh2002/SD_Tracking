import React, { useState } from "react";
import "./styles/ProjectSettings.scss";
import { 
  Zap, 
  Settings, 
  Github, 
  Users, 
  BarChart3, 
  Terminal,
  ChevronRight,
  Info,
  MoveLeftIcon
} from 'lucide-react';
import Automations from "./Automation";
import RunningJobs from "./RunningJobs";
import GitHubAdminPanel from "../AccessControl/Administration/githubControlPanel";
import UserAccess from "./UserAccess";
import AnalyticsPage from "./AnalyticsPage";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const SECTIONS = [
  {
    id: "Automations",
    label: "Automations",
    description: "Manage project-level workflow scripts",
    icon: <Zap size={18} />,
    education: "Automations allow you to trigger specific actions based on ticket events. Use these to maintain consistency across your project's lifecycle without manual intervention."
  },
  {
    id: "Running Jobs",
    label: "Running Jobs",
    description: "Monitor active background processes",
    icon: <Terminal size={18} />,
    education: "View and manage all active background tasks associated with this project. Ensure your data syncs and long-running operations are executing as expected."
  },
  {
    id: "GitHub Integration",
    label: "GitHub Integration",
    description: "Source code and branch connectivity",
    icon: <Github size={18} />,
    education: "Connect your project to GitHub repositories to enable branch tracking, pull request automation, and deep work-linkage between code and tasks."
  },
  {
    id: "User Access",
    label: "User Access",
    description: "Permissions and team management",
    icon: <Users size={18} />,
    education: "Manage who can see and edit this project. Granular permissions allow you to define roles for viewers, editors, managers, and administrators."
  },
  {
    id: "Analytics",
    label: "Analytics",
    description: "Sprint velocity and DORA configuration",
    icon: <BarChart3 size={18} />,
    education: "Configure how velocity and performance metrics are calculated. Define your status categories and effort fields to get accurate, project-specific insights."
  },
];

export default function ProjectSettings() {
  const [active, setActive] = useState("Automations");
  const activeItem = SECTIONS.find(s => s.id === active);
    const projectId = useParams().projectId;
    const navigate = useNavigate();

  return (
    <div className="project-settings-container">
      <div className="settings-wrapper">
        {/* Sidebar Navigation */}
        <aside className="settings-sidebar">
          <div className="sidebar-header">
            <MoveLeftIcon size={35} className="header-icon" style={{cursor:"pointer"}} onClick={() => navigate(`/work-space/confrigurator`)}/>
            <Settings size={20} className="header-icon" />
            <h2>Project Settings</h2>
          </div>
          
          <nav className="sidebar-nav">
            {SECTIONS.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${active === item.id ? "active" : ""}`}
                onClick={() => setActive(item.id)}
              >
                <div className="nav-icon-container">
                  {item.icon}
                </div>
                <div className="nav-text">
                  <span className="nav-label">{item.label}</span>
                  <p className="nav-description">{item.description}</p>
                </div>
                <ChevronRight size={14} className="nav-arrow" />
              </div>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="settings-content">
          <div className="content-inner">
            <header className="content-header">
              <h1>{activeItem.label}</h1>
              <div className="education-banner">
                <div className="banner-icon">
                  <Info size={18} />
                </div>
                <div className="banner-text">
                  <p>{activeItem.education}</p>
                </div>
              </div>
            </header>

            <div className="section-body">
              {active === "Automations" && <Automations projectId={projectId} />}
              {active === "Running Jobs" && <RunningJobs projectId={projectId} />}
              {active === "GitHub Integration" && <GitHubAdminPanel projectId={projectId} />}
              {active === "User Access" && <UserAccess  projectId={projectId} />}
              {active === "Analytics" && <AnalyticsPage projectId={projectId} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
