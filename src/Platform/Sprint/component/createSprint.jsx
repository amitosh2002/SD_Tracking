import React, { useState, useEffect } from 'react';
import './CreateSprint.scss';

const CreateSprint = ({
  formData,
  projects,
  setShowCreateModal,
  setFormData,
  handleCreateSprint
}) => {
  const [errors, setErrors] = useState({});
  console.log(projects)

  // Validate dates
  const validateDates = () => {
    const newErrors = {};
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
      
      // Calculate duration
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.ceil(diffDays / 7);
      
      if (diffWeeks > 4) {
        newErrors.endDate = 'Sprint duration cannot exceed 4 weeks';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auto-calculate end date when start date changes
  useEffect(() => {
    if (formData.startDate && !formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 14); // Default 2 weeks
      
      setFormData({
        ...formData,
        endDate: end.toISOString().split('T')[0]
      });
    }
  }, [formData.startDate]);

  const handleSubmit = () => {
    if (validateDates()) {
        console.log(" submit ")
      handleCreateSprint();
    }
  };

  const handleClose = () => {
    setShowCreateModal(false);
    setErrors({});
  };

  // Check if form is valid
  const isFormValid = formData.projectId && 
                      formData.startDate && 
                      formData.endDate && 
                      Object.keys(errors).length === 0;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <h2>Create New Sprint</h2>
            <p className="header-subtitle">Set up a new sprint for your project</p>
          </div>
          <button className="close-btn" onClick={handleClose} title="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Project Selection */}
          <div className="form-group">
            <label htmlFor="project-select">
              Project <span className="required">*</span>
            </label>
            <select
              id="project-select"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="project-select"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project.projectId}>
                  {project.name ?? project.projectName}
                </option>
              ))}
            </select>
            {!formData.projectId && (
              <span className="field-hint">Choose the project for this sprint</span>
            )}
          </div>

          {/* Sprint Name (Optional - Auto-generated) */}
          <div className="form-group">
            <label htmlFor="sprint-name">
              Sprint Name <span className="optional">(Optional)</span>
            </label>
            <input
              id="sprint-name"
              type="text"
              value={formData.sprintName || ''}
              onChange={(e) => setFormData({ ...formData, sprintName: e.target.value })}
              placeholder="Leave empty for auto-generated name (Sprint-1, Sprint-2...)"
            />
            <span className="field-hint">
              If not provided, will be auto-generated based on sprint number
            </span>
          </div>

          {/* Date Range */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start-date">
                Start Date <span className="required">*</span>
              </label>
              <input
                id="start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) => {
                  setFormData({ ...formData, startDate: e.target.value });
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="end-date">
                End Date <span className="required">*</span>
              </label>
              <input
                id="end-date"
                type="date"
                value={formData.endDate}
                onChange={(e) => {
                  setFormData({ ...formData, endDate: e.target.value });
                }}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
              {errors.endDate && (
                <span className="error-message">{errors.endDate}</span>
              )}
            </div>
          </div>

          {/* Duration Info (Read-only) */}
          {formData.startDate && formData.endDate && (
            <div className="duration-info">
              <span className="duration-icon">⏱️</span>
              <span className="duration-text">
                Sprint Duration: {
                  Math.ceil(
                    (new Date(formData.endDate) - new Date(formData.startDate)) / 
                    (1000 * 60 * 60 * 24 * 7)
                  )
                } week(s)
              </span>
            </div>
          )}

          {/* Info Box */}
          <div className="info-box">
            <div className="info-icon">ℹ️</div>
            <div className="info-content">
              <strong>Auto-generated fields:</strong>
              <ul>
                <li>Sprint number will be assigned automatically</li>
                <li>Sprint name will default to "Sprint-X" if not provided</li>
                <li>Status will be set to "planned"</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button 
            className="btn-submit" 
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            <span className="btn-icon">+</span>
            Create Sprint
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSprint;