import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import DragDrop from "editorjs-drag-drop";
import "./styles/editior.scss"
import Table from '@editorjs/table';
import { ButtonV1 } from '../customFiles/customComponent/CustomButtons';

const TextEditor = ({ initialData }) => {
    const editorHolderRef = useRef(null);
    const editorInstanceRef = useRef(null);

    useEffect(() => {
        if (editorHolderRef.current && !editorInstanceRef.current) {
            try {
                // Initialize the Editor.js instance
                const editor = new EditorJS({
                    holder: editorHolderRef.current || 'editorjs',
                    tools: {
                        header: Header,
                        list: List,
                        paragraph: {
                            class: Paragraph,
                            inlineToolbar: true,
                        },
                        table: Table,
                        
                    },
                    data: initialData,
                    onReady: () => {
                        // Initialize DragDrop here, only after the editor is ready
                        new DragDrop(editor);
                        console.log('Editor.js is ready with DragDrop!');
                    }
                });
                editorInstanceRef.current = editor;

            } catch (error) {
                console.error('Editor.js initialization failed:', error);
                editorInstanceRef.current = null;
            }
        }

        return () => {
            if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
                editorInstanceRef.current.destroy();
                editorInstanceRef.current = null;
            }
        };
    }, [editorHolderRef, initialData]); // Add initialData to dependency array

    const handleSave = async () => {
        if (editorInstanceRef.current) {
            try {
                const outputData = await editorInstanceRef.current.save();
                console.log('Content saved:', outputData);
                // You can now handle the saved data
            } catch (error) {
                console.error('Saving failed:', error);
            }
        } else {
            console.error('Editor instance is not initialized');
        }
    };

    const handleClear = async () => {
        if (editorInstanceRef.current) {
            try {
                await editorInstanceRef.current.clear();
                console.log('Editor cleared');
            } catch (error) {
                console.error('Clearing failed:', error);
            }
        } else {
            console.error('Editor instance is not initialized');
        }
    };

    const buttonGroup = [
        { text: "save", onClick: handleSave, type: "primary" },
        { text: "clear", onClick: handleClear, type: "secondary" }
    ];

    return (
        <div className='editor-container'>
            <div className='editor-body'>
                <div id="editorjs" ref={editorHolderRef} />
            </div>
            <div className="button-group">
                {buttonGroup.map((button, index) => (
                    <ButtonV1
                        key={index}
                        onClick={button.onClick}
                        text={button.text}
                        type={button.type}
                    />
                ))}
            </div>
        </div>
    );
};

export default TextEditor;