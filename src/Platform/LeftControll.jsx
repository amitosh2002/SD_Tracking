

import React, { useCallback, useEffect, useState } from 'react';
import './styles/issueDetails.scss'; // Import the SCSS file
import { ButtonUD, ButtonV1 } from '../customFiles/customComponent/CustomButtons';
import defaultUser from"../assets/platformIcons/defaultUser.svg"
// Assuming updateStoryPointApi exists in your TicketActions
import { addStoryPointToTicket, addTimeLogForWork, assignTaskApi, changeTicketStatus, getTicketById, } from '../Redux/Actions/TicketActions/ticketAction'; 
import { useDispatch, useSelector } from 'react-redux';
import { DropDownForTicketStatus } from '../customFiles/customComponent/DropDown';
import { PopupV1 } from '../customFiles/customComponent/popups';
import { convertInputToSeconds, formatMinutesToCustomDays } from '../utillity/helper';
import { SHOW_SNACKBAR } from '../Redux/Constants/PlatformConstatnt/platformConstant';
import { GET_TICKET_UPDATED_DETAILS } from '../Redux/Constants/ticketReducerConstants';

const IssueDetails = ({task}) => {
  const dispatch = useDispatch()
  
  // Destructure selectedTicket from Redux state for reliable access
  const { ticketDetailsChange, selectedTicket } = useSelector((state) => state.worksTicket);
  
  // Use status and storyPoint from the up-to-date selectedTicket state
  const { storyPoint, _id: ticketId } = selectedTicket || {};
  
  const [timeLogged, setTimeLogged] = useState('');
  const [error, setError] = useState(null);
  const [timeLogPopup, setTimeLogPopup] = useState(false);
  
  // Initialize local state based on the Redux state (selectedTicket)
  const [storyPoints, setStoryPoints] = useState(storyPoint || 0);

  const {TicketStatus:ticketStatus}=useSelector((state)=>state.keyValuePair)||{}
  const {userDetails}=useSelector((state)=>state.user);

  // -----------------------------------------------------------
  // 1. Initial/Refetch Data Effect (Triggers on task ID or flag change)
  useEffect(()=>{
    if (task?._id) {
        dispatch(getTicketById(task._id));
    }
    // Runs when task ID changes or when ticketDetailsChange (the flag) flips
  },[dispatch, task?._id, ticketDetailsChange])

  // 2. Sync local storyPoints state with Redux state
  useEffect(() => {
    // Only update local state if the Redux state value is different
    if (selectedTicket && selectedTicket.storyPoint !== storyPoints) {
        setStoryPoints(selectedTicket.storyPoint || 0);
    }
  }, [selectedTicket?.storyPoint,selectedTicket,storyPoints]); // Only re-run when the Redux storyPoint changes
  // -----------------------------------------------------------


  const handleTimeLogChange = (e) => {
    let timeLog = e.target.value.trim(); // Trim whitespace
    const allowedCharsRegex = /^[0-9dhms\s]*$/i; 

    // 1. Filter out disallowed characters
    if (!allowedCharsRegex.test(timeLog)) {
        console.log("Invalid character entered.");
        setError("Invalid characters detected. Use d, h, m for units.");
        return; 
    }

    // 2. Update the state with the raw input (contains only allowed chars)
    setTimeLogged(e.target.value); 
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let totalTimeLog = convertInputToSeconds(timeLogged);
    const note = "";

    if (!ticketId || !userDetails?.id) {
        console.error("Missing Ticket ID or User ID for time log.");
        return;
    }

    dispatch(addTimeLogForWork(ticketId, userDetails.id, totalTimeLog, note));
    setTimeLogPopup(false);
    
    // ✅ FIX 1: Toggle the flag to force useEffect to call getTicketById
    dispatch({type: GET_TICKET_UPDATED_DETAILS});
    
    setTimeLogged("");
    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        message: `Successful added the timelog for "${selectedTicket?.type} ${selectedTicket?.sequenceNumber}"`,
        type: "success"
      }
    });
  };
let storyPointTimeout; // put this outside component OR useRef

const handleStoryPointChange = async (e) => {
    const value = e.target.value;

    // Always update local state immediately
    setStoryPoints(value);

    // Prevent empty / invalid values from triggering API
    if (value === "" || isNaN(Number(value))) {
        return;
    }

    // Debounce API to avoid sending too many calls
    if (storyPointTimeout) clearTimeout(storyPointTimeout);

    storyPointTimeout = setTimeout(async () => {
        if (task?._id) {
            await dispatch(addStoryPointToTicket({
                point: Number(value),
                userId: userDetails.id,
                ticketId: task._id
            }));

            dispatch({ type: GET_TICKET_UPDATED_DETAILS });
        }
    }, 600); // waits 600ms after user stops typing
};


  const handleAssingTask = (id) => {
    if (!id || !userDetails?.id) {
      console.log("Ticket ID or User ID not found");
      return;
    }
    
    dispatch(assignTaskApi(id, userDetails.id));
    
    // ✅ FIX 3: Toggle the flag to force useEffect to call getTicketById
    dispatch({type: GET_TICKET_UPDATED_DETAILS});
  };

  const handleStatusChange = useCallback((data) => {
    if (!ticketId) {
        console.error("Task ID not found for status change.");
        return;
    }
    dispatch(changeTicketStatus(ticketId, data?.newStatus));
    
    // ✅ FIX 4: Toggle the flag to force useEffect to call getTicketById
    dispatch({type: GET_TICKET_UPDATED_DETAILS});
        
  }, [ticketId, dispatch]);
  
  return (
    <div className="issue-container">
      {/* Top action bar */}
      <div className="action-bar">
        <div className="action-bar__left">
        <DropDownForTicketStatus
          ticketTypes={ticketStatus}
          value={selectedTicket?.status || "OPEN"}
          onStatusChange={(statusData) => {
            handleStatusChange(statusData);
          }}
          className="status-dropdown"
          ticketId={selectedTicket?._id}
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
            selectedTicket?.assignee !== "Unassigned"? (
                <div className='assignie_controll'>
               <div className="assigne-avtar" >
                 <span className="avatar">{selectedTicket?.assignee[0] ?? ""}</span>
                <span className="user-name">{selectedTicket?.assignee ?? ""}</span>
               </div>
              {
                 selectedTicket?.assignee===userDetails?.username &&  <ButtonUD text={"Unassigned"}/>
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
            selectedTicket?.assignee!==userDetails?.username &&
            <ButtonUD text={"Assign to me"} onClick={()=>handleAssingTask(selectedTicket._id)}/>
           }
          </div>
        </div>
        <div className="details-row">
          <span className="details-label">Reporter</span>
          <div className="details-value">
            <span className="avatar">{selectedTicket?.reporter[0] ?? ""}</span>
            <span className="user-name">{selectedTicket?.reporter ?? ""}</span>
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
          <span className="field-value">{selectedTicket?.priority}</span>
          {/* <DropDownV1/> */}
        </div>
        <div className="more-field-item">
          <span className="field-label">Status:</span>
          <span className="field-value">{selectedTicket?.status}</span>
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
              value={formatMinutesToCustomDays(selectedTicket?.totalTimeLogged)}
              readOnly // Made readOnly to indicate this is a display field
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
              // type="number" 
              className="story-point-input" 
              value={storyPoints} // Used local state for controlled input
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