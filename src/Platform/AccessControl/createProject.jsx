// import React, { useState, useEffect } from 'react';
// import { 
//   Save, X, Upload, Calendar, DollarSign, 
//   FileText, Image, AlertCircle, CheckCircle2,
//   Loader, Plus, Trash2
// } from 'lucide-react';

// export default function CreateProject() {
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [partnerId, setPartnerId] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     partnerCode: '',
//     description: {
//       short: '',
//       long: '',
//       features: []
//     },
//     startDate: '',
//     endDate: '',
//     status: 'draft',
//     category: '',
//     budget: '',
//     images: []
//   });
  
//   const [errors, setErrors] = useState({});
//   const [imagePreview, setImagePreview] = useState([]);
//   const [currentFeature, setCurrentFeature] = useState('');

//   // Fetch partnerId from backend
//   useEffect(() => {
//     const fetchPartnerData = async () => {
//       try {
//         // Simulate API call - Replace with your actual API endpoint
//         // const response = await fetch('/api/partner/me', {
//         //   headers: { Authorization: `Bearer ${token}` }
//         // });
//         // const data = await response.json();
        
//         // Mock data for demonstration
//         setTimeout(() => {
//           setPartnerId('PARTNER_12345');
//         }, 500);
//       } catch (error) {
//         console.error('Error fetching partner data:', error);
//       }
//     };

//     fetchPartnerData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }

//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
    
//     files.forEach(file => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(prev => [...prev, reader.result]);
//         setFormData(prev => ({
//           ...prev,
//           images: [...prev.images, {
//             url: reader.result,
//             altText: file.name
//           }]
//         }));
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeImage = (index) => {
//     setImagePreview(prev => prev.filter((_, i) => i !== index));
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   const addFeature = () => {
//     if (currentFeature.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         description: {
//           ...prev.description,
//           features: [...prev.description.features, currentFeature.trim()]
//         }
//       }));
//       setCurrentFeature('');
//     }
//   };

//   const removeFeature = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       description: {
//         ...prev.description,
//         features: prev.description.features.filter((_, i) => i !== index)
//       }
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) newErrors.name = 'Project name is required';
//     if (!formData.partnerCode.trim()) newErrors.partnerCode = 'Partner code is required';
//     if (!formData.description.short.trim()) newErrors['description.short'] = 'Short description is required';
//     if (!formData.startDate) newErrors.startDate = 'Start date is required';
//     if (!formData.category.trim()) newErrors.category = 'Category is required';
//     if (formData.budget && isNaN(formData.budget)) newErrors.budget = 'Budget must be a number';
    
//     if (formData.endDate && formData.startDate) {
//       if (new Date(formData.endDate) < new Date(formData.startDate)) {
//         newErrors.endDate = 'End date must be after start date';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       // Prepare data for submission
//       const projectData = {
//         ...formData,
//         partnerId: partnerId,
//         budget: formData.budget ? parseFloat(formData.budget) : undefined
//       };

//       // Simulate API call - Replace with your actual API endpoint
//       // const response = await fetch('/api/projects', {
//       //   method: 'POST',
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //     Authorization: `Bearer ${token}`
//       //   },
//       //   body: JSON.stringify(projectData)
//       // });
      
//       // Mock successful response
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       console.log('Project created:', projectData);
//       setSuccess(true);
      
//       // Reset form after success
//       setTimeout(() => {
//         setFormData({
//           name: '',
//           partnerCode: '',
//           description: { short: '', long: '', features: [] },
//           startDate: '',
//           endDate: '',
//           status: 'draft',
//           category: '',
//           budget: '',
//           images: []
//         });
//         setImagePreview([]);
//         setSuccess(false);
//       }, 2000);

//     } catch (error) {
//       console.error('Error creating project:', error);
//       setErrors({ submit: 'Failed to create project. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
//       window.history.back();
//     }
//   };

//   if (!partnerId) {
//     return (
//       <div className="hora-create-project">
//         <div className="hora-create-project__loading">
//           <Loader className="hora-spinner" />
//           <p>Loading partner information...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="hora-create-project">
//       <div className="hora-create-project__container">
//         {/* Header */}
//         <div className="hora-create-project__header">
//           <div>
//             <h1 className="hora-create-project__title">Create New Project</h1>
//             <p className="hora-create-project__subtitle">
//               Partner ID: <span className="hora-badge">{partnerId}</span>
//             </p>
//           </div>
//           <button 
//             type="button"
//             onClick={handleCancel}
//             className="hora-btn hora-btn--ghost"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Success Message */}
//         {success && (
//           <div className="hora-alert hora-alert--success">
//             <CheckCircle2 size={20} />
//             <span>Project created successfully!</span>
//           </div>
//         )}

//         {/* Error Message */}
//         {errors.submit && (
//           <div className="hora-alert hora-alert--error">
//             <AlertCircle size={20} />
//             <span>{errors.submit}</span>
//           </div>
//         )}

//         {/* Form */}
//         <div className="hora-card">
//           <div className="hora-form">
//             {/* Basic Information */}
//             <div className="hora-form__section">
//               <h2 className="hora-form__section-title">
//                 <FileText size={20} />
//                 Basic Information
//               </h2>

//               <div className="hora-form__grid">
//                 <div className="hora-form__group">
//                   <label className="hora-form__label">
//                     Project Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className={`hora-input ${errors.name ? 'hora-input--error' : ''}`}
//                     placeholder="Enter project name"
//                   />
//                   {errors.name && (
//                     <span className="hora-form__error">{errors.name}</span>
//                   )}
//                 </div>

//                 <div className="hora-form__group">
//                   <label className="hora-form__label">
//                     Partner Code *
//                   </label>
//                   <input
//                     type="text"
//                     name="partnerCode"
//                     value={formData.partnerCode}
//                     onChange={handleInputChange}
//                     className={`hora-input ${errors.partnerCode ? 'hora-input--error' : ''}`}
//                     placeholder="Enter unique partner code"
//                   />
//                   {errors.partnerCode && (
//                     <span className="hora-form__error">{errors.partnerCode}</span>
//                   )}
//                 </div>
//               </div>

//               <div className="hora-form__grid">
//                 <div className="hora-form__group">
//                   <label className="hora-form__label">
//                     Category *
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     className={`hora-select ${errors.category ? 'hora-select--error' : ''}`}
//                   >
//                     <option value="">Select category</option>
//                     <option value="E-Commerce">E-Commerce</option>
//                     <option value="Delivery">Delivery</option>
//                     <option value="Retail">Retail</option>
//                     <option value="Healthcare">Healthcare</option>
//                     <option value="Food & Beverage">Food & Beverage</option>
//                     <option value="Services">Services</option>
//                     <option value="Other">Other</option>
//                   </select>
//                   {errors.category && (
//                     <span className="hora-form__error">{errors.category}</span>
//                   )}
//                 </div>

//                 <div className="hora-form__group">
//                   <label className="hora-form__label">
//                     Status
//                   </label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     className="hora-select"
//                   >
//                     <option value="draft">Draft</option>
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                     <option value="completed">Completed</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="hora-form__section">
//               <h2 className="hora-form__section-title">
//                 <FileText size={20} />
//                 Description
//               </h2>

//               <div className="hora-form__group">
//                 <label className="hora-form__label">
//                   Short Description *
//                 </label>
//                 <input
//                   type="text"
//                   name="description.short"
//                   value={formData.description.short}
//                   onChange={handleInputChange}
//                   className={`hora-input ${errors['description.short'] ? 'hora-input--error' : ''}`}
//                   placeholder="Brief description of the project"
//                   maxLength={200}
//                 />
//                 <span className="hora-form__hint">
//                   {formData.description.short.length}/200 characters
//                 </span>
//                 {errors['description.short'] && (
//                   <span className="hora-form__error">{errors['description.short']}</span>
//                 )}
//               </div>

//               <div className="hora-form__group">
//                 <label className="hora-form__label">
//                   Long Description
//                 </label>
//                 <textarea
//                   name="description.long"
//                   value={formData.description.long}
//                   onChange={handleInputChange}
//                   className="hora-textarea"
//                   placeholder="Detailed description of the project"
//                   rows={5}
//                 />
//               </div>

//               <div className="hora-form__group">
//                 <label className="hora-form__label">
//                   Key Features
//                 </label>
//                 <div className="hora-feature-input">
//                   <input
//                     type="text"
//                     value={currentFeature}
//                     onChange={(e) => setCurrentFeature(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
//                     className="hora-input"
//                     placeholder="Add a feature and press Enter"
//                   />
//                   <button
//                     type="button"
//                     onClick={addFeature}
//                     className="hora-btn hora-btn--primary hora-btn--sm"
//                   >
//                     <Plus size={16} />
//                   </button>
//                 </div>
//                 {formData.description.features.length > 0 && (
//                   <div className="hora-feature-list">
//                     {formData.description.features.map((feature, index) => (
//                       <div key={index} className="hora-feature-item">
//                         <span>{feature}</span>
//                         <button
//                           type="button"
//                           onClick={() => removeFeature(index)}
//                           className="hora-feature-item__remove"
//                         >
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Timeline & Budget */}
//             <div className="hora-form__section">
//               <h2 className="hora-form__section-title">
//                 <Calendar size={20} />
//                 Timeline & Budget
//               </h2>

//               <div className="hora-form__grid">
//                 <div className="hora-form__group">
//                   <label className="hora-form__label">
//                     Start Date *
//                   </label>
//                   <input
//                     type="date"
//                     name="startDate"
//                     value={formData.startDate}
//                     onChange={handleInputChange}
//                     className={`hora-input ${errors.startDate ? 'hora-input--error' : ''}`}
//                   />
//                   {errors.startDate && (
//                     <span className="hora-form__error">{errors.startDate}</span>
//                   )}
//                 </div>

//                 <div className="hora-form__group">
//                   <label className="hora-form__label">
//                     End Date
//                   </label>
//                   <input
//                     type="date"
//                     name="endDate"
//                     value={formData.endDate}
//                     onChange={handleInputChange}
//                     className={`hora-input ${errors.endDate ? 'hora-input--error' : ''}`}
//                     min={formData.startDate}
//                   />
//                   {errors.endDate && (
//                     <span className="hora-form__error">{errors.endDate}</span>
//                   )}
//                 </div>
//               </div>

//               <div className="hora-form__group">
//                 <label className="hora-form__label">
//                   <DollarSign size={16} />
//                   Budget (Optional)
//                 </label>
//                 <input
//                   type="number"
//                   name="budget"
//                   value={formData.budget}
//                   onChange={handleInputChange}
//                   className={`hora-input ${errors.budget ? 'hora-input--error' : ''}`}
//                   placeholder="Enter project budget"
//                   min="0"
//                   step="0.01"
//                 />
//                 {errors.budget && (
//                   <span className="hora-form__error">{errors.budget}</span>
//                 )}
//               </div>
//             </div>

//             {/* Images */}
//             <div className="hora-form__section">
//               <h2 className="hora-form__section-title">
//                 <Image size={20} />
//                 Project Images
//               </h2>

//               <div className="hora-upload-area">
//                 <input
//                   type="file"
//                   id="imageUpload"
//                   accept="image/*"
//                   multiple
//                   onChange={handleImageUpload}
//                   className="hora-upload-input"
//                 />
//                 <label htmlFor="imageUpload" className="hora-upload-label">
//                   <Upload size={32} />
//                   <span className="hora-upload-label__text">
//                     Click to upload or drag and drop
//                   </span>
//                   <span className="hora-upload-label__hint">
//                     PNG, JPG, GIF up to 10MB
//                   </span>
//                 </label>
//               </div>

//               {imagePreview.length > 0 && (
//                 <div className="hora-image-grid">
//                   {imagePreview.map((image, index) => (
//                     <div key={index} className="hora-image-item">
//                       <img src={image} alt={`Preview ${index + 1}`} />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(index)}
//                         className="hora-image-item__remove"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Actions */}
//             <div className="hora-form__actions">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="hora-btn hora-btn--secondary"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="hora-btn hora-btn--primary"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <Loader className="hora-spinner" size={20} />
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={20} />
//                     Create Project
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }

//         .hora-create-project {
//           min-height: 100vh;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           padding: 2rem;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
//         }

//         .hora-create-project__container {
//           max-width: 1000px;
//           margin: 0 auto;
//         }

//         .hora-create-project__loading {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           min-height: 60vh;
//           color: white;
//           gap: 1rem;
//         }

//         /* Header */
//         .hora-create-project__header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 2rem;
//         }

//         .hora-create-project__title {
//           font-size: 2.5rem;
//           font-weight: 700;
//           color: white;
//           margin-bottom: 0.5rem;
//         }

//         .hora-create-project__subtitle {
//           color: rgba(255, 255, 255, 0.9);
//           font-size: 1rem;
//         }

//         .hora-badge {
//           background: rgba(255, 255, 255, 0.2);
//           padding: 0.25rem 0.75rem;
//           border-radius: 0.5rem;
//           font-weight: 600;
//           backdrop-filter: blur(10px);
//         }

//         /* Card */
//         .hora-card {
//           background: white;
//           border-radius: 1.5rem;
//           box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
//           padding: 3rem;
//         }

//         /* Form */
//         .hora-form__section {
//           margin-bottom: 3rem;
//           padding-bottom: 3rem;
//           border-bottom: 2px solid #f3f4f6;
//         }

//         .hora-form__section:last-of-type {
//           border-bottom: none;
//           margin-bottom: 0;
//           padding-bottom: 0;
//         }

//         .hora-form__section-title {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           font-size: 1.5rem;
//           font-weight: 600;
//           color: #1f2937;
//           margin-bottom: 2rem;
//         }

//         .hora-form__grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 1.5rem;
//         }

//         .hora-form__group {
//           margin-bottom: 1.5rem;
//         }

//         .hora-form__label {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           font-size: 0.875rem;
//           font-weight: 600;
//           color: #374151;
//           margin-bottom: 0.5rem;
//         }

//         .hora-input,
//         .hora-select,
//         .hora-textarea {
//           width: 100%;
//           padding: 0.875rem 1rem;
//           border: 2px solid #e5e7eb;
//           border-radius: 0.75rem;
//           font-size: 1rem;
//           color: #1f2937;
//           transition: all 0.2s ease;
//           background: white;
//           font-family: inherit;
//         }

//         .hora-input:focus,
//         .hora-select:focus,
//         .hora-textarea:focus {
//           outline: none;
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//         }

//         .hora-input--error,
//         .hora-select--error {
//           border-color: #ef4444;
//         }

//         .hora-textarea {
//           resize: vertical;
//           min-height: 120px;
//         }

//         .hora-form__error {
//           display: block;
//           margin-top: 0.5rem;
//           font-size: 0.875rem;
//           color: #ef4444;
//         }

//         .hora-form__hint {
//           display: block;
//           margin-top: 0.5rem;
//           font-size: 0.75rem;
//           color: #6b7280;
//         }

//         /* Features */
//         .hora-feature-input {
//           display: flex;
//           gap: 0.75rem;
//         }

//         .hora-feature-list {
//           margin-top: 1rem;
//           display: flex;
//           flex-wrap: wrap;
//           gap: 0.75rem;
//         }

//         .hora-feature-item {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           background: #f3f4f6;
//           padding: 0.5rem 1rem;
//           border-radius: 2rem;
//           font-size: 0.875rem;
//         }

//         .hora-feature-item__remove {
//           background: none;
//           border: none;
//           color: #ef4444;
//           cursor: pointer;
//           padding: 0.25rem;
//           display: flex;
//           align-items: center;
//           transition: transform 0.2s;
//         }

//         .hora-feature-item__remove:hover {
//           transform: scale(1.2);
//         }

//         /* Upload */
//         .hora-upload-area {
//           position: relative;
//         }

//         .hora-upload-input {
//           position: absolute;
//           width: 0;
//           height: 0;
//           opacity: 0;
//         }

//         .hora-upload-label {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 3rem;
//           border: 2px dashed #d1d5db;
//           border-radius: 0.75rem;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           background: #f9fafb;
//         }

//         .hora-upload-label:hover {
//           border-color: #667eea;
//           background: #eff6ff;
//         }

//         .hora-upload-label__text {
//           margin-top: 1rem;
//           font-weight: 600;
//           color: #374151;
//         }

//         .hora-upload-label__hint {
//           margin-top: 0.5rem;
//           font-size: 0.875rem;
//           color: #6b7280;
//         }

//         /* Image Grid */
//         .hora-image-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
//           gap: 1rem;
//           margin-top: 1.5rem;
//         }

//         .hora-image-item {
//           position: relative;
//           aspect-ratio: 1;
//           border-radius: 0.75rem;
//           overflow: hidden;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .hora-image-item img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .hora-image-item__remove {
//           position: absolute;
//           top: 0.5rem;
//           right: 0.5rem;
//           background: rgba(239, 68, 68, 0.9);
//           color: white;
//           border: none;
//           border-radius: 50%;
//           width: 2rem;
//           height: 2rem;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .hora-image-item__remove:hover {
//           background: #dc2626;
//           transform: scale(1.1);
//         }

//         /* Alerts */
//         .hora-alert {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           padding: 1rem 1.5rem;
//           border-radius: 0.75rem;
//           margin-bottom: 2rem;
//           font-weight: 500;
//         }

//         .hora-alert--success {
//           background: #d1fae5;
//           color: #065f46;
//           border: 1px solid #6ee7b7;
//         }

//         .hora-alert--error {
//           background: #fee2e2;
//           color: #991b1b;
//           border: 1px solid #fca5a5;
//         }

//         /* Buttons */
//         .hora-form__actions {
//           display: flex;
//           justify-content: flex-end;
//           gap: 1rem;
//           margin-top: 3rem;
//           padding-top: 2rem;
//           border-top: 2px solid #f3f4f6;
//         }

//         .hora-btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           padding: 0.875rem 1.75rem;
//           border-radius: 0.75rem;
//           font-size: 1rem;
//           font-weight: 600;
//           border: none;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .hora-btn:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }

//         .hora-btn:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
//         }

//         .hora-btn--primary {
//           background: #667eea;
//           color: white;
//         }

//         .hora-btn--secondary {
//           background: #f3f4f6;
//           color: #374151;
//         }

//         .hora-btn--ghost {
//           background: rgba(255, 255, 255, 0.2);
//           color: white;
//           backdrop-filter: blur(10px);
//         }

//         .hora-btn--sm {
//           padding: 0.5rem 1rem;
//           font-size: 0.875rem;
//         }

//         /* Spinner */
//         .hora-spinner {
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }

//         /* Responsive */
//         @media (max-width: 768px) {
//           .hora-create-project {
//             padding: 1rem;
//           }

//           .hora-card {
//             padding: 1.5rem;
//           }

//           .hora-create-project__title {
//             font-size: 2rem;
//           }

//           .hora-form__grid {
//             grid-template-columns: 1fr;
//           }

//           .hora-form__section-title {
//             font-size: 1.25rem;
//           }

//           .hora-form__actions {
//             flex-direction: column-reverse;
//           }

//           .hora-form__actions .hora-btn {
//             width: 100%;
//           }

//           .hora-image-grid {
//             grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback } from 'react';
import { 
  Save, X, Upload, Calendar, DollarSign, 
  FileText, Image, AlertCircle, CheckCircle2,
  Loader, Plus, Trash2, Key
} from 'lucide-react';

// --- INITIAL STATE CONSTANT ---
const INITIAL_FORM_DATA = {
  name: '',
  partnerCode: '',
  description: {
    short: '',
    long: '',
    features: []
  },
  startDate: '',
  endDate: '',
  status: 'draft',
  category: '',
  budget: '',
  images: []
};

export default function CreateProject() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [partnerId, setPartnerId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState([]);
  const [currentFeature, setCurrentFeature] = useState('');

  // --- Data Fetching (Partner ID) ---
  useEffect(() => {
    let isMounted = true;
    const fetchPartnerData = async () => {
      try {
        // MOCK DATA: Simulate fetching a valid Partner ID
        await new Promise(resolve => setTimeout(resolve, 800));
        if (isMounted) {
          setPartnerId('PARTNER_12345');
        }
      } catch (error) {
        console.error('Error fetching partner data:', error);
      }
    };

    fetchPartnerData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // --- Handlers (Memoized with useCallback) ---

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // 💡 FIX FOR MULTIPLE RERENDERS: Use Promise.all to read all files 
    // before performing a single, batched state update.
    const filePromises = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            preview: reader.result,
            data: { url: reader.result, altText: file.name }
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(results => {
      // Single state update for all previews and form data
      setImagePreview(prev => [...prev, ...results.map(r => r.preview)]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...results.map(r => r.data)]
      }));
    }).catch(err => {
        console.error("Error reading files:", err);
    });
    
    // Clear the input value so the same files can be selected again if needed
    e.target.value = null; 
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        description: {
          ...prev.description,
          features: [...prev.description.features, currentFeature.trim()]
        }
      }));
      setCurrentFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      description: {
        ...prev.description,
        features: prev.description.features.filter((_, i) => i !== index)
      }
    }));
  };

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.partnerCode.trim()) newErrors.partnerCode = 'Partner code is required';
    if (!formData.description.short.trim()) newErrors['description.short'] = 'Short description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    const budgetValue = formData.budget ? parseFloat(formData.budget) : null;
    if (formData.budget && (isNaN(budgetValue) || budgetValue < 0)) newErrors.budget = 'Budget must be a valid non-negative number';
    
    if (formData.endDate && formData.startDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);


  const handleSubmit = useCallback(async (e, isDraft = false) => {
    e.preventDefault();

    const currentStatus = isDraft ? 'draft' : formData.status;

    if (!isDraft && !validateForm()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    if (!partnerId) {
        setErrors({ submit: 'Partner context is not loaded. Cannot submit.' });
        return;
    }

    setLoading(true);

    try {
      const projectData = {
        ...formData,
        status: currentStatus,
        partnerId: partnerId,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
      };

      // MOCK API CALL
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Project submitted:', projectData);
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData(INITIAL_FORM_DATA);
        setImagePreview([]);
        setSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({ submit: `Failed to ${isDraft ? 'save draft' : 'create project'}. Please check the console.` });
    } finally {
      setLoading(false);
    }
  }, [formData, partnerId, validateForm]);

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      window.history.back();
    }
  };

  // --- Loading State ---
  if (!partnerId) {
    return (
      <div className="hora-create-project">
        <div className="hora-create-project__loading">
          <Loader className="hora-spinner" size={40} />
          <p>Loading partner information...</p>
        </div>
      </div>
    );
  }

  // --- Rendered Form ---
  return (
    <div className="hora-create-project">
      <div className="hora-create-project__container">
        {/* Header */}
        <div className="hora-create-project__header">
          <div>
            <h1 className="hora-create-project__title">Create New Project</h1>
            <p className="hora-create-project__subtitle">
              <Key size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
              Partner Context: <span className="hora-badge">{partnerId}</span>
            </p>
          </div>
          <button 
            type="button"
            onClick={handleCancel}
            className="hora-btn hora-btn--ghost"
          >
            <X size={20} />
          </button>
        </div>

        {/* Alerts */}
        {success && (
          <div className="hora-alert hora-alert--success">
            <CheckCircle2 size={20} />
            <span>Project created successfully!</span>
          </div>
        )}
        {errors.submit && (
          <div className="hora-alert hora-alert--error">
            <AlertCircle size={20} />
            <span>{errors.submit}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="hora-card">
          <form onSubmit={(e) => handleSubmit(e, false)} className="hora-form">
            
            {/* Basic Information */}
            <div className="hora-form__section">
              <h2 className="hora-form__section-title">
                <FileText size={20} />
                Basic Information
              </h2>

              <div className="hora-form__grid">
                <div className="hora-form__group">
                  <label className="hora-form__label">Project Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`hora-input ${errors.name ? 'hora-input--error' : ''}`}
                    placeholder="Enter project name"
                  />
                  {errors.name && (<span className="hora-form__error">{errors.name}</span>)}
                </div>

                <div className="hora-form__group">
                  <label className="hora-form__label">Partner Code *</label>
                  <input
                    type="text"
                    name="partnerCode"
                    value={formData.partnerCode}
                    onChange={handleInputChange}
                    className={`hora-input ${errors.partnerCode ? 'hora-input--error' : ''}`}
                    placeholder="Enter unique partner code"
                  />
                  {errors.partnerCode && (<span className="hora-form__error">{errors.partnerCode}</span>)}
                </div>
              </div>

              <div className="hora-form__grid">
                <div className="hora-form__group">
                  <label className="hora-form__label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`hora-select ${errors.category ? 'hora-select--error' : ''}`}
                  >
                    <option value="">Select category</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Retail">Retail</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Services">Services</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && (<span className="hora-form__error">{errors.category}</span>)}
                </div>

                <div className="hora-form__group">
                  <label className="hora-form__label">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="hora-select">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="hora-form__section">
              <h2 className="hora-form__section-title">
                <FileText size={20} />
                Description
              </h2>

              <div className="hora-form__group">
                <label className="hora-form__label">Short Description *</label>
                <input
                  type="text"
                  name="description.short"
                  value={formData.description.short}
                  onChange={handleInputChange}
                  className={`hora-input ${errors['description.short'] ? 'hora-input--error' : ''}`}
                  placeholder="Brief description of the project"
                  maxLength={200}
                />
                <span className="hora-form__hint">{formData.description.short.length}/200 characters</span>
                {errors['description.short'] && (<span className="hora-form__error">{errors['description.short']}</span>)}
              </div>

              <div className="hora-form__group">
                <label className="hora-form__label">Long Description</label>
                <textarea
                  name="description.long"
                  value={formData.description.long}
                  onChange={handleInputChange}
                  className="hora-textarea"
                  placeholder="Detailed description of the project"
                  rows={5}
                />
              </div>

              <div className="hora-form__group">
                <label className="hora-form__label">Key Features</label>
                <div className="hora-feature-input">
                  <input
                    type="text"
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    className="hora-input"
                    placeholder="Add a feature and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="hora-btn hora-btn--primary hora-btn--sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {formData.description.features.length > 0 && (
                  <div className="hora-feature-list">
                    {formData.description.features.map((feature, index) => (
                      <div key={index} className="hora-feature-item">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="hora-feature-item__remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline & Budget */}
            <div className="hora-form__section">
              <h2 className="hora-form__section-title">
                <Calendar size={20} />
                Timeline & Budget
              </h2>

              <div className="hora-form__grid">
                <div className="hora-form__group">
                  <label className="hora-form__label">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`hora-input ${errors.startDate ? 'hora-input--error' : ''}`}
                  />
                  {errors.startDate && (<span className="hora-form__error">{errors.startDate}</span>)}
                </div>

                <div className="hora-form__group">
                  <label className="hora-form__label">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`hora-input ${errors.endDate ? 'hora-input--error' : ''}`}
                    min={formData.startDate}
                  />
                  {errors.endDate && (<span className="hora-form__error">{errors.endDate}</span>)}
                </div>
              </div>

              <div className="hora-form__group">
                <label className="hora-form__label"><DollarSign size={16} />Budget (Optional)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className={`hora-input ${errors.budget ? 'hora-input--error' : ''}`}
                  placeholder="Enter project budget"
                  min="0"
                  step="0.01"
                />
                {errors.budget && (<span className="hora-form__error">{errors.budget}</span>)}
              </div>
            </div>

            {/* Images */}
            <div className="hora-form__section">
              <h2 className="hora-form__section-title">
                <Image size={20} />
                Project Images
              </h2>

              <div className="hora-upload-area">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hora-upload-input"
                />
                <label htmlFor="imageUpload" className="hora-upload-label">
                  <Upload size={32} />
                  <span className="hora-upload-label__text">
                    Click to upload or drag and drop
                  </span>
                  <span className="hora-upload-label__hint">
                    PNG, JPG, GIF up to 10MB
                  </span>
                </label>
              </div>

              {imagePreview.length > 0 && (
                <div className="hora-image-grid">
                  {imagePreview.map((image, index) => (
                    <div key={index} className="hora-image-item">
                      <img src={image} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="hora-image-item__remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="hora-form__actions">
              <button
                type="button"
                onClick={handleCancel}
                className="hora-btn hora-btn--secondary"
                disabled={loading}
              >
                <X size={20} />
                Cancel
              </button>
              
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="hora-btn hora-btn--tertiary"
                disabled={loading}
              >
                {loading ? (
                    <Loader className="hora-spinner" size={20} />
                ) : (
                    <Save size={20} />
                )}
                Save Draft
              </button>

              <button
                type="submit"
                className="hora-btn hora-btn--primary"
                disabled={loading}
              >
                {loading && !success ? (
                  <>
                    <Loader className="hora-spinner" size={20} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Create Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- Unified CSS Styles --- */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .hora-create-project {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          color: #1f2937;
        }

        .hora-create-project__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .hora-create-project__loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          color: white;
          gap: 1rem;
        }

        /* Header */
        .hora-create-project__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .hora-create-project__title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }

        .hora-create-project__subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .hora-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        /* Card */
        .hora-card {
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.05);
          padding: 3rem;
        }

        /* Form Structure */
        .hora-form__section {
          margin-bottom: 3rem;
          padding-bottom: 3rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .hora-form__section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .hora-form__section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 2rem;
        }

        .hora-form__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .hora-form__group {
          margin-bottom: 1.5rem;
        }

        .hora-form__label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        /* Inputs */
        .hora-input,
        .hora-select,
        .hora-textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 1rem;
          color: #1f2937;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          background: white;
          font-family: inherit;
        }

        .hora-input:focus,
        .hora-select:focus,
        .hora-textarea:focus {
          outline: none;
          border-color: #5A67D8;
          box-shadow: 0 0 0 4px rgba(90, 103, 216, 0.15);
        }

        .hora-input--error,
        .hora-select--error {
          border-color: #ef4444;
        }

        .hora-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .hora-form__error {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #ef4444;
        }

        .hora-form__hint {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        /* Features */
        .hora-feature-input {
          display: flex;
          gap: 0.75rem;
        }

        .hora-feature-list {
          margin-top: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .hora-feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #e6eefc; /* Light accent background */
          border: 1px solid #c3dafe;
          padding: 0.4rem 0.9rem;
          border-radius: 9999px; /* Pill shape */
          font-size: 0.875rem;
        }

        .hora-feature-item__remove {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          transition: transform 0.2s;
        }

        .hora-feature-item__remove:hover {
          transform: scale(1.2);
        }

        /* Upload */
        .hora-upload-area {
          position: relative;
        }

        .hora-upload-input {
          position: absolute;
          width: 0;
          height: 0;
          opacity: 0;
        }

        .hora-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          border: 2px dashed #cbd5e1;
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f9fafb;
        }

        .hora-upload-label:hover {
          border-color: #5A67D8;
          background: #f4f7fc;
        }

        .hora-upload-label__text {
          margin-top: 1rem;
          font-weight: 600;
          color: #374151;
        }

        .hora-upload-label__hint {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        /* Image Grid */
        .hora-image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .hora-image-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .hora-image-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hora-image-item__remove {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .hora-image-item__remove:hover {
          background: #dc2626;
          transform: scale(1.1);
        }

        /* Alerts */
        .hora-alert {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .hora-alert--success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #6ee7b7;
        }

        .hora-alert--error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        /* Buttons */
        .hora-form__actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid #f3f4f6;
        }

        .hora-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hora-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .hora-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .hora-btn--primary {
          background: #667eea;
          color: white;
        }

        .hora-btn--secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .hora-btn--tertiary {
          background: #e5e7eb;
          color: #374151;
        }

        .hora-btn--tertiary:hover:not(:disabled) {
          background: #d1d5db;
          color: #1f2937;
        }

        .hora-btn--ghost {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          backdrop-filter: blur(10px);
        }

        .hora-btn--sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        /* Spinner */
        .hora-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hora-create-project {
            padding: 1rem;
          }

          .hora-card {
            padding: 1.5rem;
          }

          .hora-create-project__title {
            font-size: 2rem;
          }

          .hora-form__grid {
            grid-template-columns: 1fr;
          }

          .hora-form__section-title {
            font-size: 1.25rem;
          }

          .hora-form__actions {
            flex-direction: column-reverse;
          }

          .hora-form__actions .hora-btn {
            width: 100%;
          }

          .hora-image-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}