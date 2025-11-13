import React, { useCallback, useEffect, useState } from 'react';
import './styles/issueDetails.scss'; // Import the SCSS file
import { ButtonUD, ButtonV1 } from '../customFiles/customComponent/CustomButtons';
import defaultUser from"../assets/platformIcons/defaultUser.svg"
import { addTimeLogForWork, assignTaskApi, changeTicketStatus } from '../Redux/Actions/TicketActions/ticketAction';
import { useDispatch, useSelector } from 'react-redux';
import { DropDownForTicketStatus } from '../customFiles/customComponent/DropDown';
import { PopupV1 } from '../customFiles/customComponent/popups';
import { convertInputToSeconds, formatMinutesToCustomDays } from '../utillity/helper';
import { SHOW_SNACKBAR } from '../Redux/Constants/PlatformConstatnt/platformConstant';
const IssueDetails = ({task}) => {
  const dispatch = useDispatch()
  console.log("Task Details:", task);

  const {status,storyPoint}=task || {};
   const [timeLogged, setTimeLogged] = useState('');
    const [error, setError] = useState(null);
    const [timeLogPopup, setTimeLogPopup] = useState(false);

  const [storyPoints, setStoryPoints] = useState(storyPoint || 0);

  const {
    TicketStatus:ticketStatus
  }=useSelector((state)=>state.keyValuePair)||{}
  const {userDetails}=useSelector((state)=>state.user);
  useEffect(()=>{})

 const handleTimeLogChange = (e) => {
    let timeLog = e.target.value.trim(); // Trim whitespace
    
    // Regex allows digits, d, m, h (if needed), and spaces.
    // It filters out invalid characters as the user types.
    const allowedCharsRegex = /^[0-9dhms\s]*$/i; 

    // Regex to fully validate the format (e.g., "2d 5h 30m") 
    // This looks for one or more segments (e.g., 2d, 3h, 15m) separated by spaces.
    // The units are optional, but if present, must be d, h, or m.
    const validationRegex = /^(\s*\d+\s*[dhm]\s*)*$/i; 

    // 1. Filter out disallowed characters (e.g., letters, symbols) immediately
    if (!allowedCharsRegex.test(timeLog)) {
        // If an invalid character is detected, do NOT update the state
        // You can optionally show an error message here.
        console.log("Invalid character entered.");
        setError(true)
        return; 

    }

    // 2. Update the state with the raw input (contains only allowed chars)
    setTimeLogged(e.target.value); 
    
    // 3. Optional: If you need to ONLY allow saving/submitting if the format is perfect:
    // This check should ideally be done in the submit handler, not the change handler.
    if (validationRegex.test(timeLog) || timeLog === '') {
        setTimeLogged(e.target.value);
        console.log(timeLog)
    }
};

  const handleSubmit=(e)=>{
     e.preventDefault();
    let totalTimeLog = convertInputToSeconds(timeLogged)
    const note =""
    dispatch(addTimeLogForWork(task?._id,userDetails?.id,totalTimeLog,note))
    setTimeLogPopup(false);
    setTimeLogged("")
      dispatch({
        type: SHOW_SNACKBAR,
        payload: {
          message: `Successful added the timelog for "${task?.type} ${task?.sequenceNumber}"`,
          type: "success"
        }
      });

    

  }

  const handleStoryPointChange = (e) => {
    setStoryPoints(e.target.value);
  };

  const handleAssingTask=(id)=>{
    
    // console.log(id);
    if (!id) {
      console.log("ticket not found")
      return;
      
    }
    dispatch(assignTaskApi(id,userDetails?.id));
  }


     const handleStatusChange = useCallback((data) => {
        if (!task?._id) {
            console.error("Task ID not found for status change.");
            return;
        }
        // Dispatch the action to update the status in the backend and Redux store
        dispatch(changeTicketStatus(task?._id, data?.newStatus));
        // Remove local state update - let Redux handle the state
        
    }, [task?._id, dispatch]);
  
  return (
    <div className="issue-container">
      {/* Top action bar */}
      <div className="action-bar">
        <div className="action-bar__left">
        <DropDownForTicketStatus
          ticketTypes={ticketStatus}
          value={task?.status || "OPEN"}
          onStatusChange={(statusData) => {
            handleStatusChange(statusData);
          }}
          className="status-dropdown"
          ticketId={task?._id}
        />
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
                <div className='assignie_controll'>
               <div className="assigne-avtar" >
                 <span className="avatar">{task?.assignee[0] ?? ""}</span>
                <span className="user-name">{task?.assignee ?? ""}</span>
               </div>
              {
                 task.assignee===userDetails?.username &&  <ButtonUD text={"Unassigned"}/>
              }
           
                </div>
            ):(
                <>
                <img src={defaultUser} className="avatar"alt="" />
                <span className="user-name">Unassigned</span>
                </>
            )
           }
           </div>{
            task.assignee!==userDetails?.username &&
            <ButtonUD text={"Assign to me"} onClick={()=>handleAssingTask(task._id)}/>
           }
          </div>
        </div>
        <div className="details-row">
          <span className="details-label">Reporter</span>
          <div className="details-value">
            <span className="avatar">{task?.reporter[0] ?? ""}</span>
            <span className="user-name">{task?.reporter ?? ""}</span>
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
          {/* <DropDownV1/> */}
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
              value={formatMinutesToCustomDays(task?.totalTimeLogged)}
              onChange={handleTimeLogChange}
              onClick={()=>setTimeLogPopup(true)}
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

     { timeLogPopup && <PopupV1 
      title={"Enter Time Log"}
      onClose={()=>setTimeLogPopup(false)}>
          <form onSubmit={handleSubmit} className="time-log-form">
            <div className="time-log-input-group">
                <label htmlFor="timeInput" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Log Time Duration:
                </label>
                <input
                    id="timeInput"
                    type="text"
                    value={timeLogged}
                    onChange={handleTimeLogChange}
                    // 💡 ADDED: Clear description for the user in the placeholder
                    placeholder="e.g., 1d 4h 30m (1 day = 9 hours)"
                    style={{ 
                        border: error ? '1px solid red' : '1px solid #ccc', 
                        padding: '10px', 
                        width: '250px',
                        marginRight: '10px'
                    }}
                />
                <ButtonV1 type="primary" disabled={!timeLogged.trim()}>
                    Log Time
                </ButtonV1>
            </div>
            
            {/* 💡 ADDED: Concise instruction below the input */}
            <p style={{ 
                fontSize: '12px', 
                color: '#666', 
                marginTop: '5px' 
            }}>
                Use 'd' for **Days** (1d = 9 hours), 'h' for **Hours**, and 'm' for **Minutes**. Example: **`1d 45m`**.
            </p>

            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
        </form>
      </PopupV1>}
    </div>
  );
};

export default IssueDetails;