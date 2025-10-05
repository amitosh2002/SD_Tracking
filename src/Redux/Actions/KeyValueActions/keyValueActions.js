import axios from "axios";
import {  SET_TICKET_STATUS, SET_TICKET_TYPE } from "../../Constants/KeyValueConstant";

export const fetchPlatformKeyValueAction = () => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        // Helpful debug: ensure the backend URL is what we expect
        // console.debug('VITE_BACKEND_URL=', import.meta.env.VITE_BACKEND_URL);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/platform/key-values`, {
            headers: {
                'Content-Type': 'application/json',
                // Correct header name (was misspelled as `autherization`)
                Authorization: `Bearer ${token}`
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
