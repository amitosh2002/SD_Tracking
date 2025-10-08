import {createTicketV2,assignTask, ticketStatusurl, tickettimelogsurl, getAllTicketApiv1} from "../../../Api/Plat/TicketsApi"
import { UPDATE_TICKET_STATUS, ADD_TICKET_TIME_LOG, ASSIGN_TICKET, CREATE_TICKET, SET_SELECTED_TICKET } from "../../Constants/ticketReducerConstants"
import apiClient from "../../../utils/axiosConfig"

export const getAllWorkTicket = () => async (dispatch) => {
    try {
        const response = await apiClient.get(`${getAllTicketApiv1}`);
        if (response.status === 200) {
            dispatch({
                type: 'GET_ALL_TICKETS',
                payload: response.data
            });
        }
        console.log("All tickets fetched successfully:", response.data);
    } catch (error) {
        console.error("Error fetching all tickets:", error);
    }
};

export const createTicket = (ticketData, userId) => async (dispatch) => {
    if (!ticketData) {
        console.log("No ticket data found");
        return;
    }
    
    try {
        const response = await apiClient.post(`${createTicketV2}`, {
            ...ticketData,
            userId: userId
        });
        
        if (response.status === 201 || response.status === 200) {
            dispatch({
                type: CREATE_TICKET,
                payload: response.data
            });
            console.log("Ticket created successfully:", response.data);
        }
    } catch (error) {
        console.error("Error creating ticket:", error);
    }
};
// api for assigning the task
export const assignTaskApi = (taskId, userId) => async (dispatch) => {
    console.log("Assigning task:", taskId, "to user:", userId);

    try {
        const response = await apiClient.post(
            `${assignTask}/${taskId}/assignee`,
            {
                userId: userId
            }
        );

        console.log("Task assigned successfully:", response.data);
        
        // Dispatch success action to update Redux state
        dispatch({
            type: ASSIGN_TICKET,
            payload: {
                ticketId: taskId,
                assignee: response.data.assignee || userId
            }
        });

    } catch (error) {
        console.error("Error assigning task:", error.response?.data || error.message);
    }
};


// change the status for ticket
export const changeTicketStatus = (ticketId, status) => async (dispatch) => {
    console.log("Changing ticket status:", ticketId, "to:", status);
    
    try {
        const response = await apiClient.post(`${ticketStatusurl}/${ticketId}/status`, {
            status
        });

        console.log("Ticket status updated successfully:", response.data);
        
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

//Time log adding to ticket
export const addTimeLogForWork = (ticketId, userId, timelogged, note) => async (dispatch) => {
    console.log("Adding time log for ticket:", ticketId, "by user:", userId);
    
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
          const res = await axios.get(`${getTicketByKey}/${key}`,{
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