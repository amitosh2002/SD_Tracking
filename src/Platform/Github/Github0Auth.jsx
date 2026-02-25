import React, { useState } from 'react';
import {
  Github,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Lock,
  Eye,
  GitBranch,
  Users,
  Settings,
  Check,
  X
} from 'lucide-react';
import './styles/GitHubAuthPage.scss';

export default function GitHubAuthPage() {
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data
  const appInfo = {
    name: 'Hora',
    developer: 'Hora Inc.',
    website: 'https://hora.app',
    description: 'Engineering velocity and DORA metrics platform',
    logo: null // Would be actual logo URL
  };

  const userInfo = {
    username: 'johndoe',
    name: 'John Doe',
    avatar: null,
    email: 'john.doe@example.com'
  };

  const permissions = [
    {
      category: 'Repository permissions',
      items: [
        { name: 'Contents', access: 'Read-only', description: 'Read repository contents and commits' },
        { name: 'Metadata', access: 'Read-only', description: 'Read repository metadata' },
        { name: 'Pull requests', access: 'Read-only', description: 'Read pull request data' },
        { name: 'Actions', access: 'Read-only', description: 'Read GitHub Actions workflow runs' }
      ]
    },
    {
      category: 'Organization permissions',
      items: [
        { name: 'Members', access: 'Read-only', description: 'Read organization members' }
      ]
    }
  ];

  const handleApprove = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production: redirect to callback URL with authorization code
      // window.location.href = `${callbackUrl}?code=${authCode}&state=${state}`;
      
      console.log('Authorization approved');
    } catch (error) {
      console.error('Authorization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    // In production: redirect to callback URL with error
    // window.location.href = `${callbackUrl}?error=access_denied`;
    console.log('Authorization declined');
    window.history.back();
  };

  return (
    <div className="github-auth-page">
      <div className="github-auth-page__container">
        {/* Header */}
        <div className="auth-header">
          <Github className="auth-header__logo" size={48} />
          <h1 className="auth-header__title">Authorize application</h1>
        </div>

        {/* Main Card */}
        <div className="auth-card">
          {/* App Info */}
          <div className="app-info">
            <div className="app-info__logo">
              {appInfo.logo ? (
                <img src={appInfo.logo} alt={appInfo.name} />
              ) : (
                <div className="app-info__logo-placeholder">
                  <Shield size={32} />
                </div>
              )}
            </div>
            <div className="app-info__details">
              <h2 className="app-info__name">{appInfo.name}</h2>
              <p className="app-info__developer">by {appInfo.developer}</p>
              <p className="app-info__description">{appInfo.description}</p>
              <a href={appInfo.website} target="_blank" rel="noopener noreferrer" className="app-info__link">
                {appInfo.website}
              </a>
            </div>
          </div>

          {/* Authorization Request */}
          <div className="auth-request">
            <div className="auth-request__header">
              <Shield size={20} />
              <h3>Authorization Request</h3>
            </div>
            <p className="auth-request__message">
              <strong>{appInfo.name}</strong> by <strong>{appInfo.developer}</strong> wants to access your{' '}
              <strong>{userInfo.username}</strong> account
            </p>
          </div>

          {/* User Info */}
          <div className="user-info">
            <div className="user-info__avatar">
              {userInfo.avatar ? (
                <img src={userInfo.avatar} alt={userInfo.name} />
              ) : (
                <div className="user-info__avatar-placeholder">
                  {userInfo.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <div className="user-info__details">
              <div className="user-info__name">{userInfo.name}</div>
              <div className="user-info__username">@{userInfo.username}</div>
            </div>
          </div>

          {/* Permissions Summary */}
          <div className="permissions-summary">
            <h4>This application will be able to:</h4>
            <ul className="permissions-summary__list">
              <li>
                <Check size={16} />
                <span>Read your repository contents and metadata</span>
              </li>
              <li>
                <Check size={16} />
                <span>Access pull request information</span>
              </li>
              <li>
                <Check size={16} />
                <span>View GitHub Actions workflow runs</span>
              </li>
              <li>
                <Check size={16} />
                <span>Read organization membership data</span>
              </li>
            </ul>
          </div>

          {/* Detailed Permissions */}
          <div className="permissions-details">
            <button 
              className="permissions-toggle"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span>View detailed permissions</span>
              <ChevronRight 
                size={18} 
                className={showDetails ? 'permissions-toggle__icon--open' : ''}
              />
            </button>

            {showDetails && (
              <div className="permissions-list">
                {permissions.map((category, catIndex) => (
                  <div key={catIndex} className="permission-category">
                    <h5 className="permission-category__title">{category.category}</h5>
                    <div className="permission-items">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="permission-item">
                          <div className="permission-item__header">
                            <Eye size={16} />
                            <span className="permission-item__name">{item.name}</span>
                            <span className="permission-item__badge">{item.access}</span>
                          </div>
                          <p className="permission-item__description">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="security-notice">
            <Lock size={16} />
            <div className="security-notice__content">
              <strong>This authorization is secure</strong>
              <p>You can revoke this authorization at any time from your GitHub settings.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="auth-actions">
            <button 
              className="btn btn--secondary"
              onClick={handleDecline}
              disabled={loading}
            >
              <X size={18} />
              Cancel
            </button>
            <button 
              className="btn btn--success"
              onClick={handleApprove}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Authorizing...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Authorize {appInfo.name}
                </>
              )}
            </button>
          </div>

          {/* Warning */}
          <div className="auth-warning">
            <AlertTriangle size={16} />
            <p>
              Authorizing will redirect you to <strong>{appInfo.website}</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Not {userInfo.username}? <a href="#">Sign in with a different account</a>
          </p>
          <div className="auth-footer__links">
            <a href="#">Terms</a>
            <span>•</span>
            <a href="#">Privacy</a>
            <span>•</span>
            <a href="#">Security</a>
            <span>•</span>
            <a href="#">Contact GitHub</a>
          </div>
        </div>
      </div>
    </div>
  );
}