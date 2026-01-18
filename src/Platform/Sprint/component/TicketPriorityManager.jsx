import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit3, Trash2, Info, X, Check, ArrowUp, ArrowDown, Minus } from "lucide-react";
import "./styles/TicketPriorityManager.scss";
import { useDispatch, useSelector } from "react-redux";
import { ticketConfiguratorActionV1 } from "../../../Redux/Actions/PlatformActions.js/projectsActions";

const TicketPriorityManager = ({projectId}) => {
  const [priorities, setPriorities] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPriority, setCurrentPriority] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);

  // Auto-fill standard priorities from "backend"
  
  const defaultPriorities = useMemo(()=>[
    { id: 1, name: "Urgent", level: 4, color: "#e11d48", description: "Critical blockers" },
    { id: 2, name: "High", level: 3, color: "#f59e0b", description: "Important features" },
    { id: 3, name: "Medium", level: 2, color: "#2563eb", description: "Standard tasks" },
    { id: 4, name: "Low", level: 1, color: "#64748b", description: "Minor tweaks" },
  ],[]);
  
  
  
  // ============================Hooks initilization ===========================
  const dispatch = useDispatch();
  const {projectsPriorities}= useSelector((state)=>state.projects)
  // ============================Hooks initilization ===========================
  
  // =========================================== Api calls here ==================
  useEffect(() => {
    setPriorities(projectsPriorities.length>0 ?projectsPriorities:defaultPriorities);
  }, [projectId,defaultPriorities,projectsPriorities]);



    const handleSaveAllPriorities = () => {
      dispatch(ticketConfiguratorActionV1(projectId,"priorities",priorities))
    }
  // =========================================== Api calls here ==================






  const openEdit = (priority = null) => {
    setCurrentPriority(priority || { priorityId: Date.now(), name: "", level: 1, color: "#3b82f6", description: "" });
    setIsEditing(true);
  };

  const savePriority = (updated) => {
    setPriorities(prev => {
      const exists = prev.find(p => p.priorityId === updated.priorityId);
      const newState = exists ? prev.map(p => p.priorityId === updated.priorityId ? updated : p) : [...prev, updated];
      return newState.sort((a, b) => b.level - a.level); // Keep highest priority at top
    });
    setIsEditing(false);
  };

  return (
    <div className="priority-card">
      <header className="card-header">
        <div className="header-text">
          <h2>Ticket Priorities</h2>
          <div className="edu-badge">
            <Info size={14} />
            <span>Priorities help Hora rank tasks in your automated sprint backlog.</span>
          </div>
        </div>
        <button className="primary-add" onClick={() => openEdit()}>
          <Plus size={18} /> Add Priority
        </button>
      </header>

      <div className="list-container">
        <div className="list-labels">
          <span>Rank & Name</span>
          <span>Level</span>
          <span>Description</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="scroll-viewport">
          {priorities.map((p) => (
            <div key={p.id} className="priority-row">
              <div className="priority-main">
                <div className="priority-indicator" style={{ backgroundColor: p.color }} />
                <span className="name">{p.name}</span>
              </div>
              
              <div className="level-badge">
                {p.level >= 3 ? <ArrowUp size={14} /> : p.level === 2 ? <Minus size={14} /> : <ArrowDown size={14} />}
                Lvl {p.level}
              </div>
              
              <span className="description">{p.description || "No description set"}</span>

              <div className="actions">
                <button onClick={() => openEdit(p)} className="action-btn edit"><Edit3 size={16} /></button>
                <button onClick={() => setPriorities(prev => prev.filter(item => item.id !== p.id))} className="action-btn delete"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="manager-footer">
        <div className="footer-content">
          <p className="footer-hint">Priority levels affect how tasks appear in your Project Board.</p>
          <button className="save-main-btn" onClick={handleSaveAllPriorities}>
            Save Priorities
          </button>
        </div>
      </footer>

      {isEditing && (
        <PriorityModal 
          data={currentPriority} 
          onClose={() => setIsEditing(false)} 
          onSave={savePriority} 
        />
      )}
    </div>
  );
};

/* --- EDIT MODAL --- */
const PriorityModal = ({ data, onClose, onSave }) => {
  const [form, setForm] = useState(data);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Configure Priority</h3>
          <button className="close-x" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div className="input-split">
            <div className="field">
              <label>Priority Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Immediate" />
            </div>
            <div className="field">
              <label>Level (1-15)</label>
              <input type="number" min="1" max="15" value={form.level} onChange={e => setForm({...form, level: parseInt(e.target.value)})} />
            </div>
          </div>
          <div className="field">
            <label>Color Tag</label>
            <input type="color" className="color-pt" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
          </div>
          <div className="field">
            <label>Internal Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="When should users use this priority?" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave(form)}>Update Priority</button>
        </div>
      </div>
    </div>
  );
};

export default TicketPriorityManager;