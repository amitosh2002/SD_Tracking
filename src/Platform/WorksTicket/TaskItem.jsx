import React from 'react';
import './TaskItem.scss';

const TaskItem = ({ task, isSelected, onClick }) => {
  return (
    <div
      className={`task-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(task._id)}
    >
      <h4>{task.ticketKey}</h4>
      <p>ID: {task.title}</p>
    </div>
  );
};

export default TaskItem;