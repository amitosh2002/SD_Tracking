import React from 'react';
import './TaskDetails.scss';
// import TextEditor from '../Editor';
import TextEditor from '../../Platform/Editor';
import IssueDetails from '../LeftControll';

const TaskDetails = ({ task }) => {
  if (!task) {
    return (
      <div className="placeholder">
        <h2>Select a task to view details.</h2>
        <p>Your task description will appear here.</p>
      </div>
    );
  }
const savedData = {
  time: 1755691820318,
  blocks: [
    {
      id: "_T_lK2jgE6",
      type: "paragraph",
      data: { text: "gtgtgt" }
    }
  ],
  version: "2.31.0-rc.7"
};
  return (
    <>
   
    <div className="task-details">
      <div className="task-details-container">
      <p className="task-id">ID: {task.ticketKey}</p>
      <h2 className="task-title">{task.title}</h2>
      <p className="task-description">{task.description || 'No description available.'}</p>
      <TextEditor initialData={savedData} />
      </div>
      {/* <TextEditor/> */}
                    <IssueDetails task={task}/>
      
    </div>
    </>
  );
};

export default TaskDetails;