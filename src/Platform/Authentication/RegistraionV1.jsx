// import React, { useState } from 'react';
// import { Eye, EyeOff, User, Mail, Phone, Lock, Clock, CheckCircle, Shield, Zap } from 'lucide-react';
// import './HoraRegistration.scss';
// import { registerUserAction } from '../../Redux/Actions/Auth/AuthActions';
// import { useDispatch } from 'react-redux';

// const HoraRegistration = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phone: '',
//     firstName: '',
//     lastName: ''
//   });
  
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const dispatch = useDispatch();

//   const validateField = (name, value) => {
//     switch (name) {
//       case 'username':
//         if (value.length < 3) return 'Username must be at least 3 characters';
//         if (value.length > 30) return 'Username must be less than 30 characters';
//         if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
//         return '';
//       case 'email':
//         if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) return 'Please enter a valid email';
//         return '';
//       case 'password':
//         if (value.length < 6) return 'Password must be at least 6 characters';
//         return '';
//       case 'confirmPassword':
//         if (value !== formData.password) return 'Passwords do not match';
//         return '';
//       case 'phone':
//         if (!/^[0-9]{10}$/.test(value)) return 'Please enter a valid 10-digit phone number';
//         return '';
//       default:
//         return '';
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Real-time validation
//     const error = validateField(name, value);
//     setErrors(prev => ({ ...prev, [name]: error }));
//   };

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();
//     setIsLoading(true);
    
//     // Validate all fields
//     const newErrors = {};
//     Object.keys(formData).forEach(key => {
//       const error = validateField(key, formData[key]);
//       if (error) newErrors[key] = error;
//     });
    
//     // Check required fields
//     if (!formData.username) newErrors.username = 'Username is required';
//     if (!formData.email) newErrors.email = 'Email is required';
//     if (!formData.password) newErrors.password = 'Password is required';
//     if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
//     if (!formData.phone) newErrors.phone = 'Phone number is required';
    
//     setErrors(newErrors);
    
//     if (Object.keys(newErrors).length === 0) {
//       // Simulate API call
//       dispatch(registerUserAction(formData));
//       console.log('Registration data:', formData);
//       setTimeout(() => {
//         console.log('Registration data:', formData);
//         alert('Registration successful!');
//         setIsLoading(false);
//       }, 2000);
//     } else {
//       setIsLoading(false);
//     }
//   };

//   const features = [
//     {
//       icon: <CheckCircle className="feature-icon" />,
//       title: "Easy Setup",
//       description: "Get started in minutes with our intuitive onboarding process"
//     },
//     {
//       icon: <Shield className="feature-icon" />,
//       title: "Secure & Private",
//       description: "Your data is protected with enterprise-grade security"
//     },
//     {
//       icon: <Zap className="feature-icon" />,
//       title: "Lightning Fast",
//       description: "Optimized performance for the best user experience"
//     }
//   ];

//   return (
//     <div className="registration-container">
//       <div className="registration-layout">
//         {/* Left Side - Content & Illustration */}
//         <div className="content-section">
//           <div className="content-wrapper">
//             {/* Logo and Brand */}
//             <div className="brand">
//               <div className="brand__logo">
//                 <Clock />
//               </div>
//               <h1 className="brand__name">Hora</h1>
//               <p className="brand__tagline">Time Management Redefined</p>
//             </div>

//             {/* Main Content */}
//             <div className="main-content">
//               <h2 className="main-content__title">
//                 Join thousands of professionals who trust Hora
//               </h2>
//               <p className="main-content__description">
//                 Transform your productivity with intelligent time tracking, 
//                 seamless collaboration, and powerful analytics that help you 
//                 make the most of every moment.
//               </p>

//               {/* Features List */}
//               <div className="features-list">
//                 {features.map((feature, index) => (
//                   <div key={index} className="feature-item">
//                     <div className="feature-item__icon">
//                       {feature.icon}
//                     </div>
//                     <div className="feature-item__content">
//                       <h3 className="feature-item__title">{feature.title}</h3>
//                       <p className="feature-item__description">{feature.description}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Illustration */}
//               <div className="illustration">
//                 <svg viewBox="0 0 400 300" className="illustration-svg">
//                   {/* Background circles */}
//                   <circle cx="200" cy="150" r="120" fill="url(#gradient1)" opacity="0.1" />
//                   <circle cx="300" cy="80" r="60" fill="url(#gradient2)" opacity="0.2" />
//                   <circle cx="100" cy="220" r="40" fill="url(#gradient3)" opacity="0.15" />
                  
//                   {/* Main clock illustration */}
//                   <circle cx="200" cy="150" r="80" fill="url(#gradient4)" />
//                   <circle cx="200" cy="150" r="75" fill="white" />
//                   <circle cx="200" cy="150" r="5" fill="#667eea" />
                  
//                   {/* Clock hands */}
//                   <line x1="200" y1="150" x2="200" y2="90" stroke="#667eea" strokeWidth="3" strokeLinecap="round" />
//                   <line x1="200" y1="150" x2="240" y2="150" stroke="#764ba2" strokeWidth="2" strokeLinecap="round" />
                  
//                   {/* Hour markers */}
//                   <circle cx="200" cy="80" r="3" fill="#e5e7eb" />
//                   <circle cx="270" cy="150" r="3" fill="#e5e7eb" />
//                   <circle cx="200" cy="220" r="3" fill="#e5e7eb" />
//                   <circle cx="130" cy="150" r="3" fill="#e5e7eb" />
                  
//                   {/* Floating elements */}
//                   <rect x="320" y="120" width="60" height="40" rx="8" fill="url(#gradient5)" opacity="0.8" />
//                   <rect x="325" y="125" width="50" height="4" rx="2" fill="white" />
//                   <rect x="325" y="135" width="35" height="4" rx="2" fill="white" />
//                   <rect x="325" y="145" width="25" height="4" rx="2" fill="white" />
                  
//                   <rect x="20" y="180" width="50" height="60" rx="8" fill="url(#gradient6)" opacity="0.8" />
//                   <circle cx="45" cy="200" r="8" fill="white" />
//                   <rect x="35" y="215" width="20" height="3" rx="1.5" fill="white" />
//                   <rect x="30" y="225" width="30" height="3" rx="1.5" fill="white" />
                  
//                   {/* Gradients */}
//                   <defs>
//                     <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
//                       <stop offset="0%" stopColor="#667eea" />
//                       <stop offset="100%" stopColor="#764ba2" />
//                     </linearGradient>
//                     <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
//                       <stop offset="0%" stopColor="#f093fb" />
//                       <stop offset="100%" stopColor="#f5576c" />
//                     </linearGradient>
//                     <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
//                       <stop offset="0%" stopColor="#4facfe" />
//                       <stop offset="100%" stopColor="#00f2fe" />
//                     </linearGradient>
//                     <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
//                       <stop offset="0%" stopColor="#667eea" />
//                       <stop offset="100%" stopColor="#764ba2" />
//                     </linearGradient>
//                     <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
//                       <stop offset="0%" stopColor="#667eea" />
//                       <stop offset="100%" stopColor="#764ba2" />
//                     </linearGradient>
//                     <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
//                       <stop offset="0%" stopColor="#f093fb" />
//                       <stop offset="100%" stopColor="#f5576c" />
//                     </linearGradient>
//                   </defs>
//                 </svg>
//               </div>

//               {/* Stats */}
//               <div className="stats">
//                 <div className="stat-item">
//                   <div className="stat-item__number">10K+</div>
//                   <div className="stat-item__label">Active Users</div>
//                 </div>
//                 <div className="stat-item">
//                   <div className="stat-item__number">99.9%</div>
//                   <div className="stat-item__label">Uptime</div>
//                 </div>
//                 <div className="stat-item">
//                   <div className="stat-item__number">24/7</div>
//                   <div className="stat-item__label">Support</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Registration Form */}
//         <div className="form-section">
//           <div className="form-wrapper">
//             <div className="form-header">
//               <h2 className="form-header__title">Create Your Account</h2>
//               <p className="form-header__subtitle">Start your journey with Hora today</p>
//             </div>

//             <div className="form-card">
//               <div className="form-content">
//                 {/* Personal Info Row */}
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label className="form-group__label">First Name</label>
//                     <div className="form-group__input-wrapper">
//                       <input
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleInputChange}
//                         placeholder="John"
//                       />
//                       <User className="icon" />
//                     </div>
//                   </div>
//                   <div className="form-group">
//                     <label className="form-group__label">Last Name</label>
//                     <div className="form-group__input-wrapper">
//                       <input
//                         type="text"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleInputChange}
//                         placeholder="Doe"
//                       />
//                       <User className="icon" />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Username */}
//                 <div className="form-group">
//                   <label className="form-group__label">
//                     Username <span className="required">*</span>
//                   </label>
//                   <div className="form-group__input-wrapper">
//                     <input
//                       type="text"
//                       name="username"
//                       value={formData.username}
//                       onChange={handleInputChange}
//                       className={errors.username ? 'error' : ''}
//                       placeholder="johndoe"
//                       required
//                     />
//                     <User className="icon" />
//                   </div>
//                   {errors.username && (
//                     <p className="form-group__error">{errors.username}</p>
//                   )}
//                 </div>

//                 {/* Email */}
//                 <div className="form-group">
//                   <label className="form-group__label">
//                     Email Address <span className="required">*</span>
//                   </label>
//                   <div className="form-group__input-wrapper">
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className={errors.email ? 'error' : ''}
//                       placeholder="john@example.com"
//                       required
//                     />
//                     <Mail className="icon" />
//                   </div>
//                   {errors.email && (
//                     <p className="form-group__error">{errors.email}</p>
//                   )}
//                 </div>

//                 {/* Phone */}
//                 <div className="form-group">
//                   <label className="form-group__label">
//                     Phone Number <span className="required">*</span>
//                   </label>
//                   <div className="form-group__input-wrapper">
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       className={errors.phone ? 'error' : ''}
//                       placeholder="9876543210"
//                       required
//                     />
//                     <Phone className="icon" />
//                   </div>
//                   {errors.phone && (
//                     <p className="form-group__error">{errors.phone}</p>
//                   )}
//                 </div>

//                 {/* Password */}
//                 <div className="form-group">
//                   <label className="form-group__label">
//                     Password <span className="required">*</span>
//                   </label>
//                   <div className="form-group__input-wrapper">
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className={errors.password ? 'error' : ''}
//                       placeholder="••••••••"
//                       required
//                     />
//                     <Lock className="icon" />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="password-toggle"
//                     >
//                       {showPassword ? <EyeOff /> : <Eye />}
//                     </button>
//                   </div>
//                   {errors.password && (
//                     <p className="form-group__error">{errors.password}</p>
//                   )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div className="form-group">
//                   <label className="form-group__label">
//                     Confirm Password <span className="required">*</span>
//                   </label>
//                   <div className="form-group__input-wrapper">
//                     <input
//                       type={showConfirmPassword ? 'text' : 'password'}
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleInputChange}
//                       className={errors.confirmPassword ? 'error' : ''}
//                       placeholder="••••••••"
//                       required
//                     />
//                     <Lock className="icon" />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       className="password-toggle"
//                     >
//                       {showConfirmPassword ? <EyeOff /> : <Eye />}
//                     </button>
//                   </div>
//                   {errors.confirmPassword && (
//                     <p className="form-group__error">{errors.confirmPassword}</p>
//                   )}
//                 </div>

//                 {/* Terms and Conditions */}
//                 <div className="checkbox-group">
//                   <input type="checkbox" id="terms" required />
//                   <label htmlFor="terms">
//                     I agree to the{' '}
//                     <a href="#">Terms of Service</a>{' '}
//                     and{' '}
//                     <a href="#">Privacy Policy</a>
//                   </label>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   onClick={handleSubmit}
//                   disabled={isLoading}
//                   className="submit-button"
//                 >
//                   {isLoading ? (
//                     <div className="submit-button__loading">
//                       <div className="spinner"></div>
//                       <span>Creating Account...</span>
//                     </div>
//                   ) : (
//                     'Create Account'
//                   )}
//                 </button>
//               </div>

//               {/* Login Link */}
//               <div className="login-link">
//                 <p>
//                   Already have an account?{' '}
//                   <a href="#">Sign in here</a>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HoraRegistration;

import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, Clock, CheckCircle, Shield, Zap } from 'lucide-react';
import './HoraRegistration.scss';
import { registerUserAction, verifyAccountAction } from '../../Redux/Actions/Auth/AuthActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SHOW_SNACKBAR } from '../../Redux/Constants/PlatformConstatnt/platformConstant';

const HoraRegistration = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        // confirmPassword: '',
        phone: '',
        firstName: '',
        lastName: ''
    });

    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate=useNavigate();
    // fetching user authentication status from redux
    const{isAuthenticated}=useSelector((state)=>state.auth);
    const validateField = (name, value) => {
        switch (name) {
            case 'username':
                if (value.length < 3) return 'Username must be at least 3 characters';
                if (value.length > 30) return 'Username must be less than 30 characters';
                if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
                return '';
            case 'email':
                if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) return 'Please enter a valid email';
                return '';
            case 'password':
                if (value.length < 6) return 'Password must be at least 6 characters';
                return '';
            case 'confirmPassword':
                if (value !== formData.password) return 'Passwords do not match';
                return '';
            case 'phone':
                if (!/^[0-9]{10}$/.test(value)) return 'Please enter a valid 10-digit phone number';
                return '';
            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleRegistrationSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);

        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        // if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
        if (!formData.phone) newErrors.phone = 'Phone number is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Simulate API call to send OTP
              dispatch(registerUserAction(formData));
            setTimeout(() => {
                console.log('Registration data:', formData);
               
                setIsOtpSent(true);
                setIsLoading(false);
            }, 2000);
              dispatch({
                    type: SHOW_SNACKBAR,
                    payload: {
                      message: `Otp sent to your mail id"`,
                      type: "success"
                    }
                  });
        } else {
            setIsLoading(false);
        }
        
    };

    const handleOtpSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);

        if (otp.length !== 6) {
            setErrors({ otp: 'Please enter a 6-digit OTP' });
            setIsLoading(false);
            return;
        }

        // Simulate API call to verify OTP
        await dispatch(verifyAccountAction({
            email: formData.email,
            otp: otp
        },))
        if(isAuthenticated){
            navigate("/");
        }

        // setTimeout(() => {
        //     console.log('Verifying OTP:', otp);
        //     // In a real app, you would verify the OTP here
        //     if (otp === '123456') { // Dummy check
        //         alert('Account verified and created successfully!');
        //         setIsLoading(false);
        //         // Redirect user or update UI
        //     } else {
        //         setErrors({ otp: 'Invalid OTP. Please try again.' });
        //         setIsLoading(false);
        //     }
        // }, 2000);
    };

    const features = [
        {
            icon: <CheckCircle className="feature-icon" />,
            title: "Easy Setup",
            description: "Get started in minutes with our intuitive onboarding process"
        },
        {
            icon: <Shield className="feature-icon" />,
            title: "Secure & Private",
            description: "Your data is protected with enterprise-grade security"
        },
        {
            icon: <Zap className="feature-icon" />,
            title: "Lightning Fast",
            description: "Optimized performance for the best user experience"
        }
    ];

    return (
        <div className="registration-container">
            <div className="registration-layout">
                {/* Left Side - Content & Illustration (unchanged) */}
                <div className="content-section">
                    <div className="content-wrapper">
                        <div className="brand">
                            <div className="brand__logo">
                                <Clock />
                            </div>
                            <h1 className="brand__name">Hora</h1>
                            <p className="brand__tagline">Time Management Redefined</p>
                        </div>
                        <div className="main-content">
                            <h2 className="main-content__title">
                                Join thousands of professionals who trust Hora
                            </h2>
                            <p className="main-content__description">
                                Transform your productivity with intelligent time tracking,
                                seamless collaboration, and powerful analytics that help you
                                make the most of every moment.
                            </p>
                            <div className="features-list">
                                {features.map((feature, index) => (
                                    <div key={index} className="feature-item">
                                        <div className="feature-item__icon">
                                            {feature.icon}
                                        </div>
                                        <div className="feature-item__content">
                                            <h3 className="feature-item__title">{feature.title}</h3>
                                            <p className="feature-item__description">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="illustration">
                                <svg viewBox="0 0 400 300" className="illustration-svg">
                                    <defs>
                                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#667eea" />
                                            <stop offset="100%" stopColor="#764ba2" />
                                        </linearGradient>
                                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#f093fb" />
                                            <stop offset="100%" stopColor="#f5576c" />
                                        </linearGradient>
                                        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#4facfe" />
                                            <stop offset="100%" stopColor="#00f2fe" />
                                        </linearGradient>
                                        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#667eea" />
                                            <stop offset="100%" stopColor="#764ba2" />
                                        </linearGradient>
                                        <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#667eea" />
                                            <stop offset="100%" stopColor="#764ba2" />
                                        </linearGradient>
                                        <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#f093fb" />
                                            <stop offset="100%" stopColor="#f5576c" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="200" cy="150" r="120" fill="url(#gradient1)" opacity="0.1" />
                                    <circle cx="300" cy="80" r="60" fill="url(#gradient2)" opacity="0.2" />
                                    <circle cx="100" cy="220" r="40" fill="url(#gradient3)" opacity="0.15" />
                                    <circle cx="200" cy="150" r="80" fill="url(#gradient4)" />
                                    <circle cx="200" cy="150" r="75" fill="white" />
                                    <circle cx="200" cy="150" r="5" fill="#667eea" />
                                    <line x1="200" y1="150" x2="200" y2="90" stroke="#667eea" strokeWidth="3" strokeLinecap="round" />
                                    <line x1="200" y1="150" x2="240" y2="150" stroke="#764ba2" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="200" cy="80" r="3" fill="#e5e7eb" />
                                    <circle cx="270" cy="150" r="3" fill="#e5e7eb" />
                                    <circle cx="200" cy="220" r="3" fill="#e5e7eb" />
                                    <circle cx="130" cy="150" r="3" fill="#e5e7eb" />
                                    <rect x="320" y="120" width="60" height="40" rx="8" fill="url(#gradient5)" opacity="0.8" />
                                    <rect x="325" y="125" width="50" height="4" rx="2" fill="white" />
                                    <rect x="325" y="135" width="35" height="4" rx="2" fill="white" />
                                    <rect x="325" y="145" width="25" height="4" rx="2" fill="white" />
                                    <rect x="20" y="180" width="50" height="60" rx="8" fill="url(#gradient6)" opacity="0.8" />
                                    <circle cx="45" cy="200" r="8" fill="white" />
                                    <rect x="35" y="215" width="20" height="3" rx="1.5" fill="white" />
                                    <rect x="30" y="225" width="30" height="3" rx="1.5" fill="white" />
                                </svg>
                            </div>
                            <div className="stats">
                                <div className="stat-item">
                                    <div className="stat-item__number">10K+</div>
                                    <div className="stat-item__label">Active Users</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-item__number">99.9%</div>
                                    <div className="stat-item__label">Uptime</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-item__number">24/7</div>
                                    <div className="stat-item__label">Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Registration Form */}
                <div className="form-section">
                    <div className="form-wrapper">
                        {!isOtpSent ? (
                            <>
                                <div className="form-header">
                                    <h2 className="form-header__title">Create Your Account</h2>
                                    <p className="form-header__subtitle">Start your journey with Hora today</p>
                                </div>
                                <div className="form-card">
                                    <form onSubmit={handleRegistrationSubmit}>
                                        <div className="form-content">
                                            {/* Personal Info Row */}
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-group__label">First Name</label>
                                                    <div className="form-group__input-wrapper">
                                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
                                                        <User className="icon" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-group__label">Last Name</label>
                                                    <div className="form-group__input-wrapper">
                                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
                                                        <User className="icon" />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Username */}
                                            <div className="form-group">
                                                <label className="form-group__label">Username <span className="required">*</span></label>
                                                <div className="form-group__input-wrapper">
                                                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} className={errors.username ? 'error' : ''} placeholder="johndoe" required />
                                                    <User className="icon" />
                                                </div>
                                                {errors.username && (<p className="form-group__error">{errors.username}</p>)}
                                            </div>
                                            {/* Email */}
                                            <div className="form-group">
                                                <label className="form-group__label">Email Address <span className="required">*</span></label>
                                                <div className="form-group__input-wrapper">
                                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={errors.email ? 'error' : ''} placeholder="john@example.com" required />
                                                    <Mail className="icon" />
                                                </div>
                                                {errors.email && (<p className="form-group__error">{errors.email}</p>)}
                                            </div>
                                            {/* Phone */}
                                            <div className="form-group">
                                                <label className="form-group__label">Phone Number <span className="required">*</span></label>
                                                <div className="form-group__input-wrapper">
                                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={errors.phone ? 'error' : ''} placeholder="9876543210" required />
                                                    <Phone className="icon" />
                                                </div>
                                                {errors.phone && (<p className="form-group__error">{errors.phone}</p>)}
                                            </div>
                                            {/* Password */}
                                            <div className="form-group">
                                                <label className="form-group__label">Password <span className="required">*</span></label>
                                                <div className="form-group__input-wrapper">
                                                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} className={errors.password ? 'error' : ''} placeholder="••••••••" required />
                                                    <Lock className="icon" />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                                                        {showPassword ? <EyeOff /> : <Eye />}
                                                    </button>
                                                </div>
                                                {errors.password && (<p className="form-group__error">{errors.password}</p>)}
                                            </div>
                                            {/* Confirm Password */}
                                            <div className="form-group">
                                                <label className="form-group__label">Confirm Password <span className="required">*</span></label>
                                                <div className="form-group__input-wrapper">
                                                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={errors.confirmPassword ? 'error' : ''} placeholder="••••••••" required />
                                                    <Lock className="icon" />
                                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle">
                                                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                                                    </button>
                                                </div>
                                                {errors.confirmPassword && (<p className="form-group__error">{errors.confirmPassword}</p>)}
                                            </div>
                                            {/* Terms and Conditions */}
                                            <div className="checkbox-group">
                                                <input type="checkbox" id="terms" required />
                                                <label htmlFor="terms">
                                                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                                                </label>
                                            </div>
                                            {/* Submit Button */}
                                            <button type="submit" disabled={isLoading} className="submit-button">
                                                {isLoading ? (
                                                    <div className="submit-button__loading">
                                                        <div className="spinner"></div>
                                                        <span>Creating Account...</span>
                                                    </div>
                                                ) : (
                                                    'Create Account'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                    {/* Login Link */}
                                    <div className="login-link">
                                        <p>Already have an account? <a href="#">Sign in here</a></p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // OTP Verification Section
                            <>
                                <div className="form-header">
                                    <h2 className="form-header__title">Verify Your Email</h2>
                                    <p className="form-header__subtitle">An OTP has been sent to **{formData.email}**. Please enter it below.</p>
                                </div>
                                <div className="form-card">
                                    <form onSubmit={handleOtpSubmit}>
                                        <div className="form-content">
                                            <div className="form-group">
                                                <label className="form-group__label">
                                                    OTP
                                                </label>
                                                <div className="form-group__input-wrapper">
                                                    <input
                                                        type="text"
                                                        name="otp"
                                                        value={otp}
                                                        onChange={handleOtpChange}
                                                        className={errors.otp ? 'error' : ''}
                                                        placeholder="Enter 6-digit OTP"
                                                        maxLength="6"
                                                        required
                                                    />
                                                    <Lock className="icon" />
                                                </div>
                                                {errors.otp && (
                                                    <p className="form-group__error">{errors.otp}</p>
                                                )}
                                            </div>
                                            <button type="submit" disabled={isLoading} className="submit-button">
                                                {isLoading ? (
                                                    <div className="submit-button__loading">
                                                        <div className="spinner"></div>
                                                        <span>Verifying...</span>
                                                    </div>
                                                ) : (
                                                    'Verify Account'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HoraRegistration;