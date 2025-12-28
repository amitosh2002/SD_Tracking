import React from 'react'


const EditSprint = ({setFormData,setShowEditModal,formData,projectsData,handleUpdateSprint}) => {
  return (
      <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Sprint</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Project *</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="project-select"
                >
                  {projectsData.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.key} - {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Sprint Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Sprint Goal</label>
                <textarea
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button className="btn-submit" onClick={handleUpdateSprint}>
                  Update Sprint
                </button>
              </div>
            </div>
          </div>
        </div>
  )
}

export default EditSprint