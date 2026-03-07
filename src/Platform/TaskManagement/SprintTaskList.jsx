import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  LayoutList,
  LayoutGrid,
  Calendar as CalendarIcon,
  Plus,
  Filter,
  X,
  Zap
} from 'lucide-react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import './styles/SprintTaskList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentProjectSprintWorkActions, changeTicketStatus } from '../../Redux/Actions/TicketActions/ticketAction';
import { CustomDropDownV3 } from '../../customFiles/customComponent/DropDown';
import { getAllProjects } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import FilterDropdown from '../WorksTicket/Components/FilterDropdown';
import { OPEN_CREATE_TICKET_POPUP } from '../../Redux/Constants/ticketReducerConstants';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from '../../customFiles/customComponent/sprintComponents/KanbanBoard';
import ExpandableTaskList from '../../customFiles/customComponent/sprintComponents/ExpandableTaskList';


const SprintTaskList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // list, kanban
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [sortConfig] = useState({ key: null, direction: 'asc' });
  const [projectId, setProjectId] = useState('');
  const navigate = useNavigate();
  // Filter state
  const [activeFilters, setActiveFilters] = useState({
    assignee: [],
    status: [],
    label: [],
    priority: []
  });
  const [statusSelectionModal, setStatusSelectionModal] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const dispatch = useDispatch();

  const { 
    currentProjectSprintName,
    totalSprintStoryPoints,
    sprintColumns,
    sprintFilters,
    loading,
    projectBoard
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

  // Transform API data to match component structure by flattening kanban board
  const transformedTasks = useMemo(() => {
    if (!Array.isArray(projectBoard)) return [];
    
    return projectBoard.flatMap(col => {
      const colName = col.name || col.title || 'Unknown';
      
      return (col.tickets || col.tasks || []).map(ticket => {
        // Extract initials from assignee name
        const getInitials = (name) => {
          if (!name || name === 'Unassigned') return 'UN';
          return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        };
  
        // Handle priority - can be array, string, or object
        const getPriorityLabel = (ticket) => {
          if (ticket.priorityName && ticket.priorityName !== "Unknown") return ticket.priorityName;
          const p = ticket.priority;
          if (p && typeof p === 'object' && !Array.isArray(p)) return p.name || 'Medium';
          if (Array.isArray(p)) {
            const first = p[0];
            return (first && typeof first === 'object') ? first.name : (first || 'Medium');
          }
          return p || 'Medium';
        };
  
        // Handle labels - normalized to array of strings
        const getLabelsArray = (ticket) => {
          const l = ticket.labels || [];
          const labelList = Array.isArray(l) ? l : [l];
          return labelList.map(label => {
            if (label && typeof label === 'object') return label.name;
            return label;
          }).filter(Boolean);
        };
  
        return {
          id: ticket.id || ticket._id,
          ticketKey: ticket.ticketKey,
          name: ticket.title,
          assignee: {
            name: (ticket.assignee && typeof ticket.assignee === 'object' ? ticket.assignee.name : ticket.assignee) || 'Unassigned',
            avatar: (ticket.assignee && ticket.assignee.image) || ticket.assigneeImage || null,
            initials: getInitials((ticket.assignee && typeof ticket.assignee === 'object' ? ticket.assignee.name : ticket.assignee)),
            _id: (ticket.assignee && ticket.assignee._id) || ticket.assigneeId || null
          },
          project: ticket.projectId || 'Unknown Project',
          tags: getLabelsArray(ticket),
          deadline: ticket.eta || ticket.dueDate || "",
          priority: getPriorityLabel(ticket),
          status: colName, // Exact column name from backend array
          rawStatus: ticket.status,
          storyPoint: ticket.storyPoint || 0,
          labels: getLabelsArray(ticket),
          _rawData: ticket,
          ticketId: ticket.id || ticket._id
        };
      });
    });
  }, [projectBoard]);

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

  // Group tickets into board flow columns based on statusKeys with robust global deduplication
  const groupedTasks = useMemo(() => {
    const groups = {};
    
    if (sprintColumns && sprintColumns.length > 0) {
      sprintColumns.forEach(col => {
        groups[col.name] = [];
      });
      filteredAndSortedTasks.forEach(task => {
        if (groups[task.status]) {
           groups[task.status].push(task);
        } else {
           // Fallback if somehow mismatched
           let firstCol = sprintColumns[0].name;
           if (!groups[firstCol]) groups[firstCol] = [];
           groups[firstCol].push(task);
        }
      });
    } else {
      // Fallback
      filteredAndSortedTasks.forEach(task => {
        if (!groups[task.status]) groups[task.status] = [];
        groups[task.status].push(task);
      });
    }

    return groups;
  }, [filteredAndSortedTasks, sprintColumns]);


  const statusGroups = useMemo(() => {
    if (sprintColumns && sprintColumns.length > 0) {
      return sprintColumns.map(column => ({
        key: column.name,
        label: column.name,
        color: column.color || '#6366f1',
        count: (groupedTasks[column.name]) ? groupedTasks[column.name].length : 0
      }));
    }
    // Fallback if sprintColumns is not available
    const defaultKeys = ['To Do', 'In Progress', 'In Review', 'Done'];
    return defaultKeys.map(key => ({
      key,
      label: key,
      color: key === 'Done' ? '#10b981' : key === 'In Progress' ? '#f59e0b' : '#6b7280',
      count: groupedTasks[key]?.length || 0
    }));
  }, [sprintColumns, groupedTasks]);

  const toggleGroup = (groupKey) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const handleTaskMove = ({ destinationColumnId, active }) => {
    const taskData = active.data.current?.task;
    const realTicketId = taskData?.ticketId || taskData?._id;
    
    // Find destination column to get the status key
    let targetColumn = null;
    if (sprintColumns && sprintColumns.length > 0) {
      targetColumn = sprintColumns.find(col => col.name === destinationColumnId);
    }
    
    if (!realTicketId) return;

    // Use the first statusKey if available, otherwise fallback to destinationColumnId (which is column name)
    const newStatus = targetColumn?.statusKeys?.[0] || destinationColumnId;
    
    if (newStatus) {
      dispatch(changeTicketStatus(realTicketId, newStatus));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id) => {
    const sId = String(id);
    if (statusGroups.some(group => String(group.key) === sId)) return sId;
    const allT = Object.values(groupedTasks).flat();
    const task = allT.find(t => String(t.id || t._id) === sId);
    return task ? task.status : null;
  };

  const handleDragStart = (event) => {
    const task = event.active.data.current?.task;
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) return;

    const targetColumn = sprintColumns?.find(col => col.name === overContainer);
    
    if (targetColumn && targetColumn.statusKeys && targetColumn.statusKeys.length > 1) {
      setStatusSelectionModal({
        taskId: activeId,
        statusKeys: targetColumn.statusKeys,
        destinationColumnId: overContainer
      });
    } else {
      handleTaskMove({ destinationColumnId: overContainer, active });
    }
  };

  const handleStatusSelect = (status) => {
    if (statusSelectionModal) {
      dispatch(changeTicketStatus(statusSelectionModal.taskId, status));
      setStatusSelectionModal(null);
    }
  };

  const measuringConfig = {
    droppable: { strategy: MeasuringStrategy.Always },
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
          <div className="view-toggle">
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
          </div>

          <CustomDropDownV3 
            options={projectData}
            onChange={(value) => setProjectId(value)}
            placeholder="Select Project"
            value={projectId}
            searchable={true}
          />
        </div>
      </div>

      {/* Task Content */}
      {viewMode === 'list' ? (
        <div className="pb-backlog" style={{ padding: '0 0 32px' }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            measuring={measuringConfig}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {statusGroups.map((group) => (
              <ExpandableTaskList
                key={group.key}
                id={group.key}
                title={group.label}
                tasks={groupedTasks[group.key] || []}
                isCollapsed={collapsedGroups[group.key]}
                onToggle={() => toggleGroup(group.key)}
                onTaskClick={(task) => navigate(`/tickets/${task.ticketId}`)}
                bugCount={(groupedTasks[group.key] || []).filter(t => 
                  (t.labels || []).some(l => (typeof l === 'string' ? l : l.name).toLowerCase().includes('bug'))
                ).length}
              />
            ))}
            <DragOverlay>
              {activeTask ? (
                <table style={{ width: '100%', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <tbody>
                    <tr className="pb-table__row is-overlay">
                      <td className="pb-table__col-drag" style={{ width: '40px' }}></td>
                      <td className="pb-table__col-id" style={{ width: '100px' }}>{activeTask.ticketKey}</td>
                      <td className="pb-table__col-title">{activeTask.name || activeTask.title}</td>
                      <td className="pb-table__col-pts" style={{ width: '60px' }}>{activeTask.storyPoint}</td>
                      <td className="pb-table__col-status">{activeTask.status}</td>
                    </tr>
                  </tbody>
                </table>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      ) : (
        <KanbanBoard 
          columns={statusGroups.map(group => ({
            id: group.key,
            name: group.label,
            color: group.color,
            tasks: groupedTasks[group.key] || []
          }))}
          onTaskClick={(task) => navigate(`/tickets/${task.ticketId}`)}
          onAddTask={() => dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: true })}
          onTaskMove={handleTaskMove}
        />
      )}

      {statusSelectionModal && (
        <div className="status-selection-overlay" onClick={() => setStatusSelectionModal(null)}>
          <div className="status-selection-modal" onClick={(e) => e.stopPropagation()}>
            <div className="status-selection-modal__header">
              <h3>Select Target Status</h3>
              <p>This column supports multiple statuses. Please select one:</p>
            </div>
            <div className="status-selection-modal__options">
              {statusSelectionModal.statusKeys.map((status) => (
                <button
                  key={status}
                  className="status-option-btn"
                  onClick={() => handleStatusSelect(status)}
                >
                  <span className="status-dot" />
                  {status.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
            <div className="status-selection-modal__footer">
              <button className="cancel-btn" onClick={() => setStatusSelectionModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintTaskList;