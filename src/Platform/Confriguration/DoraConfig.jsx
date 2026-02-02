import React, { useState } from 'react';
import { 
  CheckCircle, Clock, AlertCircle, TrendingUp, Zap, Target, 
  Settings, Info, ArrowRight, Play, BarChart3, Activity, 
  GitBranch, Users, Calendar, Award, HelpCircle, BookOpen,
  ChevronRight, CheckSquare, XCircle, PlayCircle, PauseCircle
} from 'lucide-react';
import './DoraConfig.scss';

const ScrumMasterSetup = () => {
  const [activeTab, setActiveTab] = useState('mapping');
  const [showEducation, setShowEducation] = useState(true);

  const availableStatuses = [
    { value: "Backlog", category: "todo", icon: "📋" },
    { value: "To Do", category: "todo", icon: "📝" },
    { value: "In Progress", category: "progress", icon: "⚙️" },
    { value: "Coding", category: "progress", icon: "💻" },
    { value: "On Hold", category: "blocked", icon: "⏸️" },
    { value: "Peer Review", category: "review", icon: "👥" },
    { value: "QA Testing", category: "testing", icon: "🧪" },
    { value: "UAT", category: "testing", icon: "✅" },
    { value: "Ready for Deploy", category: "ready", icon: "🚀" },
    { value: "Resolved", category: "done", icon: "✔️" },
    { value: "Closed", category: "done", icon: "🔒" },
    { value: "Done", category: "done", icon: "🎉" },
    { value: "Cancelled", category: "cancelled", icon: "❌" }
  ];

  const availableFields = [
    { 
      id: "estimatePoints", 
      label: "Story Points (Fibonacci)",
      description: "Relative effort estimation using Fibonacci sequence",
      icon: <Target size={20} />,
      recommended: true
    },
    { 
      id: "totalTimeLogged", 
      label: "Actual Time Logged",
      description: "Real hours/minutes spent on tasks",
      icon: <Clock size={20} />,
      recommended: false
    },
    { 
      id: "priorityWeight", 
      label: "Priority Weightage",
      description: "Business value-based scoring",
      icon: <Award size={20} />,
      recommended: false
    },
    { 
      id: "count", 
      label: "Ticket Count",
      description: "Simple count of completed tickets",
      icon: <CheckSquare size={20} />,
      recommended: false
    }
  ];

  const [config, setConfig] = useState({
    mapping: {
      todo: ['Backlog', 'To Do'],
      progress: ['In Progress', 'Coding'],
      testing: ['QA Testing', 'UAT'],
      done: ['Resolved', 'Closed', 'Done'],
    },
    metrics: {
      velocityUnit: 'estimatePoints',
      mttrStartStatus: 'To Do',
      mttrEndStatus: 'Done',
      includeWeekends: false,
      trackBlockers: true
    }
  });

  const updateMapping = (category, value) => {
    setConfig(prev => ({
      ...prev,
      mapping: { ...prev.mapping, [category]: value }
    }));
  };

  const toggleStatus = (category, status) => {
    const current = config.mapping[category] || [];
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    updateMapping(category, updated);
  };

  const educationContent = {
    mapping: {
      title: "Why Status Mapping Matters",
      points: [
        "Hora needs to understand your workflow to calculate accurate velocity and cycle time",
        "Mapping ensures sprint burndown charts reflect your team's actual progress",
        "DORA metrics (Lead Time, Deployment Frequency) depend on correct status categorization"
      ]
    },
    metrics: {
      title: "Choosing the Right Velocity Unit",
      points: [
        "Story Points: Best for agile teams using relative estimation (Recommended)",
        "Time Logged: Useful for billing or time-tracking focused teams",
        "Ticket Count: Simple but ignores complexity differences",
        "Priority Weight: Measures business value delivered"
      ]
    },
    dora: {
      title: "DORA Metrics Explained",
      points: [
        "Lead Time: How long from ticket creation to deployment",
        "Deployment Frequency: How often you ship to production",
        "MTTR (Mean Time to Recovery): Average time to fix incidents",
        "Change Failure Rate: Percentage of deployments causing issues"
      ]
    }
  };

  return (
    <div className="dora-container">

      {/* Header */}
      <div className="dora-header">
        <div className="dora-header-content">
          <div className="dora-header-icon">
            <Settings size={40} color="#ffffff" />
          </div>
          <div>
            <h1 className="dora-title">Scrum Master Console</h1>
            <p className="dora-subtitle">
              Configure analytics engine to understand your team's workflow and calculate DORA metrics
            </p>
          </div>
        </div>
        
        <button 
          className="dora-education-toggle"
          onClick={() => setShowEducation(!showEducation)}
        >
          <BookOpen size={18} />
          <span>{showEducation ? 'Hide' : 'Show'} Education</span>
        </button>
      </div>

      {/* Education Banner */}
      {showEducation && (
        <div className="dora-education-banner dora-section">
          <div className="dora-education-icon">
            <Info size={24} color="#1e40af" />
          </div>
          <div className="dora-education-content">
            <h3 className="dora-education-title">
              {educationContent[activeTab]?.title || "Getting Started"}
            </h3>
            <ul className="dora-education-list">
              {(educationContent[activeTab]?.points || []).map((point, i) => (
                <li key={i} className="dora-education-point">
                  <CheckCircle size={16} color="#10b981" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="dora-tabs">
        <button
          className={`dora-tab ${activeTab === 'mapping' ? 'dora-tab-active' : ''}`}
          onClick={() => setActiveTab('mapping')}
        >
          <GitBranch size={20} />
          <span>Status Mapping</span>
          <span className="dora-tab-badge">1</span>
        </button>
        <button
          className={`dora-tab ${activeTab === 'metrics' ? 'dora-tab-active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          <BarChart3 size={20} />
          <span>Velocity Config</span>
          <span className="dora-tab-badge">2</span>
        </button>
        <button
          className={`dora-tab ${activeTab === 'dora' ? 'dora-tab-active' : ''}`}
          onClick={() => setActiveTab('dora')}
        >
          <Zap size={20} />
          <span>DORA Setup</span>
          <span className="dora-tab-badge">3</span>
        </button>
      </div>

      {/* Content */}
      <div className="dora-content">
        {/* Tab 1: Status Mapping */}
        {activeTab === 'mapping' && (
          <div className="dora-section">
            <div className="dora-section-header">
              <div className="dora-section-header-left">
                <GitBranch size={24} color="#667eea" />
                <div>
                  <h2 className="dora-section-title">Workflow Status Mapping</h2>
                  <p className="dora-section-subtitle">
                    Map your custom statuses to Hora's analytics categories
                  </p>
                </div>
              </div>
            </div>

            {/* Mapping Cards */}
            <div className="dora-mapping-grid">
              {/* TODO Category */}
              <div className="dora-category-card">
                <div className="dora-category-header">
                  <div className="dora-category-icon" style={{...{background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'}}}>
                    <PlayCircle size={24} color="#ffffff" />
                  </div>
                  <div>
                    <h3 className="dora-category-title">TODO</h3>
                    <p className="dora-category-desc">Work not yet started</p>
                  </div>
                  <span className="dora-selected-count">
                    {config.mapping.todo.length} selected
                  </span>
                </div>
                <div className="dora-status-grid">
                  {availableStatuses
                    .filter(s => ['Backlog', 'To Do', 'Cancelled'].includes(s.value))
                    .map(status => (
                      <div
                        key={status.value}
                        className={`status-chip ${config.mapping.todo.includes(status.value) ? 'selected' : ''}`}
                        onClick={() => toggleStatus('todo', status.value)}
                      >
                        <span className="status-icon">{status.icon}</span>
                        <span>{status.value}</span>
                        {config.mapping.todo.includes(status.value) && (
                          <CheckCircle size={16} color="#10b981" />
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* PROGRESS Category */}
              <div className="dora-category-card">
                <div className="dora-category-header">
                  <div className="dora-category-icon" style={{...{background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'}}}>
                    <Activity size={24} color="#ffffff" />
                  </div>
                  <div>
                    <h3 className="dora-category-title">IN PROGRESS</h3>
                    <p className="dora-category-desc">Active development work</p>
                  </div>
                  <span className="dora-selected-count">
                    {config.mapping.progress.length} selected
                  </span>
                </div>
                <div className="dora-status-grid">
                  {availableStatuses
                    .filter(s => ['In Progress', 'Coding', 'On Hold', 'Peer Review'].includes(s.value))
                    .map(status => (
                      <div
                        key={status.value}
                        className={`status-chip ${config.mapping.progress.includes(status.value) ? 'selected' : ''}`}
                        onClick={() => toggleStatus('progress', status.value)}
                      >
                        <span className="status-icon">{status.icon}</span>
                        <span>{status.value}</span>
                        {config.mapping.progress.includes(status.value) && (
                          <CheckCircle size={16} color="#10b981" />
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* TESTING Category */}
              <div className="dora-category-card">
                <div className="dora-category-header">
                  <div className="dora-category-icon" style={{...{background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)'}}}>
                    <CheckSquare size={24} color="#ffffff" />
                  </div>
                  <div>
                    <h3 className="dora-category-title">TESTING</h3>
                    <p className="dora-category-desc">Quality assurance phase</p>
                  </div>
                  <span className="dora-selected-count">
                    {config.mapping.testing.length} selected
                  </span>
                </div>
                <div className="dora-status-grid">
                  {availableStatuses
                    .filter(s => ['QA Testing', 'UAT', 'Ready for Deploy'].includes(s.value))
                    .map(status => (
                      <div
                        key={status.value}
                        className={`status-chip ${config.mapping.testing.includes(status.value) ? 'selected' : ''}`}
                        onClick={() => toggleStatus('testing', status.value)}
                      >
                        <span className="status-icon">{status.icon}</span>
                        <span>{status.value}</span>
                        {config.mapping.testing.includes(status.value) && (
                          <CheckCircle size={16} color="#10b981" />
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* DONE Category */}
              <div className="dora-category-card">
                <div className="dora-category-header">
                  <div className="dora-category-icon" style={{...{background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'}}}>
                    <CheckCircle size={24} color="#ffffff" />
                  </div>
                  <div>
                    <h3 className="dora-category-title">DONE</h3>
                    <p className="dora-category-desc">Completed work</p>
                  </div>
                  <span className="dora-selected-count">
                    {config.mapping.done.length} selected
                  </span>
                </div>
                <div className="dora-status-grid">
                  {availableStatuses
                    .filter(s => ['Resolved', 'Closed', 'Done'].includes(s.value))
                    .map(status => (
                      <div
                        key={status.value}
                        className={`status-chip ${config.mapping.done.includes(status.value) ? 'selected' : ''}`}
                        onClick={() => toggleStatus('done', status.value)}
                      >
                        <span className="status-icon">{status.icon}</span>
                        <span>{status.value}</span>
                        {config.mapping.done.includes(status.value) && (
                          <CheckCircle size={16} color="#10b981" />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Velocity Metrics */}
        {activeTab === 'metrics' && (
          <div className="dora-section">
            <div className="dora-section-header">
              <div className="dora-section-header-left">
                <BarChart3 size={24} color="#667eea" />
                <div>
                  <h2 className="dora-section-title">Velocity Calculation Setup</h2>
                  <p className="dora-section-subtitle">
                    Choose how Hora measures your team's output and productivity
                  </p>
                </div>
              </div>
            </div>

            <div className="dora-metrics-grid">
              {availableFields.map(field => (
                <div
                  key={field.id}
                  className={`metric-card ${config.metrics.velocityUnit === field.id ? 'selected' : ''}`}
                  onClick={() => setConfig({
                    ...config,
                    metrics: { ...config.metrics, velocityUnit: field.id }
                  })}
                >
                  {field.recommended && (
                    <div className="dora-recommended-badge">
                      <Award size={14} />
                      Recommended
                    </div>
                  )}
                  <div className="dora-metric-icon">
                    {field.icon}
                  </div>
                  <h3 className="dora-metric-title">{field.label}</h3>
                  <p className="dora-metric-desc">{field.description}</p>
                  {config.metrics.velocityUnit === field.id && (
                    <div className="dora-selected-indicator">
                      <CheckCircle size={20} color="#10b981" />
                      <span>Currently Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Additional Options */}
            <div className="dora-options-card">
              <h3 className="dora-options-title">Additional Settings</h3>
              <div className="dora-options-list">
                <label className="dora-option-item">
                  <input 
                    type="checkbox" 
                    checked={config.metrics.includeWeekends}
                    onChange={(e) => setConfig({
                      ...config,
                      metrics: { ...config.metrics, includeWeekends: e.target.checked }
                    })}
                    className="dora-checkbox"
                  />
                  <div>
                    <span className="dora-option-label">Include weekends in cycle time</span>
                    <p className="dora-option-desc">Count Saturday and Sunday in lead time calculations</p>
                  </div>
                </label>
                <label className="dora-option-item">
                  <input 
                    type="checkbox"
                    checked={config.metrics.trackBlockers}
                    onChange={(e) => setConfig({
                      ...config,
                      metrics: { ...config.metrics, trackBlockers: e.target.checked }
                    })}
                    className="dora-checkbox"
                  />
                  <div>
                    <span className="dora-option-label">Track blocked time separately</span>
                    <p className="dora-option-desc">Exclude blocked/on-hold time from active work metrics</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: DORA Metrics */}
        {activeTab === 'dora' && (
          <div className="dora-section">
            <div className="dora-section-header">
              <div className="dora-section-header-left">
                <Zap size={24} color="#667eea" />
                <div>
                  <h2 className="dora-section-title">DORA Metrics Configuration</h2>
                  <p className="dora-section-subtitle">
                    Define recovery time measurement points for Mean Time To Recovery (MTTR)
                  </p>
                </div>
              </div>
            </div>

            {/* DORA Cards */}
            <div className="dora-grid">
              <div className="dora-card">
                <div className="dora-icon">
                  <PlayCircle size={32} color="#667eea" />
                </div>
                <h3 className="dora-title-sm">MTTR Start Point</h3>
                <p className="dora-desc">When does the recovery clock start ticking?</p>
                <select 
                  className="dora-select"
                  value={config.metrics.mttrStartStatus}
                  onChange={(e) => setConfig({
                    ...config,
                    metrics: { ...config.metrics, mttrStartStatus: e.target.value }
                  })}
                >
                  {availableStatuses.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.icon} {s.value}
                    </option>
                  ))}
                </select>
                <div className="dora-hint">
                  <Info size={14} />
                  <span>Typically when incident/bug is reported</span>
                </div>
              </div>

              <div className="dora-arrow">
                <ArrowRight size={32} color="#cbd5e1" />
              </div>

              <div className="dora-card">
                <div className="dora-icon">
                  <CheckCircle size={32} color="#10b981" />
                </div>
                <h3 className="dora-title-sm">MTTR End Point</h3>
                <p className="dora-desc">When is the issue considered resolved?</p>
                <select 
                  className="dora-select"
                  value={config.metrics.mttrEndStatus}
                  onChange={(e) => setConfig({
                    ...config,
                    metrics: { ...config.metrics, mttrEndStatus: e.target.value }
                  })}
                >
                  {availableStatuses.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.icon} {s.value}
                    </option>
                  ))}
                </select>
                <div className="dora-hint">
                  <Info size={14} />
                  <span>Typically when fix is deployed to production</span>
                </div>
              </div>
            </div>

            {/* DORA Info Cards */}
            <div className="dora-info-grid">
              <div className="dora-info-card">
                <TrendingUp size={24} color="#667eea" />
                <h4 className="dora-info-title">Lead Time</h4>
                <p className="dora-info-text">
                  Time from code commit to production deployment
                </p>
              </div>
              <div className="dora-info-card">
                <Activity size={24} color="#10b981" />
                <h4 className="dora-info-title">Deployment Frequency</h4>
                <p className="dora-info-text">
                  How often your team ships to production
                </p>
              </div>
              <div className="dora-info-card">
                <Clock size={24} color="#f59e0b" />
                <h4 className="dora-info-title">MTTR</h4>
                <p className="dora-info-text">
                  Average time to restore service after incident
                </p>
              </div>
              <div className="dora-info-card">
                <AlertCircle size={24} color="#ef4444" />
                <h4 className="dora-info-title">Change Failure Rate</h4>
                <p className="dora-info-text">
                  Percentage of deployments causing incidents
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="dora-footer">
        <div className="dora-footer-content">
          <div className="dora-footer-info">
            <HelpCircle size={20} color="#64748b" />
            <span>Changes will apply to all future sprints and analytics calculations</span>
          </div>
          <button className="dora-save-button">
            <Play size={20} />
            <span>Initialize Analytics Engine</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScrumMasterSetup;