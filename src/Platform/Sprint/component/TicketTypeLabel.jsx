import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit3, Trash2, Info, X, Check, Search, BadgePlus } from "lucide-react";
import { TICKET_ICON_LIBRARY } from "./Data/tickeyTypeIcon";
import "./styles/TicketTypeManager.scss";
import { ticketConfiguratorActionV1 } from "../../../Redux/Actions/PlatformActions.js/projectsActions";
import { useDispatch, useSelector } from "react-redux";
import { SHOW_SNACKBAR } from "../../../Redux/Constants/PlatformConstatnt/platformConstant";

const PREVIEW_NUMBER = "001";

const TicketTypeManager = ({projectId}) => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentType, setCurrentType] = useState(null);

  // Auto-fill data from "backend" (mocked)
const mockBackendData = useMemo(() => [
  { id: "1", name: "Bug Fix", suffix: "BUG", iconId: "bug", color: "#e11d48" },
  { id: "2", name: "New Feature", suffix: "FEAT", iconId: "rocket", color: "#2563eb" },
  { id: "3", name: "Internal Task", suffix: "TASK", iconId: "tag", color: "#64748b" },
  { id: "4", name: "Refactoring", suffix: "REFA", iconId: "refactor", color: "#7c3aed" },
], []); // Empty array means "only create this once"


  // ============================Hooks initilization ===========================
      const dispatch = useDispatch();
      const {projectConventions}= useSelector((state)=>state.projects)
      
  // ============================Hooks initilization ===========================

  // =========================================== Api calls here ==================


  useEffect(() => {
    if (projectConventions?.length >0) {
    setTicketTypes(projectConventions );
    }else{
    setTicketTypes( mockBackendData);
    }
  }, [projectConventions,mockBackendData]);


  // =========================================== Api calls here ==================





  const openEdit = (type = null) => {
    setCurrentType(type || { typeId: Date.now(), name: "", suffix: "", iconId: "tag", color: "#2563eb" });
    setIsEditing(true);
  };

  const saveType = (updated) => {
    setTicketTypes(prev => {
      const exists = prev.find(t => t.typeId === updated.typeId);
      return exists ? prev.map(t => t.typeId === updated.typeId ? updated : t) : [...prev, updated];
    });
    setIsEditing(false);
  };

  const [isSaving, setIsSaving] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);

const handleFinalSave = async () => {
  setIsSaving(true);
  try {
    // API Call to your Render Backend
 dispatch(ticketConfiguratorActionV1(projectId,"conventions",ticketTypes))    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000); // Hide success after 3s
  } catch (error) {
    alert("Error saving conventions. Check your connection.");
    dispatch({
      type:SHOW_SNACKBAR,
      payload:{
        type:"error",
        msg:error.message

      }
    })
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div className="convention-card">
      <header className="card-header">
        <div className="header-text">
          <h2>Ticket Conventions</h2>
        { projectConventions?.length===0 ? <div className="edu-badge">
            <Info size={14} />
            <span>Below are the default conventions for Ticket you can customize it as per your requirement.</span>
          </div>:
          
          <div className="edu-badge">
            <Info size={14} />
            <span>These prefixes link GitHub commits to your project tickets automatically.</span>
          </div>
          }
        </div>
          <BadgePlus color="#1d72e2" size={38} onClick={() => openEdit()} />
      </header>

      {/* Scrollable List Section */}
      <div className="list-container">
        <div className="list-labels">
          <span>Icon & Name</span>
          <span>Suffix</span>
          <span>Preview</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="scroll-viewport">
          {ticketTypes.map((type) => (
            <div key={type.id} className="type-row">
              <div className="type-main">
                <div className="icon-frame" style={{ color: type.color, backgroundColor: `${type.color}15` }}
                     dangerouslySetInnerHTML={{ __html: TICKET_ICON_LIBRARY[type.iconId]?.svg }} />
                <span className="name">{type.name}</span>
              </div>
              
              <code className="suffix-code">{type.suffix}</code>
              
              <div className="preview-tag" style={{ color: type.color, backgroundColor: `${type.color}10`, border: `1px solid ${type.color}30` }}>
                {type.suffix}-{PREVIEW_NUMBER}
              </div>

              <div className="actions">
                <button onClick={() => openEdit(type)} className="action-btn edit"><Edit3 size={16} /></button>
                <button onClick={() => setTicketTypes(prev => prev.filter(t => t.id !== type.id))} className="action-btn delete"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Edit/Add Modal Popup */}
      {isEditing && (
        <EditPopup 
          data={currentType} 
          onClose={() => setIsEditing(false)} 
          onSave={saveType} 
          library={TICKET_ICON_LIBRARY} 
        />
      )}
      <footer className="manager-footer">
        <div className="footer-content">
          <p className="footer-hint">
            <Check size={24} /> Changes are saved locally. Click "Save All Changes" to update the backend.
          </p>
          <button 
            className={`save-main-btn ${isSaving ? 'loading' : ''} ${showSuccess ? 'success' : ''}`}
            onClick={handleFinalSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="spinner"></span>
            ) : showSuccess ? (
              <><Check size={18} /> Saved Successfully</>
            ) : (
              "Save All Changes"
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

/* --- EDIT POPUP COMPONENT --- */
const EditPopup = ({ data, onClose, onSave, library }) => {
  const [form, setForm] = useState(data);
  const [search, setSearch] = useState("");

  const filteredIcons = Object.values(library).filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Convention</h3>
          <button className="close-x" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          <div className="input-split">
            <div className="field">
              <label>Display Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Hotfix" />
            </div>
            <div className="field">
              <label>ID Suffix</label>
              <input value={form.suffix} maxLength={5} onChange={e => setForm({...form, suffix: e.target.value.toUpperCase().replace(/[^A-Z]/g, '')})} placeholder="HFX" />
            </div>
          </div>

          <label className="section-label">Select Visual Identity</label>
          <div className="icon-selector">
            <div className="search-bar">
              <Search size={14} />
              <input placeholder="Search icons..." onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="icon-grid">
              {filteredIcons.map(icon => (
                <button key={icon.id} 
                        className={`grid-item ${form.iconId === icon.id ? 'selected' : ''}`}
                        onClick={() => setForm({...form, iconId: icon.id})}>
                  <div className="svg-hold" dangerouslySetInnerHTML={{ __html: icon.svg }} />
                  <span>{icon.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Brand Color</label>
            <input type="color" className="color-pt" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave(form)}>Save Convention</button>
        </div>
      </div>
    </div>
  );
};

export default TicketTypeManager;