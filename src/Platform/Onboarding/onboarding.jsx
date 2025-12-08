import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Building2, FileText, CreditCard, CheckCircle2 } from 'lucide-react';
import './style/PartnerOnboarding.scss';

export default function PartnerOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    businessType: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    registrationNumber: '',
    gstNumber: '',
    panNumber: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    bankName: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: 'Basic Info', icon: Building2 },
    { number: 2, title: 'Address', icon: FileText },
    { number: 3, title: 'Registration', icon: FileText },
    { number: 4, title: 'Bank Details', icon: CreditCard }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number';
      }
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
    }

    if (step === 2) {
      if (!formData.street.trim()) newErrors.street = 'Street address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
      else if (!/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Invalid pincode';
      }
    }

    if (step === 3) {
      if (!formData.gstNumber.trim()) newErrors.gstNumber = 'GST number is required';
      if (!formData.panNumber.trim()) newErrors.panNumber = 'PAN number is required';
    }

    if (step === 4) {
      if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
      if (!formData.confirmAccountNumber.trim()) {
        newErrors.confirmAccountNumber = 'Please confirm account number';
      } else if (formData.accountNumber !== formData.confirmAccountNumber) {
        newErrors.confirmAccountNumber = 'Account numbers do not match';
      }
      if (!formData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
      if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
      if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(4)) {
      console.log('Form submitted:', formData);
      setCurrentStep(5);
    }
  };

  return (
    <div className="hora-onboarding">
      <div className="hora-onboarding__container">
        
        {/* Header */}
        <header className="hora-onboarding__header">
          <div className="hora-logo">
            <span className="hora-logo__text">Hora</span>
          </div>
          <h1 className="hora-onboarding__title">Join Hora as a Partner</h1>
          <p className="hora-onboarding__subtitle">Start growing your business with us today</p>
        </header>

        {currentStep <= 4 && (
          <>
            {/* Progress Steps */}
            <div className="hora-steps">
              <div className="hora-steps__wrapper">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;
                  
                  return (
                    <React.Fragment key={step.number}>
                      <div className="hora-steps__item">
                        <div className={`hora-steps__circle ${isCompleted ? 'hora-steps__circle--completed' : ''} ${isActive ? 'hora-steps__circle--active' : ''}`}>
                          {isCompleted ? (
                            <Check className="hora-steps__icon" />
                          ) : (
                            <Icon className="hora-steps__icon" />
                          )}
                        </div>
                        <span className={`hora-steps__label ${(isActive || isCompleted) ? 'hora-steps__label--active' : ''}`}>
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`hora-steps__line ${isCompleted ? 'hora-steps__line--completed' : ''}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Form Card */}
            <div className="hora-card">
              <div className="hora-form">
                
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="hora-form__step">
                    <h2 className="hora-form__heading">Basic Information</h2>
                    
                    <div className="hora-form__group">
                      <label className="hora-form__label">Business Name *</label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className={`hora-input ${errors.businessName ? 'hora-input--error' : ''}`}
                        placeholder="Enter your business name"
                      />
                      {errors.businessName && (
                        <span className="hora-form__error">{errors.businessName}</span>
                      )}
                    </div>

                    <div className="hora-form__group">
                      <label className="hora-form__label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`hora-input ${errors.email ? 'hora-input--error' : ''}`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <span className="hora-form__error">{errors.email}</span>
                      )}
                    </div>

                    <div className="hora-form__group">
                      <label className="hora-form__label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`hora-input ${errors.phone ? 'hora-input--error' : ''}`}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                      {errors.phone && (
                        <span className="hora-form__error">{errors.phone}</span>
                      )}
                    </div>

                    <div className="hora-form__group">
                      <label className="hora-form__label">Business Type *</label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className={`hora-select ${errors.businessType ? 'hora-select--error' : ''}`}
                      >
                        <option value="">Select business type</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="retail">Retail Store</option>
                        <option value="service">Service Provider</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.businessType && (
                        <span className="hora-form__error">{errors.businessType}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Address Details */}
                {currentStep === 2 && (
                  <div className="hora-form__step">
                    <h2 className="hora-form__heading">Business Address</h2>
                    
                    <div className="hora-form__group">
                      <label className="hora-form__label">Street Address *</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className={`hora-input ${errors.street ? 'hora-input--error' : ''}`}
                        placeholder="Building, street, area"
                      />
                      {errors.street && (
                        <span className="hora-form__error">{errors.street}</span>
                      )}
                    </div>

                    <div className="hora-form__row">
                      <div className="hora-form__group">
                        <label className="hora-form__label">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`hora-input ${errors.city ? 'hora-input--error' : ''}`}
                          placeholder="City"
                        />
                        {errors.city && (
                          <span className="hora-form__error">{errors.city}</span>
                        )}
                      </div>

                      <div className="hora-form__group">
                        <label className="hora-form__label">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`hora-input ${errors.state ? 'hora-input--error' : ''}`}
                          placeholder="State"
                        />
                        {errors.state && (
                          <span className="hora-form__error">{errors.state}</span>
                        )}
                      </div>
                    </div>

                    <div className="hora-form__group">
                      <label className="hora-form__label">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={`hora-input ${errors.pincode ? 'hora-input--error' : ''}`}
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                      {errors.pincode && (
                        <span className="hora-form__error">{errors.pincode}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Business Registration */}
                {currentStep === 3 && (
                  <div className="hora-form__step">
                    <h2 className="hora-form__heading">Business Registration</h2>
                    
                    <div className="hora-form__group">
                      <label className="hora-form__label">Business Registration Number</label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
                        className="hora-input"
                        placeholder="Registration number (if applicable)"
                      />
                    </div>

                    <div className="hora-form__group">
                      <label className="hora-form__label">GST Number *</label>
                      <input
                        type="text"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleInputChange}
                        className={`hora-input ${errors.gstNumber ? 'hora-input--error' : ''}`}
                        placeholder="GST number"
                      />
                      {errors.gstNumber && (
                        <span className="hora-form__error">{errors.gstNumber}</span>
                      )}
                    </div>

                    <div className="hora-form__group">
                      <label className="hora-form__label">PAN Number *</label>
                      <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleInputChange}
                        className={`hora-input ${errors.panNumber ? 'hora-input--error' : ''}`}
                        placeholder="PAN number"
                        maxLength={10}
                      />
                      {errors.panNumber && (
                        <span className="hora-form__error">{errors.panNumber}</span>
                      )}
                    </div>

                    <div className="hora-alert hora-alert--info">
                      <strong>Note:</strong> All documents will be verified by our team. 
                      You'll be notified once verification is complete.
                    </div>
                  </div>
                )}

                {/* Step 4: Bank Details */}
                {currentStep === 4 && (
                  <div className="hora-form__step">
                    <h2 className="hora-form__heading">Bank Details</h2>
                    
                    <div className="hora-form__group">
                      <label className="hora-form__label">Account Holder Name *</label>
                      <input
                        type="text"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleInputChange}
                        className={`hora-input ${errors.accountHolderName ? 'hora-input--error' : ''}`}
                        placeholder="As per bank account"
                      />
                      {errors.accountHolderName && (
                        <span className="hora-form__error">{errors.accountHolderName}</span>
                      )}
                    </div>

                    <div className="hora-form__group">
                      <label className="hora-form__label">Bank Name *</label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        className={`hora-input ${errors.bankName ? 'hora-input--error' : ''}`}
                        placeholder="Bank name"
                      />
                      {errors.bankName && (
                        <span className="hora-form__error">{errors.bankName}</span>
                      )}
                    </div>

                    <div className="hora-form__group">
                      <label className="hora-form__label">Account Number *</label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        className={`hora-input ${errors.accountNumber ? 'hora-input--error' : ''}`}
                        placeholder="Account number"
                      />
                      {errors.accountNumber && (
                        <span className="hora-form__error">{errors.accountNumber}</span>
                      )}
                    </div>

                    <div className="hora-form__group">
                      <label className="hora-form__label">Confirm Account Number *</label>
                      <input
                        type="text"
                        name="confirmAccountNumber"
                        value={formData.confirmAccountNumber}
                        onChange={handleInputChange}
                        className={`hora-input ${errors.confirmAccountNumber ? 'hora-input--error' : ''}`}
                        placeholder="Re-enter account number"
                      />
                      {errors.confirmAccountNumber && (
                        <span className="hora-form__error">{errors.confirmAccountNumber}</span>
                      )}
                    </div>

                    <div className="hora-form__group">
                      <label className="hora-form__label">IFSC Code *</label>
                      <input
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleInputChange}
                        className={`hora-input ${errors.ifscCode ? 'hora-input--error' : ''}`}
                        placeholder="IFSC code"
                        maxLength={11}
                      />
                      {errors.ifscCode && (
                        <span className="hora-form__error">{errors.ifscCode}</span>
                      )}
                    </div>

                    <div className="hora-form__group">
                      <label className="hora-checkbox">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          className="hora-checkbox__input"
                        />
                        <span className="hora-checkbox__label">
                          I agree to the Terms and Conditions and Privacy Policy of Hora
                        </span>
                      </label>
                      {errors.agreeToTerms && (
                        <span className="hora-form__error">{errors.agreeToTerms}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="hora-form__actions">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="hora-btn hora-btn--secondary"
                    >
                      <ChevronLeft className="hora-btn__icon-left" />
                      Previous
                    </button>
                  )}
                  
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="hora-btn hora-btn--primary"
                      style={{ marginLeft: currentStep === 1 ? 'auto' : '0' }}
                    >
                      Next
                      <ChevronRight className="hora-btn__icon-right" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="hora-btn hora-btn--success"
                    >
                      Submit Application
                      <CheckCircle2 className="hora-btn__icon-right" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Success Screen */}
        {currentStep === 5 && (
          <div className="hora-card hora-success">
            <div className="hora-success__icon-wrapper">
              <CheckCircle2 className="hora-success__icon" />
            </div>
            <h2 className="hora-success__title">Application Submitted Successfully!</h2>
            <p className="hora-success__message">
              Thank you for your interest in partnering with Hora. Our team will review your application and get back to you within 2-3 business days.
            </p>
            <div className="hora-alert hora-alert--info">
              <h3 className="hora-alert__title">What happens next?</h3>
              <ul className="hora-success__list">
                <li>Our team will verify your documents</li>
                <li>You'll receive an email with your partner dashboard access</li>
                <li>Complete your profile and start adding projects</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="hora-btn hora-btn--outline"
            >
              Submit Another Application
            </button>
          </div>
        )}
      </div>

      <style>{`
        /* Hora Design System - SCSS Variables converted to CSS */
        
       
      `}</style>
    </div>
  );
}