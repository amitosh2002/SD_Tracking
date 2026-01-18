import { User } from 'lucide-react'; // Assuming you use lucide-react or similar for icons
import './TaskItem.scss';

const TaskItem = ({ task, isSelected, onClick }) => {
  // Helper to get initials (e.g., "John Doe" -> "JD")
  const getInitials = (name) => {
    if (!name || name === "Unassigned") return null;
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const isUnassigned = !task.assignee || task.assignee === "Unassigned";

  return (
    <div
      className={`task-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(task?._id)}
    >
      <div className="task-header">
        <h4>{task.ticketKey}</h4>
        <span className={`status-pill ${task.status?.toLowerCase().replace(/\s+/g, '-')}`}>
          {task.status}
        </span>
      </div>

      <p className="task-title">{task.title}</p>

      <div className="task-footer">
        <div className={`assignee-avatar ${isUnassigned ? 'unassigned' : ''}`}>
          {isUnassigned ? (
            <User size={14} />
          ) : (
            <span>{getInitials(task.assignee)}</span>
          )}
        </div>
        <span className="assignee-name">{task.assignee}</span>
      </div>
    </div>
  );
};

export default TaskItem;