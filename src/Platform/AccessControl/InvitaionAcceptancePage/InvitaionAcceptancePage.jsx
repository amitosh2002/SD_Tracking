import  { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader, Mail, Clock, User, Briefcase, Shield, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './styles/fullInvitation.scss';
import { acceptProjectInvitation, fetchInvitationDetails } from '../../../Redux/Actions/PlatformActions.js/projectsActions';

const FullInvitationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // const [inviteToken, setInviteToken] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [inviterName, setInviterName] = useState('');
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    
    const token = searchParams.get('inviteToken');
    
    
    if (!token) {
      console.error('No token found in URL');
      setError('Invalid invitation link. No token provided.');
      setLoading(false);
      return;
    }

    verifyToken(token);
  }, [searchParams,]);
  

  const verifyToken = async (token) => {
    // console.log('Verifying token:', token);
    setLoading(true);
    setError('');

    try {
      const decoded = decodeJWT(token);
      // console.log('Decoded token:', decoded);

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        setError("This invitation has expired.");
        setLoading(false);
        return;
      }

      setTokenData(decoded);

      // console.log('Fetching invitation details for:', {
      //   projectId: decoded.projectId,
      //   invitedBy: decoded.invitedBy
      // });

      const response = await dispatch(fetchInvitationDetails({
        projectId: decoded.projectId,
        invitedBy: decoded.invitedBy
      }));

      // console.log("INVITATION DETAILS FROM API =>", response);

      if (response?.data) {
        setProjectName(response.data.project || 'Unknown Project');
        setInviterName(response.data.invitedBy || 'Team Member');
      }

      setLoading(false);

    } catch (err) {
      console.error('Error verifying token:', err);
      setError("Invalid or expired invitation link.");
      setLoading(false);
    }
  };

  const decodeJWT = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT decode error:', error);
      throw new Error('Invalid token format');
    }
  };

  const handleAcceptInvitation = async () => {
    setError('');
    setAccepting(true);

    try {

      const res = await dispatch(acceptProjectInvitation(tokenData?.invitationId));
      
      setAccepted(res?.success);
      setAccepting(false);

    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError('Failed to accept invitation. Please try again.');
      setAccepting(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
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
      300: 'Manager',
      400: 'Admin',
      200: 'Editor',
      100: 'Viewer'
    };
    return levels[level] || 'Member';
  };

  // Loading state
  if (loading) {
    return (
      <div className="full-invitation-page">
        <div className="full-invitation-container">
          <div className="loading-state">
            <div className="loading-spinner">
              <Loader size={48} className="spinner-animate" />
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
              onClick={() => navigate('/')}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
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
              <strong>{projectName}</strong>
            </p>
            
            <div className="success-details">
              <div className="success-detail-item">
                <Shield size={24} />
                <div>
                  <span className="detail-label">Your Role</span>
                  <span className="detail-value">
                    {getAccessLevelName(tokenData?.accessType)}
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

  // Main invitation page
  return (
    <div className="full-invitation-page">
      <div className="full-invitation-container">
        <div className="invitation-header">
          <div className="invitation-header__logo">H</div>
          <h1 className="invitation-header__title">You're Invited!</h1>
          <p className="invitation-header__subtitle">
            Join {projectName} on Hora
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
          <div className="info-section">
            <div className="inviter-card">
              <div className="inviter-avatar">
                {inviterName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="inviter-info">
                <p className="inviter-message">
                  <strong>{inviterName}</strong> invited you to collaborate
                </p>
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="info-section">
            <h2 className="info-section__title">
              <Briefcase size={24} />
              Project
            </h2>
            <div className="project-card">
              <h3 className="project-name">{projectName}</h3>
            </div>
          </div>

          {/* Your Role */}
          <div className="info-section">
            <h2 className="info-section__title">
              <Shield size={24} />
              Your Role
            </h2>
            <div className="role-card">
              <div className="role-badge">
                {getAccessLevelName(tokenData?.accessLevel)}
              </div>
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
                  <span>You'll be added to {projectName} team</span>
                </li>
                <li>
                  <CheckCircle size={18} />
                  <span>Access project dashboards and analytics</span>
                </li>
                <li>
                  <CheckCircle size={18} />
                  <span>Collaborate with team members</span>
                </li>
                <li>
                  <CheckCircle size={18} />
                  <span>Receive real-time project updates</span>
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
                  <Loader className="btn-spinner spinner-animate" size={20} />
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