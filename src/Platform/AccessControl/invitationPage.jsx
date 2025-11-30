import  { useState, useEffect } from 'react';
import { Mail, UserPlus, X, Check, AlertCircle, Send, Users, FolderOpen } from 'lucide-react';
import './styles/invitation.scss';
import { getProjectWithHigherAccess, invitationToProjet } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import { useDispatch, useSelector } from 'react-redux';
import CircularLoader from '../../customFiles/customComponent/Loader/circularLoader';

const TeamInvitationPage = () => {
  const [emails, setEmails] = useState(['']);
  const [selectedProject, setSelectedProject] = useState('');
  const [role, setRole] = useState(100);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projects, setProjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch=useDispatch();

  // Fetch projects on component mount
  const {userDetails}= useSelector((state)=>state.user)
  useEffect(() => {
    dispatch(getProjectWithHigherAccess(userDetails?.id))
  }, [dispatch,userDetails?.id]);

  const {projectWithAccess,sucessFetchProjects}= useSelector((state)=>state.projects)
  // const fetchProjects = async () => {
  //   setLoadingProjects(true);
  //   try {
  //     // Simulate API call - Replace with actual API
  //     await new Promise(resolve => setTimeout(resolve, 1000));
      
  //     // Mock project data - Replace with actual API call
  //     const mockProjects = [
  //       { id: '1', name: 'E-commerce Platform', memberCount: 12, status: 'active' },
  //       { id: '2', name: 'Mobile App Development', memberCount: 8, status: 'active' },
  //       { id: '3', name: 'Marketing Campaign', memberCount: 15, status: 'active' },
  //       { id: '4', name: 'AI Research Project', memberCount: 6, status: 'active' },
  //       { id: '5', name: 'Website Redesign', memberCount: 10, status: 'active' }
  //     ];

  //     setProjects(mockProjects);
  //   } catch (error) {
  //     setErrorMessage('Failed to load projects',error);
  //   } finally {
  //     setLoadingProjects(false);
  //   }
  // };

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
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

const handleSendInvitations = async (e) => {
  e.preventDefault();
  setErrorMessage('');
  setSuccessMessage('');

  // Validate project selection
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
    const response = await dispatch(invitationToProjet({
      projectId: selectedProject,
      emails: validEmails,
      accessType: role,  // FIXED name
      message,
      invitedBy: userDetails?.id
    }));

    console.log("API RESPONSE:", response);

    const projectName = projects.find(p => p.id === selectedProject)?.name;

    setSuccessMessage(
      `Successfully sent ${validEmails.length} invitation${validEmails.length > 1 ? 's' : ''} to ${projectName}!`
    );

    setEmails(['']);
    setSelectedProject('');
    setMessage('');
    
    setTimeout(() => setSuccessMessage(''), 5000);

  } catch (error) {
    console.log("ERROR:", error);
    setErrorMessage('Failed to send invitations. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const accesTypeValue=(value)=>{
    if (value===100) {
      return "Viewer"
    }
    if (value===200) {
      return "Editor"
    }
    if (value===300) {
      return "Manager"
    }
    if (value===400) {
      return "Admin"
    }
  }

  if (!sucessFetchProjects) {
    return <CircularLoader/>
    
  }

  return (
    <div className="invitation-page">
      <div className="invitation-container">
        <div className="invitation-header">
          <div className="invitation-header__icon">
            <Users size={32} />
          </div>
          <h1 className="invitation-header__title">Invite Team Members</h1>
          <p className="invitation-header__subtitle">
            Send invitations to join your project workspace
          </p>
        </div>

        {successMessage && (
          <div className="alert alert--success">
            <Check size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert--error">
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSendInvitations} className="invitation-form">
          {/* Project Selection Section */}
          <div className="form-section">
            <label className="form-label" htmlFor="project">
              <FolderOpen size={18} />
              Select Project
            </label>
            {!sucessFetchProjects ? (
              <div className="loading-projects">
                <div className="spinner" />
                <span>Loading projects...</span>
              </div>
            ) : (
              <>
                <select
                  id="project"
                  className="form-select"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  required
                >
                  <option value="">Choose a project...</option>

                  {projectWithAccess?.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} ({project.memberCount} members)
                    </option>
                  ))}
                </select>

                <p className="form-hint">
                  {selectedProject
                    ? `Inviting members to ${
                        projectWithAccess?.find((p) => p.id === selectedProject)?.name
                      }`
                    : "Select the project you want to invite members to"}
                </p>

              </>
            )}
          </div>

          {/* Email Inputs Section */}
          <div className="form-section">
            <div className="email-inputs">
              <label className="form-label">
                <Mail size={18} />
                Email Addresses
              </label>
              {emails.map((email, index) => (
                <div key={index} className="email-input-group">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="colleague@company.com"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    required={index === 0}
                  />
                  {emails.length > 1 && (
                    <button
                      type="button"
                      className="btn-icon btn-icon--danger"
                      onClick={() => removeEmailField(index)}
                      aria-label="Remove email"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-add-email"
              onClick={addEmailField}
            >
              <UserPlus size={18} />
              Add Another Email
            </button>
          </div>

          {/* Role Selection Section */}
          <div className="form-section">
            <label className="form-label" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value={100}>{accesTypeValue(100)}</option>
              <option value={200}>{accesTypeValue(200)}</option>
              <option value={300}>{accesTypeValue(300)}</option>
              <option value={400}>{accesTypeValue(400)}</option>
            </select>
            <p className="form-hint">
              {role === 400 && 'Admins can manage team members and project settings'}
              {role === 300 && 'Managers can oversee projects and assign tasks'}
              {role === 200 && 'Members can create and manage their own tasks'}
              {role === 100 && 'Viewers have read-only access to the project'}
            </p>
          </div>

          {/* Personal Message Section */}
          <div className="form-section">
            <label className="form-label" htmlFor="message">
              Personal Message (Optional)
            </label>
            <textarea
              id="message"
              className="form-textarea"
              placeholder="Add a personal message to your invitation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <p className="form-hint">
              {message.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={!sucessFetchProjects }
            >
              {!sucessFetchProjects ? (
                <>
                  <div className="spinner" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Invitations
                </>
              )}
            </button>
          </div>
        </form>

        {/* Information Card */}
        <div className="invitation-info">
          <div className="info-card">
            <h3 className="info-card__title">What happens next?</h3>
            <ul className="info-card__list">
              <li>Invitees will receive an email with a secure link</li>
              <li>They can accept the invitation and create their account</li>
              <li>Once accepted, they'll have access to the selected project</li>
              <li>You can manage team members from the Project settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInvitationPage;