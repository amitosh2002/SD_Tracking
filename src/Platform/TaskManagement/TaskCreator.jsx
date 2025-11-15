import React, { useState, useEffect } from 'react';
import './TaskGenerator.scss'; // SCSS for styling

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
  // Initialize state with a better approach
  const [selectedPrefix, setSelectedPrefix] = useState(prefixes[0].value);
  const [taskName, setTaskName] = useState('');
  const [generatedTaskID, setGeneratedTaskID] = useState('');
  const [ticketNumber, setTicketNumber] = useState('001'); // Using state to allow user input

  // Effect to generate the task ID
  useEffect(() => {
    if (taskName && ticketNumber) { // Ensure both inputs are provided
      const slug = slugify(taskName);
      const newID = `${selectedPrefix}-${ticketNumber}-${slug}`.toUpperCase();
      setGeneratedTaskID(newID);
    } else {
      setGeneratedTaskID('');
    }
  }, [selectedPrefix, taskName, ticketNumber]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedTaskID)
      .then(() => {
        // Optional: Provide user feedback like a success message
        console.log('Task ID copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

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
        <label htmlFor="ticket-number">Ticket Number</label>
        <input
          id="ticket-number"
          type="text"
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
          placeholder="e.g., 001"
          className="task-name-input"
        />
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
        <div className="generated-output-container">
          <div className="generated-output">
            <p className="output-label">Generated Task ID:</p>
            <code className="output-code">{generatedTaskID}</code>
          </div>
          <button onClick={handleCopyToClipboard} className="copy-button">
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskGenerator;