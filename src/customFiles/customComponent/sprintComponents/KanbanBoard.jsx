import React from 'react';
import { MoreHorizontal, Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import './KanbanBoard.scss';

// Utility for avatar colors
const getAvatarColor = (initials) => {
  if (!initials) return '#e8e8eeff';
  const colors = ['#e8e8eeff', '#10b981', '#f59e0b', '#ef4444', '#efecf6ff', '#3b82f6', '#ec4899'];
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Utility for priority colors
const getPriorityColor = (priority) => {
  const p = (priority || "").toLowerCase();
  if (p === 'high' || p === 'critical') return '#ef4444';
  if (p === 'medium') return '#f59e0b';
  if (p === 'low') return '#6366f1';
  return '#a1a1aa';
};

const KanbanCard = ({ task, onTaskClick }) => {
  const {
    id,
    title,
    name,
    priority,
    labels = [],
    tags = [],
    storyPoint,
    deadline,
    dueDate,
    progress,
    assignee,
    fullAssignee,
    priorityColor
  } = task;

  const displayTags = (labels && labels.length > 0) ? labels : (tags || []);
  const displayDate = deadline || dueDate;
  const initials = assignee?.initials || (assignee?.name ? assignee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'UN');
  const assigneeName = fullAssignee || assignee?.name || 'Unassigned';

  return (
    <div className="kanban-card" onClick={() => onTaskClick?.(task)}>
      <div className="kanban-card__header">
        <Clock size={12} />
        <span className="kanban-card__id">{id}</span>
        {displayDate && (
          <span className="kanban-card__date">
            {new Date(displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
      
      <h4 className="kanban-card__title">
        <span 
          className="kanban-card__priority-dot" 
          style={{ backgroundColor: priorityColor || getPriorityColor(priority) }} 
        />
        {title || name}
      </h4>
      
      {displayTags.length > 0 && (
        <div className="kanban-card__tags">
          {displayTags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="kanban-card__tag" style={tag.color ? { borderLeft: `3px solid ${tag.color}`, paddingLeft: '6px' } : {}}>
              {typeof tag === 'object' ? tag.name : tag}
            </span>
          ))}
        </div>
      )}

      {progress !== undefined && progress > 0 && (
        <div className="kanban-card__progress">
          <div className="progress-label">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      <div className="kanban-card__footer">
        <div className="kanban-card__assignee">
          <div 
            className="avatar" 
            style={{ backgroundColor: getAvatarColor(initials) }}
            title={assigneeName}
          >
            {assignee?.image ? (
              <img src={assignee.image} alt={initials} />
            ) : (
              initials
            )}
          </div>
          <span className="assignee-name">{assigneeName}</span>
        </div>
        
        <div className="kanban-card__meta">
          {storyPoint !== undefined && (
            <div className="kanban-card__meta-item kanban-card__meta-item--points">
              {storyPoint} pts
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const KanbanBoard = ({ columns, onTaskClick, onAddTask }) => {
  return (
    <div className="kanban-board-container">
      {columns.map((column) => (
        <div key={column.id || column.key} className="kanban-column">
          <div className="kanban-column__header">
            <div className="kanban-column__title-area">
              <span className="kanban-column__dot" style={{ backgroundColor: column.color }} />
              <span className="kanban-column__count">{column.count ?? column.tasks?.length ?? 0}</span>
              <span className="kanban-column__name">{column.name || column.label || column.title}</span>
            </div>
            <button className="icon-btn">
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="kanban-column__body">
            {column.tasks && column.tasks.length > 0 ? (
              column.tasks.map((task) => (
                <KanbanCard 
                  key={task.id} 
                  task={task} 
                  onTaskClick={onTaskClick} 
                />
              ))
            ) : (
              <div className="kanban-empty">No tasks</div>
            )}
          </div>

          {onAddTask && (
            <div className="kanban-column__footer">
              <button 
                className="add-task-btn" 
                onClick={() => onAddTask(column)}
              >
                <Plus size={14} />
                <span>Add Task</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
