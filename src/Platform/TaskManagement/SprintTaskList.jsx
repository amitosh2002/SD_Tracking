import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutList,
  LayoutGrid,
  Calendar as CalendarIcon,
  Plus,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  Filter,
  X,
  Zap
} from 'lucide-react';
import './styles/SprintTaskList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentProjectSprintWorkActions } from '../../Redux/Actions/TicketActions/ticketAction';
import { CustomDropDownV3 } from '../../customFiles/customComponent/DropDown';
import { getAllProjects } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import FilterDropdown from '../WorksTicket/Components/FilterDropdown';
import { OPEN_CREATE_TICKET_POPUP } from '../../Redux/Constants/ticketReducerConstants';
import { useNavigate } from 'react-router-dom';

const SprintTaskList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // const [viewMode, setViewMode] = useState('list'); // list, kanban, calendar
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [projectId, setProjectId] = useState('');
  const navigate = useNavigate();
  // Filter state
  const [activeFilters, setActiveFilters] = useState({
    assignee: [],
    status: [],
    label: [],
    priority: []
  });

  const dispatch = useDispatch();

  const { 
    currentProjectSprintWork, 
    currentProjectSprintName,
    totalSprintStoryPoints,
    sprintFilters,
    loading 
  } = useSelector((state) => state.worksTicket);
  
  const projects = useSelector((state) => state.projects.projects);

  // Fetch projects only once on component mount
  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  // Set default projectId when projects are loaded
  useEffect(() => {
    if (projects.length > 0 && !projectId) {
      setProjectId(projects[0].projectId);
    }
  }, [projects, projectId]);

  const projectData = useMemo(() => {
    return projects.map((project) => ({
      label: project.projectName,
      value: project.projectId
    }));
  }, [projects]);

  // Fetch sprint work when projectId changes
  useEffect(() => {
    if (projectId) {
      dispatch(getCurrentProjectSprintWorkActions(projectId));
    }
  }, [projectId, dispatch]);

  // Reset filters when project changes
  useEffect(() => {
    setActiveFilters({
      assignee: [],
      status: [],
      label: [],
      priority: []
    });
  }, [projectId]);

  // Transform API data to match component structure
  const transformedTasks = useMemo(() => {
    return (currentProjectSprintWork || []).map(ticket => {
      // Extract initials from assignee name
      const getInitials = (name) => {
        if (!name || name === 'Unassigned') return 'UN';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      };

      // Map status from API to display status
      const mapStatus = (apiStatus) => {
        const statusMap = {
          'BACKLOG': 'To Do',
          'TODO': 'To Do',
          'OPEN': 'To Do',
          'IN_PROGRESS': 'In Progress',
          'INPROGRESS': 'In Progress',
          'IN_REVIEW': 'In Review',
          'REVIEW': 'In Review',
          'DONE': 'Done',
          'COMPLETED': 'Done'
        };
        return statusMap[apiStatus] || 'To Do';
      };

      // Handle priority - can be array or string
      const getPriority = (priority) => {
        if (Array.isArray(priority)) {
          return priority.length > 0 ? priority[0] : 'Medium';
        }
        return priority || 'Medium';
      };

      return {
        id: ticket.ticketKey,
        name: ticket.title,
        assignee: {
          name: ticket.assignee || 'Unassigned',
          avatar: null,
          initials: getInitials(ticket.assignee),
          _id: ticket.assigneeId // Assuming you might have this or can use name
        },
        project: ticket.projectId || 'Unknown Project',
        tags: Array.isArray(ticket.labels) ? ticket.labels : (ticket.labels ? [ticket.labels] : []),
        deadline: ticket.eta || "",
        priority: getPriority(ticket.priority),
        status: mapStatus(ticket.status),
        rawStatus: ticket.status,
        storyPoint: ticket.storyPoint || 0,
        labels: Array.isArray(ticket.labels) ? ticket.labels : (ticket.labels ? [ticket.labels] : []),
        _rawData: ticket,
        ticketId: ticket._id
      };
    });
  }, [currentProjectSprintWork]);

  // Apply Filtering and Sorting
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...transformedTasks];

    // 1. Filter by search term
    if (searchTerm) {
      result = result.filter(task => 
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filter by dropdowns
    if (activeFilters.assignee.length > 0) {
      // Need to handle if assignee is stored as ID or Name
      result = result.filter(task => activeFilters.assignee.includes(task.assignee.name) || activeFilters.assignee.includes(task.assignee._id));
    }
    
    if (activeFilters.status.length > 0) {
      result = result.filter(task => activeFilters.status.includes(task.rawStatus) || activeFilters.status.includes(task.status));
    }
    
    if (activeFilters.label.length > 0) {
      result = result.filter(task => task.labels.some(l => activeFilters.label.includes(l)));
    }
    
    if (activeFilters.priority.length > 0) {
      result = result.filter(task => activeFilters.priority.includes(task.priority));
    }

if (sortConfig.key) {
  result.sort((a, b) => {
    let valA, valB;

    switch (sortConfig.key) {
      case 'id':
        valA = a.id;
        valB = b.id;
        break;

      case 'name':
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
        break;

      case 'assignee':
        valA = (a.assignee?.name || '').toLowerCase();
        valB = (b.assignee?.name || '').toLowerCase();
        break;

      case 'storyPoint':
        valA = a.storyPoint;
        valB = b.storyPoint;
        break;

      case 'deadline':
        valA = a.deadline ? new Date(a.deadline).getTime() : 0;
        valB = b.deadline ? new Date(b.deadline).getTime() : 0;
        break;

      case 'priority': {
        const priorityWeight = { High: 3, Medium: 2, Low: 1 };
        valA = priorityWeight[a.priority] || 0;
        valB = priorityWeight[b.priority] || 0;
        break;
      }

      default:
        return 0;
    }

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

    return result;
  }, [transformedTasks, searchTerm, activeFilters, sortConfig]);

  // Group tasks by status
  // const groupedTasks = useMemo(() => {
  //   return filteredAndSortedTasks.reduce((acc, task) => {
  //     const status = task.status;
  //     if (!acc[status]) acc[status] = [];
  //     acc[status].push(task);
  //     return acc;
  //   }, {});
  // }, [filteredAndSortedTasks]);

  const groupedTasks = useMemo(() => {
  const groups = {};

  filteredAndSortedTasks.forEach(task => {
    if (!groups[task.status]) groups[task.status] = [];
    groups[task.status].push(task);
  });

  return groups;
}, [filteredAndSortedTasks]);

  const statusGroups = [
    { key: 'To Do', label: 'To Do', color: '#6b7280', count: groupedTasks['To Do']?.length || 0 },
    { key: 'In Progress', label: 'In Progress', color: '#f59e0b', count: groupedTasks['In Progress']?.length || 0 },
    { key: 'In Review', label: 'In Review', color: '#8b5cf6', count: groupedTasks['In Review']?.length || 0 },
    { key: 'Done', label: 'Done', color: '#10b981', count: groupedTasks['Done']?.length || 0 }
  ];

  const toggleGroup = (groupKey) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority.toLowerCase()}`;
  };

  const getAvatarColor = (initials) => {
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899'];
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const clearFilters = () => {
    setActiveFilters({
      assignee: [],
      status: [],
      label: [],
      priority: []
    });
    setSearchTerm('');
  };

  const hasActiveFilters = useMemo(() => {
    return searchTerm || 
           activeFilters.assignee.length > 0 || 
           activeFilters.status.length > 0 || 
           activeFilters.label.length > 0 || 
           activeFilters.priority.length > 0;
  }, [searchTerm, activeFilters]);

  // Show loading state
  if (loading) {
    return (
      <div className="sprint-task-list">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading sprint tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sprint-task-list">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__left">
          <div className="page-header__title-row">
            <Zap className="page-header__icon" size={24} />
            <h1 className="page-header__title">Active Sprint</h1>
          </div>
          <p className="page-header__description">
            Monitor and manage your current sprint tasks. Track progress, story points, and collaborator assignments in real-time.
          </p>
        </div>
        <div className="page-header__right">
          <button 
            className="primary-cta-btn"
            onClick={() => dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: true })}
          >
            <Plus size={18} />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Sprint Info Banner */}
      {currentProjectSprintName && (
        <div className="sprint-info-highlight">
          <div className="sprint-info-highlight__item">
            <CalendarIcon size={16} className="icon" />
            <div className="details">
              <span className="label">Current Sprint</span>
              <span className="value">{currentProjectSprintName}</span>
            </div>
          </div>
          <div className="sprint-info-highlight__divider" />
          <div className="sprint-info-highlight__item">
            <LayoutList size={16} className="icon" />
            <div className="details">
              <span className="label">Total Story Points</span>
              <span className="value">{totalSprintStoryPoints}</span>
            </div>
          </div>
          <div className="sprint-info-highlight__divider" />
          <div className="sprint-info-highlight__item">
            <Filter size={16} className="icon" />
            <div className="details">
              <span className="label">Task Count</span>
              <span className="value">{transformedTasks.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header Toolbar */}
      <div className="task-toolbar">
        <div className="task-toolbar__left">
          {/* Search */}
          <div className="task-search">
            <Search size={18} className="task-search__icon" />
            <input
              type="text"
              className="task-search__input"
              placeholder="Search Task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="task-filters">
            <FilterDropdown 
              label="Assignee" 
              options={sprintFilters.assignee} 
              value={activeFilters.assignee}
              onChange={(val) => setActiveFilters(prev => ({ ...prev, assignee: val }))}
              allowMultipleSelect={true}
              avatar={true}
            />
            <FilterDropdown 
              label="Status" 
              options={sprintFilters.status} 
              value={activeFilters.status}
              onChange={(val) => setActiveFilters(prev => ({ ...prev, status: val }))}
              allowMultipleSelect={true}
            />
            <FilterDropdown 
              label="Label" 
              options={sprintFilters.label} 
              value={activeFilters.label}
              onChange={(val) => setActiveFilters(prev => ({ ...prev, label: val }))}
              allowMultipleSelect={true}
            />
            <FilterDropdown 
              label="Priority" 
              options={sprintFilters.priority} 
              value={activeFilters.priority}
              onChange={(val) => setActiveFilters(prev => ({ ...prev, priority: val }))}
              allowMultipleSelect={true}
            />
            
            {hasActiveFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                <X size={14} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        <div className="task-toolbar__right">
          {/* View Toggle */}
          {/* <div className="view-toggle">
            <button
              className={`view-toggle__btn ${viewMode === 'list' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <LayoutList size={18} />
              <span>List</span>
            </button>
            <button
              className={`view-toggle__btn ${viewMode === 'kanban' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid size={18} />
              <span>Kanban</span>
            </button>
          </div> */}

          <CustomDropDownV3 
            options={projectData}
            onChange={(value) => setProjectId(value)}
            placeholder="Select Project"
            value={projectId}
            searchable={true}
          />
        </div>
      </div>

      {/* Task Groups */}
      <div className="task-groups">
        {statusGroups.map((group) => {
          const tasks = groupedTasks[group.key] || [];
          const isCollapsed = collapsedGroups[group.key];

          return (
            <div key={group.key} className="task-group">
              {/* Group Header */}
              <div className="task-group__header" onClick={() => toggleGroup(group.key)}>
                <div className="task-group__title">
                  <div
                    className="task-group__indicator"
                    style={{ backgroundColor: group.color }}
                  />
                  <span className="task-group__label">{group.label}</span>
                  <span className="task-group__count">{group.count}</span>
                  <button className="task-group__toggle">
                    {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </button>
                </div>
              </div>

              {/* Table */}
              {!isCollapsed && tasks.length > 0 && (
                <div className="task-table">
                  {/* Table Header */}
                  <div className="task-table__header">
                    <div className="task-table__col task-table__col--id">
                      <span>Task ID</span>
                      <button onClick={() => handleSort('id')} className={sortConfig.key === 'id' ? 'active-sort' : ''}>
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                    <div className="task-table__col task-table__col--name">
                      <span>Task Name</span>
                      <button onClick={() => handleSort('name')} className={sortConfig.key === 'name' ? 'active-sort' : ''}>
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                    <div className="task-table__col task-table__col--assignee">
                      <span>Assignee</span>
                      <button onClick={() => handleSort('assignee')} className={sortConfig.key === 'assignee' ? 'active-sort' : ''}>
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                    <div className="task-table__col task-table__col--project">
                      <span>Story Points</span>
                      <button onClick={() => handleSort('project')} className={sortConfig.key === 'project' ? 'active-sort' : ''}>
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                    <div className="task-table__col task-table__col--progress">
                      <span>Labels</span>
                    </div>
                    <div className="task-table__col task-table__col--deadline">
                      <span>Deadline</span>
                      <button onClick={() => handleSort('deadline')} className={sortConfig.key === 'deadline' ? 'active-sort' : ''}>
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                    <div className="task-table__col task-table__col--priority">
                      <span>Priority</span>
                      <button onClick={() => handleSort('priority')} className={sortConfig.key === 'priority' ? 'active-sort' : ''}>
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                    <div className="task-table__col task-table__col--action">
                      <span>Action</span>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="task-table__body">
                    {tasks.map((task) => (
                      <div key={task.id} className="task-row" onClick={()=>navigate(`/tickets/${task.ticketId}`)}>
                        <div className="task-row__col task-row__col--id">
                          {task.id}
                        </div>
                        <div className="task-row__col task-row__col--name">
                          {task.name}
                        </div>
                        <div className="task-row__col task-row__col--assignee">
                          <div className="assignee">
                            <div
                              className="assignee__avatar"
                              style={{ backgroundColor: getAvatarColor(task.assignee.initials) }}
                            >
                              {task.assignee.initials}
                            </div>
                            <span className="assignee__name">{task.assignee.name}</span>
                          </div>
                        </div>
                        <div className="task-row__col task-row__col--project story_point_text">
                          {task.storyPoint}
                        </div>
                        <div className="task-row__col task-row__col--progress labels-container">
                          {task.labels && task.labels.length > 0 ? (
                            task.labels.map((label, idx) => (
                              <span key={idx} className="label-tag">{label}</span>
                            ))
                          ) : (
                            <span className="no-labels">-</span>
                          )}
                        </div>
                        <div className="task-row__col task-row__col--deadline">
                          {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : '-'}
                        </div>
                        <div className="task-row__col task-row__col--priority">
                          <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="task-row__col task-row__col--action">
                          <button className="action-menu-btn">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!isCollapsed && tasks.length === 0 && (
                <div className="empty-group-state">
                  No tasks found matching your filters.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SprintTaskList;