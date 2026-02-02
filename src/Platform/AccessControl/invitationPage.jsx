

import { useState, useEffect } from 'react';
import { Mail, UserPlus, X, Check, AlertCircle, Send, Users, Info } from 'lucide-react';
import './styles/invitation.scss';
import { getProjectWithHigherAccess, invitationToProjet } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import { useDispatch, useSelector } from 'react-redux';
import HoraLoader from '../../customFiles/customComponent/Loader/loaderV1';

const TeamInvitationPage = () => {
  const [emails, setEmails] = useState(['']);
  const [selectedProject, setSelectedProject] = useState('');
  const [role, setRole] = useState(100);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  const { projectWithAccess, sucessFetchProjects } = useSelector((state) => state.projects);

  useEffect(() => {
    if (userDetails?.id) {
      dispatch(getProjectWithHigherAccess(userDetails.id));
    }
  }, [dispatch, userDetails?.id]);

  // ============================================================================
  // Handlers
  // ============================================================================
  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedProject) {
      setErrorMessage('Please select a project');
      return;
    }

    const validEmails = emails.filter(email => email.trim() !== '');
    const invalidEmails = validEmails.filter(email => !validateEmail(email));

    if (validEmails.length === 0) {
      setErrorMessage('Please enter at least one email address');
      return;
    }

    if (invalidEmails.length > 0) {
      setErrorMessage('Please enter valid email addresses');
      return;
    }

    setLoading(true);

    try {
      await dispatch(invitationToProjet({
        projectId: selectedProject,
        emails: validEmails,
        accessType: role,
        message,
        invitedBy: userDetails?.id
      }));

      const projectName = projectWithAccess?.find(p => p.id === selectedProject)?.name;
      setSuccessMessage(
        `Successfully sent ${validEmails.length} invitation${validEmails.length > 1 ? 's' : ''} to ${projectName}`
      );

      setEmails(['']);
      setSelectedProject('');
      setMessage('');
      setRole(100);
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage('Failed to send invitations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // Helper Functions
  // ============================================================================
  const getRoleLabel = (value) => {
    const roles = {
      100: 'Viewer',
      200: 'Editor',
      300: 'Manager',
      400: 'Admin'
    };
    return roles[value];
  };

  const getRoleDescription = (value) => {
    const descriptions = {
      100: 'Can view project content',
      200: 'Can edit and create content',
      300: 'Can manage project and assign tasks',
      400: 'Full access to project settings'
    };
    return descriptions[value];
  };

  // ============================================================================
  // Loading State
  // ============================================================================
  if (!sucessFetchProjects) {
    return <HoraLoader />;
  }

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <div className="invite-page">
      <div className="invite-container">
        {/* Page Header */}
        <div className="invite-header">
          <h1 className="invite-title">Invite Team Members</h1>
          <p className="invite-description">
            Add people to collaborate on your projects
          </p>
        </div>

        <div className="invite-layout">
          {/* Main Form Section */}
          <div className="invite-form-section">
            {/* Alerts */}
            {successMessage && (
              <Alert type="success" message={successMessage} />
            )}

            {errorMessage && (
              <Alert type="error" message={errorMessage} />
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="invite-form">
              {/* Project Selection */}
              <FormField label="Project" required>
                <select
                  className="form-select"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  required
                >
                  <option value="">Select a project</option>
                  {projectWithAccess?.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} ({project.memberCount} members)
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Email Addresses */}
              <FormField label="Email Addresses" required>
                <div className="email-inputs">
                  {emails.map((email, index) => (
                    <EmailInput
                      key={index}
                      value={email}
                      onChange={(value) => updateEmail(index, value)}
                      onRemove={() => removeEmailField(index)}
                      canRemove={emails.length > 1}
                      required={index === 0}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="btn-add-email"
                  onClick={addEmailField}
                >
                  <UserPlus size={16} />
                  <span>Add another email</span>
                </button>
              </FormField>

              {/* Role Selection */}
              <FormField label="Role" required>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(Number(e.target.value))}
                  required
                >
                  <option value={100}>{getRoleLabel(100)}</option>
                  <option value={200}>{getRoleLabel(200)}</option>
                  <option value={300}>{getRoleLabel(300)}</option>
                  <option value={400}>{getRoleLabel(400)}</option>
                </select>
                <p className="field-hint">{getRoleDescription(role)}</p>
              </FormField>

              {/* Message */}
              <FormField label="Personal Message" optional>
                <textarea
                  className="form-textarea"
                  placeholder="Add a personal message to your invitation..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={500}
                />
                <p className="field-hint">{message.length}/500 characters</p>
              </FormField>

              {/* Submit Button */}
              <div className="form-submit">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || !sucessFetchProjects}
                >
                  {loading ? (
                    <>
                      <span className="btn-spinner"></span>
                      <span>Sending Invitations...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Invitations</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="invite-info-section">
            <InfoCard />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Sub-Components
// ============================================================================

// Alert Component
const Alert = ({ type, message }) => (
  <div className={`alert alert-${type}`}>
    {type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
    <span>{message}</span>
  </div>
);

// Form Field Component
const FormField = ({ label, required, optional, children }) => (
  <div className="form-field">
    <label className="field-label">
      <span>{label}</span>
      {required && <span className="field-required">*</span>}
      {optional && <span className="field-optional">(Optional)</span>}
    </label>
    {children}
  </div>
);

// Email Input Component
const EmailInput = ({ value, onChange, onRemove, canRemove, required }) => (
  <div className="email-input-row">
    <Mail size={16} className="email-icon" />
    <input
      type="email"
      className="form-input"
      placeholder="name@company.com"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
    {canRemove && (
      <button
        type="button"
        className="btn-remove"
        onClick={onRemove}
        aria-label="Remove email"
      >
        <X size={16} />
      </button>
    )}
  </div>
);

// Info Card Component
const InfoCard = () => (
  <div className="info-card">
    <div className="info-header">
      <div className="info-icon">
        <Info size={20} />
      </div>
      <h3 className="info-title">Invitation Process</h3>
    </div>
    <div className="info-content">
      <div className="info-step">
        <div className="step-number">1</div>
        <div className="step-text">
          <h4>Invitation Sent</h4>
          <p>Recipients receive a secure email invitation link</p>
        </div>
      </div>
      <div className="info-step">
        <div className="step-number">2</div>
        <div className="step-text">
          <h4>Account Setup</h4>
          <p>They create an account or sign in to accept</p>
        </div>
      </div>
      <div className="info-step">
        <div className="step-number">3</div>
        <div className="step-text">
          <h4>Access Granted</h4>
          <p>Team members can start collaborating immediately</p>
        </div>
      </div>
    </div>
    <div className="info-footer">
      <p>You can manage team members from Project Settings at any time.</p>
    </div>
  </div>
);

export default TeamInvitationPage;