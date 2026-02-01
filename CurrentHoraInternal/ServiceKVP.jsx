import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Power, PowerOff, DollarSign, Zap, Check, X, Info, Loader2 } from 'lucide-react';
import apiClient from '../src/utils/axiosConfig';
import { horaServiceApi } from '../src/Api/Plat/projectApi';

const HoraServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    description: '',
    isActive: true,
    planType: 'FREE'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      // Logic for relative paths in apiClient needs to be consistent
      // The horaServiceApi export has full URL, but apiClient base is the origin
      // We can use a relative path if apiClient is configured with baseURL
      const response = await apiClient.get(horaServiceApi);
      if (response.data.success) {
        setServices(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = (services || []).filter(service => {
    const matchesSearch = 
      service.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlan = filterPlan === 'ALL' || service.planType === filterPlan;
    const matchesStatus = filterStatus === 'ALL' || 
      (filterStatus === 'ACTIVE' ? service.isActive : !service.isActive);
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleCreate = () => {
    setEditingService(null);
    setFormData({
      key: '',
      name: '',
      description: '',
      isActive: true,
      planType: 'FREE'
    });
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      key: service.key,
      name: service.name,
      description: service.description,
      isActive: service.isActive,
      planType: service.planType
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.key || !formData.name) {
      alert('Key and Name are required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingService) {
        const response = await apiClient.put(`/api/hora/v1/services/${editingService.serviceId}`, formData);
        if (response.data.success) {
          fetchServices();
          setShowModal(false);
        }
      } else {
        const response = await apiClient.post('/api/hora/v1/services', formData);
        if (response.data.success) {
          fetchServices();
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error('Failed to save service:', error);
      alert(error.response?.data?.message || 'Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await apiClient.delete(`/api/hora/v1/services/${serviceId}`);
        if (response.data.success) {
          fetchServices();
        }
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  };

  const toggleStatus = async (service) => {
    try {
      const response = await apiClient.put(`/api/hora/v1/services/${service.serviceId}`, {
        isActive: !service.isActive
      });
      if (response.data.success) {
        fetchServices();
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const stats = {
    total: services.length,
    active: services.filter(s => s.isActive).length,
    free: services.filter(s => s.planType === 'FREE').length,
    paid: services.filter(s => s.planType === 'PAID').length
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Service Management</h1>
            <p style={styles.subtitle}>Manage Hora platform services and features</p>
          </div>
          <button style={styles.createButton} onClick={handleCreate}>
            <Plus size={18} />
            <span>Add Service</span>
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <Zap size={20} />
            </div>
            <div>
              <div style={styles.statValue}>{stats.total}</div>
              <div style={styles.statLabel}>Total Services</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <Power size={20} />
            </div>
            <div>
              <div style={styles.statValue}>{stats.active}</div>
              <div style={styles.statLabel}>Active</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <Check size={20} />
            </div>
            <div>
              <div style={styles.statValue}>{stats.free}</div>
              <div style={styles.statLabel}>Free Tier</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <DollarSign size={20} />
            </div>
            <div>
              <div style={styles.statValue}>{stats.paid}</div>
              <div style={styles.statLabel}>Paid Tier</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filtersBar}>
          <div style={styles.searchBox}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by key or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.filterGroup}>
            <select 
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="ALL">All Plans</option>
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
            </select>

            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Services Table */}
        <div style={styles.tableContainer}>
          {loading ? (
            <div style={styles.loadingState}>
              <Loader2 size={32} className="animate-spin text-gray-400" />
              <p>Fetching services...</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Service Key</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Plan</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={styles.emptyState}>
                      <Info size={48} color="#d1d5db" />
                      <p>No services found</p>
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.serviceId} style={styles.tableRow}>
                      <td style={styles.td}>
                        <code style={styles.serviceKey}>{service.key}</code>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.serviceName}>{service.name}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.serviceDesc}>{service.description || '—'}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.planBadge,
                          ...(service.planType === 'PAID' ? styles.planBadgePaid : styles.planBadgeFree)
                        }}>
                          {service.planType === 'PAID' ? (
                            <>
                              <DollarSign size={12} />
                              Paid
                            </>
                          ) : (
                            <>
                              <Check size={12} />
                              Free
                            </>
                          )}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button
                          style={{
                            ...styles.statusButton,
                            ...(service.isActive ? styles.statusButtonActive : styles.statusButtonInactive)
                          }}
                          onClick={() => toggleStatus(service)}
                        >
                          {service.isActive ? (
                            <>
                              <Power size={14} />
                              Active
                            </>
                          ) : (
                            <>
                              <PowerOff size={14} />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button 
                            style={styles.actionButton}
                            onClick={() => handleEdit(service)}
                            title="Edit service"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            style={{...styles.actionButton, ...styles.actionButtonDanger}}
                            onClick={() => handleDelete(service.serviceId)}
                            title="Delete service"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingService ? 'Edit Service' : 'Create Service'}
              </h2>
              <button style={styles.closeButton} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Service Key *</label>
                <input
                  type="text"
                  placeholder="e.g., DORA_METRICS"
                  value={formData.key}
                  onChange={(e) => setFormData({...formData, key: e.target.value.toUpperCase().replace(/\s+/g, '_')})}
                  style={styles.input}
                  disabled={!!editingService}
                />
                <span style={styles.hint}>Unique identifier (uppercase, underscores)</span>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Service Name *</label>
                <input
                  type="text"
                  placeholder="e.g., DORA Metrics"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder="Brief description of the service..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{...styles.input, ...styles.textarea}}
                  rows={3}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Plan Type</label>
                  <select
                    value={formData.planType}
                    onChange={(e) => setFormData({...formData, planType: e.target.value})}
                    style={styles.select}
                  >
                    <option value="FREE">Free</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <select
                    value={formData.isActive.toString()}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                    style={styles.select}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.cancelButton} onClick={() => setShowModal(false)} disabled={isSubmitting}>
                Cancel
              </button>
              <button style={styles.saveButton} onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (editingService ? 'Update' : 'Create') + ' Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafb',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  wrapper: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 0.5rem 0'
  },
  subtitle: {
    fontSize: '0.9375rem',
    color: '#6b7280',
    margin: 0
  },
  createButton: {
    padding: '0.625rem 1.25rem',
    background: '#111827',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background 0.2s'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '1.25rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '6px',
    background: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280'
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#111827',
    lineHeight: '1'
  },
  statLabel: {
    fontSize: '0.8125rem',
    color: '#6b7280',
    marginTop: '0.25rem'
  },
  filtersBar: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '1.25rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  searchBox: {
    flex: 1,
    minWidth: '250px',
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    left: '0.875rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    padding: '0.625rem 0.75rem 0.625rem 2.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    color: '#111827'
  },
  filterGroup: {
    display: 'flex',
    gap: '0.75rem'
  },
  filterSelect: {
    padding: '0.625rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    color: '#374151',
    background: '#ffffff',
    cursor: 'pointer'
  },
  tableContainer: {
    background: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  th: {
    padding: '0.875rem 1rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tableRow: {
    borderBottom: '1px solid #f3f4f6',
    transition: 'background 0.15s'
  },
  td: {
    padding: '1rem',
    fontSize: '0.875rem',
    color: '#374151'
  },
  serviceKey: {
    fontFamily: 'monospace',
    fontSize: '0.8125rem',
    background: '#f3f4f6',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    color: '#111827',
    fontWeight: '600'
  },
  serviceName: {
    fontWeight: '500',
    color: '#111827'
  },
  serviceDesc: {
    color: '#6b7280',
    fontSize: '0.8125rem'
  },
  planBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.25rem 0.625rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  planBadgeFree: {
    background: '#ecfdf5',
    color: '#047857'
  },
  planBadgePaid: {
    background: '#fef3c7',
    color: '#92400e'
  },
  statusButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.375rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s'
  },
  statusButtonActive: {
    background: '#ecfdf5',
    color: '#047857'
  },
  statusButtonInactive: {
    background: '#fef2f2',
    color: '#dc2626'
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  actionButton: {
    width: '32px',
    height: '32px',
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#6b7280',
    transition: 'all 0.15s'
  },
  actionButtonDanger: {
    color: '#dc2626'
  },
  emptyState: {
    padding: '4rem',
    textAlign: 'center',
    color: '#9ca3af'
  },
  loadingState: {
    padding: '4rem',
    textAlign: 'center',
    color: '#6b7280',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  },
  modal: {
    background: '#ffffff',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  modalHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '4px'
  },
  modalBody: {
    padding: '1.5rem'
  },
  formGroup: {
    marginBottom: '1.25rem'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.625rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    color: '#111827'
  },
  textarea: {
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  select: {
    width: '100%',
    padding: '0.625rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    color: '#111827',
    background: '#ffffff',
    cursor: 'pointer'
  },
  hint: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.375rem'
  },
  modalFooter: {
    padding: '1.5rem',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    padding: '0.625rem 1.25rem',
    background: '#f9fafb',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  saveButton: {
    padding: '0.625rem 1.25rem',
    background: '#111827',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export default HoraServiceManagement;