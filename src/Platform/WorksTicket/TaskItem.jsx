// import { User } from 'lucide-react'; // Assuming you use lucide-react or similar for icons
// import './TaskItem.scss';

// const TaskItem = ({ task, isSelected, onClick }) => {
//   // Helper to get initials (e.g., "John Doe" -> "JD")
//   const getInitials = (name) => {
//     if (!name || name === "Unassigned") return null;
//     return name
//       .split(' ')
//       .map((n) => n[0])
//       .slice(0, 2)
//       .join('')
//       .toUpperCase();
//   };
// console.log(task,"task")
//   const isUnassigned = !task.assignee || task.assignee === "Unassigned";

//   return (
//     <div
//       className={`task-item ${isSelected ? 'selected' : ''}`}
//       onClick={() => onClick(task?._id)}
//     >
//       <div className="task-header">
//         <h4>{task.ticketKey}</h4>
//         <span className={`status-pill ${task.status?.toLowerCase().replace(/\s+/g, '-')}`}>
//           {task.status}
//         </span>
//       </div>

//       <p className="task-title">{task.title}</p>

//       <div className="task-footer">
//         <div className={`assignee-avatar ${isUnassigned ? 'unassigned' : ''}`}>
//           {isUnassigned ? (
//             <User size={14} />
//           ) : (
//             <span>{getInitials(task.assignee)}</span>
//           )}
//         </div>
//         <span className="assignee-name">{task.assignee}</span>
//       </div>
//     </div>
//   );
// };

// export default TaskItem;
import React from 'react';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import './TaskItem.scss';

const TaskItem = ({ task, isSelected, onClick, isShrunk, onToggleShrink }) => {
  // Mapping accent colors based on raw type ID
  const typeColors = {
    "1": "#ef4444", // Bug (Red)
    "2": "#10b981", // Improvements (Green)
    "3": "#a855f7", // Epic (Purple)
    "4": "#3b82f6", // Task (Blue)
  };

  const accentColor = typeColors[task.type] || "#5287d6ff";

  // Truncate ticket key to match TECH-12 style
  const shortTicketKey = task.ticketKey?.split('-').slice(0, 2).join('-');

  const formatDue = (dateString) => {
    if (!dateString || dateString === "No Date") return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div
      className={`task-item ${isSelected ? 'selected' : ''} ${isShrunk ? 'shrunk' : ''}`}
      onClick={() => onClick(task?._id)}
      style={{ borderLeft: `4px solid ${accentColor}` }}
    >
      {/* Shrink Toggle Button */}
      <button 
        className="shrink-toggle" 
        onClick={(e) => { e.stopPropagation(); onToggleShrink(); }}
      >
        {isShrunk ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div className="task-body">
        {/* Assignee Section */}
        <div className="avatar-wrapper">
          {(!task.assignee || task.assignee === "Unassigned") ? (
            <div className="user-avatar-placeholder unassigned">
              <User size={16} />
            </div>
          ) : (
            <div className="user-avatar-placeholder">
              {task.assignee.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info Section - Hidden when Shrunk */}
        
          <div className="content-wrapper">
            <div className="task-meta-top">
              <span className="ticket-key">{ !isShrunk ?task.ticketKey: shortTicketKey}</span>
            </div>
            
          { !isShrunk && <h4 className="task-title">{task.title}</h4>}

         { !isShrunk &&  <div className="info-grid">
              <div className="info-row">
                <span className="label">Type</span>
                <span className="value">{task.type}</span>
              </div>
              <div className="info-row">
                <span className="label">Due</span>
                <span className="value date">{formatDue(task.eta)}</span>
              </div>
         { task.assignee &&   <div className="info-row">
                <span className="label">Assignee </span>
              <span className="value ">{task.assignee }</span>
              </div>}
            </div>}
          </div>
      </div>
    </div>
  );
};

export default TaskItem;