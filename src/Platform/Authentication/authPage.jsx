

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOtpAction, resendOtpRequest, verifyOtpAction } from '../../Redux/Actions/Auth/AuthActions';
import { useNavigate } from 'react-router-dom';
import { SHOW_SNACKBAR } from '../../Redux/Constants/PlatformConstatnt/platformConstant';
import GoogleAuthButton from './googleSSO';
import HoraLoader from '../../customFiles/customComponent/Loader/loaderV1';
import './LoginPage.scss';
import HoraLogo from '../../assets/platformIcons/hora-logo.svg';

const LoginPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    dispatch(getOtpAction(email));
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 500);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
    if (e.key === 'Enter') {
      handleOtpSubmit(e);
    }
  };

  const handleOtpSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete OTP');
      return;
    }
    const data = { email: email, otp: otpString };
    dispatch(verifyOtpAction(data));
    
    setLoading(true);
    setError('');
    navigate("/");
  };

  const resendOtp = async () => {
    setLoading(true);
    if (!email) {
      setError('Email is required to resend OTP');
      setLoading(false);
      return;
    }
    await dispatch(resendOtpRequest(email));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        message: `OTP sent successfully!`,
        type: "success"
      }
    });
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, otp.length);
    const pasteArray = pasteData.split('');

    const newOtp = [...otp];
    pasteArray.forEach((char, index) => {
      if (index < otp.length) {
        newOtp[index] = char;
      }
    });

    setOtp(newOtp);
    const nextIndex = Math.min(pasteArray.length, otp.length - 1);
    document.getElementById(`otp-${nextIndex}`)?.focus();
  };

  const { ssoLoading, ssoLogin } = useSelector((state) => state.auth);
  
  if (!ssoLoading && ssoLogin) {
    return <div><HoraLoader /></div>;
  }

  return (
    <div className="login-page">
      {/* Left Brand Section */}
      <div className="login-brand">
        <div className="brand-content">
          <div className="brand-logo">
            {/* <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#6366f1"/>
              <path d="M16 14h6v20h-6V14zm10 8h6v12h-6V22z" fill="white"/>
            </svg> */}
            <img src={HoraLogo} alt="Hora" style={{width:"100px", height:"100px"}}/>
            <span className="brand-name">Hora</span>
          </div>
          <h1 className="brand-title">Project Management<br />Made Simple</h1>
          <p className="brand-description">
            Streamline your workflow, collaborate with your team, and deliver projects on time.
          </p>
          
          <div className="brand-features">
            <div className="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7.5L18 8.5L14 13L15 18.5L10 15.5L5 18.5L6 13L2 8.5L7.5 7.5L10 2Z" fill="#6366f1"/>
              </svg>
              <span>Task & Project Tracking</span>
            </div>
            <div className="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7.5L18 8.5L14 13L15 18.5L10 15.5L5 18.5L6 13L2 8.5L7.5 7.5L10 2Z" fill="#6366f1"/>
              </svg>
              <span>Team Collaboration</span>
            </div>
            <div className="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7.5L18 8.5L14 13L15 18.5L10 15.5L5 18.5L6 13L2 8.5L7.5 7.5L10 2Z" fill="#6366f1"/>
              </svg>
              <span>Real-time Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="login-form-section">
        <div className="login-form-container">
          <div className="login-header">
            <h2 className="login-title">
              {step === 1 ? 'Sign in to Hora' : 'Verify your email'}
            </h2>
            <p className="login-subtitle">
              {step === 1 
                ? 'Enter your email address to continue' 
                : `We sent a code to ${email}`
              }
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="form-input"
                  autoFocus
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Sending code...' : 'Continue with Email'}
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <GoogleAuthButton />

              <p className="form-footer">
                Don't have an account? <a href="#" className="link">Sign up</a>
              </p>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Verification code</label>
                <div className="otp-inputs">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      id={`otp-${index}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handlePaste}
                      maxLength="1"
                      className="otp-input"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <div className="form-actions">
                <button 
                  type="button"
                  onClick={resendOtp} 
                  className="btn-link"
                  disabled={loading}
                >
                  Resend code
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(1)} 
                  className="btn-link"
                >
                  Change email
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="login-footer">
          <p>&copy; {new Date().getFullYear()} Hora. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Help</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;