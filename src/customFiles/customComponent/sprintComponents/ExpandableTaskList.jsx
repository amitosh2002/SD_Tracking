import React from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import './ExpandableTaskList.scss';

const AVATAR_COLORS = ['#3B5BDB', '#0C8599', '#7048E8', '#2F9E44', '#E67700', '#E03131'];
const getAvatarColor = (name) =>
  name === 'Unassigned'
    ? '#868E96'
    : AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length];

const ExpandableTaskList = ({ 
  title, 
  tasks = [], 
  isCollapsed, 
  onToggle, 
  onTaskClick, 
  onAddClick,
  bugCount = 0
}) => {
  const storyPoints = tasks.reduce((a, t) => a + (t.storyPoint || t.pts || 0), 0);

  return (
    <div className="pb-group">
      {/* Group header */}
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

      {/* Table */}
      {!isCollapsed && (
        <div className="pb-table-scroll">
          <table className="pb-table">
            <thead>
              <tr>
                <th className="pb-table__col-check">
                  <input type="checkbox" aria-label="Select all" />
                </th>
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
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="pb-table__row"
                    onClick={() => onTaskClick?.(task)}
                  >
                    <td className="pb-table__col-check" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" />
                    </td>

                    <td className="pb-table__col-id">
                      <span className="pb-ticket-id">{task.ticketKey.split("-")[0]+"-"+task.ticketKey.split("-")[1]}</span>
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
                        {task.priority}
                       </span>
                     </td>
 
                     <td className="pb-table__col-status pb-hide-sm">
                       <span className={`pb-status-badge pb-status-badge--${(task.status || "").toLowerCase().replace(/\s+/g, '')}`}>
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
                ))
              ) : (
                <tr>
                   <td colSpan={8} className="pb-table__empty">
                     No issues found
                   </td>
                </tr>
              )}

              {onAddClick && (
                 <tr className="pb-table__add-row" onClick={onAddClick}>
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
