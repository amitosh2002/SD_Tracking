import React, { useState, useEffect } from 'react';
import './TaskGenerator.scss'; // SCSS for styling
import { ButtonV1 } from '../../customFiles/customComponent/CustomButtons';

const prefixes = [
  { label: 'Architecture', value: 'ARCH' },
  { label: 'Feature', value: 'FEAT' },
  { label: 'Store', value: 'STORE' },
  { label: 'Platform', value: 'PLAT' },
  { label: 'Live Operations', value: 'LIVEOPS' },
  { label: 'Technical Debt', value: 'TECH' },
];

// Helper function to convert a string to a URL-friendly slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

const TaskGenerator = () => {
  const [selectedPrefix, setSelectedPrefix] = useState(prefixes[0].value);
  const [taskName, setTaskName] = useState('');
  const [generatedTaskID, setGeneratedTaskID] = useState('');

  // Use a mock ticket number for demonstration
  const [ticketNumber, setTicketNumber] = useState('001');

  useEffect(() => {
    if (taskName) {
      const slug = slugify(taskName);
      const newID = `${selectedPrefix}-${ticketNumber}-${slug}`.toUpperCase();
      setGeneratedTaskID(newID);
    } else {
      setGeneratedTaskID('');
    }
  }, [selectedPrefix, taskName, ticketNumber]);

  return (
    <div className="task-generator-container">
      <div className="input-group">
        <label htmlFor="prefix-select">Task Type</label>
        <select
          id="prefix-select"
          value={selectedPrefix}
          onChange={(e) => setSelectedPrefix(e.target.value)}
          className="prefix-select"
        >
          {prefixes.map((prefix) => (
            <option key={prefix.value} value={prefix.value}>
              {prefix.label}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="task-name">Task Name</label>
        <input
          id="task-name"
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="e.g., Responsive Design Update"
          className="task-name-input"
        />
      </div>

      {generatedTaskID && (
       <>
        <div className="generated-output">
          <p className="output-label">Generated Task ID:</p>
          <code className="output-code">{generatedTaskID}</code>
           
        </div>
        <ButtonV1
                onClick={() => navigator.clipboard.writeText(generatedTaskID)}
                text="Copy to Clipboard"
                type="primary"
          /></>
      )}
    </div>
  );
};

export default TaskGenerator;