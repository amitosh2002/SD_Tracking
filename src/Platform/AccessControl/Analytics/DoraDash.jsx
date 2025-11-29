import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, GitCommit, GitPullRequest, 
  Clock, AlertCircle, CheckCircle, Activity, BarChart3, 
  Users, User, Calendar, Target, Zap, RefreshCw
} from 'lucide-react';
import './styles/metricsMatrix.scss';

const DeveloperMetricsMatrix = () => {
  const [viewMode, setViewMode] = useState('admin'); // 'admin' or 'user'
  const [selectedUser, setSelectedUser] = useState('all');
  const [timeRange, setTimeRange] = useState('sprint'); // 'week', 'sprint', 'month', 'quarter'

  // Mock Data - DORA Metrics
  const doraMetrics = {
    admin: {
      deploymentFrequency: { value: 23, unit: 'deploys/week', trend: 15, status: 'elite' },
      leadTimeForChanges: { value: 2.3, unit: 'hours', trend: -12, status: 'elite' },
      meanTimeToRecovery: { value: 45, unit: 'minutes', trend: -8, status: 'high' },
      changeFailureRate: { value: 5.2, unit: '%', trend: -3, status: 'high' }
    },
    users: {
      'john_doe': {
        deploymentFrequency: { value: 8, unit: 'deploys/week', trend: 20, status: 'high' },
        leadTimeForChanges: { value: 1.8, unit: 'hours', trend: -15, status: 'elite' },
        meanTimeToRecovery: { value: 30, unit: 'minutes', trend: -10, status: 'elite' },
        changeFailureRate: { value: 3.5, unit: '%', trend: -5, status: 'elite' }
      },
      'jane_smith': {
        deploymentFrequency: { value: 12, unit: 'deploys/week', trend: 18, status: 'elite' },
        leadTimeForChanges: { value: 2.1, unit: 'hours', trend: -8, status: 'elite' },
        meanTimeToRecovery: { value: 38, unit: 'minutes', trend: -7, status: 'high' },
        changeFailureRate: { value: 4.2, unit: '%', trend: -2, status: 'high' }
      },
      'mike_johnson': {
        deploymentFrequency: { value: 5, unit: 'deploys/week', trend: 10, status: 'medium' },
        leadTimeForChanges: { value: 4.5, unit: 'hours', trend: -5, status: 'medium' },
        meanTimeToRecovery: { value: 72, unit: 'minutes', trend: 5, status: 'medium' },
        changeFailureRate: { value: 8.1, unit: '%', trend: 1, status: 'low' }
      }
    }
  };

  // Mock Data - Cycle Time Breakdown
  const cycleTimeData = {
    admin: {
      total: { value: 5.2, unit: 'days', trend: -10 },
      coding: { value: 1.8, unit: 'days', percentage: 35, trend: -5 },
      pickup: { value: 0.8, unit: 'days', percentage: 15, trend: -15 },
      review: { value: 1.9, unit: 'days', percentage: 37, trend: -8 },
      deploy: { value: 0.7, unit: 'days', percentage: 13, trend: -12 }
    },
    users: {
      'john_doe': {
        total: { value: 3.8, unit: 'days', trend: -15 },
        coding: { value: 1.2, unit: 'days', percentage: 32, trend: -10 },
        pickup: { value: 0.5, unit: 'days', percentage: 13, trend: -20 },
        review: { value: 1.6, unit: 'days', percentage: 42, trend: -8 },
        deploy: { value: 0.5, unit: 'days', percentage: 13, trend: -15 }
      },
      'jane_smith': {
        total: { value: 4.2, unit: 'days', trend: -12 },
        coding: { value: 1.5, unit: 'days', percentage: 36, trend: -8 },
        pickup: { value: 0.7, unit: 'days', percentage: 17, trend: -10 },
        review: { value: 1.5, unit: 'days', percentage: 36, trend: -5 },
        deploy: { value: 0.5, unit: 'days', percentage: 12, trend: -18 }
      },
      'mike_johnson': {
        total: { value: 7.5, unit: 'days', trend: -3 },
        coding: { value: 2.8, unit: 'days', percentage: 37, trend: 2 },
        pickup: { value: 1.2, unit: 'days', percentage: 16, trend: -8 },
        review: { value: 2.8, unit: 'days', percentage: 37, trend: -5 },
        deploy: { value: 0.7, unit: 'days', percentage: 9, trend: -10 }
      }
    }
  };

  // Mock Data - Supporting Metrics
  const supportingMetrics = {
    admin: {
      wip: { value: 28, optimal: 20, status: 'warning' },
      codeChurn: { value: 12.5, unit: '%', status: 'good' },
      prSize: { value: 245, unit: 'LOC', status: 'good' },
      commitFrequency: { value: 156, unit: 'commits/week', status: 'excellent' }
    },
    users: {
      'john_doe': {
        wip: { value: 4, optimal: 3, status: 'warning' },
        codeChurn: { value: 8.2, unit: '%', status: 'excellent' },
        prSize: { value: 180, unit: 'LOC', status: 'excellent' },
        commitFrequency: { value: 42, unit: 'commits/week', status: 'excellent' }
      },
      'jane_smith': {
        wip: { value: 5, optimal: 3, status: 'danger' },
        codeChurn: { value: 10.5, unit: '%', status: 'good' },
        prSize: { value: 220, unit: 'LOC', status: 'good' },
        commitFrequency: { value: 58, unit: 'commits/week', status: 'excellent' }
      },
      'mike_johnson': {
        wip: { value: 6, optimal: 3, status: 'danger' },
        codeChurn: { value: 18.7, unit: '%', status: 'warning' },
        prSize: { value: 380, unit: 'LOC', status: 'warning' },
        commitFrequency: { value: 28, unit: 'commits/week', status: 'good' }
      }
    }
  };

  const users = [
    { id: 'john_doe', name: 'John Doe', role: 'Senior Developer' },
    { id: 'jane_smith', name: 'Jane Smith', role: 'Lead Developer' },
    { id: 'mike_johnson', name: 'Mike Johnson', role: 'Junior Developer' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      elite: '#10b981',
      high: '#3b82f6',
      medium: '#f59e0b',
      low: '#ef4444',
      excellent: '#10b981',
      good: '#3b82f6',
      warning: '#f59e0b',
      danger: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getTrendIcon = (trend) => {
    if (trend > 5) return <TrendingUp size={16} className="trend-icon trend-icon--up" />;
    if (trend < -5) return <TrendingDown size={16} className="trend-icon trend-icon--down" />;
    return <Minus size={16} className="trend-icon trend-icon--stable" />;
  };

  const getCurrentData = () => {
    if (viewMode === 'admin') {
      return {
        dora: doraMetrics.admin,
        cycleTime: cycleTimeData.admin,
        supporting: supportingMetrics.admin
      };
    } else {
      const userId = selectedUser === 'all' ? 'john_doe' : selectedUser;
      return {
        dora: doraMetrics.users[userId],
        cycleTime: cycleTimeData.users[userId],
        supporting: supportingMetrics.users[userId]
      };
    }
  };

  const data = getCurrentData();

  return (
    <div className="metrics-matrix">
      {/* Header */}
      <div className="metrics-header">
        <div className="metrics-header__left">
          <h1 className="metrics-title">Developer Velocity Metrics</h1>
          <p className="metrics-subtitle">DORA & Flow Metrics Analysis</p>
        </div>
        <div className="metrics-header__right">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'admin' ? 'toggle-btn--active' : ''}`}
              onClick={() => setViewMode('admin')}
            >
              <Users size={18} />
              Team View
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'user' ? 'toggle-btn--active' : ''}`}
              onClick={() => setViewMode('user')}
            >
              <User size={18} />
              Individual
            </button>
          </div>

          {viewMode === 'user' && (
            <select 
              className="user-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </option>
              ))}
            </select>
          )}

          <select 
            className="time-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="sprint">Current Sprint</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* DORA Metrics Matrix */}
      <section className="metrics-section">
        <div className="section-header">
          <h2 className="section-title">
            <Activity size={24} />
            DORA Metrics
          </h2>
          <span className="section-badge">Industry Standard</span>
        </div>

        <div className="dora-grid">
          {/* Deployment Frequency */}
          <div className="dora-card">
            <div className="dora-card__header">
              <div className="dora-card__icon" style={{ background: `${getStatusColor(data.dora.deploymentFrequency.status)}20` }}>
                <Zap size={24} style={{ color: getStatusColor(data.dora.deploymentFrequency.status) }} />
              </div>
              <div className="dora-card__info">
                <h3 className="dora-card__title">Deployment Frequency</h3>
                <p className="dora-card__description">How often code ships to production</p>
              </div>
            </div>
            <div className="dora-card__body">
              <div className="metric-value">
                <span className="value-number">{data.dora.deploymentFrequency.value}</span>
                <span className="value-unit">{data.dora.deploymentFrequency.unit}</span>
              </div>
              <div className="metric-trend">
                {getTrendIcon(data.dora.deploymentFrequency.trend)}
                <span>{Math.abs(data.dora.deploymentFrequency.trend)}% from last period</span>
              </div>
            </div>
            <div className="dora-card__footer">
              <span className="status-badge" style={{ 
                background: `${getStatusColor(data.dora.deploymentFrequency.status)}20`,
                color: getStatusColor(data.dora.deploymentFrequency.status)
              }}>
                {data.dora.deploymentFrequency.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Lead Time for Changes */}
          <div className="dora-card">
            <div className="dora-card__header">
              <div className="dora-card__icon" style={{ background: `${getStatusColor(data.dora.leadTimeForChanges.status)}20` }}>
                <Clock size={24} style={{ color: getStatusColor(data.dora.leadTimeForChanges.status) }} />
              </div>
              <div className="dora-card__info">
                <h3 className="dora-card__title">Lead Time for Changes</h3>
                <p className="dora-card__description">Commit to production time</p>
              </div>
            </div>
            <div className="dora-card__body">
              <div className="metric-value">
                <span className="value-number">{data.dora.leadTimeForChanges.value}</span>
                <span className="value-unit">{data.dora.leadTimeForChanges.unit}</span>
              </div>
              <div className="metric-trend">
                {getTrendIcon(data.dora.leadTimeForChanges.trend)}
                <span>{Math.abs(data.dora.leadTimeForChanges.trend)}% from last period</span>
              </div>
            </div>
            <div className="dora-card__footer">
              <span className="status-badge" style={{ 
                background: `${getStatusColor(data.dora.leadTimeForChanges.status)}20`,
                color: getStatusColor(data.dora.leadTimeForChanges.status)
              }}>
                {data.dora.leadTimeForChanges.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Mean Time to Recovery */}
          <div className="dora-card">
            <div className="dora-card__header">
              <div className="dora-card__icon" style={{ background: `${getStatusColor(data.dora.meanTimeToRecovery.status)}20` }}>
                <RefreshCw size={24} style={{ color: getStatusColor(data.dora.meanTimeToRecovery.status) }} />
              </div>
              <div className="dora-card__info">
                <h3 className="dora-card__title">Mean Time to Recovery</h3>
                <p className="dora-card__description">Time to restore after incident</p>
              </div>
            </div>
            <div className="dora-card__body">
              <div className="metric-value">
                <span className="value-number">{data.dora.meanTimeToRecovery.value}</span>
                <span className="value-unit">{data.dora.meanTimeToRecovery.unit}</span>
              </div>
              <div className="metric-trend">
                {getTrendIcon(data.dora.meanTimeToRecovery.trend)}
                <span>{Math.abs(data.dora.meanTimeToRecovery.trend)}% from last period</span>
              </div>
            </div>
            <div className="dora-card__footer">
              <span className="status-badge" style={{ 
                background: `${getStatusColor(data.dora.meanTimeToRecovery.status)}20`,
                color: getStatusColor(data.dora.meanTimeToRecovery.status)
              }}>
                {data.dora.meanTimeToRecovery.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Change Failure Rate */}
          <div className="dora-card">
            <div className="dora-card__header">
              <div className="dora-card__icon" style={{ background: `${getStatusColor(data.dora.changeFailureRate.status)}20` }}>
                <AlertCircle size={24} style={{ color: getStatusColor(data.dora.changeFailureRate.status) }} />
              </div>
              <div className="dora-card__info">
                <h3 className="dora-card__title">Change Failure Rate</h3>
                <p className="dora-card__description">% of changes requiring fixes</p>
              </div>
            </div>
            <div className="dora-card__body">
              <div className="metric-value">
                <span className="value-number">{data.dora.changeFailureRate.value}</span>
                <span className="value-unit">{data.dora.changeFailureRate.unit}</span>
              </div>
              <div className="metric-trend">
                {getTrendIcon(data.dora.changeFailureRate.trend)}
                <span>{Math.abs(data.dora.changeFailureRate.trend)}% from last period</span>
              </div>
            </div>
            <div className="dora-card__footer">
              <span className="status-badge" style={{ 
                background: `${getStatusColor(data.dora.changeFailureRate.status)}20`,
                color: getStatusColor(data.dora.changeFailureRate.status)
              }}>
                {data.dora.changeFailureRate.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cycle Time Breakdown */}
      <section className="metrics-section">
        <div className="section-header">
          <h2 className="section-title">
            <BarChart3 size={24} />
            Cycle Time Breakdown
          </h2>
          <span className="section-badge">Flow Metrics</span>
        </div>

        <div className="cycle-time-container">
          <div className="cycle-time-summary">
            <div className="summary-value">
              <span className="summary-number">{data.cycleTime.total.value}</span>
              <span className="summary-unit">{data.cycleTime.total.unit}</span>
            </div>
            <p className="summary-label">Total Cycle Time</p>
            <div className="summary-trend">
              {getTrendIcon(data.cycleTime.total.trend)}
              <span>{Math.abs(data.cycleTime.total.trend)}% improvement</span>
            </div>
          </div>

          <div className="cycle-time-breakdown">
            <div className="breakdown-item">
              <div className="breakdown-header">
                <div className="breakdown-label">
                  <GitCommit size={18} />
                  <span>Coding Time</span>
                </div>
                <div className="breakdown-value">
                  {data.cycleTime.coding.value} {data.cycleTime.coding.unit}
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill progress-fill--coding" 
                  style={{ width: `${data.cycleTime.coding.percentage}%` }}
                />
              </div>
              <div className="breakdown-footer">
                <span className="percentage">{data.cycleTime.coding.percentage}%</span>
                <span className="trend">{getTrendIcon(data.cycleTime.coding.trend)} {Math.abs(data.cycleTime.coding.trend)}%</span>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <div className="breakdown-label">
                  <Target size={18} />
                  <span>Pickup Time</span>
                </div>
                <div className="breakdown-value">
                  {data.cycleTime.pickup.value} {data.cycleTime.pickup.unit}
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill progress-fill--pickup" 
                  style={{ width: `${data.cycleTime.pickup.percentage}%` }}
                />
              </div>
              <div className="breakdown-footer">
                <span className="percentage">{data.cycleTime.pickup.percentage}%</span>
                <span className="trend">{getTrendIcon(data.cycleTime.pickup.trend)} {Math.abs(data.cycleTime.pickup.trend)}%</span>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <div className="breakdown-label">
                  <GitPullRequest size={18} />
                  <span>Review Time</span>
                </div>
                <div className="breakdown-value">
                  {data.cycleTime.review.value} {data.cycleTime.review.unit}
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill progress-fill--review" 
                  style={{ width: `${data.cycleTime.review.percentage}%` }}
                />
              </div>
              <div className="breakdown-footer">
                <span className="percentage">{data.cycleTime.review.percentage}%</span>
                <span className="trend">{getTrendIcon(data.cycleTime.review.trend)} {Math.abs(data.cycleTime.review.trend)}%</span>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <div className="breakdown-label">
                  <CheckCircle size={18} />
                  <span>Deploy Time</span>
                </div>
                <div className="breakdown-value">
                  {data.cycleTime.deploy.value} {data.cycleTime.deploy.unit}
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill progress-fill--deploy" 
                  style={{ width: `${data.cycleTime.deploy.percentage}%` }}
                />
              </div>
              <div className="breakdown-footer">
                <span className="percentage">{data.cycleTime.deploy.percentage}%</span>
                <span className="trend">{getTrendIcon(data.cycleTime.deploy.trend)} {Math.abs(data.cycleTime.deploy.trend)}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting Metrics */}
      <section className="metrics-section">
        <div className="section-header">
          <h2 className="section-title">
            <Target size={24} />
            Supporting Metrics
          </h2>
          <span className="section-badge">Context</span>
        </div>

        <div className="supporting-grid">
          <div className="supporting-card">
            <div className="supporting-card__header">
              <h3>Work in Progress (WIP)</h3>
              <span 
                className="status-dot" 
                style={{ background: getStatusColor(data.supporting.wip.status) }}
              />
            </div>
            <div className="supporting-card__body">
              <div className="wip-display">
                <span className="wip-current">{data.supporting.wip.value}</span>
                <span className="wip-separator">/</span>
                <span className="wip-optimal">{data.supporting.wip.optimal} optimal</span>
              </div>
              <div className="wip-bar">
                <div 
                  className="wip-fill" 
                  style={{ 
                    width: `${(data.supporting.wip.value / (data.supporting.wip.optimal * 2)) * 100}%`,
                    background: getStatusColor(data.supporting.wip.status)
                  }}
                />
              </div>
            </div>
          </div>

          <div className="supporting-card">
            <div className="supporting-card__header">
              <h3>Code Churn</h3>
              <span 
                className="status-dot" 
                style={{ background: getStatusColor(data.supporting.codeChurn.status) }}
              />
            </div>
            <div className="supporting-card__body">
              <div className="metric-large">
                {data.supporting.codeChurn.value}
                <span className="metric-unit">{data.supporting.codeChurn.unit}</span>
              </div>
              <p className="metric-description">of code deleted after writing</p>
            </div>
          </div>

          <div className="supporting-card">
            <div className="supporting-card__header">
              <h3>Average PR Size</h3>
              <span 
                className="status-dot" 
                style={{ background: getStatusColor(data.supporting.prSize.status) }}
              />
            </div>
            <div className="supporting-card__body">
              <div className="metric-large">
                {data.supporting.prSize.value}
                <span className="metric-unit">{data.supporting.prSize.unit}</span>
              </div>
              <p className="metric-description">lines of code per PR</p>
            </div>
          </div>

          <div className="supporting-card">
            <div className="supporting-card__header">
              <h3>Commit Frequency</h3>
              <span 
                className="status-dot" 
                style={{ background: getStatusColor(data.supporting.commitFrequency.status) }}
              />
            </div>
            <div className="supporting-card__body">
              <div className="metric-large">
                {data.supporting.commitFrequency.value}
                <span className="metric-unit">{data.supporting.commitFrequency.unit}</span>
              </div>
              <p className="metric-description">regular commit activity</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeveloperMetricsMatrix;