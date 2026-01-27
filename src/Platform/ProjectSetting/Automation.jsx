import React from 'react';
import { Zap, Plus, Settings2 } from 'lucide-react';

function Automations({projectId}) {
  return (
    <div className="section-container">
      <div className="jobs-list">
        <div className="job-card professional-card">
          <div className="job-info">
            <div className="job-icon-container active">
              <Zap size={20} />
            </div>
            <div className="job-details">
              <div className="job-header">
                <span className="job-name">Workflow Automations</span>
              </div>
              <p className="job-desc">
                Configure smart rules to automate repetitive tasks, like auto-assigning tickets or updating statuses based on GitHub activity.
              </p>
            </div>
          </div>
          
          <div className="job-actions">
            <button className="icon-button" title="Automation Settings">
              <Settings2 size={16} />
            </button>
            <button className="buttonPrimary" style={{ height: '36px', padding: '0 1rem', fontSize: '0.8125rem' }}>
              <Plus size={16} />
              Create Rule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Automations;