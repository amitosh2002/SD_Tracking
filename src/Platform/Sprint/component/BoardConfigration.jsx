import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProjectScrumBoard,
  fetchProjectScrumFlow,
  updateProjectScrumBoard,
  
} from '../../../Redux/Actions/SprintActions/sprintActionsV1';
import './style/ColumnStatusManager.scss';

const ColumnStatusManager = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('status');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Redux State
  const {
    scrumLoading,
    boardId,
    boardColumn,
    flowId,
    statusWorkFlow
  } = useSelector((state) => state.sprint);
  console.log(statusWorkFlow)
  
  // Status Flow State
  const [localStatuses, setLocalStatuses] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusForm, setStatusForm] = useState({
    key: '',
    label: '',
    description: '',
    color: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
    isTerminal: false
  });

  // Columns State
  const [localColumns, setLocalColumns] = useState([]);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const [columnForm, setColumnForm] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    wipLimit: null,
    statusKeys: []
  });

  const predefinedColors = [
    { name: 'Blue', bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
    { name: 'Purple', bg: '#e0e7ff', text: '#3730a3', border: '#6366f1' },
    { name: 'Green', bg: '#d1fae5', text: '#065f46', border: '#10b981' },
    { name: 'Yellow', bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
    { name: 'Red', bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
    { name: 'Pink', bg: '#fce7f3', text: '#831843', border: '#ec4899' },
    { name: 'Cyan', bg: '#cffafe', text: '#164e63', border: '#06b6d4' },
    { name: 'Indigo', bg: '#e0e7ff', text: '#3730a3', border: '#4f46e5' }
  ];




const normalizedFlowColumns = useMemo(() => {
  if (!statusWorkFlow?.statuses || !statusWorkFlow?.workflow) return [];

  return statusWorkFlow.statuses.map((status, index) => ({
    id: `flow_${status.key}`,
    name: status.label,
    statusKeys: [
      status.key,                    // ✅ self
      ...(statusWorkFlow.workflow[status.key] || []) // ✅ allowed transitions
    ],
    color: status.color?.border || '#6366f1',
    wipLimit: null,
    order: index
  }));
}, [statusWorkFlow]);


useEffect(() => {
  if (normalizedFlowColumns.length) {
    setLocalColumns(JSON.parse(JSON.stringify(normalizedFlowColumns)));
  }
}, [normalizedFlowColumns]);

  // Fetch data on mount
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectScrumFlow(projectId));
      dispatch(fetchProjectScrumBoard(projectId));
    }
  }, [projectId, dispatch]);

  // Sync Redux state to local state
 useEffect(() => {
  if (statusWorkFlow?.statuses) {
    setLocalStatuses(JSON.parse(JSON.stringify(statusWorkFlow.statuses)));
  }
}, [statusWorkFlow]);


  // useEffect(() => {
  //   if (boardColumn) {
  //     const sorted = [...boardColumn].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  //     setLocalColumns(JSON.parse(JSON.stringify(sorted)));
  //   }
  // }, [boardColumn]);

  // Check for changes
  useEffect(() => {
    const statusChanged = JSON.stringify(localStatuses) !== JSON.stringify(statusWorkFlow?.statuses || []);
    const columnsChanged = JSON.stringify(localColumns) !== JSON.stringify(boardColumn || []);
    setHasChanges(statusChanged || columnsChanged);
  }, [localStatuses, localColumns, statusWorkFlow, boardColumn]);

  // ========== SAVE ALL CHANGES ==========
  // const handleSaveAll = async () => {
  //   if (!hasChanges) return;

  //   try {
  //     // Save Status Flow
  //     const statusPayload = {
  //       statuses: localStatuses,
  //       transitions: statusWorkFlow?.transitions || []
  //     };

  //     if (flowId) {
  //       await dispatch(updateProjectScrumFlow(projectId, statusPayload));
  //     } else {
  //       await dispatch(saveProjectScrumFlow(projectId, statusPayload));
  //     }

  //     // Save Board Columns
  //     const columnPayload = {
  //       columns: localColumns.map((col, i) => ({
  //         ...col,
  //         order: i
  //       }))
  //     };

  //     if (boardId) {
  //       await dispatch(updateProjectScrumBoard(boardId, columnPayload));
  //     } else {
  //       await dispatch(saveProjectScrumBoard(projectId, columnPayload));
  //     }

  //     alert('Changes saved successfully!');
  //     setHasChanges(false);
      
  //     // Refresh data
  //     dispatch(fetchProjectScrumFlow(projectId));
  //     dispatch(fetchProjectScrumBoard(projectId));
  //   } catch (error) {
  //     console.error('Error saving:', error);
  //     alert('Error saving changes');
  //   }
  // };
const handleSaveAll = () => {
  if (!hasChanges) return;

  try {


   

    // ======== BOARD COLUMNS PAYLOAD ========
        const boardPayload = {
          columns: localColumns.map((col, i) => ({
            columnId: col.id,  // e.g., 'col_1', 'col_2'
            name: col.name,
            description: col.description || '',
            color: col.color,
            wipLimit: col.wipLimit || null,
            statusKeys: Array.from(new Set(col.statusKeys)), // deduplicate
            order: i
          }))
        };


    console.log('Board Payload:', boardPayload);

     dispatch(updateProjectScrumBoard(projectId, boardPayload));

    alert('Changes saved successfully!');
    setHasChanges(false);

    // Refresh data after save
    dispatch(fetchProjectScrumFlow(projectId));
    dispatch(fetchProjectScrumBoard(projectId));

  } catch (error) {
    console.error('Error saving changes:', error);
    alert('Failed to save changes');
  }
};


  // ========== STATUS FLOW HANDLERS ==========
  const handleCreateStatus = () => {
    if (!statusForm.key || !statusForm.label) {
      alert('Please fill required fields');
      return;
    }

    const statusKey = statusForm.key.toUpperCase().replace(/\s+/g, '_');
    const newStatus = {
      key: statusKey,
      label: statusForm.label,
      description: statusForm.description,
      color: statusForm.color,
      isTerminal: statusForm.isTerminal
    };

    if (editingStatus) {
      setLocalStatuses(prev => prev.map(s => 
        s.key === editingStatus.key ? newStatus : s
      ));
      
      // Update columns if key changed
      if (statusKey !== editingStatus.key) {
        setLocalColumns(prev => prev.map(col => ({
          ...col,
          statusKeys: col.statusKeys.map(key => 
            key === editingStatus.key ? statusKey : key
          )
        })));
      }
    } else {
      setLocalStatuses(prev => [...prev, newStatus]);
    }

    resetStatusForm();
    setShowStatusModal(false);
  };

  const handleEditStatus = (status) => {
    setEditingStatus(status);
    setStatusForm({
      key: status.key,
      label: status.label,
      description: status.description || '',
      color: status.color,
      isTerminal: status.isTerminal
    });
    setShowStatusModal(true);
  };

  const handleDeleteStatus = (statusKey) => {
    if (!confirm('Delete this status? It will be removed from all columns.')) return;
    
    setLocalStatuses(prev => prev.filter(s => s.key !== statusKey));
    setLocalColumns(prev => prev.map(col => ({
      ...col,
      statusKeys: col.statusKeys.filter(key => key !== statusKey)
    })));
  };

  const resetStatusForm = () => {
    setStatusForm({
      key: '',
      label: '',
      description: '',
      color: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
      isTerminal: false
    });
    setEditingStatus(null);
  };

  // ========== COLUMN HANDLERS ==========
  const handleCreateColumn = () => {
    if (!columnForm.name) {
      alert('Please enter column name');
      return;
    }

    const newColumn = {
      id: editingColumn?.id || `col_${Date.now()}`,
      name: columnForm.name,
      description: columnForm.description,
      color: columnForm.color,
      wipLimit: columnForm.wipLimit,
      statusKeys: columnForm.statusKeys,
      order: editingColumn?.order ?? localColumns.length
    };

    if (editingColumn) {
      setLocalColumns(prev => prev.map(col => 
        col.id === editingColumn.id ? newColumn : col
      ));
    } else {
      setLocalColumns(prev => [...prev, newColumn]);
    }

    resetColumnForm();
    setShowColumnModal(false);
  };

  const handleEditColumn = (column) => {
    setEditingColumn(column);
    setColumnForm({
      name: column.name,
      description: column.description || '',
      color: column.color,
      wipLimit: column.wipLimit,
      statusKeys: column.statusKeys || []
    });
    setShowColumnModal(true);
  };

  const handleDeleteColumn = (columnId) => {
    if (!confirm('Delete this column?')) return;
    setLocalColumns(prev => prev.filter(col => col.id !== columnId));
  };

  const moveColumn = (columnId, direction) => {
    const index = localColumns.findIndex(col => col.id === columnId);
    if (index === -1) return;
    
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= localColumns.length) return;

    const newColumns = [...localColumns];
    [newColumns[index], newColumns[newIndex]] = [newColumns[newIndex], newColumns[index]];
    setLocalColumns(newColumns);
  };

  const resetColumnForm = () => {
    setColumnForm({
      name: '',
      description: '',
      color: '#3b82f6',
      wipLimit: null,
      statusKeys: []
    });
    setEditingColumn(null);
  };

  // ========== MAPPING HANDLERS ==========
// ========== MAPPING HANDLER ==========
const toggleStatusInColumn = (columnId, statusKey) => {
  setLocalColumns(prev =>
    prev.map(col => {
      if (col.id !== columnId) return col; // Only modify the clicked column

      const exists = col.statusKeys.includes(statusKey);

      return {
        ...col,
        statusKeys: exists
          ? col.statusKeys.filter(key => key !== statusKey) // remove
          : [...col.statusKeys, statusKey] // add
      };
    })
  );
};



const getUnassignedStatuses = useMemo(() => {
  const assigned = new Set(localColumns.flatMap(col => col.statusKeys || []));
  return localStatuses.filter(status => !assigned.has(status.key));
}, [localStatuses, localColumns]);



  if (scrumLoading) {
    return (
      <div className="column-status-container loading">
        <div className="loading-spinner"></div>
        <p>Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="column-status-container">
      <div className="column-status-wrapper">
        {/* Header */}
        <div className="cs-header">
          <div>
            <h1 className="cs-title">Board Configuration</h1>
            <p className="cs-subtitle">Manage status flows and board columns separately</p>
          </div>
          <button 
            onClick={handleSaveAll}
            className="cs-btn-save"
            disabled={!hasChanges}
          >
            <span className="cs-icon">💾</span>
            {hasChanges ? 'Save All Changes' : 'Saved'}
          </button>
        </div>

        {/* Tabs */}
        <div className="cs-tabs">
          <button
            className={`cs-tab ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            <span className="cs-tab-icon">🎯</span>
            Status Flows
            <span className="cs-tab-count">{localStatuses.length}</span>
          </button>
          <button
            className={`cs-tab ${activeTab === 'columns' ? 'active' : ''}`}
            onClick={() => setActiveTab('columns')}
          >
            <span className="cs-tab-icon">📊</span>
            Board Columns
            <span className="cs-tab-count">{localColumns.length}</span>
          </button>
          <button
            className={`cs-tab ${activeTab === 'mapping' ? 'active' : ''}`}
            onClick={() => setActiveTab('mapping')}
          >
            <span className="cs-tab-icon">🔗</span>
            Status Mapping
          </button>
        </div>

        {/* Status Flow Tab */}
        {activeTab === 'status' && (
          <div className="cs-content">
            <div className="cs-content-header">
              <h2>Status Flows</h2>
              <button onClick={() => { resetStatusForm(); setShowStatusModal(true); }} className="cs-btn-primary">
                <span>+</span>
                Add Status
              </button>
            </div>

            {localStatuses.length === 0 ? (
              <div className="cs-empty-state">
                <div className="cs-empty-icon">🎯</div>
                <h3>No Status Flows Yet</h3>
                <p>Create status flows to define work item states</p>
              </div>
            ) : (
              <div className="cs-grid">
                {localStatuses.map((status) => (
                  <div key={status.key} className="cs-status-card">
                    <div 
                      className="cs-status-header"
                      style={{ 
                        backgroundColor: status.color.bg,
                        borderLeft: `4px solid ${status.color.border}`
                      }}
                    >
                      <div className="cs-status-info">
                        <h3 style={{ color: status.color.text }}>{status.label}</h3>
                        <code className="cs-status-key">{status.key}</code>
                      </div>
                      {status.isTerminal && (
                        <span className="cs-terminal-badge">Terminal</span>
                      )}
                    </div>

                    {status.description && (
                      <p className="cs-status-description">{status.description}</p>
                    )}

                    <div className="cs-card-actions">
                      <button onClick={() => handleEditStatus(status)} className="cs-action-btn">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDeleteStatus(status.key)} className="cs-action-btn danger">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Columns Tab */}
        {activeTab === 'columns' && (
          <div className="cs-content">
            <div className="cs-content-header">
              <h2>Board Columns</h2>
              <button onClick={() => { resetColumnForm(); setShowColumnModal(true); }} className="cs-btn-primary">
                <span>+</span>
                Add Column
              </button>
            </div>

            {localColumns.length === 0 ? (
              <div className="cs-empty-state">
                <div className="cs-empty-icon">📊</div>
                <h3>No Columns Yet</h3>
                <p>Create board columns to organize your work</p>
              </div>
            ) : (
              <div className="cs-column-list">
                {localColumns.map((column, index) => (
                  <div key={column.id} className="cs-column-item">
                    <div className="cs-column-header">
                      <div className="cs-column-info">
                        <div className="cs-color-indicator" style={{ backgroundColor: column.color }} />
                        <div>
                          <h3>{column.name}</h3>
                          <p>{column.statusKeys.length} status(es) mapped</p>
                        </div>
                      </div>
                      <div className="cs-column-actions">
                        <button onClick={() => moveColumn(column.id, 'left')} disabled={index === 0} className="cs-icon-btn">
                          ←
                        </button>
                        <button onClick={() => moveColumn(column.id, 'right')} disabled={index === localColumns.length - 1} className="cs-icon-btn">
                          →
                        </button>
                        <button onClick={() => handleEditColumn(column)} className="cs-icon-btn">
                          ✏️
                        </button>
                        <button onClick={() => handleDeleteColumn(column.id)} className="cs-icon-btn danger">
                          🗑️
                        </button>
                      </div>
                    </div>
                    {column.wipLimit && (
                      <div className="cs-wip-limit">WIP Limit: <span>{column.wipLimit}</span></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mapping Tab */}
        {activeTab === 'mapping' && (
          <div className="cs-content">
            <h2 className="cs-content-title">Status to Column Mapping</h2>
            
            {getUnassignedStatuses.length > 0 && (
              <div className="cs-warning-card">
                <h3>⚠️ Unassigned Statuses</h3>
                <div className="cs-status-badges">
                  {getUnassignedStatuses.map((status) => (
                    <div
                      key={status.key}
                      className="cs-status-badge"
                      style={{
                        backgroundColor: status.color.bg,
                        color: status.color.text,
                        borderColor: status.color.border
                      }}
                    >
                      {status.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="cs-mapping-sections">
              {localColumns.map((column) => (
                <div key={column.id} className="cs-mapping-section">
                  <div className="cs-mapping-header">
                    <div className="cs-color-indicator" style={{ backgroundColor: column.color }} />
                    <h3>{column.name}</h3>
                  </div>

                  <div className="cs-status-grid">
                    {localStatuses.map((status) => (
                      <label key={status.key} className={`cs-status-checkbox ${column.statusKeys.includes(status.key) ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={column.statusKeys.includes(status.key)}
                          onChange={() => toggleStatusInColumn(column.id, status.key)}
                        />
                        <div
                          className="cs-status-chip"
                          style={{
                            backgroundColor: status.color.bg,
                            color: status.color.text,
                            borderColor: status.color.border
                          }}
                        >
                          {status.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Status Modal */}
      {showStatusModal && (
        <div className="cs-modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="cs-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cs-modal-header">
              <h2>{editingStatus ? 'Edit Status Flow' : 'Create Status Flow'}</h2>
              <button onClick={() => setShowStatusModal(false)} className="cs-close-btn">✕</button>
            </div>

            <div className="cs-modal-body">
              <div className="cs-form-group">
                <label>Status Label *</label>
                <input
                  type="text"
                  value={statusForm.label}
                  onChange={(e) => setStatusForm({ ...statusForm, label: e.target.value, key: e.target.value })}
                  placeholder="e.g., In Progress"
                />
              </div>

              <div className="cs-form-group">
                <label>Status Key *</label>
                <input
                  type="text"
                  value={statusForm.key.toUpperCase().replace(/\s+/g, '_')}
                  readOnly
                  className="cs-readonly-input"
                />
              </div>

              <div className="cs-form-group">
                <label>Description</label>
                <textarea
                  value={statusForm.description}
                  onChange={(e) => setStatusForm({ ...statusForm, description: e.target.value })}
                  placeholder="Brief description"
                  rows={3}
                />
              </div>

              <div className="cs-form-group">
                <label>Color Theme</label>
                <div className="cs-color-picker">
                  <div className="cs-color-grid">
                    {predefinedColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setStatusForm({ ...statusForm, color: { bg: color.bg, text: color.text, border: color.border } })}
                        className={`cs-color-option ${JSON.stringify(statusForm.color) === JSON.stringify({ bg: color.bg, text: color.text, border: color.border }) ? 'active' : ''}`}
                        style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                  
                  <div className="cs-custom-color">
                    <label>Custom Colors</label>
                    <div className="cs-custom-color-inputs">
                      <div className="cs-color-input-group">
                        <label>Background</label>
                        <input
                          type="color"
                          value={statusForm.color.bg}
                          onChange={(e) => setStatusForm({ ...statusForm, color: { ...statusForm.color, bg: e.target.value } })}
                        />
                        <input
                          type="text"
                          value={statusForm.color.bg}
                          onChange={(e) => setStatusForm({ ...statusForm, color: { ...statusForm.color, bg: e.target.value } })}
                          placeholder="#dbeafe"
                          maxLength={7}
                        />
                      </div>
                      <div className="cs-color-input-group">
                        <label>Text</label>
                        <input
                          type="color"
                          value={statusForm.color.text}
                          onChange={(e) => setStatusForm({ ...statusForm, color: { ...statusForm.color, text: e.target.value } })}
                        />
                        <input
                          type="text"
                          value={statusForm.color.text}
                          onChange={(e) => setStatusForm({ ...statusForm, color: { ...statusForm.color, text: e.target.value } })}
                          placeholder="#1e40af"
                          maxLength={7}
                        />
                      </div>
                      <div className="cs-color-input-group">
                        <label>Border</label>
                        <input
                          type="color"
                          value={statusForm.color.border}
                          onChange={(e) => setStatusForm({ ...statusForm, color: { ...statusForm.color, border: e.target.value } })}
                        />
                        <input
                          type="text"
                          value={statusForm.color.border}
                          onChange={(e) => setStatusForm({ ...statusForm, color: { ...statusForm.color, border: e.target.value } })}
                          placeholder="#3b82f6"
                          maxLength={7}
                        />
                      </div>
                    </div>
                    <div className="cs-color-preview" style={{ backgroundColor: statusForm.color.bg, color: statusForm.color.text, borderColor: statusForm.color.border }}>
                      Preview: {statusForm.label || 'Status Label'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="cs-form-group">
                <label className="cs-checkbox-label">
                  <input
                    type="checkbox"
                    checked={statusForm.isTerminal}
                    onChange={(e) => setStatusForm({ ...statusForm, isTerminal: e.target.checked })}
                  />
                  <span>Terminal Status (No further transitions)</span>
                </label>
              </div>
            </div>

            <div className="cs-modal-footer">
              <button onClick={() => setShowStatusModal(false)} className="cs-btn-cancel">Cancel</button>
              <button onClick={handleCreateStatus} className="cs-btn-primary">
                {editingStatus ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Column Modal */}
      {showColumnModal && (
        <div className="cs-modal-overlay" onClick={() => setShowColumnModal(false)}>
          <div className="cs-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cs-modal-header">
              <h2>{editingColumn ? 'Edit Column' : 'Create Column'}</h2>
              <button onClick={() => setShowColumnModal(false)} className="cs-close-btn">✕</button>
            </div>

            <div className="cs-modal-body">
              <div className="cs-form-group">
                <label>Column Name *</label>
                <input
                  type="text"
                  value={columnForm.name}
                  onChange={(e) => setColumnForm({ ...columnForm, name: e.target.value })}
                  placeholder="e.g., In Progress"
                />
              </div>

              <div className="cs-form-group">
                <label>Description</label>
                <textarea
                  value={columnForm.description}
                  onChange={(e) => setColumnForm({ ...columnForm, description: e.target.value })}
                  placeholder="Brief description"
                  rows={3}
                />
              </div>

              <div className="cs-form-group">
                <label>Column Color</label>
                <div className="cs-color-picker-simple">
                  <div className="cs-color-grid-simple">
                    {predefinedColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setColumnForm({ ...columnForm, color: color.border })}
                        className={`cs-color-btn ${columnForm.color === color.border ? 'active' : ''}`}
                        style={{ backgroundColor: color.border }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="cs-custom-color-simple">
                    <label>Custom Color</label>
                    <div className="cs-custom-input">
                      <input
                        type="color"
                        value={columnForm.color}
                        onChange={(e) => setColumnForm({ ...columnForm, color: e.target.value })}
                      />
                      <input
                        type="text"
                        value={columnForm.color}
                        onChange={(e) => setColumnForm({ ...columnForm, color: e.target.value })}
                        placeholder="#3b82f6"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="cs-form-group">
                <label>WIP Limit (optional)</label>
                <input
                  type="number"
                  value={columnForm.wipLimit || ''}
                  onChange={(e) => setColumnForm({ ...columnForm, wipLimit: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="Leave empty for no limit"
                  min="1"
                />
              </div>

              <div className="cs-form-group">
                <label>Select Statuses</label>
                <div className="cs-status-select-grid">
                  {localStatuses.map((status) => (
                    <label key={status.key} className={`cs-status-select-item ${columnForm.statusKeys.includes(status.key) ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={columnForm.statusKeys.includes(status.key)}
                        onChange={(e) => {
                          const statusKeys = e.target.checked
                            ? [...columnForm.statusKeys, status.key]
                            : columnForm.statusKeys.filter(key => key !== status.key);
                          setColumnForm({ ...columnForm, statusKeys });
                        }}
                      />
                      <div
                        className="cs-status-chip"
                        style={{
                          backgroundColor: status.color.bg,
                          color: status.color.text,
                          borderColor: status.color.border
                        }}
                      >
                        {status.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="cs-modal-footer">
              <button onClick={() => setShowColumnModal(false)} className="cs-btn-cancel">Cancel</button>
              <button onClick={handleCreateColumn} className="cs-btn-primary">
                {editingColumn ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnStatusManager;