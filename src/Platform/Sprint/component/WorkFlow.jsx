import React, { useState } from 'react';
import './styles/WorkflowManager.scss';

const WorkflowManager = () => {
  const [workflow, setWorkflow] = useState({
    partnerId: 'p1',
    projectId: 'proj123',
    statuses: [
      {
        key: 'OPEN',
        label: 'Open',
        color: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
        isTerminal: false
      },
      {
        key: 'IN_PROGRESS',
        label: 'In Progress',
        color: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
        isTerminal: false
      },
      {
        key: 'CLOSED',
        label: 'Closed',
        color: { bg: '#e5e7eb', text: '#374151', border: '#6b7280' },
        isTerminal: true
      }
    ],
    transitions: [
      { from: 'OPEN', to: ['IN_PROGRESS'] },
      { from: 'IN_PROGRESS', to: ['CLOSED', 'OPEN'] }
    ]
  });

  const [editingStatus, setEditingStatus] = useState(null);
  const [showAddStatus, setShowAddStatus] = useState(false);
  const [newStatus, setNewStatus] = useState({
    key: '',
    label: '',
    color: { bg: '#e0e7ff', text: '#3730a3', border: '#6366f1' },
    isTerminal: false
  });

  const predefinedColors = [
    { name: 'Blue', bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
    { name: 'Purple', bg: '#e0e7ff', text: '#3730a3', border: '#6366f1' },
    { name: 'Green', bg: '#d1fae5', text: '#065f46', border: '#10b981' },
    { name: 'Yellow', bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
    { name: 'Red', bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
    { name: 'Gray', bg: '#e5e7eb', text: '#374151', border: '#6b7280' },
    { name: 'Pink', bg: '#fce7f3', text: '#831843', border: '#ec4899' },
    { name: 'Cyan', bg: '#cffafe', text: '#164e63', border: '#06b6d4' }
  ];

  const handleAddStatus = () => {
    if (!newStatus.key || !newStatus.label) return;

    const statusKey = newStatus.key.toUpperCase().replace(/\s+/g, '_');
    const updatedStatuses = [...workflow.statuses, { ...newStatus, key: statusKey }];
    
    setWorkflow({
      ...workflow,
      statuses: updatedStatuses,
      transitions: [...workflow.transitions, { from: statusKey, to: [] }]
    });

    setNewStatus({
      key: '',
      label: '',
      color: { bg: '#e0e7ff', text: '#3730a3', border: '#6366f1' },
      isTerminal: false
    });
    setShowAddStatus(false);
  };

  const handleDeleteStatus = (statusKey) => {
    const updatedStatuses = workflow.statuses.filter(s => s.key !== statusKey);
    const updatedTransitions = workflow.transitions
      .filter(t => t.from !== statusKey)
      .map(t => ({
        ...t,
        to: t.to.filter(toKey => toKey !== statusKey)
      }));

    setWorkflow({
      ...workflow,
      statuses: updatedStatuses,
      transitions: updatedTransitions
    });
  };

  const handleUpdateStatus = (statusKey, updates) => {
    const updatedStatuses = workflow.statuses.map(s =>
      s.key === statusKey ? { ...s, ...updates } : s
    );
    setWorkflow({ ...workflow, statuses: updatedStatuses });
  };

  const handleToggleTransition = (fromKey, toKey) => {
    const updatedTransitions = workflow.transitions.map(t => {
      if (t.from === fromKey) {
        const toArray = t.to.includes(toKey)
          ? t.to.filter(k => k !== toKey)
          : [...t.to, toKey];
        return { ...t, to: toArray };
      }
      return t;
    });
    setWorkflow({ ...workflow, transitions: updatedTransitions });
  };

  const getTransitionsTo = (statusKey) => {
    const transition = workflow.transitions.find(t => t.from === statusKey);
    return transition ? transition.to : [];
  };

  const canTransitionTo = (fromKey, toKey) => {
    return getTransitionsTo(fromKey).includes(toKey);
  };

  return (
    <div className="workflow-manager">
      <div className="workflow-header">
        <div className="header-content">
          <h1 className="page-title">Workflow Manager</h1>
          <p className="page-subtitle">Configure status flow for your project</p>
        </div>
        <button className="btn-add-status" onClick={() => setShowAddStatus(true)}>
          <span className="btn-icon">+</span>
          Add Status
        </button>
      </div>

      <div className="workflow-visualization">
        <h2 className="section-title">Current Workflow</h2>
        <div className="flow-container">
          {workflow.statuses.map((status, index) => (
            <div key={status.key} className="flow-item">
              <div 
                className="status-node"
                style={{
                  backgroundColor: status.color.bg,
                  color: status.color.text,
                  borderColor: status.color.border
                }}
              >
                <div className="status-header">
                  <span className="status-label">{status.label}</span>
                  {status.isTerminal && (
                    <span className="terminal-badge">Terminal</span>
                  )}
                </div>
                <div className="status-actions">
                  <button 
                    className="action-icon"
                    onClick={() => setEditingStatus(status.key)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    className="action-icon"
                    onClick={() => handleDeleteStatus(status.key)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              {index < workflow.statuses.length - 1 && (
                <div className="flow-arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="transition-matrix">
        <h2 className="section-title">Transition Rules</h2>
        <p className="section-description">
          Check the boxes to allow transitions between statuses
        </p>
        <div className="matrix-container">
          <table className="matrix-table">
            <thead>
              <tr>
                <th className="matrix-corner">From / To</th>
                {workflow.statuses.map(status => (
                  <th 
                    key={status.key}
                    style={{
                      backgroundColor: status.color.bg,
                      color: status.color.text
                    }}
                  >
                    {status.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workflow.statuses.map(fromStatus => (
                <tr key={fromStatus.key}>
                  <td 
                    className="matrix-row-header"
                    style={{
                      backgroundColor: fromStatus.color.bg,
                      color: fromStatus.color.text
                    }}
                  >
                    {fromStatus.label}
                  </td>
                  {workflow.statuses.map(toStatus => (
                    <td key={toStatus.key} className="matrix-cell">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={canTransitionTo(fromStatus.key, toStatus.key)}
                          onChange={() => handleToggleTransition(fromStatus.key, toStatus.key)}
                          disabled={fromStatus.key === toStatus.key}
                        />
                        <span className="checkbox-custom"></span>
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="workflow-json">
        <h2 className="section-title">Workflow JSON</h2>
        <div className="json-viewer">
          <pre>{JSON.stringify(workflow, null, 2)}</pre>
        </div>
        <button className="btn-copy" onClick={() => navigator.clipboard.writeText(JSON.stringify(workflow, null, 2))}>
          📋 Copy JSON
        </button>
      </div>

      {showAddStatus && (
        <div className="modal-overlay" onClick={() => setShowAddStatus(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Status</h2>
              <button className="close-btn" onClick={() => setShowAddStatus(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Status Label *</label>
                <input
                  type="text"
                  value={newStatus.label}
                  onChange={(e) => setNewStatus({ ...newStatus, label: e.target.value, key: e.target.value })}
                  placeholder="e.g., In Review"
                />
              </div>
              <div className="form-group">
                <label>Status Key</label>
                <input
                  type="text"
                  value={newStatus.key.toUpperCase().replace(/\s+/g, '_')}
                  readOnly
                  className="readonly-input"
                />
              </div>
              <div className="form-group">
                <label>Color Theme</label>
                <div className="color-grid">
                  {predefinedColors.map((color) => (
                    <button
                      key={color.name}
                      className={`color-option ${JSON.stringify(newStatus.color) === JSON.stringify(color) ? 'active' : ''}`}
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                        borderColor: color.border
                      }}
                      onClick={() => setNewStatus({ ...newStatus, color: { bg: color.bg, text: color.text, border: color.border } })}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newStatus.isTerminal}
                    onChange={(e) => setNewStatus({ ...newStatus, isTerminal: e.target.checked })}
                  />
                  <span>Terminal Status (No further transitions)</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddStatus(false)}>
                Cancel
              </button>
              <button 
                className="btn-submit" 
                onClick={handleAddStatus}
                disabled={!newStatus.label}
              >
                Add Status
              </button>
            </div>
          </div>
        </div>
      )}

      {editingStatus && (
        <div className="modal-overlay" onClick={() => setEditingStatus(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Status</h2>
              <button className="close-btn" onClick={() => setEditingStatus(null)}>✕</button>
            </div>
            <div className="modal-body">
              {(() => {
                const status = workflow.statuses.find(s => s.key === editingStatus);
                return (
                  <>
                    <div className="form-group">
                      <label>Status Label *</label>
                      <input
                        type="text"
                        value={status.label}
                        onChange={(e) => handleUpdateStatus(editingStatus, { label: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Color Theme</label>
                      <div className="color-grid">
                        {predefinedColors.map((color) => (
                          <button
                            key={color.name}
                            className={`color-option ${JSON.stringify(status.color) === JSON.stringify(color) ? 'active' : ''}`}
                            style={{
                              backgroundColor: color.bg,
                              color: color.text,
                              borderColor: color.border
                            }}
                            onClick={() => handleUpdateStatus(editingStatus, { color: { bg: color.bg, text: color.text, border: color.border } })}
                          >
                            {color.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={status.isTerminal}
                          onChange={(e) => handleUpdateStatus(editingStatus, { isTerminal: e.target.checked })}
                        />
                        <span>Terminal Status</span>
                      </label>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setEditingStatus(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowManager;