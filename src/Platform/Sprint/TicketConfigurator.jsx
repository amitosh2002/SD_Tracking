import React, { useState } from 'react';
import './style/ConfigurationPage.scss';
import { 
  Hash, ListOrdered, Plus, Trash2, Settings, 
  ChevronDown, Rocket, Bug, LifeBuoy, Tag, Bookmark, 
  CheckCircle, LayoutGrid, Info 
} from 'lucide-react';
import SprintBoardManager from './component/SprintBoardManager';
import LabelManager from './component/LabelManager';
import ColumnStatusManager from './component/BoardConfigration';

// This map stores the raw SVG strings that will be sent to your backend
const SVG_LIB = {
  Rocket: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/></svg>',
  Bug: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8Z"/><path d="M5 12H4"/><path d="M20 12h-1"/><path d="M19 17h-1"/><path d="M6 17H5"/><path d="m14.83 9.17 1.83-1.83"/><path d="m7.33 16.67-1.83 1.83"/><path d="m14.83 14.83 1.83 1.83"/><path d="m7.33 7.33-1.83-1.83"/></svg>',
  Tag: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  LifeBuoy: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>'
};

const WorkspaceConfig = () => {
  const [selectedProject, setSelectedProject] = useState("Alpha CRM System");

  // Naming Conventions State (with icon svg code)
  const [conventions, setConventions] = useState([
    { id: 1, label: 'Feature', prefix: 'FEAT', separator: '-', iconKey: 'Rocket', svgCode: SVG_LIB.Rocket },
    { id: 2, label: 'Bug', prefix: 'BUG', separator: '_', iconKey: 'Bug', svgCode: SVG_LIB.Bug }
  ]);

  // Priority Levels State
  const [priorities, setPriorities] = useState([
    { id: 1, label: 'Urgent', color: '#ef4444' },
    { id: 2, label: 'High', color: '#f59e0b' },
    { id: 3, label: 'Normal', color: '#3b82f6' }
  ]);

  const addConvention = () => {
    setConventions([...conventions, { 
      id: Date.now(), label: 'Task', prefix: 'TASK', separator: '-', iconKey: 'Tag', svgCode: SVG_LIB.Tag 
    }]);
  };

  const updateConvention = (id, field, value) => {
    setConventions(conventions.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        if (field === 'iconKey') updated.svgCode = SVG_LIB[value];
        return updated;
      }
      return c;
    }));
  };

  const handleSave = () => {
    const payload = {
      project: selectedProject,
      ticketConfig: conventions,
      priorityConfig: priorities
    };
    console.log("Saving Workspace to Backend:", payload);
    alert("Configuration sent to backend! Check console for SVG strings.");
  };

  return (
    <div className="workspace-page">
      {/* HEADER WITH PROJECT SELECTOR */}
      <header className="main-header">
        <div className="project-selector">
          <div className="project-icon">
            <LayoutGrid size={20} />
          </div>
          <div className="dropdown-area">
            <span className="label">Project Workspace</span>
            <div className="current-select">
              {selectedProject} <ChevronDown size={14} />
            </div>
          </div>
        </div>
        <button className="btn-save-main" onClick={handleSave}>Create Workspace</button>
      </header>

      <div className="config-layout">
        <div className="config-grid">
          
          {/* TICKET NAMING SECTION */}
          <section className="config-card">
            <div className="card-header">
              <Hash size={18} />
              <h2>Ticket Naming Conventions</h2>
              <button className="add-btn" onClick={addConvention}><Plus size={16} /></button>
            </div>
            <div className="card-body">
              {conventions.map((conv) => (
                <div key={conv.id} className="convention-item">
                  <div className="item-inputs">
                    <select 
                      className="icon-picker"
                      value={conv.iconKey}
                      onChange={(e) => updateConvention(conv.id, 'iconKey', e.target.value)}
                    >
                      <option value="Rocket">🚀</option>
                      <option value="Bug">🐛</option>
                      <option value="Tag">🏷️</option>
                      <option value="LifeBuoy">🛟</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Label" 
                      value={conv.label}
                      onChange={(e) => updateConvention(conv.id, 'label', e.target.value)}
                    />
                    <input 
                      className="prefix" 
                      type="text" 
                      value={conv.prefix}
                      onChange={(e) => updateConvention(conv.id, 'prefix', e.target.value.toUpperCase())}
                    />
                    <select 
                      className="separator"
                      value={conv.separator}
                      onChange={(e) => updateConvention(conv.id, 'separator', e.target.value)}
                    >
                      <option value="-">-</option>
                      <option value="_">_</option>
                      <option value="/">/</option>
                      <option value=".">.</option>
                    </select>
                    <button className="delete-btn" onClick={() => setConventions(conventions.filter(c => c.id !== conv.id))}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="item-preview">
                    Preview: <span>{conv.prefix}{conv.separator}101</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PRIORITY MANAGEMENT SECTION */}
          <section className="config-card">
            <div className="card-header">
              <ListOrdered size={18} />
              <h2>Priority Levels</h2>
              <button className="add-btn" onClick={() => setPriorities([...priorities, {id: Date.now(), label: 'New', color: '#6b7280'}])}>
                <Plus size={16} />
              </button>
            </div>
            <div className="card-body">
              {priorities.map((p) => (
                <div key={p.id} className="priority-row">
                  <div className="color-box">
                    <input 
                      type="color" 
                      value={p.color}
                      onChange={(e) => setPriorities(priorities.map(item => item.id === p.id ? {...item, color: e.target.value} : item))}
                    />
                  </div>
                  <input 
                    type="text" 
                    value={p.label}
                    onChange={(e) => setPriorities(priorities.map(item => item.id === p.id ? {...item, label: e.target.value} : item))}
                  />
                  <button className="delete-btn" onClick={() => setPriorities(priorities.filter(item => item.id !== p.id))}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
      <SprintBoardManager/>
      <LabelManager/>
      <ColumnStatusManager/>
    </div>
  );
};

export default WorkspaceConfig;