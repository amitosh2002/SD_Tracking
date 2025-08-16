import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import DragDrop from "editorjs-drag-drop";
import "./styles/editior.scss"
import { ButtonV1 } from '../customFiles/customComponent/CustomButtons';
import IssueDetails from './LeftControll';
const TextEditor = () => {
  
    const editorHolderRef = useRef(null);
    const editorInstanceRef = useRef(null);

    useEffect(() => {
        if (editorHolderRef.current && !editorInstanceRef.current) {
            try {
                editorInstanceRef.current = new EditorJS({
                    holder: editorHolderRef.current,
                    tools: {
                        header: Header,
                        list: List,
                        paragraph: {
                            class: Paragraph,
                            inlineToolbar: true,
                        },
                    },
                });
            } catch (error) {
                console.error('Editor.js initialization failed:', error);
                // Ensure the ref is null if initialization fails
                editorInstanceRef.current = null;
            }
        }

        return () => {
            // Check if the destroy method exists before calling it
            if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
                editorInstanceRef.current.destroy();
                editorInstanceRef.current = null;
            }
        };
    }, []);
    const buttonGroup = [
        {
            text: "save",
            // icon: "https://cdn-icons-png.flaticon.com/512/1828/1828770.png",
            // tailIcon: "https://cdn-icons-png.flaticon.com/512/1828/1828770.png",
            type: "primary"
        },
        {
            text: "clear",
            // icon: "https://cdn-icons-png.flaticon.com/512/1828/1828770.png",
            // tailIcon: "https://cdn-icons-png.flaticon.com/512/1828/1828770.png",
            type: "secondary"
        }
    ];

    return (
          <div className='editor-container'>
              <div className='editor-body' >

            <div ref={editorHolderRef} />
              </div>
            <div className="button-group">
                {buttonGroup.map((button, index) => (
                    <ButtonV1
                        key={index}
                        onClick={button.onClick}
                        text={button.text}
                        icon={button.icon}
                        type={button.type}
                    />
                ))}
            </div>
        </div>)
};    
    
export default TextEditor;