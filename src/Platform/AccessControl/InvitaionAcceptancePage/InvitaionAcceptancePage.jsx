import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader, Mail, Clock, User, Briefcase, Building2, Users, Shield, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import './styles/fullInvitation.scss';

const FullInvitationPage = ({ navigate }) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  
  const [inviteToken, setInviteToken] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [inviterData, setInviterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('inviteToken');
    
    if (!token) {
      setError('Invalid invitation link. No token provided.');
      setLoading(false);
      return;
    }

    setInviteToken(token);
    verifyToken(token);
  }, []);

  const verifyToken = async (token) => {
    setLoading(true);
    setError('');

    try {
      const decoded = decodeJWT(token);
      
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        setError('This invitation has expired. Please request a new invitation.');
        setLoading(false);
        return;
      }

      setTokenData(decoded);
      
      // Fetch all related details
      await Promise.all([
        fetchProjectDetails(decoded.projectId),
        fetchPartnerDetails(decoded.partnerId),
        fetchInviterDetails(decoded.invitedBy)
      ]);
      
      setLoading(false);
    } catch (err) {
      console.error('Token verification error:', err);
      setError('Invalid invitation link. Please check the URL and try again.');
      setLoading(false);
    }
  };

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid token format');
    }
  };

  const fetchProjectDetails = async (projectId) => {
    try {
      // API call to fetch project details
      // const response = await dispatch(getProjectById(projectId));
      // setProjectData(response.data);
      
      // For now, using mock data - replace with actual API call
      const mockProject = {
        name: 'Smart Grid Analytics Platform',
        description: 'Advanced energy management and analytics system for modern infrastructure',
        category: 'Energy Tech',
        status: 'Active',
        teamSize: 8,
        startDate: '2025-01-15'
      };
      setProjectData(mockProject);
    } catch (err) {
      console.error('Failed to fetch project details:', err);
    }
  };

  const fetchPartnerDetails = async (partnerId) => {
    try {
      // API call to fetch partner details
      // const response = await dispatch(getPartnerById(partnerId));
      // setPartnerData(response.data);
      
      // Mock data - replace with actual API call
      const mockPartner = {
        businessName: 'TechCorp Solutions',
        industry: 'Technology',
        location: 'Patna, Bihar'
      };
      setPartnerData(mockPartner);
    } catch (err) {
      console.error('Failed to fetch partner details:', err);
    }
  };

  const fetchInviterDetails = async (inviterId) => {
    try {
      // API call to fetch inviter details
      // const response = await dispatch(getUserById(inviterId));
      // setInviterData(response.data);
      
      // Mock data - replace with actual API call
      const mockInviter = {
        name: 'Rahul Sharma',
        role: 'Project Manager',
        email: 'rahul.sharma@techcorp.com'
      };
      setInviterData(mockInviter);
    } catch (err) {
      console.error('Failed to fetch inviter details:', err);
    }
  };

  const handleAcceptInvitation = async () => {
    setError('');
    setAccepting(true);

    try {
      // API call to accept invitation
      // const response = await dispatch(acceptProjectInvitation({
      //   token: inviteToken,
      //   email: tokenData.invitedEmail,
      //   projectId: tokenData.projectId,
      //   partnerId: tokenData.partnerId,
      //   invitedBy: tokenData.invitedBy,
      //   userId: userDetails?.id // If user is logged in
      // }));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setAccepted(true);
      setAccepting(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept invitation. Please try again.');
      setAccepting(false);
    }
  };

  const handleGoToDashboard = () => {
    if (navigate) {
      navigate('/dashboard');
    } else {
      window.location.href = '/dashboard';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccessLevelName = (level) => {
    const levels = {
      300: 'Admin',
      200: 'Manager',
      100: 'Viewer'
    };
    return levels[level] || 'Member';
  };

  const getAccessLevelDescription = (level) => {
    const descriptions = {
      300: 'Full access to manage projects, team members, and settings',
      200: 'Can manage project tasks, assign work, and monitor progress',
      100: 'Read-only access to view projects and reports'
    };
    return descriptions[level] || 'Standard team member access';
  };

  // Loading state
  if (loading) {
    return (
      <div className="full-invitation-page">
        <div className="full-invitation-container">
          <div className="loading-state">
            <div className="loading-spinner">
              <Loader size={48} />
            </div>
            <h2>Verifying your invitation...</h2>
            <p>Please wait while we validate your invitation link</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !tokenData) {
    return (
      <div className="full-invitation-page">
        <div className="full-invitation-container">
          <div className="error-state">
            <AlertCircle size={64} />
            <h2>Invalid Invitation</h2>
            <p>{error}</p>
            <button 
              className="btn btn--primary"
              onClick={() => window.location.href = '/'}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - After acceptance
  if (accepted) {
    return (
      <div className="full-invitation-page">
        <div className="full-invitation-container full-invitation-container--success">
          <div className="success-celebration">
            <div className="success-icon">
              <CheckCircle size={80} />
            </div>
            <h1 className="success-title">Welcome to the Team! 🎉</h1>
            <p className="success-message">
              You have successfully accepted the invitation to join{' '}
              <strong>{projectData?.name || 'the project'}</strong>
            </p>
            
            <div className="success-details">
              <div className="success-detail-item">
                <Shield size={24} />
                <div>
                  <span className="detail-label">Your Access Level</span>
                  <span className="detail-value">
                    {getAccessLevelName(tokenData?.accessLevel)}
                  </span>
                </div>
              </div>
              <div className="success-detail-item">
                <Mail size={24} />
                <div>
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{tokenData?.invitedEmail}</span>
                </div>
              </div>
              <div className="success-detail-item">
                <Building2 size={24} />
                <div>
                  <span className="detail-label">Organization</span>
                  <span className="detail-value">{partnerData?.businessName}</span>
                </div>
              </div>
            </div>

            <button 
              className="btn btn--primary btn--large"
              onClick={handleGoToDashboard}
            >
              Go to Dashboard
              <ArrowRight size={20} />
            </button>

            <p className="success-footer">
              Get started by exploring your projects and connecting with your team
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main invitation details page
  return (
    <div className="full-invitation-page">
      <div className="full-invitation-container">
        <div className="invitation-header">
          <div className="invitation-header__logo">H</div>
          <h1 className="invitation-header__title">You're Invited!</h1>
          <p className="invitation-header__subtitle">
            Join {partnerData?.businessName || 'the team'} on Hora
          </p>
        </div>

        <div className="invitation-body">
          {error && (
            <div className="alert alert--error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Inviter Information */}
          {inviterData && (
            <div className="info-section">
              <div className="inviter-card">
                <div className="inviter-avatar">
                  {inviterData.name?.charAt(0).toUpperCase()}
                </div>
                <div className="inviter-info">
                  <p className="inviter-message">
                    <strong>{inviterData.name}</strong> invited you to collaborate
                  </p>
                  <p className="inviter-role">{inviterData.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Organization Information */}
          {partnerData && (
            <div className="info-section">
              <h2 className="info-section__title">
                <Building2 size={24} />
                Organization
              </h2>
              <div className="organization-card">
                <h3 className="organization-name">{partnerData.businessName}</h3>
                <div className="organization-meta">
                  {partnerData.industry && (
                    <span className="meta-tag">{partnerData.industry}</span>
                  )}
                  {partnerData.location && (
                    <span className="meta-tag">{partnerData.location}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Project Information */}
          {projectData && (
            <div className="info-section">
              <h2 className="info-section__title">
                <Briefcase size={24} />
                Project Details
              </h2>
              <div className="project-card">
                <div className="project-card__header">
                  <h3 className="project-name">{projectData.name}</h3>
                  <span className={`project-status project-status--${projectData.status.toLowerCase()}`}>
                    {projectData.status}
                  </span>
                </div>
                <p className="project-description">{projectData.description}</p>
                <div className="project-meta">
                  <div className="meta-item">
                    <Users size={18} />
                    <span>{projectData.teamSize} Team Members</span>
                  </div>
                  <div className="meta-item">
                    <Briefcase size={18} />
                    <span>{projectData.category}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Your Access Level */}
          <div className="info-section">
            <h2 className="info-section__title">
              <Shield size={24} />
              Your Access Level
            </h2>
            <div className="role-card">
              <div className="role-badge">
                {getAccessLevelName(tokenData?.accessLevel)}
              </div>
              <p className="role-description">
                {getAccessLevelDescription(tokenData?.accessLevel)}
              </p>
            </div>
          </div>

          {/* Invitation Details */}
          <div className="info-section">
            <h2 className="info-section__title">
              <Mail size={24} />
              Invitation Details
            </h2>
            <div className="details-grid">
              <div className="detail-card">
                <User size={20} />
                <div className="detail-content">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{tokenData?.invitedEmail}</span>
                </div>
              </div>
              {tokenData?.exp && (
                <div className="detail-card">
                  <Clock size={20} />
                  <div className="detail-content">
                    <span className="detail-label">Expires On</span>
                    <span className="detail-value">{formatDate(tokenData.exp)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* What's Next */}
          <div className="info-section">
            <div className="next-steps">
              <h3>What happens after you accept?</h3>
              <ul>
                <li>
                  <CheckCircle size={18} />
                  <span>You'll be added to {projectData?.name || 'the project'} team</span>
                </li>
                <li>
                  <CheckCircle size={18} />
                  <span>Access project dashboards and analytics</span>
                </li>
                <li>
                  <CheckCircle size={18} />
                  <span>Collaborate with {projectData?.teamSize || 'your'} team members</span>
                </li>
                <li>
                  <CheckCircle size={18} />
                  <span>Receive real-time project updates and notifications</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Accept Button */}
          <div className="invitation-actions">
            <button
              className="btn btn--primary btn--large"
              onClick={handleAcceptInvitation}
              disabled={accepting}
            >
              {accepting ? (
                <>
                  <Loader className="btn-spinner" size={20} />
                  Accepting Invitation...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Accept Invitation
                </>
              )}
            </button>
          </div>

          <p className="invitation-footer">
            By accepting, you agree to Hora's{' '}
            <a href="/terms" className="link">Terms of Service</a> and{' '}
            <a href="/privacy" className="link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FullInvitationPage;