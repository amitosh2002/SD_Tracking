import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../component/style/SprintBoardManager.scss'
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectScrumFlow, updateProjectScrumFlow } from '../../../Redux/Actions/SprintActions/sprintActionsV1';


const SprintFLowBoard = ({projectId}) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type'); // FLOW | BOARD

  /* ================= REDUX ================= */
  const {
    scrumLoading,
    boardName,
    boardColumn,
    flowId,
    flowName,
    statusWorkFlow
  } = useSelector((state) => state.sprint);

  /* ================= UI STATE ================= */
  const [activeView, setActiveView] = useState('board');
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);

  const [newColumn, setNewColumn] = useState({
    name: '',
    statusKeys: [],
    color: '#6366f1',
    wipLimit: null
  });

  const predefinedColors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#6366f1' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Indigo', value: '#4f46e5' }
  ];

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!projectId) return;
    console.debug('SprintBoardManager: fetch', { projectId, type });
    if (type === 'FLOW') {
      dispatch(fetchProjectScrumFlow(projectId));
    } 
  }, [projectId, type, dispatch]);

  /* ================= NORMALIZE ================= */
  const normalizedConfig = useMemo(() => {
    // Flow: build columns from statusWorkFlow
    if (type === 'FLOW' && statusWorkFlow?.statuses) {
      return {
        name: flowName || 'Sprint Flow',
        columns: statusWorkFlow.statuses.map((s, i) => ({
          id: `flow_${i}`,
          name: s.label || s.key,
          statusKeys: [s.key],
          color: s.color?.border || '#6366f1',
          wipLimit: null,
          order: i
        }))
      };
    }

    // // Board: normalize backend board columns
    // if (type === 'BOARD' && boardColumn?.length) {
    //   return {
    //     name: boardName || 'Sprint Board',
    //     columns: [...boardColumn]
    //       .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    //       .map((c) => ({
    //         id: c.id || `col_${Math.random().toString(36).slice(2, 9)}`,
    //         name: c.name || 'Column',
    //         statusKeys: Array.isArray(c.statusKeys) ? c.statusKeys : [],
    //         color: c.color || '#6366f1',
    //         wipLimit: c.wipLimit ?? null,
    //         order: c.order ?? 0
    //       }))
    //   };
    // }

    // Default: return empty config (avoid nulls in UI)
    return {
      name: type === 'FLOW' ? (flowName || 'Sprint Flow') : (boardName || 'Sprint Board'),
      columns: []
    };
  }, [type, statusWorkFlow, boardColumn, flowName, boardName]);

  /* ================= LOCAL EDITABLE COPY ================= */
  const [localConfig, setLocalConfig] = useState(null);
  const originalRef = useRef(null);

  useEffect(() => {
    if (!normalizedConfig) return;
    setLocalConfig(JSON.parse(JSON.stringify(normalizedConfig)));
    originalRef.current = JSON.stringify(normalizedConfig);
  }, [normalizedConfig]);

  /* ================= DIRTY CHECK ================= */
  const hasChanges = useMemo(() => {
    if (!localConfig || !originalRef.current) return false;
    return JSON.stringify(localConfig) !== originalRef.current;
  }, [localConfig]);

  /* ================= HELPERS ================= */
  const getStatusByKey = (key) =>
    statusWorkFlow?.statuses?.find((s) => s.key === key);

  const getUnassignedStatuses = () => {
    if (!statusWorkFlow) return [];
    const assigned = new Set((localConfig?.columns || []).flatMap(c => c.statusKeys || []));
    return (statusWorkFlow.statuses || []).filter(s => !assigned.has(s.key));
  };

  /* ================= MUTATIONS ================= */
  const updateColumn = (id, updates) => {
    setLocalConfig(prev => ({
      ...prev,
      columns: prev.columns.map(c =>
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  };

  const deleteColumn = (id) => {
    setLocalConfig(prev => ({
      ...prev,
      columns: prev.columns.filter(c => c.id !== id)
    }));
  };

  const moveColumn = (id, dir) => {
    setLocalConfig(prev => {
      const cols = [...prev.columns];
      const i = cols.findIndex(c => c.id === id);
      const j = dir === 'left' ? i - 1 : i + 1;
      if (i < 0 || j < 0 || j >= cols.length) return prev;
      [cols[i], cols[j]] = [cols[j], cols[i]];
      return { ...prev, columns: cols };
    });
  };

  const toggleStatus = (colId, statusKey) => {
    setLocalConfig(prev => ({
      ...prev,
      columns: prev.columns.map(c =>
        c.id === colId
          ? {
              ...c,
              statusKeys: c.statusKeys.includes(statusKey)
                ? c.statusKeys.filter(k => k !== statusKey)
                : [...c.statusKeys, statusKey]
            }
          : c
      )
    }));
  };

  const addColumn = () => {
    if (!newColumn.name || !newColumn.statusKeys.length) return;
    setLocalConfig(prev => ({
      ...prev,
      columns: [...prev.columns, { id: `col_${Date.now()}`, ...newColumn }]
    }));
    setShowAddColumn(false);
    setNewColumn({ name: '', statusKeys: [], color: '#6366f1', wipLimit: null });
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    if (!hasChanges) return;

    const payload = {
      name: localConfig?.name,
      columns: (localConfig?.columns || []).map((c, i) => ({
        name: c.name,
        statusKeys: c.statusKeys,
        color: c.color,
        wipLimit: c.wipLimit,
        order: i
      }))
    };

    if (type === 'FLOW') {
      flowId
        ? dispatch(updateProjectScrumFlow(projectId, payload))
        : dispatch(updateProjectScrumFlow(projectId, payload));
    } 

    originalRef.current = JSON.stringify(localConfig);
    alert('Saved successfully');
  };

  /* ================= LOADER ================= */
  if (scrumLoading) {
    return (
      <div className="sprint-board-container sprint-loading">
        <div className="sprint-loading-content">
          <div className="sprint-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sprint-board-container">
      <div className="sprint-wrapper">
        {/* Header */}
        <div className="sprint-header-card">
          <div className="sprint-header-top">
            <div className="sprint-header-info">
              <h1 className="sprint-main-title">
                {type === "FLOW" ? "Sprint Flow Manager" : "Sprint Board Manager"}
              </h1>
              <p className="sprint-main-subtitle">
                {`Configure your sprint ${type === "FLOW" ? "flow" : "board"} columns and status mappings`}
              </p>
            </div>
            <button 
              onClick={handleSave} 
              className="sprint-btn-save"
              disabled={!hasChanges}
            >
              <span className="sprint-icon">💾</span>
              {hasChanges ? 'Save Changes' : 'Saved'}
            </button>
          </div>

          <div className="sprint-view-tabs">
            <button
              onClick={() => setActiveView('board')}
              className={`sprint-tab ${activeView === 'board' ? 'sprint-tab-active' : ''}`}
            >
              <span className="sprint-icon">📊</span>
              {type === "FLOW" ? "Flow Preview" : "Board Preview"}
            </button>
            <button
              onClick={() => setActiveView('config')}
              className={`sprint-tab ${activeView === 'config' ? 'sprint-tab-active' : ''}`}
            >
              <span className="sprint-icon">⚙️</span>
              Configure
            </button>
            <button
              onClick={() => setActiveView('mapping')}
              className={`sprint-tab ${activeView === 'mapping' ? 'sprint-tab-active' : ''}`}
            >
              <span className="sprint-icon">🔗</span>
              Status Mapping
            </button>
          </div>
        </div>

        {/* Board Preview View */}
        {activeView === 'board' && (
          <div className="sprint-content-card">
            <h2 className="sprint-section-title">
              {type === "FLOW" ? "Flow Preview" : "Board Preview"}
            </h2>
            <div className="sprint-board-preview">
              {localConfig?.columns?.map((column) => (
                <div
                  key={column.id}
                  className="sprint-board-column"
                  style={{ borderTopColor: column.color }}
                >
                  <div className="sprint-column-header">
                    <div className="sprint-column-info">
                      <h3 className="sprint-column-name">{column.name}</h3>
                      {column.wipLimit && (
                        <p className="sprint-wip-limit">WIP Limit: {column.wipLimit}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingColumn(column.id)}
                      className="sprint-icon-btn"
                      title="Edit"
                    >
                      ✏️
                    </button>
                  </div>

                  <div className="sprint-status-cards">
                    {column.statusKeys.map((statusKey) => {
                      const status = getStatusByKey(statusKey);
                      return status ? (
                        <div
                          key={statusKey}
                          className="sprint-status-card"
                          style={{
                            backgroundColor: status.color.bg,
                            color: status.color.text,
                            borderLeftColor: status.color.border
                          }}
                        >
                          <p className="sprint-status-label">{status.label}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}

              <button onClick={() => setShowAddColumn(true)} className="sprint-add-column-card">
                <span className="sprint-add-icon">+</span>
                <p>Add Column</p>
              </button>
            </div>
          </div>
        )}

        {/* Configuration View */}
        {activeView === 'config' && (
          <div className="sprint-config-view">
            <div className="sprint-content-card">
              <div className="sprint-card-header">
                <h2 className="sprint-section-title">
                  {type === "FLOW" ? "Flow Configuration" : "Board Columns"}
                </h2>
                <button onClick={() => setShowAddColumn(true)} className="sprint-btn-primary">
                  <span className="sprint-icon">+</span>
                  Add Column
                </button>
              </div>

              <div className="sprint-column-list">
                {(localConfig?.columns || []).map((column, index) => (
                  <div key={column.id} className="sprint-column-item">
                    <div className="sprint-column-item-header">
                      <div className="sprint-column-item-info">
                        <div
                          className="sprint-color-indicator"
                          style={{ backgroundColor: column.color }}
                        />
                        <div>
                          <h3 className="sprint-column-item-name">{column.name}</h3>
                          <p className="sprint-column-item-meta">
                            {column.statusKeys.length} status(es) mapped
                          </p>
                        </div>
                      </div>
                      <div className="sprint-column-item-actions">
                        <button
                          onClick={() => moveColumn(column.id, 'left')}
                          disabled={index === 0}
                          className="sprint-icon-btn"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => moveColumn(column.id, 'right')}
                          disabled={index === (localConfig?.columns?.length || 0) - 1}
                          className="sprint-icon-btn"
                        >
                          →
                        </button>
                        <button
                          onClick={() => setEditingColumn(column.id)}
                          className="sprint-icon-btn"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteColumn(column.id)}
                          className="sprint-icon-btn sprint-danger"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {column.wipLimit && (
                      <div className="sprint-wip-info">
                        WIP Limit: <span>{column.wipLimit}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {getUnassignedStatuses().length > 0 && (
              <div className="sprint-warning-card">
                <h3 className="sprint-warning-title">Unassigned Statuses</h3>
                <div className="sprint-status-badges">
                  {getUnassignedStatuses().map((status) => (
                    <div
                      key={status.key}
                      className="sprint-status-badge"
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
                <p className="sprint-warning-text">
                  These statuses are not mapped to any column. Add them to columns in the mapping view.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Status Mapping View */}
        {activeView === 'mapping' && (
          <div className="sprint-content-card">
            <h2 className="sprint-section-title">Status to Column Mapping</h2>
            <div className="sprint-mapping-sections">
              {(localConfig?.columns || []).map((column) => (
                <div key={column.id} className="sprint-mapping-section">
                  <div className="sprint-mapping-header">
                    <div
                      className="sprint-color-indicator"
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className="sprint-mapping-title">{column.name}</h3>
                  </div>

                  <div className="sprint-status-grid">
                    {(statusWorkFlow?.statuses || []).map((status) => (
                      <label
                        key={status.key}
                        className={`sprint-status-checkbox ${
                          column.statusKeys.includes(status.key) ? 'sprint-checked' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={column.statusKeys.includes(status.key)}
                          onChange={() => toggleStatus(column.id, status.key)}
                        />
                        <div
                          className="sprint-status-chip"
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

        {/* Export Configuration */}
        <div className="sprint-content-card">
          <h2 className="sprint-section-title">Configuration JSON</h2>
            <div className="sprint-json-viewer">
            <pre>{JSON.stringify(localConfig || {}, null, 2)}</pre>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(localConfig, null, 2));
              alert('Configuration copied to clipboard!');
            }}
            className="sprint-btn-copy"
          >
            📋 Copy Configuration
          </button>
        </div>
      </div>

      {/* Add Column Modal */}
              {showAddColumn && (
        <div className="sprint-modal-overlay" onClick={() => setShowAddColumn(false)}>
          <div className="sprint-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sprint-modal-header">
              <h2>Add New Column</h2>
              <button onClick={() => setShowAddColumn(false)} className="sprint-close-btn">
                ✕
              </button>
            </div>

            <div className="sprint-modal-body">
              <div className="sprint-form-group">
                <label>Column Name *</label>
                <input
                  type="text"
                  value={newColumn.name}
                  onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
                  placeholder="e.g., Code Review"
                />
              </div>

              <div className="sprint-form-group">
                <label>Column Color</label>
                <div className="sprint-color-grid">
                  {predefinedColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setNewColumn({ ...newColumn, color: color.value })}
                      className={`sprint-color-option ${
                        newColumn.color === color.value ? 'sprint-color-active' : ''
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sprint-form-group">
                <label>WIP Limit (optional)</label>
                <input
                  type="number"
                  value={newColumn.wipLimit || ''}
                  onChange={(e) =>
                    setNewColumn({
                      ...newColumn,
                      wipLimit: e.target.value ? parseInt(e.target.value) : null
                    })
                  }
                  placeholder="Leave empty for no limit"
                  min="1"
                />
              </div>

              <div className="sprint-form-group">
                <label>Select Statuses *</label>
                <div className="sprint-status-select-grid">
                    {(statusWorkFlow?.statuses || []).map((status) => (
                    <label
                      key={status.key}
                      className={`sprint-status-select-item ${
                        newColumn.statusKeys.includes(status.key) ? 'sprint-checked' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newColumn.statusKeys.includes(status.key)}
                        onChange={(e) => {
                          const statusKeys = e.target.checked
                            ? [...newColumn.statusKeys, status.key]
                            : newColumn.statusKeys.filter((key) => key !== status.key);
                          setNewColumn({ ...newColumn, statusKeys });
                        }}
                      />
                      <div
                        className="sprint-status-chip"
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

            <div className="sprint-modal-footer">
              <button onClick={() => setShowAddColumn(false)} className="sprint-btn-cancel">
                Cancel
              </button>
              <button
                onClick={addColumn}
                disabled={!newColumn.name || newColumn.statusKeys.length === 0}
                className="sprint-btn-primary"
              >
                Add Column
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Column Modal */}
      {editingColumn && (
        <div className="sprint-modal-overlay" onClick={() => setEditingColumn(null)}>
          <div className="sprint-modal-content" onClick={(e) => e.stopPropagation()}>
              {(() => {
            const column = (localConfig?.columns || []).find((col) => col.id === editingColumn);
            if (!column) return null;

              return (
                <>
                  <div className="sprint-modal-header">
                    <h2>Edit Column</h2>
                    <button onClick={() => setEditingColumn(null)} className="sprint-close-btn">
                      ✕
                    </button>
                  </div>

                  <div className="sprint-modal-body">
                    <div className="sprint-form-group">
                      <label>Column Name</label>
                      <input
                        type="text"
                        value={column.name}
                        onChange={(e) =>
                          updateColumn(editingColumn, { name: e.target.value })
                        }
                      />
                    </div>

                    <div className="sprint-form-group">
                      <label>Column Color</label>
                      <div className="sprint-color-grid">
                        {predefinedColors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() =>
                              updateColumn(editingColumn, { color: color.value })
                            }
                            className={`sprint-color-option ${
                              column.color === color.value ? 'sprint-color-active' : ''
                            }`}
                            style={{ backgroundColor: color.value }}
                          >
                            {color.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="sprint-form-group">
                      <label>WIP Limit</label>
                      <input
                        type="number"
                        value={column.wipLimit || ''}
                        onChange={(e) =>
                          updateColumn(editingColumn, {
                            wipLimit: e.target.value ? parseInt(e.target.value) : null
                          })
                        }
                        placeholder="Leave empty for no limit"
                        min="1"
                      />
                    </div>

                    <div className="sprint-form-group">
                      <label>Statuses in this Column</label>
                      <div className="sprint-status-select-grid">
                        {(statusWorkFlow?.statuses || []).map((status) => (
                          <label
                            key={status.key}
                            className={`sprint-status-select-item ${
                              column.statusKeys.includes(status.key) ? 'sprint-checked' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={column.statusKeys.includes(status.key)}
                              onChange={() => toggleStatus(editingColumn, status.key)}
                            />
                            <div
                              className="sprint-status-chip"
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

                  <div className="sprint-modal-footer">
                    <button onClick={() => setEditingColumn(null)} className="sprint-btn-primary">
                      Done
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintFLowBoard;