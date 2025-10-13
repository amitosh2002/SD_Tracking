import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { GET_OTP } from '../../Redux/Constants/AuthConstants';
import { getOtpAction, resendOtpRequest, verifyOtpAction } from '../../Redux/Actions/Auth/AuthActions';
import { useNavigate } from 'react-router-dom';
import { SHOW_SNACKBAR } from '../../Redux/Constants/PlatformConstatnt/platformConstant';

const LoginPage = () => {
  const [step, setStep] = useState(1); // 1 for email, 2 for OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch=useDispatch();
  const navigate =useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    dispatch(getOtpAction(email));
    
    setLoading(true);
    setError('');
    
    // Simulate API call
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
    
    // Auto-focus next input
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
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete OTP');
      return;
    }
    const data={email:email,otp:otpString};
    console.log("verifying otp for",data);
     dispatch(verifyOtpAction(data));
    
    setLoading(true);
    setError('');
    navigate("/")
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const resendOtp = async() => {
    setLoading(true);
    console.log("resending otp to",email);
    if(!email) {
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

  const styles = {
    loginContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    },

    brandSection: {
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '4rem 2rem',
      position: 'relative',
      overflow: 'hidden'
    },

    brandContent: {
      textAlign: 'center',
      zIndex: 2,
      position: 'relative'
    },

    logo: {
      fontSize: '4rem',
      fontWeight: '800',
      background: 'linear-gradient(45deg, #ffffff, #a8edea)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1rem',
      textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
      animation: 'fadeInDown 1s ease forwards'
    },

    tagline: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '1.5rem',
      fontWeight: '300',
      marginBottom: '3rem',
      animation: 'fadeInUp 1s ease 0.5s both'
    },

    features: {
      listStyle: 'none',
      textAlign: 'left',
      padding: 0
    },

    featureItem: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '1.1rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      animation: 'fadeInLeft 0.8s ease forwards'
    },

    featureIcon: {
      color: '#a8edea',
      fontSize: '1.3rem',
      marginRight: '1rem',
      width: '24px'
    },

    floatingElements: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none'
    },

    floatingCard: {
      position: 'absolute',
      width: '60px',
      height: '60px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#a8edea',
      fontSize: '1.5rem',
      animation: 'float 6s ease-in-out infinite'
    },

    card1: {
      top: '20%',
      right: '20%',
      animationDelay: '0s'
    },

    card2: {
      top: '60%',
      right: '10%',
      animationDelay: '2s'
    },

    card3: {
      top: '40%',
      right: '5%',
      animationDelay: '4s'
    },

    loginSection: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    },

    loginForm: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '3rem',
      width: '100%',
      maxWidth: '450px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
    },

    formHeader: {
      textAlign: 'center',
      marginBottom: '2rem'
    },

    formTitle: {
      color: 'white',
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '0.5rem'
    },

    formDescription: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '1rem',
      lineHeight: '1.5'
    },

    inputGroup: {
      marginBottom: '1.5rem'
    },

    inputLabel: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '0.9rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      display: 'block'
    },

    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },

    inputIcon: {
      position: 'absolute',
      left: '1rem',
      color: 'rgba(255, 255, 255, 0.5)',
      zIndex: 2
    },

    input: {
      width: '100%',
      padding: '1rem 1rem 1rem 3rem',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      color: 'white',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      outline: 'none'
    },

    otpInputGroup: {
      marginBottom: '2rem'
    },

    otpInputs: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
      marginBottom: '1rem'
    },

    otpInput: {
      width: '50px',
      height: '50px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      color: 'white',
      fontSize: '1.2rem',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      outline: 'none'
    },

    otpInfo: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '0.9rem',
      textAlign: 'center'
    },

    errorMessage: {
      color: '#ff6b6b',
      fontSize: '0.9rem',
      marginBottom: '1rem',
      textAlign: 'center',
      padding: '0.5rem',
      background: 'rgba(255, 107, 107, 0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 107, 107, 0.2)'
    },

    submitBtn: {
      width: '100%',
      padding: '1rem',
      background: 'linear-gradient(45deg, #667eea, #764ba2)',
      border: 'none',
      borderRadius: '12px',
      color: 'white',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '1.5rem'
    },

    formActions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '1.5rem'
    },

    linkBtn: {
      background: 'none',
      border: 'none',
      color: '#a8edea',
      fontSize: '0.9rem',
      cursor: 'pointer',
      textDecoration: 'underline',
      transition: 'all 0.3s ease'
    },

    formFooter: {
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '0.9rem'
    },

    signupLink: {
      color: '#a8edea',
      textDecoration: 'none',
      marginLeft: '0.5rem',
      fontWeight: '600'
    },

    // Mobile responsiveness
    '@media (max-width: 768px)': {
      loginContainer: {
        gridTemplateColumns: '1fr',
        gridTemplateCo: 'auto 1fr'
      },
      brandSection: {
        padding: '2rem 1rem'
      },
      logo: {
        fontSize: '2.5rem'
      },
      tagline: {
        fontSize: '1.2rem'
      },
      loginForm: {
        padding: '2rem',
        margin: '1rem'
      }
    }
  };

  // Add CSS animations
  const cssAnimations = `
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
  `;

  return (
    <>
      <style>{cssAnimations}</style>
      <div style={styles.loginContainer}>
        <div style={styles.brandSection}>
          <div style={styles.brandContent}>
            <h1 style={styles.logo}>HORA</h1>
            <p style={styles.tagline}>Project Management Reimagined</p>
            
            <ul style={styles.features}>
              {[
                { icon: 'fas fa-tasks', text: 'Advanced Task Management', delay: '1s' },
                { icon: 'fas fa-users', text: 'Team Collaboration Tools', delay: '1.2s' },
                { icon: 'fas fa-chart-line', text: 'Real-time Analytics', delay: '1.4s' },
                { icon: 'fas fa-rocket', text: 'Agile Project Tracking', delay: '1.6s' }
              ].map((feature, index) => (
                <li key={index} style={{
                  ...styles.featureItem,
                  animationDelay: feature.delay
                }}>
                  <i className={feature.icon} style={styles.featureIcon}></i>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div style={styles.floatingElements}>
            <div style={{...styles.floatingCard, ...styles.card1}}>
              <i className="fas fa-project-diagram"></i>
            </div>
            <div style={{...styles.floatingCard, ...styles.card2}}>
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div style={{...styles.floatingCard, ...styles.card3}}>
              <i className="fas fa-bell"></i>
            </div>
          </div>
        </div>
        
        <div style={styles.loginSection}>
          <div style={styles.loginForm}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Welcome Back</h2>
              <p style={styles.formDescription}>
                {step === 1 
                  ? 'Enter your email to get started' 
                  : 'Enter the verification code sent to your email'
                }
              </p>
            </div>

            {step === 1 ? (
              <div className="email-form">
                <div style={styles.inputGroup}>
                  <label htmlFor="email" style={styles.inputLabel}>Email Address</label>
                  <div style={styles.inputWrapper}>
                    <i className="fas fa-envelope" style={styles.inputIcon}></i>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      style={styles.input}
                      onFocus={(e) => e.target.style.borderColor = '#a8edea'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                    />
                  </div>
                </div>
                
                {error && <div style={styles.errorMessage}>{error}</div>}
                
                <button 
                  onClick={handleEmailSubmit} 
                  style={{
                    ...styles.submitBtn,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                  disabled={loading}
                  onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <i className="fas fa-arrow-right"></i>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="otp-form">
                <div style={styles.otpInputGroup}>
                  <label style={styles.inputLabel}>Verification Code</label>
                  <div style={styles.otpInputs}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        id={`otp-${index}`}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        maxLength="1"
                        style={styles.otpInput}
                        onFocus={(e) => e.target.style.borderColor = '#a8edea'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                      />
                    ))}
                  </div>
                  <p style={styles.otpInfo}>
                    Code sent to <strong>{email}</strong>
                  </p>
                </div>
                
                {error && <div style={styles.errorMessage}>{error}</div>}
                
                <button 
                  onClick={handleOtpSubmit} 
                  style={{
                    ...styles.submitBtn,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                  disabled={loading}
                  onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Login</span>
                      <i className="fas fa-check"></i>
                    </>
                  )}
                </button>
                
                <div style={styles.formActions}>
                  <button 
                    onClick={resendOtp} 
                    style={styles.linkBtn}
                    onMouseEnter={(e) => e.target.style.color = 'white'}
                    onMouseLeave={(e) => e.target.style.color = '#a8edea'}
                  >
                    Resend Code
                  </button>
                  <button 
                    onClick={() => setStep(1)} 
                    style={styles.linkBtn}
                    onMouseEnter={(e) => e.target.style.color = 'white'}
                    onMouseLeave={(e) => e.target.style.color = '#a8edea'}
                  >
                    Change Email
                  </button>
                </div>
              </div>
            )}
            
            <div style={styles.formFooter}>
              <p>
                New to Hora? 
                <a href="#" style={styles.signupLink}>Create an account</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;