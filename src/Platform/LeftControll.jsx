import React, { useState } from 'react';
import './styles/issueDetails.scss'; // Import the SCSS file
import { ButtonUD } from '../customFiles/customComponent/CustomButtons';
import defaultUser from"../assets/platformIcons/defaultUser.svg"
import { assignTaskApi } from '../Redux/Actions/TicketActions/ticketAction';
import { useDispatch } from 'react-redux';
const IssueDetails = ({task}) => {
  const dispatch = useDispatch()
  console.log("Task Details:", task);

  const {status,storyPoint}=task || {};
  const [timeLogged, setTimeLogged] = useState('1d 2h 30m');
  const [storyPoints, setStoryPoints] = useState(storyPoint || 0);

  const handleTimeLogChange = (e) => {
    setTimeLogged(e.target.value);
  };

  const handleStoryPointChange = (e) => {
    setStoryPoints(e.target.value);
  };

  const handleAssingTask=(id)=>{
    
    // console.log(id);
    if (!id) {
      console.log("ticket not found")
      return;
      
    }
    dispatch(assignTaskApi(id));
  }
  
  return (
    <div className="issue-container">
      {/* Top action bar */}
      <div className="action-bar">
        <div className="action-bar__left">
          <button className="status-button">
            <span className="status-dot"></span>
           {status || 'Open'}
          </button>
        </div>
        <div className="action-bar__right">
          <button className="icon-button">👁️ 5</button>
          <button className="icon-button">🔗</button>
          <button className="icon-button">...</button>
        </div>
      </div>

      {/* Main content body */}
      <div className="details-section">
        <h3 className="section-title">Details</h3>
        <div className="details-row">
          <span className="details-label">Assignee</span>
          <div className="assigne_detail_value">
           <div className="assigne_detail">
           {
            task?.assignee !== "Unassigned"? (
                <>
                <span className="avatar">{task?.assignee[0]}</span>
            <span className="user-name">{task?.assignee}</span>
            <ButtonUD text={"Unassigned"}/>

                </>
            ):(
                <>
                <img src={defaultUser} className="avatar"alt="" />
                <span className="user-name">Unassigned</span>
                </>
            )
           }
           </div>
            <ButtonUD text={"Assign to me"} onClick={()=>handleAssingTask(task._id)}/>
          </div>
        </div>
        <div className="details-row">
          <span className="details-label">Reporter</span>
          <div className="details-value">
            <span className="avatar">{task?.reporter[0]}</span>
            <span className="user-name">{task?.reporter}</span>
          </div>
        </div>
      </div>

      {/* Development section */}
      <div className="development-section">
        <h3 className="section-title">Development</h3>
        <div className="dev-item">
          <div className="dev-text">Open with VS Code</div>
        </div>
        <div className="dev-item">
          <div className="dev-text">1 branch</div>
        </div>
        {/* ... other items like pull request and build */}
      </div>

      {/* Add more sections as needed */}
      <div className="more_field">
        <h3 className="section-title">More Fields</h3>
        <div className="more-field-item">
          <span className="field-label">Priority:</span>
          <span className="field-value">{task?.priority}</span>
        </div>
        <div className="more-field-item">
          <span className="field-label">Status:</span>
          <span className="field-value">{task?.status}</span>
        </div>
      </div>
      <div className="task_other_details">
        {/* Time Log Section */}
        <div className="time_log">
          <h3 className="section-title">Time Log</h3>
          <div className="time-log-item">
            <span className="time-log-label">Total Time:</span>
            <input 
              type="text" 
              className="time-log-input" 
              value={timeLogged}
              onChange={handleTimeLogChange}
            />
          </div>
        </div>

        {/* Story Points Section */}
        <div className="story_point">
          <h3 className="section-title">Story Points</h3>
          <div className="story-point-item">
            <span className="story-point-label">Points:</span>
            <input 
              type="number" 
              className="story-point-input" 
              value={storyPoints}
              onChange={handleStoryPointChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;