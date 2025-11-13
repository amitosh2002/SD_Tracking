import { SET_TICKET_STATUS, SET_TICKET_TYPE } from "../../Constants/KeyValueConstant";
import apiClient from "../../../utils/axiosConfig";

export const fetchPlatformKeyValueAction = () => async (dispatch) => {
    try {
        const response = await apiClient.get('/api/platform/key-values');
        const data = response.data;
        
        console.log("Response data:", data);
        dispatch({ type: SET_TICKET_TYPE, payload: data.ticketTypes });
        dispatch({ type: SET_TICKET_STATUS, payload: data.ticketStatuses });
        console.log("Ticket key values fetched successfully:", data);
    } catch (error) {
        console.error("Error fetching ticket key values:", error);
        // Handle token expiration or other auth errors
        if (error.response?.status === 401) {
            // Token is invalid, the axios interceptor will handle the redirect
            console.log("Authentication failed, redirecting to login");
        }
    }
};
