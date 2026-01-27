import React, { useState } from 'react';
import { Play, Pause, RefreshCcw, Activity } from 'lucide-react';

function RunningJobs({projectId}) {
  const [isAnalyticsRunning, setIsAnalyticsRunning] = useState(true);
  
  return (
    <div className="section-container">
      <div className="jobs-list">
        <div className="job-card professional-card">
          <div className="job-info">
            <div className={`job-icon-container ${isAnalyticsRunning ? 'active' : ''}`}>
              <Activity size={20} className={isAnalyticsRunning ? "anim-pulse" : ""} />
            </div>
            <div className="job-details">
              <div className="job-header">
                <span className="job-name">Sprint Analytics Calculation</span>
                <span className={`status-badge ${isAnalyticsRunning ? 'running' : 'paused'}`}>
                  {isAnalyticsRunning ? 'Active' : 'Paused'}
                </span>
              </div>
              <p className="job-desc">
                Automatically updates velocity and sprint burndown data every hour based on ticket movements.
              </p>
            </div>
          </div>
          
          <div className="job-actions">
            <button 
              className={`toggle-button ${isAnalyticsRunning ? 'active' : ''}`}
              onClick={() => setIsAnalyticsRunning(!isAnalyticsRunning)}
              title={isAnalyticsRunning ? "Pause Job" : "Start Job"}
            >
              <div className="toggle-track">
                <div className="toggle-thumb">
                  {isAnalyticsRunning ? <Pause size={10} /> : <Play size={10} />}
                </div>
              </div>
              <span className="toggle-text">{isAnalyticsRunning ? 'Running' : 'Paused'}</span>
            </button>
            
            <button className="icon-button" title="Run Manual Sync">
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RunningJobs;