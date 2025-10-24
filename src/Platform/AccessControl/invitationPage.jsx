import React, { useState } from 'react';
import { Mail, UserPlus, X, Check, AlertCircle, Send, Users } from 'lucide-react';
import './styles/invitation.scss';

const TeamInvitationPage = () => {
  const [emails, setEmails] = useState(['']);
  const [role, setRole] = useState('member');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

    // Validate emails
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make your actual API call
      // const response = await dispatch(sendTeamInvitations({
      //   emails: validEmails,
      //   role,
      //   message
      // }));

      setSuccessMessage(`Successfully sent ${validEmails.length} invitation${validEmails.length > 1 ? 's' : ''}!`);
      setEmails(['']);
      setMessage('');
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage('Failed to send invitations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invitation-page">
      <div className="invitation-container">
        <div className="invitation-header">
          <div className="invitation-header__icon">
            <Users size={32} />
          </div>
          <h1 className="invitation-header__title">Invite Team Members</h1>
          <p className="invitation-header__subtitle">
            Send invitations to join your Hora workspace
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
          <div className="form-section">
            <label className="form-label">
              <Mail size={18} />
              Email Addresses
            </label>
            
            <div className="email-inputs">
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
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="viewer">Viewer</option>
            </select>
            <p className="form-hint">
              {role === 'admin' && 'Admins can manage team members and settings'}
              {role === 'manager' && 'Managers can oversee projects and assign tasks'}
              {role === 'member' && 'Members can create and manage their own tasks'}
              {role === 'viewer' && 'Viewers have read-only access'}
            </p>
          </div>

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

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
            >
              {loading ? (
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

        <div className="invitation-info">
          <div className="info-card">
            <h3 className="info-card__title">What happens next?</h3>
            <ul className="info-card__list">
              <li>Invitees will receive an email with a secure link</li>
              <li>They can accept the invitation and create their account</li>
              <li>Once accepted, they'll have access to your workspace</li>
              <li>You can manage team members from the Team settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInvitationPage;