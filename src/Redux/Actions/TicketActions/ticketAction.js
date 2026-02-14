import {createTicketV2,assignTask, ticketStatusurl, tickettimelogsurl, getAllTicketApiv1, ticketSearchQueryApi, addStoryPoints, ticketLogs, ticketbyKeyurl, ticketSortKeyValues, addLabelToTicket, addPriorityToTicket, getCurrentProjectSprintWork, } from "../../../Api/Plat/TicketsApi"
import { UPDATE_TICKET_STATUS, ADD_TICKET_TIME_LOG, ASSIGN_TICKET, CREATE_TICKET, SET_SELECTED_TICKET, SET_FILTERED_TICKETS, GET_ALL_TICKETS, GET_ACTIVITY_LOGS_SUCCESS, GET_ACTIVITY_LOGS_REQUEST, UPDATE_TICKET, APPEND_TICKETS, GET_SORT_KEY_VALUES_REQUEST, GET_SORT_KEY_VALUES_SUCCESS, GET_CURRENT_PROJECT_SPRINT_WORK_REQUEST, GET_CURRENT_PROJECT_SPRINT_WORK_SUCCESS } from "../../Constants/ticketReducerConstants"
import apiClient from "../../../utils/axiosConfig"
import axios from "axios";
import { SHOW_SNACKBAR } from "../../Constants/PlatformConstatnt/platformConstant";
import { getUserWorkDetails } from "../PlatformActions.js/userActions";
// import { PROJECT_CONFIG_FETCH_SUCESS } from "../../Constants/projectConstant";

export const getAllWorkTicket =
  (args = {}) =>
  async (dispatch) => {
    const { projectId, limit = 10, page = 1, type, filters, ...rest } = args;
    
    // Support both nested filters object and spread filters
    const actualFilters = filters || rest;

    const { status, project, sort, assignee, sprint, labels,priority, ticketConvention} = actualFilters;

    dispatch({ type: "GET_ALL_TICKETS_REQUEST" });

    try {
      const params = new URLSearchParams();

      if (projectId) params.append("projectId", String(projectId));
      params.append("limit", limit);
      params.append("page", page);
      if (type) params.append("type", type);

      const appendFilter = (key, val) => {
        if (Array.isArray(val)) {
          if (val.length > 0) params.append(key, val.join(","));
        } else if (val) {
          params.append(key, val);
        }
      };

      appendFilter("status", status);
      appendFilter("project", project);
      appendFilter("sort", sort);
      appendFilter("assignee", assignee);
      appendFilter("sprint", sprint);
      appendFilter("sprint", sprint);
      appendFilter("labels", labels);
      appendFilter("priority", priority);
      appendFilter("ticketConvention", ticketConvention);

      const response = await apiClient.get(
        `${getAllTicketApiv1}?${params}`
      );

      dispatch({
        type: type === "append" || page > 1 ? APPEND_TICKETS : GET_ALL_TICKETS,
        payload: response.data,
      });

      return response.data;

    } catch (error) {
      console.error("❌ Error fetching tickets:", error);
      dispatch({
        type: "GET_ALL_TICKETS_FAIL",
        payload: error.response?.data?.message || "Failed to fetch work tickets",
      });
      throw error;
    }
  };

export const createTicket = (ticketData) => async (dispatch) => {
    if (!ticketData) {
        console.log("No ticket data found");
        return;
    }
    try {
        const response = await apiClient.post(`${createTicketV2}`, {
            ...ticketData,
        });
        
        if (response.status === 201 || response.status === 200) {
            dispatch({
                type: CREATE_TICKET,
                payload: response.data
            });
            dispatch(getUserWorkDetails(ticketData?.projectId))
        }
    } catch (error) {
        console.error("Error creating ticket:", error);
    }
};
// api for assigning the task
export const assignTaskApi = (taskId) => async (dispatch) => {
    try {
        const response = await apiClient.post(
            `${assignTask}/${taskId}/assignee`,
          
        );

        // Dispatch success action to update Redux state
        dispatch({
            type: ASSIGN_TICKET,
            payload: {
                ticketId: taskId,
                assignee: response.data.assignee 
            }
        });

    } catch (error) {
        console.error("Error assigning task:", error.response?.data || error.message);
    }
};


// change the status for ticket
export const changeTicketStatus = (ticketId, status) => async (dispatch) => {
    
    try {
        await apiClient.post(`${ticketStatusurl}/${ticketId}/status`, {
            status
        });

        
        // Dispatch success action to update Redux state
        dispatch({
            type: UPDATE_TICKET_STATUS,
            payload: {
                ticketId: ticketId,
                status: status
            }
        });

    } catch (error) {
        console.error("Error updating ticket status:", error.response?.data || error.message);
    }
};

export const updateTicket = (ticketId, data) => async (dispatch) => {
    try {
        const response = await apiClient.patch(`${getAllTicketApiv1}/update/${ticketId}`, data);
        
        if (response.status === 200) {
            dispatch({
                type: UPDATE_TICKET,
                payload: response.data
            });
            dispatch({
                type: SHOW_SNACKBAR,
                payload: {
                    message: "Ticket updated successfully",
                    type: "success"
                }
            });
        }
    } catch (error) {
        console.error("Error updating ticket:", error);
        dispatch({
            type: SHOW_SNACKBAR,
            payload: {
                message: error.response?.data?.message || "Failed to update ticket",
                type: "error"
            }
        });
    }
};

//Time log adding to ticket
export const addTimeLogForWork = (ticketId, userId, timelogged, note) => async (dispatch) => {
    
    try {
        const response = await apiClient.post(`${tickettimelogsurl}`, {
            ticketId: ticketId,
            loggedBy: userId,
            durationSeconds: timelogged,
            note: note
        });

        console.log("Time log added successfully:", response.data);
        
        // Dispatch success action to update Redux state
        dispatch({
            type: ADD_TICKET_TIME_LOG,
            payload: {
                ticketId: ticketId,
                timeLog: {
                    id: response.data._id || Date.now(),
                    loggedBy: userId,
                    durationSeconds: timelogged,
                    note: note,
                    createdAt: new Date().toISOString()
                }
            }
        });

    } catch (error) {
        console.error("Error adding time log:", error.response?.data || error.message);
    }
};

export const getTicketByKey=async(key)=>{
    try {
        if (!key) {
            console.log("invalid key")
        }
        const token = localStorage.getItem('token')
          const res = await axios.get(`${ticketbyKeyurl}${key}`,{
                headers:{
                   'Content-Type': 'application/json',
                    // Add authorization header if needed
                   'Authorization': `Bearer ${token}`
                }
            })
        return res.data;

    } catch (error) {
        console.log(error)
        
    }
}

export const getTicketById = (ticketId) => async (dispatch) => {
    if (!ticketId) return;
    try {
        const res = await apiClient.get(`${getAllTicketApiv1}/${ticketId}`);
        if (res?.data) {
            dispatch({ type: SET_SELECTED_TICKET, payload: res.data });
        }
    } catch (error) {
        console.error("Error fetching ticket by id:", error);
    }
}

export const searchTicketByQuery = (searchQuery) => async(dispatch) => {
    // if(!searchQuery) return;
 try {
       const res =await apiClient.get(`${ticketSearchQueryApi}`,{//this api client automatically add token
        params: { query: searchQuery }
    })

    if(res?.data){
        dispatch({
            type:SET_FILTERED_TICKETS,
            payload:{
                resultTicket:res?.data?.resultTicket,
                total: res?.data?.resultTicket.length
            }
        })}
            } catch (error) {
                dispatch({
                    type:SHOW_SNACKBAR,
                    payload:{
                        type:"error",
                        message:error?.response?.data?.message || "Failed to fetch the data"
                    }
                })
 }

    }




export const addStoryPointToTicket =(point,userId,ticketId)=>async(dispatch)=>{
    try {
        const res = await apiClient.post(`${addStoryPoints}`,{
            userId,
            ticketId,
            storyPoint:point
        })

        if (res.status===200) {
              dispatch({
                    type:SHOW_SNACKBAR,
                    payload:{
                        type:"error",
                        message: `Added the story point:${point}`
                    }
                })
                
        }
    } catch (error) {
          dispatch({
                    type:SHOW_SNACKBAR,
                    payload:{
                        type:"error",
                        message:error?.response?.data?.message || "Failed to fetch the data"
                    }
                })
    }
}

export const getActivityLogs = (ticketId) => async (dispatch) => {
  try {
    if (!ticketId) {
      dispatch({
        type: SHOW_SNACKBAR,
        payload: {
          type: "error",
          message: "Ticket id required",
        },
      });
      return; // ✅ stop execution
    }

    dispatch({ type: GET_ACTIVITY_LOGS_REQUEST });

    const res = await apiClient.post(`${ticketLogs}`, { ticketId });

    dispatch({
      type: GET_ACTIVITY_LOGS_SUCCESS,
      payload: res.data?.logs,
    });
  } catch (error) {
    console.error("getActivityLogs error:", error);
    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "error",
        message:
          error?.response?.data?.message || "Failed to fetch activity logs",
      },
    });
  }
};

export const getSortKeyValues = () => async (dispatch) => {
    try {
      dispatch({ type: GET_SORT_KEY_VALUES_REQUEST });
      const res = await apiClient.get(`${ticketSortKeyValues}`);
      dispatch({
        type: GET_SORT_KEY_VALUES_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      console.error("getActivityLogs error:", error);
      dispatch({
        type: SHOW_SNACKBAR,
        payload: {
          type: "error",
          message:
            error?.response?.data?.message || "Failed to fetch activity logs",
        },
      });
    }
  };


export const ticketLabelActions =
  (ticketId, labelId) => async (dispatch) => {
    try {
      // ✅ Validation
      if (!ticketId || !labelId) {
        dispatch({
          type: SHOW_SNACKBAR,
          payload: {
            type: "error",
            message: "Ticket id and label id are required",
          },
        });
        return;
      }

      // ✅ API call
      const res = await apiClient.post(
        addLabelToTicket(ticketId),
        { labelId }
      );

      // ✅ Optional: update ticket in store
      dispatch({
        type: "UPDATE_TICKET",
        payload: res.data,
      });

      // ✅ Success message
      dispatch({
        type: SHOW_SNACKBAR,
        payload: {
          type: "success",
          message: "Label added to ticket",
        },
      });

    } catch (error) {
      console.error("Add label failed:", error);

      dispatch({
        type: SHOW_SNACKBAR,
        payload: {
          type: "error",
          message:
            error?.response?.data?.message ||
            "Failed to add label",
        },
      });
    }
  };

//   ========================================Ticket priority control Action===============================
export const ticketPriorityActions = (ticketId, priorityId) => async (dispatch) => {
    try {
        // ✅ Validation: Ensure both values EXIST. 
        // If either is missing, show error and stop.
        if (!ticketId || !priorityId) {
            dispatch({
                type: "SHOW_SNACKBAR",
                payload: {
                    type: "error",
                    message: "Ticket id and priority are required"
                }
            });
            return;
        }

        // Send the request to the backend
        const res = await apiClient.post(
            addPriorityToTicket(ticketId),
            { priorityId } // Sending the priority object or ID
        );

        if (res.status === 200) {
            // ✅ Update the ticket in the Redux store
            dispatch({
                type: "UPDATE_TICKET",
                payload: res.data, // Expecting the updated ticket object back
            });

            // ✅ Success Feedback
            dispatch({
                type: "SHOW_SNACKBAR",
                payload: {
                    type: "success",
                    message: "Priority updated successfully"
                }
            });
        }
    } catch (error) {
        // ✅ Handle API errors (CORS, 500, etc.)
        console.error("Priority Update Error:", error);
        dispatch({
            type: "SHOW_SNACKBAR",
            payload: {
                type: "error",
                message: error.response?.data?.message || "Failed to update priority"
            }
        });
    }
};

export const getCurrentProjectSprintWorkActions = (projectId) => async (dispatch) => {
    try {
      dispatch({ type: GET_CURRENT_PROJECT_SPRINT_WORK_REQUEST });
        const response = await apiClient.get(`${getCurrentProjectSprintWork}?projectId=${projectId}`);
        if (response.data.success) {
          dispatch({
            type: GET_CURRENT_PROJECT_SPRINT_WORK_SUCCESS,
            payload: response.data
        });
        }else{
          dispatch({
            type: GET_CURRENT_PROJECT_SPRINT_WORK_SUCCESS,
            payload: { sprintWork: [] }
        });
        }
    } catch (error) {
      dispatch({
        type: GET_CURRENT_PROJECT_SPRINT_WORK_SUCCESS,
        payload: { sprintWork: [] }
      });
      dispatch({
        type: SHOW_SNACKBAR,
        payload: {
          type: "error",
          message: error?.response?.data?.message || "Failed to fetch the data"
        }
      })
        console.error("Error fetching current project sprint work:", error);
    }
};