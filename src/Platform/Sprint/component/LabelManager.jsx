import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit3, Trash2, Info, X, Tag, Hash } from "lucide-react";
import "./styles/TicketLabelManager.scss";
import { useDispatch, useSelector } from "react-redux";
import { ticketConfiguratorActionV1 } from "../../../Redux/Actions/PlatformActions.js/projectsActions";

const TicketLabelManager = ({projectId}) => {
  const [labels, setLabels] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(null);



  // ============================Hooks initilization ===========================
      const dispatch = useDispatch();
      const {projectlabels}= useSelector((state)=>state.projects)
  // ============================Hooks initilization ===========================

    const defaultLabels = useMemo(() => [
      { id: 1, name: "Frontend", color: "#3b82f6", description: "UI/UX and React tasks" },
      { id: 2, name: "Backend", color: "#10b981", description: "Node.js and API logic" },
      { id: 3, name: "Database", color: "#f59e0b", description: "MongoDB and Schema changes" },
      { id: 4, name: "DevOps", color: "#6366f1", description: "Deployment and CI/CD" },
    ], []);


  // =========================================== Api calls here ==================

    useEffect(()=>{
      setLabels(projectlabels?.length >0 ? projectlabels :defaultLabels);
    },[projectlabels,defaultLabels])


  // =========================================== Api calls here ==================



  const openEdit = (label = null) => {
    setCurrentLabel(label || { labelId: Date.now(), name: "", color: "#3b82f6", description: "" });
    setIsEditing(true);
  };

  const saveLabel = (updated) => {
    setLabels(prev => {
      const exists = prev.find(l => l.labelId === updated.labelId);
      return exists ? prev.map(l => l.labelId === updated.labelId ? updated : l) : [...prev, updated];
    });
    setIsEditing(false);
  };

  const handelSaveAllLabels = () => {
    console.log("first")
    dispatch(ticketConfiguratorActionV1(projectId,"labels",labels))
  }

  return (
    <div className="label-card">
      <header className="card-header">
        <div className="header-text">
          <h2>Project Labels</h2>
         { projectlabels?.length ===0 ?<div className="edu-badge">
            <Info size={14} />
            <span>Below are the refernce lable for your project you can customize it as per your project requirement</span>
          </div>:
          <div className="edu-badge">
            <Info size={14} />
            <span>Labels help you filter your sprint board by department or tech stack.</span>
          </div>
          }
        </div>
        <button className="primary-add" onClick={() => openEdit()}>
          <Plus size={18} /> Add Label
        </button>
      </header>

      <div className="list-container">
        <div className="list-labels">
          <span>Label Tag</span>
          <span>Usage Description</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="scroll-viewport">
          {labels.map((l) => (
            <div key={l.id} className="label-row">
              <div className="label-main">
                <div 
                  className="label-pill" 
                  style={{ backgroundColor: `${l.color}15`, color: l.color, border: `1px solid ${l.color}40` }}
                >
                  <Tag size={12} />
                  {l.name}
                </div>
              </div>
              
              <span className="description">{l.description || "Categorize tasks with this label"}</span>

              <div className="actions">
                <button onClick={() => openEdit(l)} className="action-btn edit"><Edit3 size={16} /></button>
                <button onClick={() => setLabels(prev => prev.filter(item => item.id !== l.id))} className="action-btn delete"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="manager-footer">
        <div className="footer-content">
          <p className="footer-hint">These labels sync directly to your GitHub Issue Labels.</p>
          <button className="save-main-btn" onClick={handelSaveAllLabels}>Save All Labels</button>
        </div>
      </footer>

      {isEditing && (
        <LabelModal 
          data={currentLabel} 
          onClose={() => setIsEditing(false)} 
          onSave={saveLabel} 
        />
      )}
    </div>
  );
};

const LabelModal = ({ data, onClose, onSave }) => {
  const [form, setForm] = useState(data);
  const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#64748b"];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{data.name ? "Edit Label" : "Create New Label"}</h3>
          <button className="close-x" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label>Label Name</label>
            <input 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              placeholder="e.g. Research" 
            />
          </div>
          
          <div className="field">
            <label>Quick Color Select</label>
            <div className="color-grid">
              {colors.map(c => (
                <button 
                  key={c} 
                  className={`color-swatch ${form.color === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setForm({...form, color: c})}
                />
              ))}
              <input 
                type="color" 
                className="custom-color" 
                value={form.color} 
                onChange={e => setForm({...form, color: e.target.value})} 
              />
            </div>
          </div>

          <div className="field">
            <label>Description</label>
            <textarea 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              placeholder="What kind of tasks get this label?" 
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave(form)}>Save Label</button>
        </div>
      </div>
    </div>
  );
};

export default TicketLabelManager;