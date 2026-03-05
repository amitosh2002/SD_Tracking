import React, { useMemo, useState, useEffect } from "react";
import {
  CheckCircle2, Clock, AlertCircle, TrendingUp,
  Plus, Calendar, Layout,
  Coffee, Sparkles, AlertTriangle,
  ShieldAlert, LayoutGrid, List
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUserWorkDetails } from "../../../Redux/Actions/PlatformActions.js/userActions";
import "./styles/userdashboard.scss";
import { DropDownV1 } from "../../../customFiles/customComponent/DropDown";
import { OPEN_CREATE_TICKET_POPUP } from "../../../Redux/Constants/ticketReducerConstants";
import { useNavigate } from "react-router-dom";
import ExpandableTaskList from "../../../customFiles/customComponent/sprintComponents/ExpandableTaskList";
import KanbanBoard from "../../../customFiles/customComponent/sprintComponents/KanbanBoard";
import { changeTicketStatus } from "../../../Redux/Actions/TicketActions/ticketAction";

// ============================================================================
// HELPERS
// ============================================================================

// Extract short key (e.g. "TASK-2") and tags from the full ticketKey string
const parseTicketKey = (fullKey) => {
  if (!fullKey) return { short: "??", tags: [] };
  const parts = fullKey.split("-");
  const prefix = parts[0];                        
  const num   = parts[1];                         
  const short = `${prefix}-${num}`;               
  // everything after the number is the tag slug — split on "-" and dedupe
  const tagSlug = parts.slice(2).join("-");
  // pick first 2 meaningful words as tags
  const words = tagSlug.split("-").filter(w => w.length > 2);
  const tags  = [...new Set(words)].slice(0, 2);
  return { short, tags };
};

// Generate initials from name
const getInitials = (name) => {
  if (!name) return "??";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};


// ============================================================================
// SPRINT BOARD  (root)
// ============================================================================
const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Selectors
  const projects = useSelector((state) => state.projects.projects);
  const data = useSelector((state) => state.user.workDetails);
  const workColumns = useSelector((state) => state.user.workDetailsColumns);
  const loading = useSelector((state) => state.user.workDetailsLoading);
  const error = useSelector((state) => state.user.workDetailsFail);
  const errorMessage = useSelector((state) => state.user.workDetailsErrorMessage);
  const user = useSelector((state) => state.auth.user);

  // Local State
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [viewMode, setViewMode] = useState("kanban"); // kanban, list
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Set default project on load
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].projectId);
    }
  }, [projects, selectedProjectId]);

  // Fetch data when project changes
  useEffect(() => {
    if (selectedProjectId) {
      dispatch(getUserWorkDetails(selectedProjectId));
    }
  }, [selectedProjectId, dispatch]);

  const safeData = useMemo(() => data || [], [data]);
  
  const columns = useMemo(() => {
    // 1️⃣ Priority: New Array Structure from Backend
    if (Array.isArray(safeData)) {
      return safeData.map(col => ({
        id: col.columnId || col.id,
        label: col.name || col.Name || "Unknown",
        color: col.color || "#94a3b8",
        statusKeys: col.statusKeys || [],
        tickets: col.tickets || []
      }));
    }

    // 2️⃣ Fallback: If data is still an object (keyed by status) but we have separate workColumns
    if (workColumns && workColumns.length > 0) {
      return workColumns.map(col => ({
        id: col.id,
        label: col.name,
        color: col.color || "#94a3b8",
        statusKeys: col.statusKeys || [],
        tickets: safeData[col.name] || []
      }));
    }

    // 3️⃣ Legacy Fallback
    const legacyData = typeof safeData === 'object' ? safeData : {};
    return [
      { id: "todo",       label: "To Do",      color: "#94a3b8", statusKeys: ["TODO", "BACKLOG", "OPEN"], tickets: legacyData["To Do"] || legacyData["OPEN"] || [] },
      { id: "inProgress", label: "In Progress", color: "#3b82f6", statusKeys: ["IN_PROGRESS"], tickets: legacyData["In Progress"] || legacyData["IN_PROGRESS"] || [] },
      { id: "inReview",   label: "In Review",   color: "#8b5cf6", statusKeys: ["IN_REVIEW"],   tickets: legacyData["In Review"] || legacyData["IN_REVIEW"] || [] },
      { id: "done",       label: "Done",        color: "#10b981", statusKeys: ["DONE", "CLOSED"],    tickets: legacyData["Done"] || legacyData["CLOSED"] || [] }
    ];
  }, [workColumns, safeData]);

  const allTickets = useMemo(() => {
    if (Array.isArray(safeData)) {
      return safeData.flatMap(col => col.tickets || []);
    }
    return Object.values(safeData || {}).flat().filter(Boolean);
  }, [safeData]);

  const totalTasks   = allTickets.length;
  const inProgress   = columns.find(c => ["In Progress", "IN PROGRESS"].includes(c.label.toUpperCase()))?.tickets?.length || 0;
  const critical     = allTickets.filter(t => ["Critical", "High", "Urgent"].includes(t.priority)).length;
  const completed    = columns.find(c => ["Done", "DONE", "COMPLETED"].includes(c.label.toUpperCase()))?.tickets?.length || 0;

  const handleTaskMove = ({ destinationColumnId, active }) => {
    const taskData = active.data.current?.task;
    const realTicketId = taskData?._id || taskData?.id;
    
    const targetColumn = columns.find(col => col.id === destinationColumnId);
    if (!targetColumn || !realTicketId) return;

    // Use the first statusKey if available, otherwise fallback to label
    const newStatus = targetColumn.statusKeys?.[0] || targetColumn.label;
    
    if (newStatus) {
      dispatch(changeTicketStatus(realTicketId, newStatus));
    }
  };

  return (
    <div className="sb-page">
      {/* ── Header with Project Selector & View Toggle ── */}
      <div className="sb-header">
        <div className="sb-header__left">
           <h1 className="sb-header__title">Work Overview</h1>
           <p className="sb-header__subtitle">Manage and track your assigned tasks across projects</p>
        </div>

        <div className="sb-header__right" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* View Toggle */}
          <div className="sb-view-toggle">
            <button 
              className={`sb-view-toggle__btn ${viewMode === 'kanban' ? 'sb-view-toggle__btn--active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid size={16} />
              <span>Board</span>
            </button>
            <button 
              className={`sb-view-toggle__btn ${viewMode === 'list' ? 'sb-view-toggle__btn--active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
              <span>List</span>
            </button>
          </div>

          <div className="sb-project-selector">
            <Layout size={18} className="sb-project-selector__icon" />
            <DropDownV1
              defaultType={projects?.find(p => p.projectId === selectedProjectId) ? { 
                label: projects.find(p => p.projectId === selectedProjectId).projectName, 
                value: selectedProjectId 
              } : null}
              onChange={(item) => setSelectedProjectId(item.value)}
              dataTypes={projects?.map(p => ({ label: p.projectName, value: p.projectId })) || []}
              placeholder="Select a project"
              className="sb-project-selector__dropdown"
              accentColor="#94a3b8"
            />
          </div>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="sb-stats">
        <StatCard icon={<CheckCircle2 size={22} />} color="blue"   num={totalTasks}  label="Total Tasks"  />
        <StatCard icon={<Clock        size={22} />} color="orange" num={inProgress}  label="In Progress"  />
        <StatCard icon={<AlertCircle  size={22} />} color="red"    num={critical}    label="Urgent"       />
        <StatCard icon={<TrendingUp   size={22} />} color="green"  num={completed}   label="Completed"    />
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="sb-loading">
            <div className="sb-loading__spinner"></div>
            <span>Syncing your work...</span>
        </div>
      ) : error ? (
        <div className="sb-error">
          <ShieldAlert size={48} className="sb-error__icon" />
          <h2 className="sb-error__title">Project Configuration Required</h2>
          <p className="sb-error__text">
            {errorMessage || "We couldn't fetch your work details. Please check your connection and try again."}
          </p>
          <div className="sb-error__actions">
            <button className="sb-error__btn sb-error__btn--primary" onClick={() => dispatch(getUserWorkDetails(selectedProjectId))}>
              Retry Now
            </button>
          </div>
        </div>
      ) : totalTasks === 0 ? (
        <div className="sb-empty">
          <div className="sb-empty__icon-stack">
            <Coffee className="sb-empty__icon sb-empty__icon--main" size={48} />
            <Sparkles className="sb-empty__icon sb-empty__icon--sparkle" size={24} />
          </div>
          <h2 className="sb-empty__title">All Quiet on the Front</h2>
          <p className="sb-empty__text">
            No tasks assigned to you in this project yet.
          </p>
          <button className="sb-empty__btn" onClick={() => {dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: true })}}>
            <Plus size={18} />
            <span>Create New Task</span>
          </button>
        </div>
      ) : viewMode === "kanban" ? (
        <KanbanBoard 
          columns={columns.map(col => ({
            ...col,
            tasks: col.tickets.map(t => ({
              ...t,
              id: t.id || t._id,
              ticketKey: t.ticketKey,
              title: t.title,
              storyPoint: t.storyPoint || t.pts || 0,
              assignee: { 
                name: user?.profile?.firstName ? (user.profile.firstName + " " + (user.profile.lastName || "")) : "You", 
                initials: user?.profile?.firstName ? getInitials(user.profile.firstName + " " + (user.profile.lastName || "")) : "ME",
                image: user?.profile?.avatar || null
              },
              status: t.status || col.label
            }))
          }))}
          onTaskClick={(t) => navigate(`/tickets/${t._id || t.id}`)}
          onAddTask={() => dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: true })}
          onTaskMove={handleTaskMove}
        />
      ) : (
        <div className="pb-backlog" style={{ padding: '0 0 32px' }}>
          {columns.map((col) => (
            <ExpandableTaskList
              key={col.id}
              title={col.label}
              tasks={col.tickets.map(t => ({
                ...t,
                id: t.id || t._id,
                ticketKey: parseTicketKey(t.ticketKey).short,
                storyPoint: t.storyPoint || t.pts || 0,
                assignee: { 
                  name: user?.profile?.firstName ? (user.profile.firstName + " " + (user.profile.lastName || "")) : "You", 
                  initials: user?.profile?.firstName ? getInitials(user.profile.firstName + " " + (user.profile.lastName || "")) : "ME",
                  image: user?.profile?.avatar || null
                },
                status: t.status || col.label
              }))}
              isCollapsed={collapsedSections[col.id]}
              onToggle={() => toggleSection(col.id)}
              onTaskClick={(t) => navigate(`/tickets/${t._id || t.id}`)}
              bugCount={col.tickets.filter(t => 
                (t.label || "").toLowerCase().includes('bug')
              ).length}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENTS
// ============================================================================

const StatCard = ({ icon, color, num, label }) => (
  <div className={`sb-stat sb-stat--${color}`}>
    <div className="sb-stat__icon">{icon}</div>
    <div className="sb-stat__body">
      <span className="sb-stat__num">{num}</span>
      <span className="sb-stat__label">{label}</span>
    </div>
  </div>
);


export default UserDashboard;