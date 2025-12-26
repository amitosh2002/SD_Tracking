import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import DragDrop from 'editorjs-drag-drop';
import Table from '@editorjs/table';
import './styles/editior.scss';
import { ButtonV1 } from '../customFiles/customComponent/CustomButtons';

const TextEditor = ({ initialData, onSave,taskId }) => {
  const editorHolderRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [isDirty, setIsDirty] = useState(false); // track if content changed

  useEffect(() => {
    if (editorHolderRef.current && !editorInstanceRef.current) {
      try {
        const editor = new EditorJS({
          holder: editorHolderRef.current,
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
            new DragDrop(editor);
            console.log('Editor.js is ready with DragDrop!');
          },
          onChange: async () => {
            setIsDirty(true); // user made a change
          },
        });
        editorInstanceRef.current = editor;
      } catch (error) {
        console.error('Editor.js initialization failed:', error);
        editorInstanceRef.current = null;
      }
    }

    return () => {
      if (
        editorInstanceRef.current &&
        typeof editorInstanceRef.current.destroy === 'function'
      ) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [editorHolderRef, initialData]);

  const handleSave = async () => {
    if (editorInstanceRef.current) {
      try {
        const outputData = await editorInstanceRef.current.save();
        console.log('Content saved:', outputData);
        if (onSave) onSave(outputData);
        if(taskId) console.log(" update data ",outputData)
        setIsDirty(false); // reset state after save
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
        setIsDirty(false); // reset state after clear
      } catch (error) {
        console.error('Clearing failed:', error);
      }
    } else {
      console.error('Editor instance is not initialized');
    }
  };

  const buttonGroup = [
    { text: 'save', onClick: handleSave, type: 'primary' },
    { text: 'clear', onClick: handleClear, type: 'secondary' },
  ];

  return (
    <div className="editor-container">
      <div className="editor-body">
        <div id="editorjs" ref={editorHolderRef} />
      </div>

      {isDirty && (
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
      )}
    </div>
  );
};

export default TextEditor;
