// import React, { useState, useRef, useMemo } from 'react';
// import { Upload, Link, Image, Video, FileText, Save, Eye, Code } from 'lucide-react';
// import styles from './styles/RichTextEditor.module.scss';

// // Mock ReactQuill component since we can't import it directly

// interface MockReactQuillProps {
//   value: string;
//   onChange: (value: string) => void;
//   modules?: any;
//   formats?: any;
//   placeholder?: string;
//   theme?: string;
//   style?: React.CSSProperties;
//   readOnly?: boolean;
// }

// const ReactQuill = React.forwardRef<HTMLTextAreaElement, MockReactQuillProps>(
//   (
//     {
//       value,
//       onChange,
//       modules,
//       formats,
//       placeholder,
//       theme,
//       style,
//       readOnly = false
//     },
//     ref
//   ) => {
//     // Helper to update selection with formatting
//     const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || React.createRef<HTMLTextAreaElement>();

//     function formatSelection(before: string, after: string = '', surround: boolean = true) {
//       const textarea = textareaRef.current;
//       if (!textarea) return;
//       const start = textarea.selectionStart;
//       const end = textarea.selectionEnd;
//       const selected = value.substring(start, end);
//       let newValue;
//       if (surround) {
//         if (start === end) {
//           // No selection: insert markers and place cursor between
//           newValue = value.substring(0, start) + before + after + value.substring(end);
//           onChange(newValue);
//           setTimeout(() => {
//             textarea.focus();
//             textarea.setSelectionRange(start + before.length, start + before.length);
//           }, 0);
//         } else {
//           // Selection: wrap selection
//           newValue = value.substring(0, start) + before + selected + after + value.substring(end);
//           onChange(newValue);
//           setTimeout(() => {
//             textarea.focus();
//             textarea.setSelectionRange(start + before.length, end + before.length);
//           }, 0);
//         }
//       } else {
//         // Insert at start of line
//         const lines = value.split('\n');
//         let lineStart = 0;
//         let lineEnd = 0;
//         let found = false;
//         for (let i = 0, acc = 0; i < lines.length; i++) {
//           const len = lines[i].length + 1;
//           if (!found && start >= acc && start <= acc + len) {
//             lineStart = acc;
//             lineEnd = acc + lines[i].length;
//             found = true;
//           }
//           acc += len;
//         }
//         newValue = value.substring(0, lineStart) + before + value.substring(lineStart, lineEnd) + value.substring(lineEnd);
//         onChange(newValue);
//         setTimeout(() => {
//           textarea.focus();
//           textarea.setSelectionRange(lineStart + before.length, lineEnd + before.length);
//         }, 0);
//       }
//     }
//     function handleToolbarClick(type: string) {
//       if (readOnly) return;
//       switch (type) {
//         case 'bold':
//           formatSelection('**', '**');
//           break;
//         case 'italic':
//           formatSelection('*', '*');
//           break;
//         case 'underline':
//           formatSelection('<u>', '</u>');
//           break;
//         case 'strike':
//           formatSelection('~~', '~~');
//           break;
//         case 'code':
//           formatSelection('```\n', '\n```');
//           break;
//         case 'h1':
//           formatSelection('# ', '', false);
//           break;
//         case 'h2':
//           formatSelection('## ', '', false);
//           break;
//         case 'h3':
//           formatSelection('### ', '', false);
//           break;
//         case 'bullet':
//           formatSelection('- ', '', false);
//           break;
//         case 'number':
//           formatSelection('1. ', '', false);
//           break;
//         case 'check':
//           formatSelection('- [ ] ', '', false);
//           break;
//         case 'quote':
//           formatSelection('> ', '', false);
//           break;
//         case 'link': {
//           const url = prompt('Enter URL:');
//           if (url) formatSelection('[', `](${url})`);
//           break;
//         }
//         case 'image': {
//           const url = prompt('Enter image URL:');
//           if (url) formatSelection('![](', `${url})`, false);
//           break;
//         }
//         case 'video': {
//           const url = prompt('Enter video URL:');
//           if (url) formatSelection('<video src="', '" controls></video>');
//           break;
//         }
//         case 'table': {
//           const table = '\n| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Row 1 | Row 1 | Row 1 |\n| Row 2 | Row 2 | Row 2 |\n';
//           onChange(value + table);
//           break;
//         }
//         default:
//           break;
//       }
//     }

//     return (
//       <div className={styles.quillContainer} style={style}>
//         {/* Custom toolbar (now functional) */}
//         <div className={styles.toolbar}>
//           <button className={styles.toolbarButton} type="button" title="Bold" disabled={readOnly} onClick={() => handleToolbarClick('bold')}>B</button>
//           <button className={styles.toolbarButton} type="button" title="Italic" disabled={readOnly} onClick={() => handleToolbarClick('italic')}>I</button>
//           <button className={styles.toolbarButton} type="button" title="Underline" disabled={readOnly} onClick={() => handleToolbarClick('underline')}>U</button>
//           <button className={styles.toolbarButton} type="button" title="Strike" disabled={readOnly} onClick={() => handleToolbarClick('strike')}>S</button>
//           <span className={styles.separator}>|</span>
//           <button className={styles.toolbarButton} type="button" title="Header 1" disabled={readOnly} onClick={() => handleToolbarClick('h1')}>H1</button>
//           <button className={styles.toolbarButton} type="button" title="Header 2" disabled={readOnly} onClick={() => handleToolbarClick('h2')}>H2</button>
//           <button className={styles.toolbarButton} type="button" title="Header 3" disabled={readOnly} onClick={() => handleToolbarClick('h3')}>H3</button>
//           <span className={styles.separator}>|</span>
//           <button className={styles.toolbarButton} type="button" title="Bullet List" disabled={readOnly} onClick={() => handleToolbarClick('bullet')}>•</button>
//           <button className={styles.toolbarButton} type="button" title="Numbered List" disabled={readOnly} onClick={() => handleToolbarClick('number')}>1.</button>
//           <button className={styles.toolbarButton} type="button" title="Checklist" disabled={readOnly} onClick={() => handleToolbarClick('check')}>□</button>
//           <span className={styles.separator}>|</span>
//           <button className={styles.toolbarButton} type="button" title="Link" disabled={readOnly} onClick={() => handleToolbarClick('link')}>🔗</button>
//           <button className={styles.toolbarButton} type="button" title="Image" disabled={readOnly} onClick={() => handleToolbarClick('image')}>📷</button>
//           <button className={styles.toolbarButton} type="button" title="Video" disabled={readOnly} onClick={() => handleToolbarClick('video')}>🎥</button>
//           <button className={styles.toolbarButton} type="button" title="Table" disabled={readOnly} onClick={() => handleToolbarClick('table')}>📊</button>
//           <span className={styles.separator}>|</span>
//           <button className={styles.toolbarButton} type="button" title="Code Block" disabled={readOnly} onClick={() => handleToolbarClick('code')}>{'<>'}</button>
//           <button className={styles.toolbarButton} type="button" title="Quote" disabled={readOnly} onClick={() => handleToolbarClick('quote')}>""</button>
//         </div>

//         {/* Editor area */}
//         <textarea
//           ref={textareaRef}
//           value={value}
//           onChange={e => onChange(e.target.value)}
//           placeholder={placeholder}
//           className={styles.editorTextarea}
//           readOnly={readOnly}
//           style={{ minHeight: '400px', width: '100%' }}
//         />
//       </div>
//     );
//   }
// );

// interface RichTextEditorProps {
//   value?: string;
//   onChange?: (content: string) => void;
//   placeholder?: string;
//   mode?: 'prd' | 'bug' | 'general';
//   onSave?: (content: string) => void;
//   readOnly?: boolean;
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({
//   value = '',
//   onChange,
//   placeholder = 'Start writing...',
//   mode = 'general',
//   onSave,
//   readOnly = false
// }) => {
//   const [editorContent, setEditorContent] = useState(value);
//   const [isPreviewMode, setIsPreviewMode] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
//   const quillRef = useRef(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const videoInputRef = useRef<HTMLInputElement>(null);

//   // Template content based on mode
//   const templates = {
//     prd: `# Product Requirements Document

// ## 1. Overview
// Brief description of the feature/product

// ## 2. Objectives
// - Primary objective
// - Secondary objectives

// ## 3. User Stories
// ### As a [user type], I want [goal] so that [reason]

// ## 4. Functional Requirements
// ### 4.1 Core Features
// - Feature 1
// - Feature 2

// ### 4.2 User Interface Requirements
// - UI requirement 1
// - UI requirement 2

// ## 5. Technical Requirements
// - Technical requirement 1
// - Technical requirement 2

// ## 6. Acceptance Criteria
// - [ ] Criteria 1
// - [ ] Criteria 2
// - [ ] Criteria 3

// ## 7. Dependencies
// - Dependency 1
// - Dependency 2

// ## 8. Timeline & Milestones
// | Phase | Deliverable | Timeline |
// |-------|-------------|----------|
// | Phase 1 | MVP | Week 1-2 |
// | Phase 2 | Full Feature | Week 3-4 |

// ## 9. Success Metrics
// - Metric 1: Target value
// - Metric 2: Target value

// ## 10. Risks & Mitigation
// - Risk 1: Mitigation strategy
// - Risk 2: Mitigation strategy
// `,

//     bug: `# Bug Report

// ## Summary
// Brief description of the bug

// ## Environment
// - **Browser:** Chrome/Firefox/Safari
// - **OS:** Windows/macOS/Linux
// - **Version:** 
// - **Device:** Desktop/Mobile

// ## Steps to Reproduce
// 1. Step 1
// 2. Step 2
// 3. Step 3

// ## Expected Behavior
// What should happen

// ## Actual Behavior
// What actually happens

// ## Screenshots/Videos
// [Attach relevant media]

// ## Additional Information
// - Error messages
// - Console logs
// - Network requests

// ## Priority
// - [ ] Critical (P0)
// - [ ] High (P1)
// - [ ] Medium (P2)
// - [ ] Low (P3)

// ## Labels
// - bug
// - frontend/backend
// - component-name
// `
//   };


//   // Quill modules configuration
//   const modules = useMemo(() => ({
//     toolbar: {
//       container: '#toolbar',
//     //   handlers: {
//     //     image: handleImageUpload,
//     //     video: handleVideoUpload,
//     //     link: handleLinkInsert,
//     //   }
//     },
//     table: true,
//     'better-table': {
//       operationMenu: {
//         items: {
//           unmergeCells: {
//             text: 'Another unmerge cells name'
//           }
//         }
//       }
//     },
//     keyboard: {
//       bindings: {
//         tab: {
//           key: 9,
//           handler: function() {
//             return true;
//           }
//         }
//       }
//     }
//   }), []);

//   // Quill formats
//   const formats = [
//     'header', 'font', 'size',
//     'bold', 'italic', 'underline', 'strike', 'blockquote',
//     'list', 'bullet', 'indent',
//     'link', 'image', 'video',
//     'table', 'code-block', 'code',
//     'color', 'background',
//     'align', 'script',
//     'clean'
//   ];

//   const handleContentChange = (content: string) => {
//     setEditorContent(content);
//     onChange?.(content);
//   };

//   const handleImageUpload = () => {
//     fileInputRef.current?.click();
//   };

//   const handleVideoUpload = () => {
//     videoInputRef.current?.click();
//   };

//   const handleLinkInsert = () => {
//     const url = prompt('Enter URL:');
//     // In mock, just append the link markdown if provided
//     if (url) {
//       setEditorContent(prev => prev + `[${url}](${url})`);
//       onChange?.(editorContent + `[${url}](${url})`);
//     }
//   };

//   const handleFileUpload = async (file: File, type: 'image' | 'video') => {
//     const formData = new FormData();
//     formData.append('file', file);
    
//     // Simulate upload progress
//     const fileId = Date.now().toString();
//     setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
    
//     try {
//       // Simulate API call with progress
//       for (let progress = 0; progress <= 100; progress += 10) {
//         await new Promise(resolve => setTimeout(resolve, 100));
//         setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
//       }
      
//       // Mock URL - replace with actual upload response
//       const mockUrl = URL.createObjectURL(file);
      
//       // Insert into editor (mock: just append image/video markdown)
//       if (type === 'image') {
//         setEditorContent(prev => prev + `![](${mockUrl})`);
//         onChange?.(editorContent + `![](${mockUrl})`);
//       } else if (type === 'video') {
//         setEditorContent(prev => prev + `<video src="${mockUrl}" controls></video>`);
//         onChange?.(editorContent + `<video src="${mockUrl}" controls></video>`);
//       }
      
//       // Clean up progress
//       setUploadProgress(prev => {
//         const newProgress = { ...prev };
//         delete newProgress[fileId];
//         return newProgress;
//       });
      
//     } catch (error) {
//       console.error('Upload failed:', error);
//       alert('Upload failed. Please try again.');
//     }
//   };

//   const insertTemplate = () => {
//     const template = templates[mode];
//     setEditorContent(template);
//     onChange?.(template);
//   };

//   const handleSave = () => {
//     onSave?.(editorContent);
//     alert('Content saved successfully!');
//   };

//   const togglePreview = () => {
//     setIsPreviewMode(!isPreviewMode);
//   };

//   const insertTable = () => {
//     const tableHtml = `
//       <table class="${styles.insertedTable}">
//         <tr>
//           <th>Header 1</th>
//           <th>Header 2</th>
//           <th>Header 3</th>
//         </tr>
//         <tr>
//           <td>Row 1, Col 1</td>
//           <td>Row 1, Col 2</td>
//           <td>Row 1, Col 3</td>
//         </tr>
//         <tr>
//           <td>Row 2, Col 1</td>
//           <td>Row 2, Col 2</td>
//           <td>Row 2, Col 3</td>
//         </tr>
//       </table>
//     `;
    
//     const currentContent = editorContent + tableHtml;
//     setEditorContent(currentContent);
//     onChange?.(currentContent);
//   };
//             // const quillRef = useRef<ReactQuill | null>(null);

//   return (
//     <div className={styles.editorWrapper}>
//       {/* Header */}
//       <div className={styles.header}>
//         <div className={styles.headerLeft}>
//           <FileText className={styles.headerIcon} />
//           <h2 className={styles.headerTitle}>
//             {mode === 'prd' ? 'Product Requirements Document' : 
//              mode === 'bug' ? 'Bug Report' : 'Rich Text Editor'}
//           </h2>
//         </div>
        
//         <div className={styles.headerActions}>
//           {/* Template Button */}
//           {(mode === 'prd' || mode === 'bug') && (
//             <button
//               onClick={insertTemplate}
//               className={`${styles.button} ${styles.buttonTemplate}`}
//             >
//               Insert Template
//             </button>
//           )}
          
//           {/* Preview Toggle */}
//           <button
//             onClick={togglePreview}
//             className={`${styles.button} ${styles.buttonPreview} ${
//               isPreviewMode ? styles.buttonPreviewActive : ''
//             }`}
//           >
//             <Eye className={styles.buttonIcon} />
//             <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
//           </button>
          
//           {/* Save Button */}
//           {onSave && (
//             <button
//               onClick={handleSave}
//               className={`${styles.button} ${styles.buttonSave}`}
//             >
//               <Save className={styles.buttonIcon} />
//               <span>Save</span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Quick Actions Bar */}
//       <div className={styles.quickActions}>
//         <button
//           onClick={handleImageUpload}
//           className={styles.quickActionButton}
//         >
//           <Image className={styles.quickActionIcon} />
//           <span>Image</span>
//         </button>
        
//         <button
//           onClick={handleVideoUpload}
//           className={styles.quickActionButton}
//         >
//           <Video className={styles.quickActionIcon} />
//           <span>Video</span>
//         </button>
        
//         <button
//           onClick={handleLinkInsert}
//           className={styles.quickActionButton}
//         >
//           <Link className={styles.quickActionIcon} />
//           <span>Link</span>
//         </button>
        
//         <button
//           onClick={insertTable}
//           className={styles.quickActionButton}
//         >
//           <span>📊</span>
//           <span>Table</span>
//         </button>
        
//         <button
//           onClick={() => {
//             const codeBlock = '```\n// Your code here\n```\n';
//             const currentContent = editorContent + codeBlock;
//             setEditorContent(currentContent);
//             onChange?.(currentContent);
//           }}
//           className={styles.quickActionButton}
//         >
//           <Code className={styles.quickActionIcon} />
//           <span>Code</span>
//         </button>
//       </div>

//       {/* Upload Progress */}
//       {Object.keys(uploadProgress).length > 0 && (
//         <div className={styles.uploadProgress}>
//           {Object.entries(uploadProgress).map(([fileId, progress]) => (
//             <div key={fileId} className={styles.uploadItem}>
//               <Upload className={styles.uploadIcon} />
//               <div className={styles.progressBar}>
//                 <div 
//                   className={styles.progressFill}
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//               <span className={styles.progressText}>{progress}%</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Editor */}
//       <div className={styles.editorContainer}>
//         {isPreviewMode ? (
//           <div 
//             className={styles.previewMode}
//             dangerouslySetInnerHTML={{ __html: editorContent }}
//           />
//         ) : (


// // <ReactQuill
// //   ref={quillRef}
// //   value={editorContent}
// //   onChange={handleContentChange}
// //   modules={modules}
// //   formats={formats}
// // />

//           <ReactQuill
//             ref={quillRef}
//             theme="snow"
//             value={editorContent}
//             onChange={handleContentChange}
//             modules={modules}
//             formats={formats}
//             placeholder={placeholder}
//             readOnly={readOnly}
//             style={{ minHeight: '400px' }}
//           />
//         )}
//       </div>

//       {/* Hidden file inputs */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         className={styles.hiddenInput}
//         onChange={(e) => {
//           const file = e.target.files?.[0];
//           if (file) handleFileUpload(file, 'image');
//         }}
//       />
      
//       <input
//         ref={videoInputRef}
//         type="file"
//         accept="video/*"
//         className={styles.hiddenInput}
//         onChange={(e) => {
//           const file = e.target.files?.[0];
//           if (file) handleFileUpload(file, 'video');
//         }}
//       />

//       {/* Footer Stats */}
//       <div className={styles.footer}>
//         <div className={styles.footerStat}>
//           Words: {editorContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
//         </div>
//         <div className={styles.footerStat}>
//           Characters: {editorContent.replace(/<[^>]*>/g, '').length}
//         </div>
//         <div className={styles.footerTime}>
//           Last edited: {new Date().toLocaleTimeString()}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Example usage component
// const EditorExample = () => {
//   const [content, setContent] = useState('');
//   const [mode, setMode] = useState<'prd' | 'bug' | 'general'>('general');

//   const handleSave = (content: string) => {
//     console.log('Saving content:', content);
//     // Here you would typically send to your API
//   };

//   return (
//     <div className={styles.exampleWrapper}>
//       <div className={styles.exampleHeader}>
//         <h1 className={styles.exampleTitle}>Rich Text Editor</h1>
        
//         {/* Mode Selector */}
//         <div className={styles.modeSelector}>
//           {(['general', 'prd', 'bug'] as const).map((modeOption) => (
//             <button
//               key={modeOption}
//               onClick={() => setMode(modeOption)}
//               className={`${styles.modeButton} ${
//                 mode === modeOption ? styles.modeButtonActive : ''
//               }`}
//             >
//               {modeOption === 'prd' ? 'PRD' : 
//                modeOption === 'bug' ? 'Bug Report' : 'General'}
//             </button>
//           ))}
//         </div>
//       </div>

//       <RichTextEditor
//         value={content}
//         onChange={setContent}
//         mode={mode}
//         onSave={handleSave}
//         placeholder={
//           mode === 'prd' ? 'Start writing your Product Requirements Document...' :
//           mode === 'bug' ? 'Describe the bug you encountered...' :
//           'Start writing your document...'
//         }
//       />
//     </div>
//   );
// };

// export default EditorExample;

import EditorJS from '@editorjs/editorjs'; 
// import Header from '@editorjs/header'; 
// import List from '@editorjs/list'; 

const editor = new EditorJS({ 
  /** 
   * Id of Element that should contain the Editor 
   */ 
  holder: 'editorjs', 

  /** 
   * Available Tools list. 
   * Pass Tool's class or Settings object for each Tool you want to use 
   */ 
  tools: { 
    header: {
      // class: Header, 
      inlineToolbar: ['link'] 
    }, 
    list: { 
      // class: List, 
      inlineToolbar: true 
    } 
  }, 
})

export default editor;