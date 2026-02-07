import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTicket } from '../Redux/Actions/TicketActions/ticketAction';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import DragDrop from 'editorjs-drag-drop';
import Table from '@editorjs/table';
import './styles/editior.scss';
import { ButtonV1 } from '../customFiles/customComponent/CustomButtons';

const TextEditor = ({ initialData, onSave, taskId, style, autoSave = true, disabled = false }) => {
  const editorHolderRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [status, setStatus] = useState('saved'); // 'saved', 'dirty', 'saving'
  const dispatch = useDispatch();
  const timerRef = useRef(null);

  // Use refs for callbacks to avoid re-initializing EditorJS on prop changes
  const onSaveRef = useRef(onSave);
  const taskIdRef = useRef(taskId);

  useEffect(() => {
    onSaveRef.current = onSave;
    taskIdRef.current = taskId;
  }, [onSave, taskId]);

  const triggerSave = async () => {
    if (editorInstanceRef.current) {
      try {
        setStatus('saving');
        const outputData = await editorInstanceRef.current.save();
        
        if (onSaveRef.current) {
          onSaveRef.current(outputData);
        }
        
        if (taskIdRef.current) {
          dispatch(updateTicket(taskIdRef.current, { description: outputData }));
        }
        
        setStatus('saved');
      } catch (error) {
        console.error('Save failed:', error);
        setStatus('dirty');
      }
    }
  };

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
          data: initialData || {},
          onReady: () => {
            new DragDrop(editor);
          },
          onChange: async () => {
            setStatus('dirty');
            
            if (autoSave) {
              if (timerRef.current) clearTimeout(timerRef.current);
              timerRef.current = setTimeout(() => {
                triggerSave();
              }, 1000); // 1 second debounce
            }
          },
          readOnly: disabled,
        });
        editorInstanceRef.current = editor;
      } catch (error) {
        console.error('Editor.js initialization failed:', error);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
    // Initialize only once to prevent reset while typing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle read-only updates dynamically
  useEffect(() => {
    if (editorInstanceRef.current && editorInstanceRef.current.readOnly) {
      editorInstanceRef.current.readOnly.toggle(disabled);
    }
  }, [disabled]);

  // Handle data updates when taskId or initialData changes
  useEffect(() => {
    const updateEditor = async () => {
      const instance = editorInstanceRef.current;
      if (instance && initialData && typeof instance.render === 'function') {
        const isNewTask = taskIdRef.current !== taskId;
        
        if (isNewTask || status === 'saved') {
          try {
            await instance.isReady;
            await instance.render(initialData);
            if (isNewTask) {
              setStatus('saved');
              taskIdRef.current = taskId;
            }
          } catch (err) {
            console.warn('Editor update failed:', err);
          }
        }
      }
    };

    updateEditor();
  }, [initialData, taskId, status]);

  const handleManualSave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    triggerSave();
  };

  const handleCancel = async () => {
    if (editorInstanceRef.current) {
      try {
        if (timerRef.current) clearTimeout(timerRef.current);
        await editorInstanceRef.current.render(initialData || {});
        setStatus('saved');
      } catch (error) {
        console.error('Cancel/Reset failed:', error);
      }
    }
  };

  return (
    <div className="editor-container" style={style}>
      <div className="editor-status" style={{ 
        fontSize: '11px', 
        color: '#6b7280', 
        textAlign: 'right', 
        paddingRight: '12px',
        marginBottom: '4px',
        fontStyle: 'italic'
      }}>
        {status === 'saving' ? 'Saving...' : status === 'dirty' ? 'Unsaved changes' : 'All changes saved'}
      </div>
      
      <div className="editor-body">
        <div ref={editorHolderRef} />
      </div>

      {!autoSave && status === 'dirty' && (
        <div className="button-group">
          <ButtonV1 text="save" onClick={handleManualSave} type="primary" />
          <ButtonV1 text="cancel" onClick={handleCancel} type="secondary" />
        </div>
      )}
    </div>
  );
};

export default TextEditor;
