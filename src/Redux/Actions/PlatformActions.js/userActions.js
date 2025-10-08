import { FAIL_FETCH_USER_DETAILS, FETCH_USER_DETAILS, SUCESS_FETCH_USER_DETAILS } from "../../Constants/PlatformConstatnt/userConstant"
import apiClient from "../../../utils/axiosConfig"

export const fetchUserDetails = () => async (dispatch) => {
    try {
        const res = await apiClient.post('/api/auth/session/getUser', {
            token: localStorage.getItem("token")
        });
        
        console.log(res, "user details");
        
        if (res?.data?.success) {
            dispatch({ type: SUCESS_FETCH_USER_DETAILS, payload: res?.data?.success });
            dispatch({ type: FETCH_USER_DETAILS, payload: res?.data?.user });
        } else {
            dispatch({ type: FAIL_FETCH_USER_DETAILS, payload: true });
        }
    } catch (error) {
        console.log("Error fetching user details:", error);
        dispatch({ type: FAIL_FETCH_USER_DETAILS, payload: true });
        
        // Handle token expiration
        if (error.response?.status === 401) {
            console.log("Authentication failed, redirecting to login");
        }
    }
};
