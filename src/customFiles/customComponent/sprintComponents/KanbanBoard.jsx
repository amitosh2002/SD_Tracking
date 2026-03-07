import React, { useState, useRef, useCallback } from 'react';
import { MoreHorizontal, Plus, Clock, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import './KanbanBoard.scss';

// ─── Utilities ────────────────────────────────────────────────────────────────
const getAvatarColor = (initials) => {
  if (!initials) return '#e8e8eeff';
  const colors = ['#e8e8eeff', '#10b981', '#f59e0b', '#ef4444', '#efecf6ff', '#3b82f6', '#ec4899'];
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getPriorityColor = (priority) => {
  const p = (priority || '').toLowerCase();
  if (p === 'high' || p === 'critical') return '#ef4444';
  if (p === 'medium') return '#f59e0b';
  if (p === 'low') return '#6366f1';
  return '#a1a1aa';
};

// Normalise tasks so they always have a string `id` (fix #5 — _id fallback)
const normaliseTask = (task) => ({
  ...task,
  id: task.id?.toString() || task._id?.toString() || String(Math.random()),
});

// ─── KanbanCard ───────────────────────────────────────────────────────────────
const KanbanCard = ({ task, onTaskClick, isOverlay }) => {
  const {
    id,
    ticketKey,
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
    priorityColor,
  } = task;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { type: 'Task', task },
    disabled: isOverlay,
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
  };

  const displayTags = labels?.length > 0 ? labels : (tags || []);
  const displayDate = deadline || dueDate;
  const initials =
    assignee?.initials ||
    (assignee?.name
      ? assignee.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : 'UN');
  const assigneeName = fullAssignee || assignee?.name || 'Unassigned';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card ${isOverlay ? 'is-overlay' : ''}`}
      onClick={() => onTaskClick?.(task)}
      {...attributes}
      {...listeners}
    >
      <div className="kanban-card__drag-handle">
        <GripVertical size={14} />
      </div>
      <div className="kanban-card__header">
        <Clock size={12} />
        <span className="kanban-card__id">{ticketKey ?? id}</span>
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
            <span
              key={idx}
              className="kanban-card__tag"
              style={tag.color ? { borderLeft: `3px solid ${tag.color}`, paddingLeft: '6px' } : {}}
            >
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
            <div className="progress-fill" style={{ width: `${progress}%` }} />
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

// ─── KanbanColumn ─────────────────────────────────────────────────────────────
const KanbanColumn = ({ column, children, onAddTask }) => {
  const { setNodeRef } = useDroppable({
    id: column.id || column.key,
    data: { type: 'Column', column },
  });

  return (
    <div ref={setNodeRef} className="kanban-column">
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

      <div className="kanban-column__body">{children}</div>

      {onAddTask && (
        <div className="kanban-column__footer">
          <button className="add-task-btn" onClick={() => onAddTask(column)}>
            <Plus size={14} />
            <span>Add Task</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Measuring config: prevents DND Kit infinite layout loop (#6) ─────────────
const measuringConfig = {
  droppable: { strategy: MeasuringStrategy.Always },
};

// ─── KanbanBoard ──────────────────────────────────────────────────────────────
const KanbanBoard = ({ columns, onTaskClick, onAddTask, onTaskMove }) => {
  // Normalise so every task has a guaranteed string `id` (#5)
  const normalise = useCallback(
    (cols) =>
      (cols || []).map((col) => ({
        ...col,
        tasks: (col.tasks || []).map(normaliseTask),
      })),
    []
  );

  const [activeTask, setActiveTask]               = useState(null);
  const [internalColumns, setInternalColumns]     = useState(() => normalise(columns));
  const [statusSelectionModal, setStatusSelectionModal] = useState(null);

  // Stable ref so we can compare without triggering re-renders (#1)
  const prevColumnsRef = useRef(columns);

  // Sync internal state only when columns *actually* change by comparing JSON (#1)
  React.useEffect(() => {
    const prev = JSON.stringify(prevColumnsRef.current);
    const next = JSON.stringify(columns);
    if (prev !== next) {
      prevColumnsRef.current = columns;
      setInternalColumns(normalise(columns));
    }
  }, [columns, normalise]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Find which column ID contains a given draggable ID (#4 — _id fallback)
  const findContainer = useCallback(
    (id) => {
      // If the ID itself matches a column key, it's a column-level drop
      if (internalColumns.find((col) => (col.id || col.key) === id)) return id;

      const column = internalColumns.find((col) =>
        col.tasks?.find(
          (task) => task.id === id || task._id?.toString() === id
        )
      );
      return column ? (column.id || column.key) : null;
    },
    [internalColumns]
  );

  // handleDragStart — just capture the active task for the overlay (#10)
  const handleDragStart = useCallback((event) => {
    const task = event.active.data.current?.task;
    if (task) setActiveTask(task);
  }, []);

  // handleDragOver — EMPTY, no setState (#2 — prevents maximum update depth)
  const handleDragOver = useCallback(() => {}, []);

  // handleDragEnd — ALL cross-column logic lives here (#3, #7, #8, #9, #10)
  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      // #10 Always reset activeTask
      setActiveTask(null);

      // #7 Guard: over must exist
      if (!over) return;

      const activeId = String(active.id);
      const overId   = String(over.id);

      const activeContainer = findContainer(activeId);
      const overContainer   = findContainer(overId);

      // #8 Guard: both containers must resolve
      if (!activeContainer || !overContainer) return;

      // ── Same-column: reorder only, never call onTaskMove
      if (activeContainer === overContainer) {
        if (activeId !== overId) {
          setInternalColumns((prev) => {
            const column   = prev.find((c) => (c.id || c.key) === activeContainer);
            const oldIndex = column.tasks.findIndex((t) => t.id === activeId);
            const newIndex = column.tasks.findIndex((t) => t.id === overId);
            return prev.map((c) =>
              (c.id || c.key) === activeContainer
                ? { ...c, tasks: arrayMove(column.tasks, oldIndex, newIndex) }
                : c
            );
          });
        }
        return;
      }

      // ── Cross-column drop (#9 — API fires ONLY here) ──────────────────────
      const sourceCol = internalColumns.find((c) => (c.id || c.key) === activeContainer);
      const destCol   = internalColumns.find((c) => (c.id || c.key) === overContainer);

      if (!sourceCol || !destCol) return;

      // Optimistically move the task in local state for instant feedback (#3)
      setInternalColumns((prev) => {
        const src  = prev.find((c) => (c.id || c.key) === activeContainer);
        const dest = prev.find((c) => (c.id || c.key) === overContainer);
        if (!src || !dest) return prev;

        const taskToMove    = src.tasks.find((t) => t.id === activeId);
        const newSrcTasks   = src.tasks.filter((t)  => t.id !== activeId);
        const isOverColumn  = prev.some((c) => (c.id || c.key) === overId);
        let newDestTasks    = [...dest.tasks];

        if (isOverColumn) {
          newDestTasks.push(taskToMove);
        } else {
          const overIndex = dest.tasks.findIndex((t) => t.id === overId);
          newDestTasks.splice(overIndex >= 0 ? overIndex : newDestTasks.length, 0, taskToMove);
        }

        return prev.map((c) => {
          if ((c.id || c.key) === activeContainer) return { ...c, tasks: newSrcTasks };
          if ((c.id || c.key) === overContainer)   return { ...c, tasks: newDestTasks };
          return c;
        });
      });

      // Multi-status column → show picker popup
      if (destCol.statusKeys && destCol.statusKeys.length > 1) {
        setStatusSelectionModal({
          taskId: activeId,
          sourceColumnId: activeContainer,
          destinationColumnId: overContainer,
          overId,
          statusKeys: destCol.statusKeys,
          active,
          over,
        });
      } else {
        // Single status → call onTaskMove immediately
        onTaskMove?.({
          taskId: activeId,
          sourceColumnId: activeContainer,
          destinationColumnId: overContainer,
          overId,
          active,
          over,
          selectedStatus: destCol?.statusKeys?.[0] || destCol?.name || overContainer,
        });
      }
    },
    [findContainer, internalColumns, onTaskMove]
  );

  const handleStatusSelect = useCallback(
    (status) => {
      if (statusSelectionModal) {
        onTaskMove?.({ ...statusSelectionModal, selectedStatus: status });
        setStatusSelectionModal(null);
      }
    },
    [statusSelectionModal, onTaskMove]
  );

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } },
    }),
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        measuring={measuringConfig}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board-container">
          {internalColumns.map((column) => (
            <KanbanColumn
              key={column.id || column.key}
              column={column}
              onAddTask={onAddTask}
            >
              <SortableContext
                items={column.tasks?.map((t) => t.id) || []}
                strategy={verticalListSortingStrategy}
              >
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
              </SortableContext>
            </KanbanColumn>
          ))}
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

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
    </>
  );
};

export default KanbanBoard;
