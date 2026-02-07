import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  UserPlus, 
  Shield, 
  Trash2, 
  Mail, 
  ShieldCheck, 
  AlertTriangle,
  X,
  Check,
  Aperture
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { handleUsersInProjects } from '../../Redux/Actions/PlatformActions.js/projectsActions';

const ROLES = [
  { label: "Viewer", value: 100, color: "#94a3b8" },
  { label: "Editor", value: 200, color: "#3b82f6" },
  { label: "Manager", value: 300, color: "#f59e0b" },
  { label: "Admin", value: 400, color: "#ef4444" }
];

const getRoleLabel = (value) => ROLES.find(r => r.value === value)?.label || "Member";

function UserAccess({projectId}) {
  const dispatch = useDispatch();
  const { projectMembers, loadingProjectMembers } = useSelector(state => state.projects);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState(null);

  useEffect(() => {
    if (projectId) {
      dispatch(handleUsersInProjects(projectId, 'get'));
    }
  }, [projectId, dispatch]);

  const handleUpdateRole = () => {
    if (selectedUser && newRole !== null) {
      dispatch(handleUsersInProjects(projectId, 'update', [selectedUser.userId], newRole));
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      dispatch(handleUsersInProjects(projectId, 'delete', [selectedUser.userId]));
      setIsDeleteModalOpen(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="members-section">
      <div className="section-header">
        <div className="header-left">
          <h3>Team Members</h3>
          <p className="subtitle">Manage permissions and project access for your team</p>
        </div>
        <button className="buttonPrimary" style={{ height: '36px' }}>
          <UserPlus size={16} />
          Invite Member
        </button>
      </div>

      <div className="members-grid">
        {loadingProjectMembers ? (
          <div className="loading-state">Loading members...</div>
        ) : (
          (projectMembers || []).map((member) => (
            <div key={member.userId} className="member-card professional-card">
              <div className="member-info">
                <div className="avatar">
                  {member.details?.userName?.charAt(0) || <Shield size={18} />}
                </div>
                <div className="details">
                  <span className="name">{member.details?.profile.firstName + " "+ member.details?.profile?.lastName || member.email}</span>
                  <div className="email-row">
                    <Mail size={12} />
                    <span>{member?.details?.email}</span>
                  </div>
                  <div className="email-row">
                    <Aperture size={12} />
                    <span>{member?.details?.username}</span>
                  </div>
                </div>
              </div>

              <div className="member-tier">
                <div className="role-badge" style={{ borderColor: ROLES.find(r => r.value === member.role)?.color }}>
                  <ShieldCheck size={12} />
                  {getRoleLabel(member.role)}
                </div>
              </div>

              <div className="member-actions">
                <button 
                  className="icon-button" 
                  title="Update Access" 
                  onClick={() => openEditModal(member)}
                >
                  <Shield size={16} />
                </button>
                <button 
                  className="icon-button danger" 
                  title="Remove User" 
                  onClick={() => openDeleteModal(member)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Role Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="modal-header">
                <h3>Update Permissions</h3>
                <button onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <p className="modal-desc">Change access level for <strong>{selectedUser?.details?.userName || selectedUser?.email}</strong></p>
                <div className="role-options">
                  {ROLES.map((role) => (
                    <div 
                      key={role.value} 
                      className={`role-option ${newRole === role.value ? 'selected' : ''}`}
                      onClick={() => setNewRole(role.value)}
                    >
                      <div className="radio-dot"></div>
                      <div className="role-text">
                        <span className="role-label">{role.label}</span>
                        <p className="role-hint">Access Level: {role.value}</p>
                      </div>
                      {newRole === role.value && <Check size={16} className="check-icon" />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button className="buttonSecondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button className="buttonPrimary" onClick={handleUpdateRole}>Update Role</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content delete-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="modal-icon warning">
                <AlertTriangle size={32} />
              </div>
              <h3>Remove Team Member?</h3>
              <p>This will immediately revoke <strong>{selectedUser?.email}</strong>'s access to this project. This action cannot be undone.</p>
              <div className="modal-footer">
                <button className="buttonSecondary" onClick={() => setIsDeleteModalOpen(false)}>Keep Member</button>
                <button className="buttonDanger" onClick={handleDeleteUser}>Remove Access</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserAccess;