import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Github, 
  Check, 
  Shield, 
  Lock, 
  Zap,
  GitBranch,
  Code,
  Users,
  ArrowRight
} from 'lucide-react';
import './styles/GitHubConnect.scss';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function GitHubConnect({  onSkip }) {
  const [loading, setLoading] = useState(false);
  const setupInitiated = useRef(false);

  const [query] = useSearchParams();
  const installationId= query.get('installation_id');
  const setup_action= query.get('setup_action');
  const projectId = query.get('state');

  const handleConnect = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/github/github/setup`,
        {
          installation_id: installationId,
          setup_action: setup_action,
          projectId: projectId
        },
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      console.log(res.data);
      if (res.data.success && res.data.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      }
    } catch (error) {
      console.error('GitHub connection error:', error);
    } finally {
      setLoading(false);
    }
  }, [installationId, setup_action, projectId, loading]);

  useEffect(() => {
    if (installationId && setup_action && projectId && !setupInitiated.current) {
      setupInitiated.current = true;
      handleConnect();
    }
  }, [installationId, setup_action, projectId, handleConnect]);

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  const benefits = [
    {
      icon: GitBranch,
      title: 'Import Repositories',
      description: 'Seamlessly sync your existing projects'
    },
    {
      icon: Code,
      title: 'Track Commits',
      description: 'Monitor all code changes automatically'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Connect with your development team'
    },
    {
      icon: Zap,
      title: 'Quick Setup',
      description: 'Get started in seconds, not hours'
    }
  ];

  const securityFeatures = [
    'Your credentials are never stored',
    'OAuth 2.0 secure authentication',
    'Read-only access by default',
    'Revoke access anytime'
  ];

  return (
    <div className="github-connect">
      <div className="github-connect__container">
        {/* Header */}
        <div className="github-connect__header">
          <div className="github-icon">
            <Github size={64} />
          </div>
          <h1 className="github-connect__title">Connect Your GitHub Account</h1>
          <p className="github-connect__subtitle">
            Unlock powerful integrations and streamline your development workflow
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="benefits-grid">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="benefit-card">
                <div className="benefit-card__icon">
                  <Icon size={24} />
                </div>
                <h3 className="benefit-card__title">{benefit.title}</h3>
                <p className="benefit-card__description">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Connect Button */}
        <div className="connect-section">
          <button 
            onClick={handleConnect}
            disabled={loading}
            className="btn-connect"
          >
            {loading ? (
              <>
                <div className="spinner" />
                Connecting...
              </>
            ) : (
              <>
                <Github size={20} />
                Connect with GitHub
                <ArrowRight size={18} />
              </>
            )}
          </button>
          <p className="connect-hint">
            You'll be redirected to GitHub to authorize access
          </p>
        </div>

        {/* Security Section */}
        <div className="security-section">
          <div className="security-header">
            <Shield size={20} />
            <h3>Secure & Private</h3>
          </div>
          <ul className="security-list">
            {securityFeatures.map((feature, index) => (
              <li key={index} className="security-item">
                <Check size={16} className="security-item__icon" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="github-connect__footer">
          <button onClick={handleSkip} className="btn-skip">
            Skip for now
          </button>
          <a href="#" className="link-help">
            Why do I need this?
          </a>
        </div>

        {/* Trust Badge */}
        <div className="trust-badge">
          <Lock size={14} />
          <span>Trusted by 10,000+ developers</span>
        </div>
      </div>
    </div>
  );
}