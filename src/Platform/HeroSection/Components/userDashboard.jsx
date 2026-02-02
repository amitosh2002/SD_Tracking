import React, { useMemo, useState, useEffect } from "react";
import {
  CheckCircle2, Clock, AlertCircle, TrendingUp,
  Plus, MoreHorizontal, Calendar, Layout,
  Coffee, Sparkles, AlertTriangle, ChevronDown,
  ShieldAlert
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUserWorkDetails } from "../../../Redux/Actions/PlatformActions.js/userActions";
import "./styles/userdashboard.scss";
import { DropDownV1 } from "../../../customFiles/customComponent/DropDown";

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

// Convert minutes → compact string  (e.g. 360 → "6h", 90 → "1h 30m")
const fmtTime = (mins) => {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h)      return `${h}h`;
  return `${m}m`;
};

// Extract the latest date from timeLogs
const latestDate = (ticket) => {
  if (!ticket.timeLogs || !ticket.timeLogs.length) return null;
  const sorted = [...ticket.timeLogs].sort((a, b) => new Date(b.at) - new Date(a.at));
  return new Date(sorted[0].at);
};

// Format date → "Feb 1"
const fmtDate = (date) => {
  if (!date) return null;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Deterministic avatar color from ticketKey
const avatarColor = (key) => {
  if (!key) return "#6366f1";
  const colors = ["#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6","#3b82f6","#ec4899"];
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// Two-letter avatar initials from ticketKey prefix
const avatarInitials = (key) => {
  if (!key) return "??";
  const prefix = key.split("-")[0] || "??";
  return prefix.slice(0, 2).toUpperCase();
};

// Priority label style
const priorityStyle = (priority) => {
  switch (priority) {
    case "Critical": return "critical";
    case "High":     return "high";
    case "Medium":   return "medium";
    case "Low":      return "low";
    default:         return "medium";
  }
};

// ============================================================================
// SPRINT BOARD  (root)
// ============================================================================
const UserDashboard = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const projects = useSelector((state) => state.projects.projects);
  const data = useSelector((state) => state.user.workDetails);
  const loading = useSelector((state) => state.user.workDetailsLoading);
  const error = useSelector((state) => state.user.workDetailsFail);
  const errorMessage = useSelector((state) => state.user.workDetailsErrorMessage);

  // Local State
  const [selectedProjectId, setSelectedProjectId] = useState("");

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

  const safeData = data || {
    openTickets: [],
    inProgressTickets: [],
    inReviewTickets: [],
    doneTickets: []
  };
  
  const columns = useMemo(() => [
    { id: "open",       label: "To Do",      dot: "gray",   tickets: safeData.openTickets || [] },
    { id: "inProgress", label: "In Progress", dot: "blue",   tickets: safeData.inProgressTickets || [] },
    { id: "inReview",   label: "In Review",   dot: "violet", tickets: safeData.inReviewTickets || [] },
    { id: "done",       label: "Done",        dot: "green",  tickets: safeData.doneTickets || [] }
  ], [safeData]);

  const totalTasks   = columns.reduce((s, c) => s + c.tickets.length, 0);
  const inProgress   = (safeData.inProgressTickets || []).length;
  const critical     = columns.reduce((s, c) => s + c.tickets.filter(t => t.priority === "Critical" || t.priority === "High").length, 0);
  const completed    = (safeData.doneTickets || []).length;

  return (
    <div className="sb-page">
      {/* ── Header with Project Selector ── */}
      <div className="sb-header">
        <div className="sb-header__left">
           <h1 className="sb-header__title">Work Overview</h1>
           <p className="sb-header__subtitle">Manage and track your assigned tasks across projects</p>
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
            accentColor="#94a3b8" // Premium grey theme
          />
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="sb-stats">
        <StatCard icon={<CheckCircle2 size={22} />} color="blue"   num={totalTasks}  label="Total Tasks"  />
        <StatCard icon={<Clock        size={22} />} color="orange" num={inProgress}  label="In Progress"  />
        <StatCard icon={<AlertCircle  size={22} />} color="red"    num={critical}    label="Urgent"       />
        <StatCard icon={<TrendingUp   size={22} />} color="green"  num={completed}   label="Completed"    />
      </div>

      {/* ── Board Columns ── */}
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
            <button 
                className="sb-error__btn sb-error__btn--outline" 
                onClick={() => {
                   // Mock notification logic
                   dispatch({
                       type: "SHOW_SNACKBAR", 
                       payload: { type: "info", message: "Scrum Master has been notified about the configuration issue." }
                   });
                }}
            >
              Notify Scrum Master
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
            No tasks assigned to you in this project yet. <br />
            It's a great time to grab a coffee or start something new!
          </p>
          <button className="sb-empty__btn" onClick={() => {/* navigate or open task creation */}}>
            <Plus size={18} />
            <span>Create New Task</span>
          </button>
        </div>
      ) : (
        <div className="sb-board">
          {columns.map((col) => (
            <Column key={col.id} column={col} />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// STAT CARD
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

// ============================================================================
// COLUMN
// ============================================================================
const Column = ({ column }) => (
  <div className="sb-col">
    {/* header */}
    <div className="sb-col__header">
      <div className="sb-col__header-left">
        <span className={`sb-col__dot sb-col__dot--${column.dot}`} />
        <span className="sb-col__title">{column.label}</span>
        <span className="sb-col__count">{column.tickets.length}</span>
      </div>
      <div className="sb-col__header-right">
        <button className="sb-col__btn"><Plus size={16} /></button>
        <button className="sb-col__btn"><MoreHorizontal size={16} /></button>
      </div>
    </div>

    {/* ticket stack */}
    <div className="sb-col__body">
      {column.tickets.map((ticket) => (
        <TicketCard key={ticket.ticketKey} ticket={ticket} />
      ))}
    </div>

    {/* add task footer */}
    <div className="sb-col__footer">
      <Plus size={15} />
      <span>Add task</span>
    </div>
  </div>
);

// ============================================================================
// TICKET CARD
// ============================================================================
const TicketCard = ({ ticket }) => {
  const { short}  = parseTicketKey(ticket.ticketKey);
  const timeStr          = fmtTime(ticket.totalTimeLogged);
  const date             = latestDate(ticket);
  const dateStr          = fmtDate(date);

  return (
    <div className="sb-ticket">
      {/* row 1: key + priority */}
      <div className="sb-ticket__top">
        <span className="sb-ticket__key">{short}</span>
        <span className={`sb-ticket__priority sb-ticket__priority--${priorityStyle(ticket.priority)}`}>
          {ticket.priority}
        </span>
      </div>

      {/* row 2: title */}
      <h4 className="sb-ticket__title">{ticket.title}</h4>

      {/* row 3: tags */}
      {ticket.label && (
        <div className="sb-ticket__tags">
            <span key={ticket.label} className="sb-ticket__tag">{ticket.label}</span>
        </div>
      )}

      {/* row 4: meta (date · points · avatar) */}
      <div className="sb-ticket__meta">
        <div className="sb-ticket__meta-left">
          {dateStr && (
            <span className="sb-ticket__date">
              <Calendar size={13} />
              {dateStr}
            </span>
          )}
          {timeStr && <span className="sb-ticket__points">{timeStr}</span>}
        </div>
        {/* <span className="sb-ticket__avatar" style={{ background: bgColor }}>
          {initials}
        </span> */}
      </div>
    </div>
  );
};

export default UserDashboard;