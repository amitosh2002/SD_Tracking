import React, { useState } from 'react';
import './SprintBoard.scss';

const SprintBoard = () => {
  const [selectedSprint, setSelectedSprint] = useState('sprint-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [draggedTask, setDraggedTask] = useState(null);

  const sprints = [
    { id: 'sprint-1', name: 'Sprint 23 - Nov 2025', status: 'active' },
    { id: 'sprint-2', name: 'Sprint 24 - Dec 2025', status: 'planned' },
    { id: 'backlog', name: 'Backlog', status: 'backlog' },
  ];

  const projects = [
    { id: 'proj-1', name: 'E-Commerce', key: 'ECP', color: '#6366f1' },
    { id: 'proj-2', name: 'Mobile App', key: 'MOB', color: '#10b981' },
    { id: 'proj-3', name: 'Analytics', key: 'ANA', color: '#f59e0b' },
  ];

  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'To Do',
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      taskIds: ['task-4', 'task-5'],
    },
    inReview: {
      id: 'inReview',
      title: 'In Review',
      taskIds: ['task-6'],
    },
    done: {
      id: 'done',
      title: 'Done',
      taskIds: ['task-7', 'task-8'],
    },
  });

  const [tasks] = useState({
    'task-1': {
      id: 'task-1',
      key: 'ECP-101',
      projectKey: 'ECP',
      projectColor: '#6366f1',
      projectId: 'proj-1',
      title: 'Implement user authentication',
      type: 'story',
      priority: 'high',
      assignee: { name: 'John Doe', avatar: 'JD' },
      storyPoints: 8,
      labels: ['backend', 'security'],
    },
    'task-2': {
      id: 'task-2',
      key: 'ECP-102',
      projectKey: 'ECP',
      projectColor: '#6366f1',
      projectId: 'proj-1',
      title: 'Fix payment gateway integration',
      type: 'bug',
      priority: 'critical',
      assignee: { name: 'Jane Smith', avatar: 'JS' },
      storyPoints: 5,
      labels: ['payment', 'urgent'],
    },
    'task-3': {
      id: 'task-3',
      key: 'MOB-45',
      projectKey: 'MOB',
      projectColor: '#10b981',
      projectId: 'proj-2',
      title: 'Design onboarding screens',
      type: 'task',
      priority: 'medium',
      assignee: { name: 'Alice Johnson', avatar: 'AJ' },
      storyPoints: 3,
      labels: ['ui', 'design'],
    },
    'task-4': {
      id: 'task-4',
      key: 'ECP-103',
      projectKey: 'ECP',
      projectColor: '#6366f1',
      projectId: 'proj-1',
      title: 'Setup CI/CD pipeline',
      type: 'task',
      priority: 'high',
      assignee: { name: 'John Doe', avatar: 'JD' },
      storyPoints: 5,
      labels: ['devops'],
    },
    'task-5': {
      id: 'task-5',
      key: 'ANA-20',
      projectKey: 'ANA',
      projectColor: '#f59e0b',
      projectId: 'proj-3',
      title: 'Create analytics dashboard',
      type: 'story',
      priority: 'medium',
      assignee: { name: 'Bob Wilson', avatar: 'BW' },
      storyPoints: 13,
      labels: ['frontend', 'charts'],
    },
    'task-6': {
      id: 'task-6',
      key: 'MOB-46',
      projectKey: 'MOB',
      projectColor: '#10b981',
      projectId: 'proj-2',
      title: 'Implement push notifications',
      type: 'story',
      priority: 'high',
      assignee: { name: 'Alice Johnson', avatar: 'AJ' },
      storyPoints: 8,
      labels: ['mobile', 'notifications'],
    },
    'task-7': {
      id: 'task-7',
      key: 'ECP-100',
      projectKey: 'ECP',
      projectColor: '#6366f1',
      projectId: 'proj-1',
      title: 'Update documentation',
      type: 'task',
      priority: 'low',
      assignee: { name: 'Jane Smith', avatar: 'JS' },
      storyPoints: 2,
      labels: ['docs'],
    },
    'task-8': {
      id: 'task-8',
      key: 'ANA-19',
      projectKey: 'ANA',
      projectColor: '#f59e0b',
      projectId: 'proj-3',
      title: 'Fix data export bug',
      type: 'bug',
      priority: 'medium',
      assignee: { name: 'Bob Wilson', avatar: 'BW' },
      storyPoints: 3,
      labels: ['bug', 'export'],
    },
  });

  const handleDragStart = (e, taskId, sourceColumn) => {
    setDraggedTask({ taskId, sourceColumn });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedTask) return;

    const { taskId, sourceColumn } = draggedTask;
    
    if (sourceColumn === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    const newColumns = { ...columns };
    newColumns[sourceColumn].taskIds = newColumns[sourceColumn].taskIds.filter(
      (id) => id !== taskId
    );
    newColumns[targetColumnId].taskIds.push(taskId);

    setColumns(newColumns);
    setDraggedTask(null);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'story':
        return '📖';
      case 'bug':
        return '🐛';
      case 'task':
        return '✓';
      default:
        return '📝';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const filteredTasks = (taskIds) => {
    return taskIds.filter((taskId) => {
      const task = tasks[taskId];
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.key.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAssignee = filterAssignee === 'all' || task.assignee.name === filterAssignee;
      const matchesProject = selectedProject === 'all' || task.projectId === selectedProject;
      return matchesSearch && matchesAssignee && matchesProject;
    });
  };

  const calculateStats = () => {
    const allTasks = Object.values(tasks);
    const totalPoints = allTasks.reduce((sum, task) => sum + task.storyPoints, 0);
    const completedPoints = columns.done.taskIds.reduce(
      (sum, taskId) => sum + tasks[taskId].storyPoints,
      0
    );
    return {
      total: allTasks.length,
      completed: columns.done.taskIds.length,
      totalPoints,
      completedPoints,
      progress: Math.round((completedPoints / totalPoints) * 100) || 0,
    };
  };

  const stats = calculateStats();

  return (
    <div className="sprint-board">
      <div className="board-header">
        <div className="header-left">
          <h1 className="board-title">Sprint Board</h1>
          <select
            className="sprint-selector"
            value={selectedSprint}
            onChange={(e) => setSelectedSprint(e.target.value)}
          >
            {sprints.map((sprint) => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.name}
              </option>
            ))}
          </select>
        </div>
        <div className="header-right">
          <button className="btn-complete-sprint">Complete Sprint</button>
        </div>
      </div>

      <div className="sprint-stats">
        <div className="stat-item">
          <span className="stat-label">Tasks</span>
          <span className="stat-value">{stats.completed}/{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Story Points</span>
          <span className="stat-value">{stats.completedPoints}/{stats.totalPoints}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Progress</span>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${stats.progress}%` }}></div>
            </div>
            <span className="stat-value">{stats.progress}%</span>
          </div>
        </div>
      </div>

      <div className="board-filters">
        <div className="filter-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            className="filter-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.key} - {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <select
            className="filter-select"
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
          >
            <option value="all">All Assignees</option>
            <option value="John Doe">John Doe</option>
            <option value="Jane Smith">Jane Smith</option>
            <option value="Alice Johnson">Alice Johnson</option>
            <option value="Bob Wilson">Bob Wilson</option>
          </select>
        </div>
      </div>

      <div className="board-columns">
        {Object.values(columns).map((column) => (
          <div
            key={column.id}
            className="board-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="column-header">
              <h3 className="column-title">{column.title}</h3>
              <span className="column-count">
                {filteredTasks(column.taskIds).length}
              </span>
            </div>
            <div className="column-content">
              {filteredTasks(column.taskIds).map((taskId) => {
                const task = tasks[taskId];
                return (
                  <div
                    key={task.id}
                    className="task-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                  >
                    <div className="task-header">
                      <div className="task-key" style={{ backgroundColor: task.projectColor }}>
                        {task.projectKey}
                      </div>
                      <span className="task-id">{task.key}</span>
                      <div
                        className="priority-dot"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                        title={task.priority}
                      ></div>
                    </div>
                    <p className="task-title">{task.title}</p>
                    <div className="task-labels">
                      {task.labels.slice(0, 2).map((label, idx) => (
                        <span key={idx} className="task-label">
                          {label}
                        </span>
                      ))}
                    </div>
                    <div className="task-footer">
                      <div className="task-meta">
                        <span className="task-type">{getTypeIcon(task.type)}</span>
                        {task.storyPoints && (
                          <span className="story-points">{task.storyPoints} SP</span>
                        )}
                      </div>
                      <div
                        className="task-assignee"
                        title={task.assignee.name}
                      >
                        {task.assignee.avatar}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SprintBoard;