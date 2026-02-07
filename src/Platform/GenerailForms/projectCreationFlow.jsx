// import React, { useState,  } from 'react';
// import { 
//   Plus, Rocket, Users, Calendar, Target, ArrowRight, ArrowLeft, 
//   CheckCircle, Sparkles, FileText, DollarSign, Image as ImageIcon,
//   Upload, Trash2, HelpCircle, Info, Loader2
// } from 'lucide-react';
// import './styles/ProjectCreationPage.scss';
// import { useDispatch, useSelector } from 'react-redux';
// import { createProject } from '../../Redux/Actions/PlatformActions.js/projectsActions';
// import { useNavigate } from 'react-router-dom';
// import { DropDownV2 } from '../../customFiles/customComponent/DropDown';

// export default function ProjectCreationPage() {
//   const [step, setStep] = useState('empty'); // empty, form, creating, success
//   const [formData, setFormData] = useState({
//     projectName: '',
//     partnerCode: '',
//     teamSize: '',
//     projectType: '',
//     description: '',
//     status: 'draft',
//     startDate: '',
//     endDate: '',
//     budget: '',
//     images: []
//   });
//   const [imagePreview, setImagePreview] = useState([]);
//   const [errors, setErrors] = useState({});

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { projectCreateSuccess, loading } = useSelector((state) => state.projects);
//   const { userDetails } = useSelector((state) => state.user);

//   const projectTypes = [
//     { value: 'web', label: 'Web Development' },
//     { value: 'mobile', label: 'Mobile App' },
//     { value: 'design', label: 'Design Project' },
//     { value: 'marketing', label: 'Marketing Campaign' },
//     { value: 'research', label: 'Research & Development' },
//     { value: 'other', label: 'Other' }
//   ];

//   const teamSizes = [
//     { value: 'solo', label: 'Just me', description: 'Working alone' },
//     { value: 'small', label: '2-5 people', description: 'Small team' },
//     { value: 'medium', label: '6-15 people', description: 'Medium team' },
//     { value: 'large', label: '15+ people', description: 'Large team' }
//   ];

//   const statusOptions = [
//     { value: 'draft', label: 'Draft' },
//     { value: 'active', label: 'Active' },
//     { value: 'inactive', label: 'Inactive' },
//     { value: 'completed', label: 'Completed' },
//     { value: 'cancelled', label: 'Cancelled' }
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

//     const filePromises = files.map(file => {
//       return new Promise(resolve => {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           resolve({
//             preview: reader.result,
//             data: { url: reader.result, altText: file.name }
//           });
//         };
//         reader.readAsDataURL(file);
//       });
//     });

//     Promise.all(filePromises).then(results => {
//       setImagePreview(prev => [...prev, ...results.map(r => r.preview)]);
//       setFormData(prev => ({
//         ...prev,
//         images: [...prev.images, ...results.map(r => r.data)]
//       }));
//     });

//     e.target.value = null;
//   };

//   const removeImage = (index) => {
//     setImagePreview(prev => prev.filter((_, i) => i !== index));
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.projectName.trim()) {
//       newErrors.projectName = 'Project name is required';
//     }
//     if (!formData.partnerCode.trim()) {
//       newErrors.partnerCode = 'Partner code is required';
//     }
//     if (!formData.teamSize) {
//       newErrors.teamSize = 'Team size is required';
//     }
//     if (!formData.projectType) {
//       newErrors.projectType = 'Project type is required';
//     }
//     if (!formData.description.trim()) {
//       newErrors.description = 'Description is required';
//     }
//     if (!formData.startDate) {
//       newErrors.startDate = 'Start date is required';
//     }
//     if (formData.endDate && formData.startDate) {
//       if (new Date(formData.endDate) < new Date(formData.startDate)) {
//         newErrors.endDate = 'End date must be after start date';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e, isDraft = false) => {
//     e.preventDefault();

//     if (!isDraft && !validateForm()) {
//       return;
//     }

//     setStep('creating');

//     // Prepare data according to schema
//     const projectData = {
//       partnerId: userDetails?.id,
//       projectName: formData.projectName,
//       partnerCode: formData.partnerCode,
//       teamSize: formData.teamSize,
//       projectType: formData.projectType,
//       description: {
//         short: formData.description.substring(0, 200),
//         long: formData.description,
//         features: []
//       },
//       status: isDraft ? 'draft' : formData.status,
//       startDate: formData.startDate,
//       endDate: formData.endDate || undefined,
//       budget: formData.budget ? parseFloat(formData.budget) : undefined,
//       images: formData.images
//     };

//     dispatch(createProject(projectData, userDetails?.id));

//     // Simulate API delay
//     setTimeout(() => {
//       setStep('success');
//     }, 2000);
//   };

//   const startProjectCreation = () => {
//     setStep('form');
//   };

//   const createAnotherProject = () => {
//     setStep('empty');
//     setFormData({
//       projectName: '',
//       partnerCode: '',
//       teamSize: '',
//       projectType: '',
//       description: '',
//       status: 'draft',
//       startDate: '',
//       endDate: '',
//       budget: '',
//       images: []
//     });
//     setImagePreview([]);
//     setErrors({});
//   };

//   const goToDashboard = () => {
//     navigate('/dashboard');
//   };

//   // Empty State
//   if (step === 'empty') {
//     return (
//       <div className="project-creation">
//         <div className="project-creation__content project-creation__content--centered">
//           <div className="empty-state">
//             <div className="empty-state__icon">
//               <div className="icon-wrapper">
//                 <Rocket className="icon icon--large" />
//               </div>
//             </div>

//             <h1 className="empty-state__title">Create Your First Project</h1>

//             <p className="empty-state__description">
//               Let's get started and bring your ideas to life with a structured project plan.
//             </p>

//             <button onClick={startProjectCreation} className="btn btn--primary btn--large">
//               <Plus className="btn__icon" />
//               Start Creating
//             </button>

//             <div className="feature-grid">
//               <div className="feature-card">
//                 <Target className="feature-card__icon feature-card__icon--indigo" />
//                 <h3 className="feature-card__title">Set Goals</h3>
//                 <p className="feature-card__description">Define clear objectives</p>
//               </div>
//               <div className="feature-card">
//                 <Users className="feature-card__icon feature-card__icon--purple" />
//                 <h3 className="feature-card__title">Build Teams</h3>
//                 <p className="feature-card__description">Collaborate seamlessly</p>
//               </div>
//               <div className="feature-card">
//                 <Rocket className="feature-card__icon feature-card__icon--pink" />
//                 <h3 className="feature-card__title">Launch Fast</h3>
//                 <p className="feature-card__description">Ship with confidence</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Creating State
//   if (step === 'creating') {
//     return (
//       <div className="project-creation">
//         <div className="project-creation__content project-creation__content--centered">
//           <div className="loading-state">
//             <div className="loading-state__spinner">
//               <Sparkles className="icon icon--large" />
//             </div>
//             <h2 className="loading-state__title">Creating Your Project...</h2>
//             <p className="loading-state__description">Setting things up for you</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Success State
//   if (step === 'success' && projectCreateSuccess) {
//     return (
//       <div className="project-creation">
//         <div className="project-creation__content project-creation__content--centered">
//           <div className="success-state">
//             <div className="success-state__icon">
//               <CheckCircle className="icon icon--large" />
//             </div>

//             <h1 className="success-state__title">Project Created! 🎉</h1>

//             <p className="success-state__description">
//               Your project "<strong>{formData.projectName}</strong>" is ready to go!
//             </p>

//             <div className="project-summary">
//               <h3 className="project-summary__title">Project Summary</h3>
//               <div className="project-summary__content">
//                 <div className="project-summary__row">
//                   <span className="project-summary__label">Name:</span>
//                   <span className="project-summary__value">{formData.projectName}</span>
//                 </div>
//                 <div className="project-summary__row">
//                   <span className="project-summary__label">Partner Code:</span>
//                   <span className="project-summary__value">{formData.partnerCode}</span>
//                 </div>
//                 <div className="project-summary__row">
//                   <span className="project-summary__label">Type:</span>
//                   <span className="project-summary__value">
//                     {projectTypes.find(t => t.value === formData.projectType)?.label}
//                   </span>
//                 </div>
//                 <div className="project-summary__row">
//                   <span className="project-summary__label">Team Size:</span>
//                   <span className="project-summary__value">
//                     {teamSizes.find(t => t.value === formData.teamSize)?.label}
//                   </span>
//                 </div>
//                 <div className="project-summary__row">
//                   <span className="project-summary__label">Status:</span>
//                   <span className="project-summary__value">{formData.status}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="success-state__actions">
//               <button onClick={goToDashboard} className="btn btn--primary btn--large">
//                 Go to Dashboard
//               </button>
//               <button onClick={createAnotherProject} className="btn btn--secondary btn--large">
//                 Create Another
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Form State
//   return (
//     <div className="project-creation">
//       <div className="project-creation__content">
//         <div className="project-creation__header">
//           <h1 className="project-creation__title">Create New Project</h1>
//           <p className="project-creation__subtitle">Fill in the details to get started</p>
//         </div>

//         <form onSubmit={(e) => handleSubmit(e, false)} className="project-form">
//           {/* Basic Information */}
//           <div className="form-section">
//             <h2 className="form-section__title">
//               <FileText size={20} />
//               Basic Information
//             </h2>
            
//             <div className="info-box">
//               <Info className="info-box__icon" size={20} />
//               <div className="info-box__content">
//                 <span className="info-box__title">Why these details?</span>
//                 <span className="info-box__text">
//                   Your project name and partner code help us uniquely identify your workspace and generate project-specific reports.
//                 </span>
//               </div>
//             </div>

//             <div className="form-grid">
//               <div className="form-group">
//                 <label className="form-label">Project Name *</label>
//                 <input
//                   type="text"
//                   name="projectName"
//                   value={formData.projectName}
//                   onChange={handleInputChange}
//                   className={`form-input ${errors.projectName ? 'form-input--error' : ''}`}
//                   placeholder="Enter project name"
//                 />
//                 <div className="help-text">
//                    <HelpCircle size={12} />
//                    <span>Use a descriptive name (e.g., Marketing Q4)</span>
//                 </div>
//                 {errors.projectName && (
//                   <span className="form-error">{errors.projectName}</span>
//                 )}
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Partner Code *</label>
//                 <input
//                   type="text"
//                   name="partnerCode"
//                   value={formData.partnerCode}
//                   onChange={handleInputChange}
//                   className={`form-input ${errors.partnerCode ? 'form-input--error' : ''}`}
//                   placeholder="Enter unique partner code"
//                 />
//                 <div className="help-text">
//                    <HelpCircle size={12} />
//                    <span>A short unique identifier for your project.</span>
//                 </div>
//                 {errors.partnerCode && (
//                   <span className="form-error">{errors.partnerCode}</span>
//                 )}
//               </div>
//             </div>

//             <div className="form-grid">
//               <div className="form-group">
//                 <label className="form-label">Project Type *</label>
//                 <DropDownV2
//                   data={projectTypes}
//                   defaultType={formData.projectType}
//                   onChange={(option) => handleInputChange({ target: { name: 'projectType', value: option.value } })}
//                   placeholder="Select project type"
//                   className={errors.projectType ? 'form-input--error' : ''}
//                 />
//                 {errors.projectType && (
//                   <span className="form-error">{errors.projectType}</span>
//                 )}
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Status</label>
//                 <DropDownV2
//                   data={statusOptions}
//                   defaultType={formData.status}
//                   onChange={(option) => handleInputChange({ target: { name: 'status', value: option.value } })}
//                   placeholder="Select status"
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label className="form-label">Description *</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 className={`form-textarea ${errors.description ? 'form-textarea--error' : ''}`}
//                 placeholder="Describe your project goals and objectives..."
//                 rows={5}
//               />
//               {errors.description && (
//                 <span className="form-error">{errors.description}</span>
//               )}
//             </div>
//           </div>

//           {/* Team & Timeline */}
//           <div className="form-section">
//             <h2 className="form-section__title">
//               <Users size={20} />
//               Team & Timeline
//             </h2>

//             <div className="form-group">
//               <label className="form-label">Team Size *</label>
//               <div className="radio-grid">
//                 {teamSizes.map(size => (
//                   <button
//                     key={size.value}
//                     type="button"
//                     onClick={() => handleInputChange({ target: { name: 'teamSize', value: size.value } })}
//                     className={`radio-option ${formData.teamSize === size.value ? 'radio-option--active' : ''}`}
//                   >
//                     <div className="radio-option__header">
//                       <div className={`radio-button ${formData.teamSize === size.value ? 'radio-button--checked' : ''}`}>
//                         {formData.teamSize === size.value && (
//                           <div className="radio-button__dot" />
//                         )}
//                       </div>
//                       <span className="radio-option__label">{size.label}</span>
//                     </div>
//                     <p className="radio-option__description">{size.description}</p>
//                   </button>
//                 ))}
//               </div>
//               <div className="help-text">
//                    <Info size={12} />
//                    <span>Team size helps us optimize the collaboration tools for your project.</span>
//               </div>
//               {errors.teamSize && (
//                 <span className="form-error">{errors.teamSize}</span>
//               )}
//             </div>

//             <div className="form-grid">
//               <div className="form-group">
//                 <label className="form-label">Start Date *</label>
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleInputChange}
//                   className={`form-input ${errors.startDate ? 'form-input--error' : ''}`}
//                 />
//                 {errors.startDate && (
//                   <span className="form-error">{errors.startDate}</span>
//                 )}
//               </div>

//               <div className="form-group">
//                 <label className="form-label">End Date</label>
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleInputChange}
//                   className={`form-input ${errors.endDate ? 'form-input--error' : ''}`}
//                   min={formData.startDate}
//                 />
//                 {errors.endDate && (
//                   <span className="form-error">{errors.endDate}</span>
//                 )}
//               </div>
//             </div>

//             <div className="form-group">
//               <label className="form-label">
//                 <DollarSign size={16} />
//                 Budget (Optional)
//               </label>
//               <input
//                 type="number"
//                 name="budget"
//                 value={formData.budget}
//                 onChange={handleInputChange}
//                 className="form-input"
//                 placeholder="Enter project budget"
//                 min="0"
//                 step="0.01"
//               />
//               <div className="help-text">
//                    <DollarSign size={12} />
//                    <span>Financial tracking helps you manage resources effectively.</span>
//               </div>
//             </div>
//           </div>

//           {/* Images */}
//           <div className="form-section">
//             <h2 className="form-section__title">
//               <ImageIcon size={20} />
//               Project Images
//             </h2>

//             <div className="upload-area">
//               <input
//                 type="file"
//                 id="imageUpload"
//                 accept="image/*"
//                 multiple
//                 onChange={handleImageUpload}
//                 className="upload-input"
//               />
//               <label htmlFor="imageUpload" className="upload-label">
//                 <Upload size={32} />
//                 <span className="upload-label__text">Click to upload images</span>
//                 <span className="upload-label__hint">PNG, JPG, GIF up to 10MB</span>
//               </label>
//             </div>

//             {imagePreview.length > 0 && (
//               <div className="image-grid">
//                 {imagePreview.map((image, index) => (
//                   <div key={index} className="image-item">
//                     <img src={image} alt={`Preview ${index + 1}`} />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(index)}
//                       className="image-item__remove"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="form-actions">
//             <button
//               type="button"
//               onClick={createAnotherProject}
//               className="btn btn--secondary"
//               disabled={loading}
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               onClick={(e) => handleSubmit(e, true)}
//               className={`btn btn--ghost ${loading ? 'btn--loading' : ''}`}
//               disabled={loading}
//             >
//               {loading && <div className="btn-loader"><Loader2 className="spinner" size={18} /></div>}
//               Save Draft
//             </button>

//             <button
//               type="submit"
//               className={`btn btn--primary ${loading ? 'btn--loading' : ''}`}
//               disabled={loading}
//             >
//               {loading && <div className="btn-loader"><Loader2 className="spinner" size={18} /></div>}
//                Create Project
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { 
  Plus, Rocket, Users, Calendar, Target, ArrowRight, ArrowLeft, 
  CheckCircle, Sparkles, FileText, DollarSign, Image as ImageIcon,
  Upload, Trash2, HelpCircle, Info, Loader2
} from 'lucide-react';
import './styles/ProjectCreationPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import { useNavigate } from 'react-router-dom';
import { DropDownV2 } from '../../customFiles/customComponent/DropDown';

export default function ProjectCreationPage() {
  const [step, setStep] = useState('empty'); // empty, form, creating, success
  const [formData, setFormData] = useState({
    projectName: '',
    partnerCode: '',
    teamSize: '',
    projectType: '',
    description: '',
    status: 'draft',
    startDate: '',
    endDate: '',
    budget: '',
    images: []
  });
  // const [imagePreview, setImagePreview] = useState([]);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectCreateSuccess, loading } = useSelector((state) => state.projects);
  const { userDetails } = useSelector((state) => state.user);

  const projectTypes = [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'design', label: 'Design Project' },
    { value: 'marketing', label: 'Marketing Campaign' },
    { value: 'research', label: 'Research & Development' },
    { value: 'other', label: 'Other' }
  ];

  const teamSizes = [
    { value: 'solo', label: 'Just me', description: 'Working alone' },
    { value: 'small', label: '2-5 people', description: 'Small team' },
    { value: 'medium', label: '6-15 people', description: 'Medium team' },
    { value: 'large', label: '15+ people', description: 'Large team' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   if (files.length === 0) return;

  //   const filePromises = files.map(file => {
  //     return new Promise(resolve => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         resolve({
  //           preview: reader.result,
  //           data: { url: reader.result, altText: file.name }
  //         });
  //       };
  //       reader.readAsDataURL(file);
  //     });
  //   });

  //   Promise.all(filePromises).then(results => {
  //     setImagePreview(prev => [...prev, ...results.map(r => r.preview)]);
  //     setFormData(prev => ({
  //       ...prev,
  //       images: [...prev.images, ...results.map(r => r.data)]
  //     }));
  //   });

  //   e.target.value = null;
  // };

  // const removeImage = (index) => {
  //   setImagePreview(prev => prev.filter((_, i) => i !== index));
  //   setFormData(prev => ({
  //     ...prev,
  //     images: prev.images.filter((_, i) => i !== index)
  //   }));
  // };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    if (!formData.partnerCode.trim()) {
      newErrors.partnerCode = 'Partner code is required';
    }
    if (!formData.teamSize) {
      newErrors.teamSize = 'Team size is required';
    }
    if (!formData.projectType) {
      newErrors.projectType = 'Project type is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    // if (!formData.startDate) {
    //   newErrors.startDate = 'Start date is required';
    // }
    // if (formData.endDate && formData.startDate) {
    //   if (new Date(formData.endDate) < new Date(formData.startDate)) {
    //     newErrors.endDate = 'End date must be after start date';
    //   }
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();

    if (!isDraft && !validateForm()) {
      return;
    }

    setStep('creating');

    // Prepare data according to schema
    const projectData = {
      partnerId: userDetails?.id,
      projectName: formData.projectName,
      partnerCode: formData.partnerCode,
      teamSize: formData.teamSize,
      projectType: formData.projectType,
      description: {
        short: formData.description.substring(0, 200),
        long: formData.description,
        features: []
      },
      status: isDraft ? 'draft' : formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      images: formData.images
    };

    dispatch(createProject(projectData, userDetails?.id));

    // Simulate API delay
    setTimeout(() => {
      setStep('success');
      navigate("/work-space/confrigurator")
    }, 2000);
  };

  const startProjectCreation = () => {
    setStep('form');
  };

  const createAnotherProject = () => {
    setStep('empty');
    setFormData({
      projectName: '',
      partnerCode: '',
      teamSize: '',
      projectType: '',
      description: '',
      status: 'draft',
      startDate: '',
      endDate: '',
      budget: '',
      images: []
    });
    // setImagePreview([]);
    setErrors({});
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  // Empty State - Professional Layout
 // Empty State - Professional & Meaningful
  if (step === 'empty') {
    return (
      <div className="project-creation">
        <div className="project-creation__content project-creation__content--centered">
          <div className="empty-state">
            <div className="empty-state__icon">
              <div className="icon-wrapper">
                <Rocket className="icon icon--large" />
              </div>
            </div>

            <div className="empty-state__content">
              <div className="empty-state__text-wrapper">
                <h1 className="empty-state__title">
                  Start Your Next Big Project
                </h1>
                <p className="empty-state__description">
                  Transform your ideas into reality with structured project management. 
                  Organize your team, set clear goals, and track progress all in one place.
                </p>
              </div>

              <div className="empty-state__cta">
                <button onClick={startProjectCreation} className="btn btn--primary btn--large">
                  <Plus className="btn__icon" />
                  Create New Project
                </button>
              </div>

              <div className="feature-grid">
                <div className="feature-card">
                  <Target className="feature-card__icon feature-card__icon--indigo" />
                  <h3 className="feature-card__title">Define Objectives</h3>
                  <p className="feature-card__description">Set clear goals and milestones for success</p>
                </div>
                <div className="feature-card">
                  <Users className="feature-card__icon feature-card__icon--purple" />
                  <h3 className="feature-card__title">Team Collaboration</h3>
                  <p className="feature-card__description">Work seamlessly with your team members</p>
                </div>
                <div className="feature-card">
                  <Calendar className="feature-card__icon feature-card__icon--pink" />
                  <h3 className="feature-card__title">Track Progress</h3>
                  <p className="feature-card__description">Monitor timelines and deliverables</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Creating State
  if (step === 'creating') {
    return (
      <div className="project-creation">
        <div className="project-creation__content project-creation__content--centered">
          <div className="loading-state">
            <div className="loading-state__spinner">
              <Sparkles className="icon icon--large" />
            </div>
            <h2 className="loading-state__title">Creating Your Project...</h2>
            <p className="loading-state__description">Setting things up for you</p>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (step === 'success' && projectCreateSuccess) {
    return (
      <div className="project-creation">
        <div className="project-creation__content project-creation__content--centered">
          <div className="success-state">
            <div className="success-state__icon">
              <CheckCircle className="icon icon--large" />
            </div>

            <h1 className="success-state__title">Project Created! 🎉</h1>

            <p className="success-state__description">
              Your project "<strong>{formData.projectName}</strong>" is ready to go!
            </p>

            <div className="project-summary">
              <h3 className="project-summary__title">Project Summary</h3>
              <div className="project-summary__content">
                <div className="project-summary__row">
                  <span className="project-summary__label">Name:</span>
                  <span className="project-summary__value">{formData.projectName}</span>
                </div>
                <div className="project-summary__row">
                  <span className="project-summary__label">Partner Code:</span>
                  <span className="project-summary__value">{formData.partnerCode}</span>
                </div>
                <div className="project-summary__row">
                  <span className="project-summary__label">Type:</span>
                  <span className="project-summary__value">
                    {projectTypes.find(t => t.value === formData.projectType)?.label}
                  </span>
                </div>
                <div className="project-summary__row">
                  <span className="project-summary__label">Team Size:</span>
                  <span className="project-summary__value">
                    {teamSizes.find(t => t.value === formData.teamSize)?.label}
                  </span>
                </div>
                <div className="project-summary__row">
                  <span className="project-summary__label">Status:</span>
                  <span className="project-summary__value">{formData.status}</span>
                </div>
              </div>
            </div>

            <div className="success-state__actions">
              <button onClick={goToDashboard} className="btn btn--primary btn--large">
                Go to Dashboard
              </button>
              <button onClick={createAnotherProject} className="btn btn--secondary btn--large">
                Create Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form State - Single Column Layout
  return (
    <div className="project-creation">
      <div className="project-creation__content">
        <div className="project-creation__header">
          <h1 className="project-creation__title">Create New Project</h1>
          <p className="project-creation__subtitle">Fill in the details to get started</p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="project-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2 className="form-section__title">
              <FileText size={20} />
              Basic Information
            </h2>
            
            <div className="info-box">
              <Info className="info-box__icon" size={20} />
              <div className="info-box__content">
                <span className="info-box__title">Why these details?</span>
                <span className="info-box__text">
                  Your project name and partner code help us uniquely identify your workspace and generate project-specific reports.
                </span>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.projectName ? 'form-input--error' : ''}`}
                  placeholder="Enter project name"
                />
                <div className="help-text">
                   <HelpCircle size={12} />
                   <span>Use a descriptive name (e.g., Marketing Q4)</span>
                </div>
                {errors.projectName && (
                  <span className="form-error">{errors.projectName}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Partner Code *</label>
                <input
                  type="text"
                  name="partnerCode"
                  value={formData.partnerCode}
                  onChange={handleInputChange}
                  className={`form-input ${errors.partnerCode ? 'form-input--error' : ''}`}
                  placeholder="Enter unique partner code"
                />
                <div className="help-text">
                   <HelpCircle size={12} />
                   <span>A short unique identifier for your project.</span>
                </div>
                {errors.partnerCode && (
                  <span className="form-error">{errors.partnerCode}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Project Type *</label>
                <DropDownV2
                  data={projectTypes}
                  defaultType={formData.projectType}
                  onChange={(option) => handleInputChange({ target: { name: 'projectType', value: option.value } })}
                  placeholder="Select project type"
                  className={errors.projectType ? 'form-input--error' : ''}
                />
                {errors.projectType && (
                  <span className="form-error">{errors.projectType}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <DropDownV2
                  data={statusOptions}
                  defaultType={formData.status}
                  onChange={(option) => handleInputChange({ target: { name: 'status', value: option.value } })}
                  placeholder="Select status"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`form-textarea ${errors.description ? 'form-textarea--error' : ''}`}
                  placeholder="Describe your project goals and objectives..."
                  rows={5}
                />
                {errors.description && (
                  <span className="form-error">{errors.description}</span>
                )}
              </div>
            </div>
          </div>

          {/* Team & Timeline */}
          <div className="form-section">
            <h2 className="form-section__title">
              <Users size={20} />
              Team & Timeline
            </h2>

            <div className="form-group">
              <label className="form-label">Team Size *</label>
              <div className="radio-grid">
                {teamSizes.map(size => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'teamSize', value: size.value } })}
                    className={`radio-option ${formData.teamSize === size.value ? 'radio-option--active' : ''}`}
                  >
                    <div className="radio-option__header">
                      <div className={`radio-button ${formData.teamSize === size.value ? 'radio-button--checked' : ''}`}>
                        {formData.teamSize === size.value && (
                          <div className="radio-button__dot" />
                        )}
                      </div>
                      <span className="radio-option__label">{size.label}</span>
                    </div>
                    <p className="radio-option__description">{size.description}</p>
                  </button>
                ))}
              </div>
              <div className="help-text">
                   <Info size={12} />
                   <span>Team size helps us optimize the collaboration tools for your project.</span>
              </div>
              {errors.teamSize && (
                <span className="form-error">{errors.teamSize}</span>
              )}
            </div>

            {/* <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`form-input ${errors.startDate ? 'form-input--error' : ''}`}
                />
                {errors.startDate && (
                  <span className="form-error">{errors.startDate}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`form-input ${errors.endDate ? 'form-input--error' : ''}`}
                  min={formData.startDate}
                />
                {errors.endDate && (
                  <span className="form-error">{errors.endDate}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} />
                  Budget (Optional)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter project budget"
                  min="0"
                  step="0.01"
                />
                <div className="help-text">
                   <DollarSign size={12} />
                   <span>Financial tracking helps you manage resources effectively.</span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Images */}
          {/* <div className="form-section">
            <h2 className="form-section__title">
              <ImageIcon size={20} />
              Project Images
            </h2>

            <div className="upload-area">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="upload-input"
              />
              <label htmlFor="imageUpload" className="upload-label">
                <Upload size={32} />
                <span className="upload-label__text">Click to upload images</span>
                <span className="upload-label__hint">PNG, JPG, GIF up to 10MB</span>
              </label>
            </div>

            {imagePreview.length > 0 && (
              <div className="image-grid">
                {imagePreview.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="image-item__remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div> */}

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={createAnotherProject}
              className="btn btn--secondary"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className={`btn btn--ghost ${loading ? 'btn--loading' : ''}`}
              disabled={loading}
            >
              {loading && <div className="btn-loader"><Loader2 className="spinner" size={18} /></div>}
              Save Draft
            </button>

            <button
              type="submit"
              className={`btn btn--primary ${loading ? 'btn--loading' : ''}`}
              disabled={loading}
            >
              {loading && <div className="btn-loader"><Loader2 className="spinner" size={18} /></div>}
               Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}