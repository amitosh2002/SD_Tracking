import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Filter,
  List,
  Zap,
  BarChart3,
  Search,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  User as UserIcon,
  ArrowLeft,
} from 'lucide-react';
import './styles/ProjectBoard.scss';
import { OPEN_CREATE_TICKET_POPUP } from '../../Redux/Constants/ticketReducerConstants';
import { useDispatch, useSelector } from 'react-redux';
import KanbanBoard from '../../customFiles/customComponent/sprintComponents/KanbanBoard';
import { getCurrentProjectSprintWorkActions, changeTicketStatus } from '../../Redux/Actions/TicketActions/ticketAction';

import ExpandableTaskList from '../../customFiles/customComponent/sprintComponents/ExpandableTaskList';

// ─── helpers ─────────────────────────────────────────────────────────────────
const getInitials = (name) => {
  if (!name || name === 'Unassigned') return 'UN';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const getPriorityLabel = (ticket) => {
  if (ticket.priorityName && ticket.priorityName !== 'Unknown') return ticket.priorityName;
  const p = ticket.priority;
  if (p && typeof p === 'object' && !Array.isArray(p)) return p.name || 'Medium';
  if (Array.isArray(p)) {
    const first = p[0];
    return first && typeof first === 'object' ? first.name : first || 'Medium';
  }
  return p || 'Medium';
};

const getLabelsArray = (ticket) => {
  const l = ticket.labels || [];
  return (Array.isArray(l) ? l : [l])
    .map((label) => (label && typeof label === 'object' ? label.name : label))
    .filter(Boolean);
};

// ─── Avatar colours (deterministic by name) ──────────────────────────────────

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'Backlog',      label: 'Backlog',       Icon: List      },
  { id: 'Sprint Board', label: 'Sprint Board',  Icon: Zap       },
  { id: 'Analytics',   label: 'Analytics',     Icon: BarChart3 },
];

const PRIORITY_FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low'];

// ─── Component ────────────────────────────────────────────────────────────────
const ProjectBoardPage = () => {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Backlog';

  const [searchTerm, setSearchTerm]         = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [collapsed, setCollapsed]           = useState({ 'Default Backlog': false });

  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const {
    projectBoard = [],
    currentProjectSprintName,
    loading: sprintLoading,
  } = useSelector((state) => state.worksTicket);

  useEffect(() => {
    if (projectId) dispatch(getCurrentProjectSprintWorkActions(projectId));
  }, [projectId, dispatch]);

  // ── Flatten board columns into one task list ──────────────────────────────
  const transformedTasks = useMemo(() => {
    if (!Array.isArray(projectBoard)) return [];
    return projectBoard.flatMap((col) => {
      const colName = col.name || col.title || 'Unknown';
      return (col.tickets || col.tasks || []).map((ticket) => ({
        id:         ticket.id || ticket._id,
        ticketKey:  ticket.ticketKey,
        title:      ticket.title,
        status:     colName,
        rawStatus:  ticket.status,
        assignee: {
          name:     (ticket.assignee && typeof ticket.assignee === 'object'
                      ? ticket.assignee.name
                      : ticket.assignee) || 'Unassigned',
          initials: getInitials(ticket.assignee && typeof ticket.assignee === 'object'
                      ? ticket.assignee.name
                      : ticket.assignee),
          image:    (ticket.assignee && ticket.assignee.image) ||
                    ticket.assigneeImage || null,
        },
        priority:   getPriorityLabel(ticket),
        storyPoint: ticket.storyPoint || 0,
        labels:     getLabelsArray(ticket),
        ticketId:   ticket.id || ticket._id,
        dueDate:    ticket.eta ? new Date(ticket.eta).toLocaleDateString() : 'No date',
      }));
    });
  }, [projectBoard]);

  // ── Kanban columns — read directly from projectBoard ─────────────────────
  const kanbanColumns = useMemo(() => {
    if (!Array.isArray(projectBoard)) return [];
    return projectBoard.map((col) => ({
      id:         col.columnId || col.id,
      name:       col.name,
      color:      col.color,
      statusKeys: col.statusKeys,
      tasks:      (col.tickets || col.tasks || []).map((ticket) => ({
        id:         ticket.id || ticket._id,
        ticketKey:  ticket.ticketKey,
        title:      ticket.title,
        status:     ticket.status,
        rawStatus:  ticket.status,
        assignee: {
          name:     (ticket.assignee && typeof ticket.assignee === 'object'
                      ? ticket.assignee.name
                      : ticket.assignee) || 'Unassigned',
          initials: getInitials(ticket.assignee && typeof ticket.assignee === 'object'
                      ? ticket.assignee.name
                      : ticket.assignee),
          image:    (ticket.assignee && ticket.assignee.image) ||
                    ticket.assigneeImage || null,
        },
        priority:   getPriorityLabel(ticket),
        storyPoint: ticket.storyPoint || 0,
        labels:     getLabelsArray(ticket),
        ticketId:   ticket.id || ticket._id,
        dueDate:    ticket.eta ? new Date(ticket.eta).toLocaleDateString() : 'No date',
      })),
    }));
  }, [projectBoard]);

  // ── Filter (for backlog list view only) ──────────────────────────────────
  const filteredTasks = useMemo(() => {
    let r = [...transformedTasks];
    if (searchTerm)
      r = r.filter(
        (t) =>
          t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.id || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (priorityFilter !== 'All') r = r.filter((t) => t.priority === priorityFilter);
    return r;
  }, [transformedTasks, searchTerm, priorityFilter]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => [
    { label: 'Total Issues',  value: transformedTasks.length,                                              color: 'blue'  },
    { label: 'Story Points',  value: transformedTasks.reduce((a, t) => a + (t.storyPoint || 0), 0),       color: 'teal'  },
    { label: 'Unassigned',    value: transformedTasks.filter((t) => t.assignee?.name === 'Unassigned').length, color: 'amber' },
  ], [transformedTasks]);

  const toggleGroup = (name) =>
    setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleTaskMove = ({ destinationColumnId, active }) => {
    const taskData = active.data.current?.task;
    const realTicketId = taskData?.ticketId || taskData?._id;

    // Find target column from projectBoard
    const targetColumn = (Array.isArray(projectBoard) ? projectBoard : []).find(
      (col) => (col.columnId || col.id) === destinationColumnId
    );
    if (!targetColumn || !realTicketId) return;

    if (targetColumn.statusKeys && targetColumn.statusKeys.length > 1) {
      // Let KanbanBoard handle multi-status popup
      return;
    }
    const newStatus = targetColumn.statusKeys?.[0] || targetColumn.name;
    if (newStatus) {
      dispatch(changeTicketStatus(realTicketId, newStatus));
    }
  };

  const openCreate = () => dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: true });

  const bugCount = filteredTasks.filter((t) =>
    t.labels.some((l) => l.toLowerCase().includes('bug'))
  ).length;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (sprintLoading && projectBoard.length === 0) {
    return (
      <div className="pb-page pb-page--loading">
        <div className="pb-loader">
          <div className="pb-loader__ring" />
          <span>Loading project…</span>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="pb-page">

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header className="pb-header">
        <div className="pb-header__left">
          <nav className="pb-breadcrumb" aria-label="breadcrumb" style={{textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",cursor:"pointer"}}>
             <ArrowLeft size={24} onClick={() => navigate(`/workspace/${projectId}/insight`)}/> 
            <span
              className="pb-breadcrumb__item pb-breadcrumb__item--link"
              onClick={() => navigate('/projects')}
            >
            Projects
            </span>
            <span className="pb-breadcrumb__sep" aria-hidden="true">/</span>
            <span className="pb-breadcrumb__item pb-breadcrumb__item--active">
              Project Board
            </span>
          </nav>

          <h1 className="pb-page-title">
            {TABS.find((t) => t.id === activeTab)?.label ?? 'Backlog'}
          </h1>
        </div>

        <div className="pb-header__right">
          <button className="pb-btn pb-btn--outline" onClick={() => {}}>
            <Filter size={14} />
            Filter
          </button>
          <button className="pb-btn pb-btn--primary" onClick={openCreate}>
            <Plus size={14} />
            New Issue
          </button>
        </div>
      </header>

      {/* ══ TABS ════════════════════════════════════════════════════════════ */}
      <nav className="pb-tabs" role="tablist">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            aria-selected={activeTab === id}
            className={`pb-tabs__btn${activeTab === id ? ' pb-tabs__btn--active' : ''}`}
            onClick={() => setSearchParams({ tab: id })}
          >
            {/* <Icon size={14} strokeWidth={2} /> */}
            {label}
          </button>
        ))}
      </nav>

      {/* ══ BACKLOG ══════════════════════════════════════════════════════════ */}
      {activeTab === 'Backlog' && (
        <div className="pb-backlog">

          {/* Toolbar */}
          <div className="pb-toolbar">
            {/* Search */}
            <label className="pb-search">
              <Search size={14} className="pb-search__icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search issues…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pb-search__input"
              />
            </label>

            {/* Priority pills */}
            <div className="pb-pills" role="group" aria-label="Priority filter">
              {PRIORITY_FILTERS.map((p) => (
                <button
                  key={p}
                  className={`pb-pill${priorityFilter === p ? ' pb-pill--active' : ''}`}
                  onClick={() => setPriorityFilter(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            <button className="pb-btn pb-btn--primary" onClick={openCreate}>
              <Plus size={14} />
              Create Issue
            </button>
          </div>

          {/* Stats */}
          <div className="pb-stats">
            {stats.map((s) => (
              <div key={s.label} className={`pb-stat pb-stat--${s.color}`}>
                <span className="pb-stat__value">{s.value}</span>
                <span className="pb-stat__label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Backlog group */}
          <ExpandableTaskList
            title={`${currentProjectSprintName || 'Default'} Backlog`}
            tasks={filteredTasks}
            isCollapsed={collapsed['Default Backlog']}
            onToggle={() => toggleGroup('Default Backlog')}
            onTaskClick={(task) => navigate(`/tickets/${task.ticketId}`)}
            onAddClick={openCreate}
            bugCount={bugCount}
          />
        </div>
      )}

      {/* ══ SPRINT BOARD ════════════════════════════════════════════════════ */}
      {activeTab === 'Sprint Board' && (
        <div className="pb-sprint">
          <KanbanBoard
            columns={kanbanColumns}
            onTaskClick={(task) => navigate(`/tickets/${task.ticketId}`)}
            onAddTask={openCreate}
            onTaskMove={handleTaskMove}
          />
        </div>
      )}

      {/* ══ ANALYTICS ════════════════════════════════════════════════════════ */}
      {activeTab === 'Analytics' && (
        <div className="pb-analytics-placeholder">
          <div className="pb-analytics-placeholder__icon">
            <BarChart3 size={36} />
          </div>
          <h3 className="pb-analytics-placeholder__title">Sprint Analytics</h3>
          <p className="pb-analytics-placeholder__body">
            Powerful insights are coming soon — velocity charts, burndown diagrams,
            and member performance metrics.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectBoardPage;