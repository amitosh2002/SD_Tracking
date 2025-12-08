

// import React, { useCallback, useEffect, useState } from 'react';
// import './styles/issueDetails.scss'; // Import the SCSS file
// import { ButtonUD, ButtonV1 } from '../customFiles/customComponent/CustomButtons';
// import defaultUser from"../assets/platformIcons/defaultUser.svg"
// // Assuming updateStoryPointApi exists in your TicketActions
// import { addStoryPointToTicket, addTimeLogForWork, assignTaskApi, changeTicketStatus, getTicketById, } from '../Redux/Actions/TicketActions/ticketAction'; 
// import { useDispatch, useSelector } from 'react-redux';
// import { DropDownForTicketStatus } from '../customFiles/customComponent/DropDown';
// import { PopupV1 } from '../customFiles/customComponent/popups';
// import { convertInputToSeconds, formatMinutesToCustomDays } from '../utillity/helper';
// import { SHOW_SNACKBAR } from '../Redux/Constants/PlatformConstatnt/platformConstant';
// import { GET_TICKET_UPDATED_DETAILS } from '../Redux/Constants/ticketReducerConstants';

// const IssueDetails = ({task}) => {
//   const dispatch = useDispatch()
  
//   // Destructure selectedTicket from Redux state for reliable access
//   const { ticketDetailsChange, selectedTicket } = useSelector((state) => state.worksTicket);
  
//   // Use status and storyPoint from the up-to-date selectedTicket state
//   const { storyPoint, _id: ticketId } = selectedTicket || {};
  
//   const [timeLogged, setTimeLogged] = useState('');
//   const [error, setError] = useState(null);
//   const [timeLogPopup, setTimeLogPopup] = useState(false);
  
//   // Initialize local state based on the Redux state (selectedTicket)
//   const [storyPoints, setStoryPoints] = useState(storyPoint || 0);

//   const {TicketStatus:ticketStatus}=useSelector((state)=>state.keyValuePair)||{}
//   const {userDetails}=useSelector((state)=>state.user);

//   // -----------------------------------------------------------
//   // 1. Initial/Refetch Data Effect (Triggers on task ID or flag change)
//   useEffect(()=>{
//     if (task?._id) {
//         dispatch(getTicketById(task._id));
//     }
//     // Runs when task ID changes or when ticketDetailsChange (the flag) flips
//   },[dispatch, task?._id, ticketDetailsChange])

//   // 2. Sync local storyPoints state with Redux state
//   useEffect(() => {
//     // Only update local state if the Redux state value is different
//     if (selectedTicket && selectedTicket.storyPoint !== storyPoints) {
//         setStoryPoints(selectedTicket.storyPoint || 0);
//     }
//   }, [selectedTicket?.storyPoint,selectedTicket,storyPoints]); // Only re-run when the Redux storyPoint changes
//   // -----------------------------------------------------------


//   const handleTimeLogChange = (e) => {
//     let timeLog = e.target.value.trim(); // Trim whitespace
//     const allowedCharsRegex = /^[0-9dhms\s]*$/i; 

//     // 1. Filter out disallowed characters
//     if (!allowedCharsRegex.test(timeLog)) {
//         console.log("Invalid character entered.");
//         setError("Invalid characters detected. Use d, h, m for units.");
//         return; 
//     }

//     // 2. Update the state with the raw input (contains only allowed chars)
//     setTimeLogged(e.target.value); 
//     setError(null);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     let totalTimeLog = convertInputToSeconds(timeLogged);
//     const note = "";

//     if (!ticketId || !userDetails?.id) {
//         console.error("Missing Ticket ID or User ID for time log.");
//         return;
//     }

//     dispatch(addTimeLogForWork(ticketId, userDetails.id, totalTimeLog, note));
//     setTimeLogPopup(false);
    
//     // ✅ FIX 1: Toggle the flag to force useEffect to call getTicketById
//     dispatch({type: GET_TICKET_UPDATED_DETAILS});
    
//     setTimeLogged("");
//     dispatch({
//       type: SHOW_SNACKBAR,
//       payload: {
//         message: `Successful added the timelog for "${selectedTicket?.type} ${selectedTicket?.sequenceNumber}"`,
//         type: "success"
//       }
//     });
//   };
// let storyPointTimeout; // put this outside component OR useRef

// const handleStoryPointChange = async (e) => {
//     const value = e.target.value;

//     // Always update local state immediately
//     setStoryPoints(value);

//     // Prevent empty / invalid values from triggering API
//     if (value === "" || isNaN(Number(value))) {
//         return;
//     }

//     // Debounce API to avoid sending too many calls
//     if (storyPointTimeout) clearTimeout(storyPointTimeout);

//     storyPointTimeout = setTimeout(async () => {
//         if (task?._id) {
//             await dispatch(addStoryPointToTicket({
//                 point: Number(value),
//                 userId: userDetails.id,
//                 ticketId: task._id
//             }));

//             dispatch({ type: GET_TICKET_UPDATED_DETAILS });
//         }
//     }, 600); // waits 600ms after user stops typing
// };


//   const handleAssingTask = (id) => {
//     if (!id || !userDetails?.id) {
//       console.log("Ticket ID or User ID not found");
//       return;
//     }
    
//     dispatch(assignTaskApi(id, userDetails.id));
    
//     // ✅ FIX 3: Toggle the flag to force useEffect to call getTicketById
//     dispatch({type: GET_TICKET_UPDATED_DETAILS});
//   };

//   const handleStatusChange = useCallback((data) => {
//     if (!ticketId) {
//         console.error("Task ID not found for status change.");
//         return;
//     }
//     dispatch(changeTicketStatus(ticketId, data?.newStatus));
    
//     // ✅ FIX 4: Toggle the flag to force useEffect to call getTicketById
//     dispatch({type: GET_TICKET_UPDATED_DETAILS});
        
//   }, [ticketId, dispatch]);
  
//   return (
//     <div className="issue-container">
//       {/* Top action bar */}
//       <div className="action-bar">
//         <div className="action-bar__left">
//         <DropDownForTicketStatus
//           ticketTypes={ticketStatus}
//           value={selectedTicket?.status || "OPEN"}
//           onStatusChange={(statusData) => {
//             handleStatusChange(statusData);
//           }}
//           className="status-dropdown"
//           ticketId={selectedTicket?._id}
//         />
//       </div>
//         <div className="action-bar__right">
//           <button className="icon-button">👁️ 5</button>
//           <button className="icon-button">🔗</button>
//           <button className="icon-button">...</button>
//         </div>
//       </div>

//       {/* Main content body */}
//       <div className="details-section">
//         <h3 className="section-title">Details</h3>
//         <div className="details-row">
//           <span className="details-label">Assignee</span>
//           <div className="assigne_detail_value">
//            <div className="assigne_detail">
//            {
//             selectedTicket?.assignee !== "Unassigned"? (
//                 <div className='assignie_controll'>
//                <div className="assigne-avtar" >
//                  <span className="avatar">{selectedTicket?.assignee[0] ?? ""}</span>
//                 <span className="user-name">{selectedTicket?.assignee ?? ""}</span>
//                </div>
//               {
//                  selectedTicket?.assignee===userDetails?.username &&  <ButtonUD text={"Unassigned"}/>
//               }
           
//                 </div>
//             ):(
//                 <>
//                 <img src={defaultUser} className="avatar"alt="" />
//                 <span className="user-name">Unassigned</span>
//                 </>
//             )
//            }
//            </div>{
//             selectedTicket?.assignee!==userDetails?.username &&
//             <ButtonUD text={"Assign to me"} onClick={()=>handleAssingTask(selectedTicket._id)}/>
//            }
//           </div>
//         </div>
//         <div className="details-row">
//           <span className="details-label">Reporter</span>
//           <div className="details-value">
//             <span className="avatar">{selectedTicket?.reporter[0] ?? ""}</span>
//             <span className="user-name">{selectedTicket?.reporter ?? ""}</span>
//           </div>
//         </div>
//       </div>

//       {/* Development section */}
//       <div className="development-section">
//         <h3 className="section-title">Development</h3>
//         <div className="dev-item">
//           <div className="dev-text">Open with VS Code</div>
//         </div>
//         <div className="dev-item">
//           <div className="dev-text">1 branch</div>
//         </div>
//         {/* ... other items like pull request and build */}
//       </div>

//       {/* Add more sections as needed */}
//       <div className="more_field">
//         <h3 className="section-title">More Fields</h3>
//         <div className="more-field-item">
//           <span className="field-label">Priority:</span>
//           <span className="field-value">{selectedTicket?.priority}</span>
//           {/* <DropDownV1/> */}
//         </div>
//         <div className="more-field-item">
//           <span className="field-label">Status:</span>
//           <span className="field-value">{selectedTicket?.status}</span>
//         </div>
//       </div>
//       <div className="task_other_details">
//         {/* Time Log Section */}
//         <div className="time_log">
//           <h3 className="section-title">Time Log</h3>
//           <div className="time-log-item">
//             <span className="time-log-label">Total Time:</span>
//             <input 
//               type="text" 
//               className="time-log-input" 
//               value={formatMinutesToCustomDays(selectedTicket?.totalTimeLogged)}
//               readOnly // Made readOnly to indicate this is a display field
//               onClick={()=>setTimeLogPopup(true)}
//             />
//           </div>
//         </div>

//         {/* Story Points Section */}
//         <div className="story_point">
//           <h3 className="section-title">Story Points</h3>
//           <div className="story-point-item">
//             <span className="story-point-label">Points:</span>
//             <input 
//               // type="number" 
//               className="story-point-input" 
//               value={storyPoints} // Used local state for controlled input
//               onChange={handleStoryPointChange}
//             />
//           </div>
//         </div>


//       </div>

//      { timeLogPopup && <PopupV1 
//       title={"Enter Time Log"}
//       onClose={()=>setTimeLogPopup(false)}>
//           <form onSubmit={handleSubmit} className="time-log-form">
//             <div className="time-log-input-group">
//                 <label htmlFor="timeInput" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
//                     Log Time Duration:
//                 </label>
//                 <input
//                     id="timeInput"
//                     type="text"
//                     value={timeLogged}
//                     onChange={handleTimeLogChange}
//                     placeholder="e.g., 1d 4h 30m (1 day = 9 hours)"
//                     style={{ 
//                         border: error ? '1px solid red' : '1px solid #ccc', 
//                         padding: '10px', 
//                         width: '250px',
//                         marginRight: '10px'
//                     }}
//                 />
//                 <ButtonV1 type="primary" disabled={!timeLogged.trim()}>
//                     Log Time
//                 </ButtonV1>
//             </div>
            
//             <p style={{ 
//                 fontSize: '12px', 
//                 color: '#666', 
//                 marginTop: '5px' 
//             }}>
//                 Use 'd' for **Days** (1d = 9 hours), 'h' for **Hours**, and 'm' for **Minutes**. Example: **`1d 45m`**.
//             </p>

//             {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
//         </form>
//       </PopupV1>}
//     </div>
//   );
// };

// export default IssueDetails;



import React, { useCallback, useEffect, useState } from 'react';
import './styles/issueDetails.scss';
import { ButtonUD, ButtonV1 } from '../customFiles/customComponent/CustomButtons';
import defaultUser from"../assets/platformIcons/defaultUser.svg"
import { addStoryPointToTicket, addTimeLogForWork, assignTaskApi, changeTicketStatus, getTicketById, } from '../Redux/Actions/TicketActions/ticketAction'; 
import { useDispatch, useSelector } from 'react-redux';
import { DropDownForTicketStatus } from '../customFiles/customComponent/DropDown';
import { PopupV1 } from '../customFiles/customComponent/popups';
import { convertInputToSeconds, formatMinutesToCustomDays } from '../utillity/helper';
import { SHOW_SNACKBAR } from '../Redux/Constants/PlatformConstatnt/platformConstant';
import { GET_TICKET_UPDATED_DETAILS } from '../Redux/Constants/ticketReducerConstants';

const IssueDetails = ({task}) => {
  const dispatch = useDispatch()
  
  const { ticketDetailsChange, selectedTicket } = useSelector((state) => state.worksTicket);
  const { storyPoint, _id: ticketId, sprint: assignedSprint } = selectedTicket || {};
  
  const [timeLogged, setTimeLogged] = useState('');
  const [error, setError] = useState(null);
  const [timeLogPopup, setTimeLogPopup] = useState(false);
  const [storyPoints, setStoryPoints] = useState(storyPoint || 0);
  const [tempStoryPoints, setTempStoryPoints] = useState(storyPoint || 0);
  const [isStoryPointEdited, setIsStoryPointEdited] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(assignedSprint || null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock sprint data - replace with actual Redux state
  const [sprints, setSprints] = useState([
    { id: 'sprint-1', name: 'Sprint 23 - Nov 2025', status: 'active', startDate: '2025-11-01', endDate: '2025-11-15' },
    { id: 'sprint-2', name: 'Sprint 24 - Dec 2025', status: 'planned', startDate: '2025-12-01', endDate: '2025-12-15' },
    { id: 'sprint-3', name: 'Sprint 22 - Oct 2025', status: 'completed', startDate: '2025-10-15', endDate: '2025-10-31' },
  ]);

  const {TicketStatus:ticketStatus}=useSelector((state)=>state.keyValuePair)||{}
  const {userDetails}=useSelector((state)=>state.user);

  useEffect(()=>{
    if (task?._id) {
        dispatch(getTicketById(task._id));
    }
  },[dispatch, task?._id, ticketDetailsChange])

  useEffect(() => {
    if (selectedTicket && selectedTicket.storyPoint !== storyPoints) {
        setStoryPoints(selectedTicket.storyPoint || 0);
        setTempStoryPoints(selectedTicket.storyPoint || 0);
    }
  }, [selectedTicket?.storyPoint,selectedTicket,storyPoints]);

  useEffect(() => {
    if (selectedTicket?.sprint) {
      setSelectedSprint(selectedTicket.sprint);
    }
  }, [selectedTicket?.sprint]);

  const handleTimeLogChange = (e) => {
    let timeLog = e.target.value.trim();
    const allowedCharsRegex = /^[0-9dhms\s]*$/i; 

    if (!allowedCharsRegex.test(timeLog)) {
        setError("Invalid characters detected. Use d, h, m for units.");
        return; 
    }

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
    dispatch({type: GET_TICKET_UPDATED_DETAILS});
    setTimeLogged("");
    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        message: `Successfully added the timelog for "${selectedTicket?.type} ${selectedTicket?.sequenceNumber}"`,
        type: "success"
      }
    });
  };

  const handleStoryPointChange = (e) => {
    const value = e.target.value;
    setTempStoryPoints(value);
    setIsStoryPointEdited(value !== storyPoints.toString());
  };

  const handleSaveStoryPoint = async () => {
    if (!task?._id || tempStoryPoints === "") {
      return;
    }

    await dispatch(addStoryPointToTicket({
      point: Number(tempStoryPoints),
      userId: userDetails.id,
      ticketId: task._id
    }));

    dispatch({ type: GET_TICKET_UPDATED_DETAILS });
    setStoryPoints(tempStoryPoints);
    setIsStoryPointEdited(false);
    
    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        message: `Story points updated to ${tempStoryPoints}`,
        type: "success"
      }
    });
  };

  const handleRemoveStoryPoint = async () => {
    if (!task?._id) return;

    await dispatch(addStoryPointToTicket({
      point: 0,
      userId: userDetails.id,
      ticketId: task._id
    }));

    dispatch({ type: GET_TICKET_UPDATED_DETAILS });
    setStoryPoints(0);
    setTempStoryPoints(0);
    setIsStoryPointEdited(false);
    
    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        message: "Story points removed",
        type: "success"
      }
    });
  };

  const handleSprintChange = async (e) => {
    const sprintId = e.target.value;
    const sprint = sprints.find(s => s.id === sprintId);
    
    if (!task?._id) return;

    // Dispatch action to update sprint
    // await dispatch(updateTicketSprint({
    //   ticketId: task._id,
    //   sprintId: sprintId,
    //   userId: userDetails.id
    // }));

    setSelectedSprint(sprint);
    dispatch({ type: GET_TICKET_UPDATED_DETAILS });
    
    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        message: `Ticket moved to ${sprint?.name || 'Backlog'}`,
        type: "success"
      }
    });
  };

  const handleAssingTask = (id) => {
    if (!id || !userDetails?.id) {
      return;
    }
    dispatch(assignTaskApi(id, userDetails.id));
    dispatch({type: GET_TICKET_UPDATED_DETAILS});
  };

  const handleStatusChange = useCallback((data) => {
    if (!ticketId) {
        return;
    }
    dispatch(changeTicketStatus(ticketId, data?.newStatus));
    dispatch({type: GET_TICKET_UPDATED_DETAILS});
  }, [ticketId, dispatch]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div className={`issue-container ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Collapse Toggle Button */}
      <button className="collapse-toggle" onClick={toggleCollapse}>
        <span className="collapse-icon">{isCollapsed ? '◀' : '▶'}</span>
      </button>

      {!isCollapsed && (
        <>
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
                  {selectedTicket?.assignee !== "Unassigned" ? (
                    <div className='assignie_controll'>
                      <div className="assigne-avtar">
                        <span className="avatar">{selectedTicket?.assignee[0] ?? ""}</span>
                        <span className="user-name">{selectedTicket?.assignee ?? ""}</span>
                      </div>
                      {selectedTicket?.assignee === userDetails?.username && 
                        <ButtonUD text={"Unassigned"}/>
                      }
                    </div>
                  ) : (
                    <>
                      <img src={defaultUser} className="avatar" alt="" />
                      <span className="user-name">Unassigned</span>
                    </>
                  )}
                </div>
                {selectedTicket?.assignee !== userDetails?.username &&
                  <ButtonUD text={"Assign to me"} onClick={() => handleAssingTask(selectedTicket._id)}/>
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
          </div>

          {/* More fields */}
          <div className="more_field">
            <h3 className="section-title">More Fields</h3>
            <div className="more-field-item">
              <span className="field-label">Priority:</span>
              <span className="field-value">{selectedTicket?.priority}</span>
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
                  readOnly
                  onClick={() => setTimeLogPopup(true)}
                />
              </div>
            </div>
                  {/* Sprint Section */}
          <div className="sprint-section">
            <h3 className="section-title">Sprint</h3>
            <div className="sprint-selector">
              <select 
                className="sprint-dropdown"
                value={selectedSprint?.id || ''}
                onChange={handleSprintChange}
              >
                <option value="">No Sprint (Backlog)</option>
                {sprints
                  .sort((a, b) => {
                    if (a.status === 'active') return -1;
                    if (b.status === 'active') return 1;
                    return new Date(b.startDate) - new Date(a.startDate);
                  })
                  .map((sprint) => (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name} {sprint.status === 'active' ? '(Active)' : sprint.status === 'completed' ? '(Completed)' : ''}
                    </option>
                  ))
                }
              </select>
              {selectedSprint && (
                <div className="sprint-info">
                  <span className={`sprint-badge sprint-badge--${selectedSprint.status}`}>
                    {selectedSprint.status}
                  </span>
                  <span className="sprint-dates">
                    {new Date(selectedSprint.startDate).toLocaleDateString()} - {new Date(selectedSprint.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
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
                  value={tempStoryPoints}
                  onChange={handleStoryPointChange}
                  min="0"
                />
                {isStoryPointEdited && (
                  <div className="story-point-actions">
                    <ButtonV1 
                      type="primary" 
                      onClick={handleSaveStoryPoint}
                      className="save-button"
                    >
                      Save
                    </ButtonV1>
                    <ButtonV1 
                      type="secondary" 
                      onClick={handleRemoveStoryPoint}
                      className="remove-button"
                    >
                      Remove
                    </ButtonV1>
                  </div>
                )}
              </div>
            </div>
          </div>

          {timeLogPopup && (
            <PopupV1 
              title={"Enter Time Log"}
              onClose={() => setTimeLogPopup(false)}
            >
              <form onSubmit={handleSubmit} className="time-log-form">
                <div className="time-log-input-group">
                  <label htmlFor="timeInput">
                    Log Time Duration:
                  </label>
                  <input
                    id="timeInput"
                    type="text"
                    value={timeLogged}
                    onChange={handleTimeLogChange}
                    placeholder="e.g., 1d 4h 30m (1 day = 9 hours)"
                  />
                  <ButtonV1 type="primary" disabled={!timeLogged.trim()}>
                    Log Time
                  </ButtonV1>
                </div>
                
                <p>
                  Use 'd' for Days (1d = 9 hours), 'h' for Hours, and 'm' for Minutes. Example: 1d 45m.
                </p>

                {error && <p className="error-text">{error}</p>}
              </form>
            </PopupV1>
          )}
        </>
      )}
    </div>
  );
};

export default IssueDetails;