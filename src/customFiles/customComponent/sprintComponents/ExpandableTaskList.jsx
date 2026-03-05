import React from 'react';
import { ChevronRight, Plus, GripVertical } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './ExpandableTaskList.scss';

const AVATAR_COLORS = ['#3B5BDB', '#0C8599', '#7048E8', '#2F9E44', '#E67700', '#E03131'];
const getAvatarColor = (name) =>
  name === 'Unassigned'
    ? '#868E96'
    : AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length];

const SortableRow = ({ task, onTaskClick }) => {
  const taskId = String(task.id || task._id);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskId,
    data: { type: 'Task', task: { ...task, id: taskId } },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 1,
    position: isDragging ? 'relative' : 'static',
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`pb-table__row ${isDragging ? 'is-dragging' : ''}`}
      onClick={() => onTaskClick?.(task)}
    >
      <td className="pb-table__col-drag">
        <div 
          className="pb-drag-handle-container"
          {...attributes} 
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          style={{ cursor: 'grab', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <GripVertical size={14} className="pb-drag-handle" color="#94a3b8" />
        </div>
      </td>
      <td className="pb-table__col-id">
        <span className="pb-ticket-id">
          {task.ticketKey?.split("-")[0] + "-" + (task.ticketKey?.split("-")[1] || task._id?.slice(-4))}
        </span>
      </td>

      <td className="pb-table__col-title">
        <span className="pb-task-title">{task.title || task.name}</span>
      </td>

      <td className="pb-table__col-labels pb-hide-md">
        <div className="pb-tag-list">
          {(task.labels || []).slice(0, 3).map((l, i) => (
            <span key={i} className="pb-tag">{typeof l === 'object' ? l.name : l}</span>
          ))}
        </div>
      </td>

      <td className="pb-table__col-priority pb-hide-md">
        <span className={`pb-priority-badge pb-priority-badge--${(task.priority || "").toLowerCase()}`}>
          {task.priority || 'Medium'}
        </span>
      </td>

      <td className="pb-table__col-status pb-hide-sm">
        <span className={`pb-status-badge pb-status-badge--${(task.status || "To Do").toLowerCase().replace(/\s+/g, '')}`}>
          {task.status || "To Do"}
        </span>
      </td>

      <td className="pb-table__col-pts">
        <span className="pb-pts-chip">{task.storyPoint || task.pts || 0}</span>
      </td>

      <td className="pb-table__col-who pb-hide-sm">
        <div
          className="pb-avatar"
          title={task.assignee?.name || 'Unassigned'}
          style={{
            background: task.assignee?.image
              ? 'transparent'
              : getAvatarColor(task.assignee?.name || 'Unassigned'),
          }}
        >
          {task.assignee?.image ? (
            <img src={task.assignee.image} alt={task.assignee.initials || 'Avatar'} />
          ) : (
            task.assignee?.initials || 'UN'
          )}
        </div>
      </td>
    </tr>
  );
};

const ExpandableTaskList = ({
  id,
  title,
  tasks = [],
  isCollapsed,
  onToggle,
  onTaskClick,
  onAddClick,
  bugCount = 0
}) => {
  const containerId = String(id || title);
  const { setNodeRef } = useDroppable({
    id: containerId,
    data: { type: 'Container', id: containerId, title },
  });

  const storyPoints = tasks.reduce((a, t) => {
    const pts = Number(t.storyPoint || t.pts) || 0;
    return a + pts;
  }, 0);

  return (
    <div ref={setNodeRef} className="pb-group">
      <button
        className="pb-group__header"
        onClick={(e) => {
          e.preventDefault();
          onToggle?.();
        }}
        aria-expanded={!isCollapsed}
      >
        <span
          className="pb-group__chevron"
          style={{
            transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
            transition: 'transform 0.2s ease'
          }}
        >
          <ChevronRight size={15} />
        </span>

        <span className="pb-group__name">{title}</span>

        <span className="pb-group__meta">
          {tasks.length} issues · {storyPoints} pts
        </span>

        {bugCount > 0 && (
          <span className="pb-group__bug-pill">
            {bugCount} bug{bugCount > 1 ? 's' : ''}
          </span>
        )}
      </button>

      {!isCollapsed && (
        <div className="pb-table-scroll">
          <table className="pb-table">
            <thead>
              <tr>
                <th className="pb-table__col-drag" style={{ width: '40px' }}></th>
                <th className="pb-table__col-id">ID</th>
                <th className="pb-table__col-title">Title</th>
                <th className="pb-table__col-labels pb-hide-md">Labels</th>
                <th className="pb-table__col-priority pb-hide-md">Priority</th>
                <th className="pb-table__col-status pb-hide-sm">Status</th>
                <th className="pb-table__col-pts">Pts</th>
                <th className="pb-table__col-who pb-hide-sm">Who</th>
              </tr>
            </thead>

            <tbody>
              <SortableContext
                items={tasks.map(t => String(t.id || t._id))}
                strategy={verticalListSortingStrategy}
              >
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <SortableRow
                      key={task.id || task._id}
                      task={task}
                      onTaskClick={onTaskClick}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="pb-table__empty">
                      No issues found
                    </td>
                  </tr>
                )}
              </SortableContext>

              {onAddClick && (
                <tr className="pb-table__add-row" onClick={(e) => {
                   e.stopPropagation();
                   onAddClick();
                }}>
                  <td colSpan={8}>
                    <span className="pb-table__add-inner">
                      <Plus size={13} />
                      Create issue
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpandableTaskList;

