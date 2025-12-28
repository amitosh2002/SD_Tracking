import React from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';
import "./styles/labelcration.scss";

const LabelManager = ({ labels = [], setLabels }) => {
  
  const addLabel = () => {
    // 1. Create the new object
    const newLabel = { 
      id: Date.now(), // Unique ID for React mapping
      text: 'New Label', 
      color: '#6366f1' 
    };

    // 2. IMPORTANT: Use functional update to ensure labels are created "inside" the state
    setLabels((currentArray) => {
      const safeArray = Array.isArray(currentArray) ? currentArray : [];
      return [...safeArray, newLabel];
    });
  };

  const updateLabel = (id, field, value) => {
    setLabels(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const removeLabel = (id) => {
    setLabels(prev => prev.filter(l => l.id !== id));
  };

  return (
    <section className="config-card label-manager-section">
      <div className="card-header">
        <div className="title-group">
          <Tag size={18} />
          <h2>Global Workspace Labels</h2>
        </div>
        <button 
          type="button" // Prevents accidental form submissions
          className="add-btn" 
          onClick={addLabel}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="card-body">
        <div className="label-grid">
          {labels && labels.length > 0 ? (
            labels.map((label) => (
              <div key={label.id} className="label-item">
                <div className="color-box">
                  <input 
                    type="color" 
                    value={label.color} 
                    onChange={(e) => updateLabel(label.id, 'color', e.target.value)} 
                  />
                </div>
                <input 
                  type="text" 
                  className="label-input"
                  placeholder="Label name"
                  value={label.text} 
                  onChange={(e) => updateLabel(label.id, 'text', e.target.value)} 
                />
                <button className="delete-btn" onClick={() => removeLabel(label.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No labels created. Click the + button to add one inside this section.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LabelManager;