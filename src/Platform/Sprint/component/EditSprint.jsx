import React from 'react'
import { useSelector } from 'react-redux';


const EditSprint = ({setFormData,setShowEditModal,formData,handleUpdateSprint}) => {
  const {projects}= useSelector((state)=>state.projects)
    const getProjectDetails = (projectId) => {
    return projects.find(
      (project) => project.projectId === projectId
    )
  };
    const toISODate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString();
};

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
               <input
                  type="text"
                  value={getProjectDetails(formData.projectId).projectName}
                  disabled={true}
                />
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
                      value={formData.startDate?.slice(0, 10)} // important for edit mode
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          startDate: toISODate(e.target.value)
                        })
                      }
                    />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                 <input
                      type="date"
                      value={formData.endDate?.slice(0, 10)}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          endDate: toISODate(e.target.value)
                        })
                      }
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