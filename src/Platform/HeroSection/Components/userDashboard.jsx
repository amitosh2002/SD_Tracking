import React, { useMemo, useState, useEffect } from "react";
import {
  CheckCircle2, Clock, AlertCircle, TrendingUp,
  Plus, MoreHorizontal, Calendar, Layout,
  Coffee, Sparkles, AlertTriangle, ChevronDown,
  ShieldAlert, LayoutGrid, List,
  ChevronUp
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUserWorkDetails } from "../../../Redux/Actions/PlatformActions.js/userActions";
import "./styles/userdashboard.scss";
import { DropDownV1 } from "../../../customFiles/customComponent/DropDown";
import { OPEN_CREATE_TICKET_POPUP } from "../../../Redux/Constants/ticketReducerConstants";
import { useNavigate } from "react-router-dom";

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

// Priority label style
const priorityStyle = (priority) => {
  const p = (priority || "").toLowerCase();
  switch (p) {
    case "critical": return "critical";
    case "high":     return "high";
    case "medium":   return "medium";
    case "low":      return "low";
    case "urgent":   return "critical";
    default:         return "medium";
  }
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

  const safeData = useMemo(() => data || {}, [data]);
  
  const columns = useMemo(() => {
    if (workColumns && workColumns.length > 0) {
      return workColumns.map(col => ({
        id: col.id,
        label: col.name,
        color: col.color || "#94a3b8",
        tickets: safeData[col.name] || []
      }));
    }

    // Default Fallback
    return [
      { id: "todo",       label: "To Do",      color: "#94a3b8", tickets: safeData["To Do"] || safeData["OPEN"] || [] },
      { id: "inProgress", label: "In Progress", color: "#3b82f6", tickets: safeData["In Progress"] || safeData["IN_PROGRESS"] || [] },
      { id: "inReview",   label: "In Review",   color: "#8b5cf6", tickets: safeData["In Review"] || safeData["IN_REVIEW"] || [] },
      { id: "done",       label: "Done",        color: "#10b981", tickets: safeData["Done"] || safeData["CLOSED"] || [] }
    ];
  }, [workColumns, safeData]);

  const allTickets = useMemo(() => {
    return Object.values(safeData).flat();
  }, [safeData]);

  const totalTasks   = allTickets.length;
  const inProgress   = columns.find(c => c.label === "In Progress")?.tickets?.length || 0;
  const critical     = allTickets.filter(t => ["Critical", "High", "Urgent"].includes(t.priority)).length;
  const completed    = columns.find(c => c.label === "Done")?.tickets?.length || 0;

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
        <div className="sb-board">
          {columns.map((col) => (
            <Column key={col.id} column={col} />
          ))}
        </div>
      ) : (
        <div className="sb-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {columns.map((col) => {
            const isCollapsed = collapsedSections[col.id];
            return (
              <div key={col.id} className="sb-list-section">
                <div 
                  className="sb-list-section__header" 
                  onClick={() => toggleSection(col.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    marginBottom: '12px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    background: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s'
                  }}
                >
                  <span className="status-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: col.color }} />
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1e293b', flex: 1 }}>{col.label}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '10px' }}>
                      {col.tickets.length}
                    </span>
                    {isCollapsed ? <ChevronDown size={18} color="#94a3b8" /> : <ChevronUp size={18} color="#94a3b8" />}
                  </div>
                </div>

                {!isCollapsed && (
                  col.tickets.length > 0 ? (
                    <div className="sb-list-view">
                      <div className="sb-table">
                        <div className="sb-table__header">
                          <span>Task ID</span>
                          <span>Title</span>
                          <span>Status</span>
                          <span>Priority</span>
                          <span>Updated</span>
                          <span>Logged</span>
                          <span></span>
                        </div>
                        <div className="sb-table__body">
                          {col.tickets.map((ticket) => (
                            <div key={ticket.id} className="sb-row" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                              <div className="sb-row__col sb-row__col--id">{parseTicketKey(ticket.ticketKey).short}</div>
                              <div className="sb-row__col sb-row__col--title">{ticket.title}</div>
                              <div className="sb-row__col sb-row__col--status">
                                <span 
                                  className="status-dot" 
                                  style={{ backgroundColor: col.color }} 
                                />
                                {ticket.status}
                              </div>
                              <div className="sb-row__col">
                                <span className={`priority-badge ${priorityStyle(ticket.priority)}`}>
                                  {ticket.priority}
                                </span>
                              </div>
                              <div className="sb-row__col">
                                {fmtDate(latestDate(ticket)) || "Recently"}
                              </div>
                              <div className="sb-row__col sb-row__col--points">
                                {fmtTime(ticket.totalTimeLogged) || "0h"}
                              </div>
                              <div className="sb-row__col">
                                <MoreHorizontal size={18} color="#94a3b8" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px dashed #e2e8f0', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
                      No tasks assigned in this stage
                    </div>
                  )
                )}
              </div>
            );
          })}
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

const Column = ({ column }) => (
  <div className="sb-col">
    <div className="sb-col__header">
      <div className="sb-col__header-left">
        <span className="sb-col__dot" style={{ backgroundColor: column.color }} />
        <span className="sb-col__title">{column.label}</span>
        <span className="sb-col__count">{column.tickets.length}</span>
      </div>
      <div className="sb-col__header-right">
        <button className="sb-col__btn"><Plus size={16} /></button>
      </div>
    </div>

    <div className="sb-col__body">
      {column.tickets.map((ticket) => (
        <TicketCard key={ticket.ticketKey} ticket={ticket} />
      ))}
      {column.tickets.length === 0 && (
         <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            No tasks here
         </div>
      )}
    </div>

    <div className="sb-col__footer">
      <Plus size={15} />
      <span>Add task</span>
    </div>
  </div>
);

const TicketCard = ({ ticket }) => {
  const { short } = parseTicketKey(ticket.ticketKey);
  const timeStr = fmtTime(ticket.totalTimeLogged);
  const date = latestDate(ticket);
  const dateStr = fmtDate(date);
  const navigate = useNavigate();

  return (
    <div className="sb-ticket" onClick={() => navigate(`/tickets/${ticket.id}`)}>
      <div className="sb-ticket__top">
        <span className="sb-ticket__key">{short}</span>
        <span className={`sb-ticket__priority sb-ticket__priority--${priorityStyle(ticket.priority)}`}>
          {ticket.priority}
        </span>
      </div>

      <h4 className="sb-ticket__title">{ticket.title}</h4>

      {ticket.label && (
        <div className="sb-ticket__tags">
            <span className="sb-ticket__tag">{ticket.label}</span>
        </div>
      )}

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
      </div>
    </div>
  );
};

export default UserDashboard;