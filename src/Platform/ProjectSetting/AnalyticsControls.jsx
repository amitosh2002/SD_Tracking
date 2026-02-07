import React from 'react';
import { Settings, BarChart3, Clock, Zap, CheckCircle, RefreshCcw } from 'lucide-react';

const AnalyticsControls = ({ projectId, mapping, onReset }) => {
  if (!mapping) return null;

  const { effortConfig, statusMapping, doraConfig } = mapping;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Analytics Overview</h2>
          <p style={styles.subtitle}>Current configuration for project: {projectId}</p>
        </div>
        <button style={styles.resetBtn} onClick={onReset}>
          <Settings size={16} />
          <span>Edit Configuration</span>
        </button>
      </div>

      <div style={styles.grid}>
        {/* Effort Config Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <BarChart3 size={20} color="#667eea" />
            <h3 style={styles.cardTitle}>Effort Metric</h3>
          </div>
          <p style={styles.cardValue}>
            {effortConfig?.field === 'estimatePoints' ? 'Story Points' : 
             effortConfig?.field === 'totalTimeLogged' ? 'Time Logged' : 'Ticket Count'}
          </p>
          <span style={styles.cardDesc}>Used for velocity and burndown</span>
        </div>

        {/* Workflow Summary Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Zap size={20} color="#f59e0b" />
            <h3 style={styles.cardTitle}>Status Mapping</h3>
          </div>
          <div style={styles.stats}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Todo:</span>
              <span style={styles.statValue}>{statusMapping?.todo?.length || 0}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>In Progress:</span>
              <span style={styles.statValue}>{statusMapping?.inProgress?.length || 0}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Done:</span>
              <span style={styles.statValue}>{statusMapping?.done?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* DORA Config Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Clock size={20} color="#10b981" />
            <h3 style={styles.cardTitle}>DORA Boundaries</h3>
          </div>
          <div style={styles.doraInfo}>
            <div style={styles.doraRow}>
              <CheckCircle size={14} color="#64748b" />
              <span>Start: {doraConfig?.leadTime?.startStatus}</span>
            </div>
            <div style={styles.doraRow}>
              <CheckCircle size={14} color="#64748b" />
              <span>End: {doraConfig?.leadTime?.endStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.infoBanner}>
        <RefreshCcw size={18} color="#3b82f6" />
        <p style={styles.infoText}>
          Your analytics engine is active. Changes to this configuration will take effect immediately.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '1.5rem',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f3f4f6'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 0.25rem 0'
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0
  },
  resetBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1rem',
    background: '#f9fafb',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    color: '#374151',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  card: {
    background: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#475569',
    margin: 0
  },
  cardValue: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 0.25rem 0'
  },
  cardDesc: {
    fontSize: '0.75rem',
    color: '#94a3b8'
  },
  stats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem'
  },
  statLabel: { color: '#64748b' },
  statValue: { fontWeight: '600', color: '#1e293b' },
  doraInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  doraRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#334155'
  },
  infoBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: '#eff6ff',
    borderRadius: '10px',
    border: '1px solid #dbeafe'
  },
  infoText: {
    fontSize: '0.875rem',
    color: '#1e40af',
    margin: 0
  }
};

export default AnalyticsControls;
