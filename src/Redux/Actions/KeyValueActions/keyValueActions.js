import axios from "axios";
import {  SET_TICKET_STATUS, SET_TICKET_TYPE } from "../../Constants/KeyValueConstant";

export const fetchPlatformKeyValueAction = () => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/platform/key-values`, {
            headers: {
                'Content-Type': 'application/json',
                autherization: `Bearer ${token}`
            }
        });


        const data =  response.data;
        console.log("Response data:", data);
        dispatch({ type: SET_TICKET_TYPE, payload: data.ticketTypes });
        dispatch({ type: SET_TICKET_STATUS, payload: data.ticketStatuses });
        // dispatch({ type: 'SET_TICKET_STATUS', payload: data.statuses });
        console.log("Ticket key values fetched successfully:", data);
    } catch (error) {
        console.error("Error fetching ticket key values:", error);
    }
}
