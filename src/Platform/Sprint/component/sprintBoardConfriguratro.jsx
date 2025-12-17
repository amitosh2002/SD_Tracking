// import React, { useState, useEffect } from 'react';
// import './style/SprintBoardManager.scss';

// const SprintBoardManager = () => {
//   const [loading, setLoading] = useState(false);
//   const [scrumWorkflow, setScrumWorkflow] = useState(null);
//   const [boardConfig, setBoardConfig] = useState({
//     boardName: 'Sprint Board',
//     columns: [
//       {
//         id: 'col_1',
//         name: 'To Do',
//         statusKeys: ['OPEN'],
//         color: '#3b82f6',
//         wipLimit: null
//       },
//       {
//         id: 'col_2',
//         name: 'In Progress',
//         statusKeys: ['IN_PROGRESS'],
//         color: '#f59e0b',
//         wipLimit: 5
//       },
//       {
//         id: 'col_3',
//         name: 'Done',
//         statusKeys: ['CLOSED'],
//         color: '#10b981',
//         wipLimit: null
//       }
//     ]
//   });

//   const [editingColumn, setEditingColumn] = useState(null);
//   const [showAddColumn, setShowAddColumn] = useState(false);
//   const [newColumn, setNewColumn] = useState({
//     name: '',
//     statusKeys: [],
//     color: '#6366f1',
//     wipLimit: null
//   });

//   const [activeView, setActiveView] = useState('board');

//   const fetchScrumWorkflow = async () => {
//     setLoading(true);
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     const mockWorkflow = {
//       partnerId: 'p1',
//       projectId: 'proj123',
//       statuses: [
//         {
//           key: 'OPEN',
//           label: 'Open',
//           color: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
//           isTerminal: false
//         },
//         {
//           key: 'IN_PROGRESS',
//           label: 'In Progress',
//           color: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
//           isTerminal: false
//         },
//         {
//           key: 'IN_REVIEW',
//           label: 'In Review',
//           color: { bg: '#e0e7ff', text: '#3730a3', border: '#6366f1' },
//           isTerminal: false
//         },
//         {
//           key: 'TESTING',
//           label: 'Testing',
//           color: { bg: '#fce7f3', text: '#831843', border: '#ec4899' },
//           isTerminal: false
//         },
//         {
//           key: 'CLOSED',
//           label: 'Closed',
//           color: { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
//           isTerminal: true
//         },
//         {
//           key: 'BLOCKED',
//           label: 'Blocked',
//           color: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
//           isTerminal: false
//         }
//       ],
//       transitions: [
//         { from: 'OPEN', to: ['IN_PROGRESS', 'BLOCKED'] },
//         { from: 'IN_PROGRESS', to: ['IN_REVIEW', 'BLOCKED', 'OPEN'] },
//         { from: 'IN_REVIEW', to: ['TESTING', 'IN_PROGRESS'] },
//         { from: 'TESTING', to: ['CLOSED', 'IN_PROGRESS'] },
//         { from: 'BLOCKED', to: ['OPEN', 'IN_PROGRESS'] }
//       ]
//     };

//     setScrumWorkflow(mockWorkflow);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchScrumWorkflow();
//   }, []);

//   const predefinedColors = [
//     { name: 'Blue', value: '#3b82f6' },
//     { name: 'Purple', value: '#6366f1' },
//     { name: 'Green', value: '#10b981' },
//     { name: 'Yellow', value: '#f59e0b' },
//     { name: 'Red', value: '#ef4444' },
//     { name: 'Pink', value: '#ec4899' },
//     { name: 'Cyan', value: '#06b6d4' },
//     { name: 'Indigo', value: '#4f46e5' }
//   ];

//   const handleAddColumn = () => {
//     if (!newColumn.name || newColumn.statusKeys.length === 0) return;

//     const column = {
//       id: `col_${Date.now()}`,
//       ...newColumn
//     };

//     setBoardConfig({
//       ...boardConfig,
//       columns: [...boardConfig.columns, column]
//     });

//     setNewColumn({
//       name: '',
//       statusKeys: [],
//       color: '#6366f1',
//       wipLimit: null
//     });
//     setShowAddColumn(false);
//   };

//   const handleUpdateColumn = (columnId, updates) => {
//     setBoardConfig({
//       ...boardConfig,
//       columns: boardConfig.columns.map(col =>
//         col.id === columnId ? { ...col, ...updates } : col
//       )
//     });
//   };

//   const handleDeleteColumn = (columnId) => {
//     setBoardConfig({
//       ...boardConfig,
//       columns: boardConfig.columns.filter(col => col.id !== columnId)
//     });
//   };

//   const handleMoveColumn = (columnId, direction) => {
//     const index = boardConfig.columns.findIndex(col => col.id === columnId);
//     if (
//       (direction === 'left' && index === 0) ||
//       (direction === 'right' && index === boardConfig.columns.length - 1)
//     ) {
//       return;
//     }

//     const newColumns = [...boardConfig.columns];
//     const newIndex = direction === 'left' ? index - 1 : index + 1;
//     [newColumns[index], newColumns[newIndex]] = [newColumns[newIndex], newColumns[index]];

//     setBoardConfig({ ...boardConfig, columns: newColumns });
//   };

//   const toggleStatusInColumn = (columnId, statusKey) => {
//     const column = boardConfig.columns.find(col => col.id === columnId);
//     const statusKeys = column.statusKeys.includes(statusKey)
//       ? column.statusKeys.filter(key => key !== statusKey)
//       : [...column.statusKeys, statusKey];

//     handleUpdateColumn(columnId, { statusKeys });
//   };

//   const getStatusByKey = (key) => {
//     return scrumWorkflow?.statuses.find(s => s.key === key);
//   };

//   const getUnassignedStatuses = () => {
//     if (!scrumWorkflow) return [];
//     const assignedKeys = new Set(boardConfig.columns.flatMap(col => col.statusKeys));
//     return scrumWorkflow.statuses.filter(status => !assignedKeys.has(status.key));
//   };

//   if (loading) {
//     return (
//       <div className="sprint-board-container sprint-loading">
//         <div className="sprint-loading-content">
//           <div className="sprint-spinner"></div>
//           <p>Loading workflow from Scrum...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="sprint-board-container">
//       <div className="sprint-wrapper">
//         {/* Header */}
//         <div className="sprint-header-card">
//           <div className="sprint-header-top">
//             <div className="sprint-header-info">
//               <h1 className="sprint-main-title">Sprint Board Manager</h1>
//               <p className="sprint-main-subtitle">Configure your sprint board columns and status mappings</p>
//             </div>
//             <button onClick={fetchScrumWorkflow} className="sprint-btn-refresh">
//               <span className="sprint-icon">🔄</span>
//               Refresh Workflow
//             </button>
//           </div>

//           <div className="sprint-view-tabs">
//             <button
//               onClick={() => setActiveView('board')}
//               className={`sprint-tab ${activeView === 'board' ? 'sprint-tab-active' : ''}`}
//             >
//               <span className="sprint-icon">📊</span>
//               Board Preview
//             </button>
//             <button
//               onClick={() => setActiveView('config')}
//               className={`sprint-tab ${activeView === 'config' ? 'sprint-tab-active' : ''}`}
//             >
//               <span className="sprint-icon">⚙️</span>
//               Configure
//             </button>
//             <button
//               onClick={() => setActiveView('mapping')}
//               className={`sprint-tab ${activeView === 'mapping' ? 'sprint-tab-active' : ''}`}
//             >
//               <span className="sprint-icon">🔗</span>
//               Status Mapping
//             </button>
//           </div>
//         </div>

//         {/* Board Preview View */}
//         {activeView === 'board' && (
//           <div className="sprint-content-card">
//             <h2 className="sprint-section-title">Board Preview</h2>
//             <div className="sprint-board-preview">
//               {boardConfig.columns.map((column) => (
//                 <div
//                   key={column.id}
//                   className="sprint-board-column"
//                   style={{ borderTopColor: column.color }}
//                 >
//                   <div className="sprint-column-header">
//                     <div className="sprint-column-info">
//                       <h3 className="sprint-column-name">{column.name}</h3>
//                       {column.wipLimit && (
//                         <p className="sprint-wip-limit">WIP Limit: {column.wipLimit}</p>
//                       )}
//                     </div>
//                     <button
//                       onClick={() => setEditingColumn(column.id)}
//                       className="sprint-icon-btn"
//                       title="Edit"
//                     >
//                       ✏️
//                     </button>
//                   </div>

//                   <div className="sprint-status-cards">
//                     {column.statusKeys.map((statusKey) => {
//                       const status = getStatusByKey(statusKey);
//                       return status ? (
//                         <div
//                           key={statusKey}
//                           className="sprint-status-card"
//                           style={{
//                             backgroundColor: status.color.bg,
//                             color: status.color.text,
//                             borderLeftColor: status.color.border
//                           }}
//                         >
//                           <p className="sprint-status-label">{status.label}</p>
//                         </div>
//                       ) : null;
//                     })}
//                   </div>
//                 </div>
//               ))}

//               <button onClick={() => setShowAddColumn(true)} className="sprint-add-column-card">
//                 <span className="sprint-add-icon">+</span>
//                 <p>Add Column</p>
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Configuration View */}
//         {activeView === 'config' && (
//           <div className="sprint-config-view">
//             <div className="sprint-content-card">
//               <div className="sprint-card-header">
//                 <h2 className="sprint-section-title">Board Columns</h2>
//                 <button onClick={() => setShowAddColumn(true)} className="sprint-btn-primary">
//                   <span className="sprint-icon">+</span>
//                   Add Column
//                 </button>
//               </div>

//               <div className="sprint-column-list">
//                 {boardConfig.columns.map((column, index) => (
//                   <div key={column.id} className="sprint-column-item">
//                     <div className="sprint-column-item-header">
//                       <div className="sprint-column-item-info">
//                         <div
//                           className="sprint-color-indicator"
//                           style={{ backgroundColor: column.color }}
//                         />
//                         <div>
//                           <h3 className="sprint-column-item-name">{column.name}</h3>
//                           <p className="sprint-column-item-meta">
//                             {column.statusKeys.length} status(es) mapped
//                           </p>
//                         </div>
//                       </div>
//                       <div className="sprint-column-item-actions">
//                         <button
//                           onClick={() => handleMoveColumn(column.id, 'left')}
//                           disabled={index === 0}
//                           className="sprint-icon-btn"
//                         >
//                           ←
//                         </button>
//                         <button
//                           onClick={() => handleMoveColumn(column.id, 'right')}
//                           disabled={index === boardConfig.columns.length - 1}
//                           className="sprint-icon-btn"
//                         >
//                           →
//                         </button>
//                         <button
//                           onClick={() => setEditingColumn(column.id)}
//                           className="sprint-icon-btn"
//                         >
//                           ✏️
//                         </button>
//                         <button
//                           onClick={() => handleDeleteColumn(column.id)}
//                           className="sprint-icon-btn sprint-danger"
//                         >
//                           🗑️
//                         </button>
//                       </div>
//                     </div>

//                     {column.wipLimit && (
//                       <div className="sprint-wip-info">
//                         WIP Limit: <span>{column.wipLimit}</span>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {getUnassignedStatuses().length > 0 && (
//               <div className="sprint-warning-card">
//                 <h3 className="sprint-warning-title">Unassigned Statuses</h3>
//                 <div className="sprint-status-badges">
//                   {getUnassignedStatuses().map((status) => (
//                     <div
//                       key={status.key}
//                       className="sprint-status-badge"
//                       style={{
//                         backgroundColor: status.color.bg,
//                         color: status.color.text,
//                         borderColor: status.color.border
//                       }}
//                     >
//                       {status.label}
//                     </div>
//                   ))}
//                 </div>
//                 <p className="sprint-warning-text">
//                   These statuses are not mapped to any column. Add them to columns in the mapping view.
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Status Mapping View */}
//         {activeView === 'mapping' && (
//           <div className="sprint-content-card">
//             <h2 className="sprint-section-title">Status to Column Mapping</h2>
//             <div className="sprint-mapping-sections">
//               {boardConfig.columns.map((column) => (
//                 <div key={column.id} className="sprint-mapping-section">
//                   <div className="sprint-mapping-header">
//                     <div
//                       className="sprint-color-indicator"
//                       style={{ backgroundColor: column.color }}
//                     />
//                     <h3 className="sprint-mapping-title">{column.name}</h3>
//                   </div>

//                   <div className="sprint-status-grid">
//                     {scrumWorkflow?.statuses.map((status) => (
//                       <label
//                         key={status.key}
//                         className={`sprint-status-checkbox ${
//                           column.statusKeys.includes(status.key) ? 'sprint-checked' : ''
//                         }`}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={column.statusKeys.includes(status.key)}
//                           onChange={() => toggleStatusInColumn(column.id, status.key)}
//                         />
//                         <div
//                           className="sprint-status-chip"
//                           style={{
//                             backgroundColor: status.color.bg,
//                             color: status.color.text,
//                             borderColor: status.color.border
//                           }}
//                         >
//                           {status.label}
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Export Configuration */}
//         <div className="sprint-content-card">
//           <h2 className="sprint-section-title">Board Configuration JSON</h2>
//           <div className="sprint-json-viewer">
//             <pre>{JSON.stringify(boardConfig, null, 2)}</pre>
//           </div>
//           <button
//             onClick={() => {
//               navigator.clipboard.writeText(JSON.stringify(boardConfig, null, 2));
//               alert('Configuration copied to clipboard!');
//             }}
//             className="sprint-btn-copy"
//           >
//             📋 Copy Configuration
//           </button>
//         </div>
//       </div>

//       {/* Add Column Modal */}
//       {showAddColumn && (
//         <div className="sprint-modal-overlay" onClick={() => setShowAddColumn(false)}>
//           <div className="sprint-modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="sprint-modal-header">
//               <h2>Add New Column</h2>
//               <button onClick={() => setShowAddColumn(false)} className="sprint-close-btn">
//                 ✕
//               </button>
//             </div>

//             <div className="sprint-modal-body">
//               <div className="sprint-form-group">
//                 <label>Column Name *</label>
//                 <input
//                   type="text"
//                   value={newColumn.name}
//                   onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
//                   placeholder="e.g., Code Review"
//                 />
//               </div>

//               <div className="sprint-form-group">
//                 <label>Column Color</label>
//                 <div className="sprint-color-grid">
//                   {predefinedColors.map((color) => (
//                     <button
//                       key={color.name}
//                       onClick={() => setNewColumn({ ...newColumn, color: color.value })}
//                       className={`sprint-color-option ${
//                         newColumn.color === color.value ? 'sprint-color-active' : ''
//                       }`}
//                       style={{ backgroundColor: color.value }}
//                     >
//                       {color.name}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="sprint-form-group">
//                 <label>WIP Limit (optional)</label>
//                 <input
//                   type="number"
//                   value={newColumn.wipLimit || ''}
//                   onChange={(e) =>
//                     setNewColumn({
//                       ...newColumn,
//                       wipLimit: e.target.value ? parseInt(e.target.value) : null
//                     })
//                   }
//                   placeholder="Leave empty for no limit"
//                   min="1"
//                 />
//               </div>

//               <div className="sprint-form-group">
//                 <label>Select Statuses *</label>
//                 <div className="sprint-status-select-grid">
//                   {scrumWorkflow?.statuses.map((status) => (
//                     <label
//                       key={status.key}
//                       className={`sprint-status-select-item ${
//                         newColumn.statusKeys.includes(status.key) ? 'sprint-checked' : ''
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={newColumn.statusKeys.includes(status.key)}
//                         onChange={(e) => {
//                           const statusKeys = e.target.checked
//                             ? [...newColumn.statusKeys, status.key]
//                             : newColumn.statusKeys.filter((key) => key !== status.key);
//                           setNewColumn({ ...newColumn, statusKeys });
//                         }}
//                       />
//                       <div
//                         className="sprint-status-chip"
//                         style={{
//                           backgroundColor: status.color.bg,
//                           color: status.color.text,
//                           borderColor: status.color.border
//                         }}
//                       >
//                         {status.label}
//                       </div>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="sprint-modal-footer">
//               <button onClick={() => setShowAddColumn(false)} className="sprint-btn-cancel">
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddColumn}
//                 disabled={!newColumn.name || newColumn.statusKeys.length === 0}
//                 className="sprint-btn-primary"
//               >
//                 Add Column
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Column Modal */}
//       {editingColumn && (
//         <div className="sprint-modal-overlay" onClick={() => setEditingColumn(null)}>
//           <div className="sprint-modal-content" onClick={(e) => e.stopPropagation()}>
//             {(() => {
//               const column = boardConfig.columns.find((col) => col.id === editingColumn);
//               if (!column) return null;

//               return (
//                 <>
//                   <div className="sprint-modal-header">
//                     <h2>Edit Column</h2>
//                     <button onClick={() => setEditingColumn(null)} className="sprint-close-btn">
//                       ✕
//                     </button>
//                   </div>

//                   <div className="sprint-modal-body">
//                     <div className="sprint-form-group">
//                       <label>Column Name</label>
//                       <input
//                         type="text"
//                         value={column.name}
//                         onChange={(e) =>
//                           handleUpdateColumn(editingColumn, { name: e.target.value })
//                         }
//                       />
//                     </div>

//                     <div className="sprint-form-group">
//                       <label>Column Color</label>
//                       <div className="sprint-color-grid">
//                         {predefinedColors.map((color) => (
//                           <button
//                             key={color.name}
//                             onClick={() =>
//                               handleUpdateColumn(editingColumn, { color: color.value })
//                             }
//                             className={`sprint-color-option ${
//                               column.color === color.value ? 'sprint-color-active' : ''
//                             }`}
//                             style={{ backgroundColor: color.value }}
//                           >
//                             {color.name}
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="sprint-form-group">
//                       <label>WIP Limit</label>
//                       <input
//                         type="number"
//                         value={column.wipLimit || ''}
//                         onChange={(e) =>
//                           handleUpdateColumn(editingColumn, {
//                             wipLimit: e.target.value ? parseInt(e.target.value) : null
//                           })
//                         }
//                         placeholder="Leave empty for no limit"
//                         min="1"
//                       />
//                     </div>

//                     <div className="sprint-form-group">
//                       <label>Statuses in this Column</label>
//                       <div className="sprint-status-select-grid">
//                         {scrumWorkflow?.statuses.map((status) => (
//                           <label
//                             key={status.key}
//                             className={`sprint-status-select-item ${
//                               column.statusKeys.includes(status.key) ? 'sprint-checked' : ''
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               checked={column.statusKeys.includes(status.key)}
//                               onChange={() => toggleStatusInColumn(editingColumn, status.key)}
//                             />
//                             <div
//                               className="sprint-status-chip"
//                               style={{
//                                 backgroundColor: status.color.bg,
//                                 color: status.color.text,
//                                 borderColor: status.color.border
//                               }}
//                             >
//                               {status.label}
//                             </div>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="sprint-modal-footer">
//                     <button onClick={() => setEditingColumn(null)} className="sprint-btn-primary">
//                       Done
//                     </button>
//                   </div>
//                 </>
//               );
//             })()}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SprintBoardManager;

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./style/SprintBoardManager.scss";

const MODES = {
  BOARD: "SPRINT_BOARD",
  FLOW: "SCRUM_FLOW",
};

const AUTOSAVE_DELAY = 1200;

const SprintBoardManager = ({ projectId }) => {
  /* =======================
   * MODE
   ======================= */
  const [mode, setMode] = useState(MODES.BOARD);

  /* =======================
   * STATE
   ======================= */
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const [scrumWorkflow, setScrumWorkflow] = useState(null);
  const [boardConfig, setBoardConfig] = useState(null);

  const [activeView, setActiveView] = useState("board");

  /* AUTOSAVE */
  const autosaveTimer = useRef(null);
  const dirtyRef = useRef(false);

  /* =======================
   * FETCH
   ======================= */
  const fetchData = async () => {
    setLoading(true);
    setIsEmpty(false);

    try {
      const [workflowRes, boardRes] = await Promise.all([
        axios.get(`/api/scrum/workflow`, { params: { projectId } }),
        axios.get(`/api/board-config`, {
          params: { projectId, type: mode },
        }),
      ]);

      if (!boardRes.data) {
        setIsEmpty(true);
        return;
      }

      setScrumWorkflow(workflowRes.data);
      setBoardConfig(boardRes.data);
    } catch (e) {
      // No config exists
      setIsEmpty(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchData();
  }, [projectId, mode]);

  /* =======================
   * CREATE FIRST CONFIG
   ======================= */
  const createFirstConfig = async (type) => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/board-config`, {
        projectId,
        type,
      });

      setMode(type);
      setBoardConfig(res.data);
      setIsEmpty(false);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
   * AUTOSAVE
   ======================= */
  const scheduleAutosave = (nextConfig) => {
    dirtyRef.current = true;
    setBoardConfig(nextConfig);

    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      if (!dirtyRef.current) return;

      setSaving(true);
      try {
        await axios.put(`/api/board-config/${nextConfig._id}`, nextConfig);
        dirtyRef.current = false;
      } finally {
        setSaving(false);
      }
    }, AUTOSAVE_DELAY);
  };

  /* =======================
   * MUTATORS
   ======================= */
  const updateColumn = (id, updates) => {
    const next = {
      ...boardConfig,
      columns: boardConfig.columns.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    };
    scheduleAutosave(next);
  };

  /* =======================
   * LOADING
   ======================= */
  if (loading) {
    return (
      <div className="sprint-board-container sprint-loading">
        <div className="sprint-spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  /* =======================
   * EMPTY / WELCOME SCREEN
   ======================= */
  if (!isEmpty) {
    return (
      <div className="workflow-manager">
        <div className="workflow-header">
          <div className="header-content">
            <h1 className="page-title">Welcome 👋</h1>
            <p className="page-subtitle">
              Get started by creating your first Sprint Board or Workflow.
            </p>
          </div>
        </div>

        <div className="workflow-visualization">
          <h2 className="section-title">Create your first setup</h2>
          <p className="section-description">
            Choose how you want to organize work for this project.
          </p>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              className="btn-submit"
              onClick={() => createFirstConfig(MODES.BOARD)}
            >
              Create Sprint Board
            </button>

            <button
              className="btn-cancel"
              onClick={() => createFirstConfig(MODES.FLOW)}
            >
              Create Workflow
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================
   * NORMAL UI
   ======================= */
  return (
    <div className="workflow-manager">
      <div className="workflow-header">
        <div className="header-content">
          <h1 className="page-title">
            {mode === MODES.BOARD ? "Sprint Board" : "Workflow"}
          </h1>
          <p className="page-subtitle">
            Configure how work moves through your sprint.
          </p>
        </div>

        <div className="sprint-toggle">
          <button
            className={mode === MODES.BOARD ? "active" : ""}
            onClick={() => setMode(MODES.BOARD)}
          >
            Board
          </button>
          <button
            className={mode === MODES.FLOW ? "active" : ""}
            onClick={() => setMode(MODES.FLOW)}
          >
            Flow
          </button>
        </div>
      </div>

      {saving && <p className="autosave-indicator">Saving…</p>}

      {/* BOARD VIEW */}
      {activeView === "board" && (
        <div className="workflow-visualization">
          {boardConfig.columns.map((col) => (
            <input
              key={col.id}
              value={col.name}
              onChange={(e) =>
                updateColumn(col.id, { name: e.target.value })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SprintBoardManager;
