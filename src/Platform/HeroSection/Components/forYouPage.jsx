// ForYouPage.jsx
import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreVertical, 
  ArrowUpRight, 
  Calendar,
  Users,
  Plus
} from "lucide-react";
import "./styles/ForYouPage.scss";

const projects = [
  {
    id: "PRJ-1",
    name: "Hora Platform",
    category: "Development",
    progress: 65,
    openWork: 8,
    assignedToMe: 3,
    overdue: 1,
    sprint: "Sprint 14",
    lastUpdated: "2h ago",
    color: "#6366f1", // Indigo
    members: ["JD", "AS", "MK"]
  },
  {
    id: "PRJ-2",
    name: "Recode Design System",
    category: "Design",
    progress: 82,
    openWork: 5,
    assignedToMe: 2,
    overdue: 0,
    sprint: "Sprint 9",
    lastUpdated: "1d ago",
    color: "#ec4899", // Pink
    members: ["MK", "RJ"]
  },
  {
    id: "PRJ-3",
    name: "Internal Tools",
    category: "Infrastructure",
    progress: 40,
    openWork: 12,
    assignedToMe: 6,
    overdue: 3,
    sprint: "Sprint 3",
    lastUpdated: "4h ago",
    color: "#10b981", // Emerald
    members: ["AS", "BK", "TL", "PR"]
  },
  {
    id: "PRJ-4",
    name: "Customer Portal",
    category: "Marketing",
    progress: 15,
    openWork: 4,
    assignedToMe: 1,
    overdue: 0,
    sprint: "Sprint 2",
    lastUpdated: "5h ago",
    color: "#f59e0b", // Amber
    members: ["JD", "TL"]
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function ForYouPage() {
  return (
    <div className="for-you">
      <header className="fy-header">
        <div className="greeting">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            Good Afternoon, Amitosh
          </motion.h1>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Here's what's happening across your projects today.
          </motion.p>
        </div>
        <div className="header-actions">
          <button className="secondary-btn">
            <Calendar size={18} />
            Schedule
          </button>
          <button className="primary-btn">
            <Plus size={18} />
            New Task
          </button>
        </div>
      </header>

      <motion.section 
        className="overview-stats"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon open">
            <BarChart3 size={20} />
          </div>
          <div className="stat-info">
            <span className="label">Total Open Work</span>
            <span className="value">29</span>
          </div>
        </motion.div>
        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon assigned">
            <Clock size={20} />
          </div>
          <div className="stat-info">
            <span className="label">Assigned to Me</span>
            <span className="value">12</span>
          </div>
        </motion.div>
        <motion.div className="stat-card urgent" variants={itemVariants}>
          <div className="stat-icon overdue">
            <AlertCircle size={20} />
          </div>
          <div className="stat-info">
            <span className="label">Overdue Tasks</span>
            <span className="value">4</span>
          </div>
        </motion.div>
        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon done">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-info">
            <span className="label">Completed (Week)</span>
            <span className="value">18</span>
          </div>
        </motion.div>
      </motion.section>

      <div className="section-title">
        <h2>Active Projects</h2>
        <button className="text-link">View all projects</button>
      </div>

      <motion.section 
        className="project-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project) => (
          <motion.div 
            key={project.id} 
            className="project-card"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
          >
            <div className="card-top">
              <div 
                className="category-badge"
                style={{ backgroundColor: `${project.color}15`, color: project.color }}
              >
                {project.category}
              </div>
              <button className="icon-btn">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="project-info">
              <h3>{project.name}</h3>
              <div className="sprint-info">
                <Calendar size={14} />
                <span>{project.sprint}</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="progress-bar-bg">
                <motion.div 
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ backgroundColor: project.color }}
                />
              </div>
            </div>

            <div className="card-metrics">
              <div className="c-metric">
                <span className="c-label">Open</span>
                <span className="c-value">{project.openWork}</span>
              </div>
              <div className="c-metric">
                <span className="c-label">Assigned</span>
                <span className="c-value">{project.assignedToMe}</span>
              </div>
              <div className={`c-metric ${project.overdue > 0 ? "warning" : ""}`}>
                <span className="c-label">Overdue</span>
                <span className="c-value">{project.overdue}</span>
              </div>
            </div>

            <div className="project-footer">
              <div className="members">
                {project.members.map((m, idx) => (
                  <div key={idx} className="member-avatar" style={{ zIndex: project.members.length - idx }}>
                    {m}
                  </div>
                ))}
                {project.members.length > 3 && <div className="member-more">+{project.members.length - 3}</div>}
              </div>
              <button className="view-btn">
                <span>Details</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}