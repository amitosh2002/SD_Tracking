import { fetchInAppNotificationsUrl, getNotificationAnalyticsUrl, markAsReadNotificationUrl } from "../../../Api/Plat/notificationApi";
import apiClient from "../../../utils/axiosConfig";
import { FETCH_IN_APP_NOTIFICATIONS_FAILURE, FETCH_IN_APP_NOTIFICATIONS_REQUEST, FETCH_IN_APP_NOTIFICATIONS_SUCCESS, GET_NOTIFICATION_ANALYTICS_FAILURE, GET_NOTIFICATION_ANALYTICS_REQUEST, GET_NOTIFICATION_ANALYTICS_SUCCESS, MARK_AS_READ_NOTIFICATION_FAILURE, MARK_AS_READ_NOTIFICATION_REQUEST, MARK_AS_READ_NOTIFICATION_SUCCESS } from "../../Constants/NotificationConstants/inAppNotificationConstant";
import { SHOW_SNACKBAR } from "../../Constants/PlatformConstatnt/platformConstant";

export const getAllNotifications=()=>async(dispatch)=>{
    try {
        dispatch({type:FETCH_IN_APP_NOTIFICATIONS_REQUEST});
        const res=await apiClient.get(fetchInAppNotificationsUrl);
        if(res.data.success){
            dispatch({type:FETCH_IN_APP_NOTIFICATIONS_SUCCESS,payload:res.data.notification});
        }
        else{
            dispatch({type:FETCH_IN_APP_NOTIFICATIONS_FAILURE,payload:res.data.message});
        }
    } catch (error) {
        dispatch({type:FETCH_IN_APP_NOTIFICATIONS_FAILURE,payload:error.response.data.message});
    }
}

export const markAsReadNotification=(notificationIds)=>async(dispatch)=>{
    try {
        dispatch({type:MARK_AS_READ_NOTIFICATION_REQUEST});
        const res=await apiClient.post(markAsReadNotificationUrl,{notificationIds});
        if(res.data.success){
            dispatch({type:MARK_AS_READ_NOTIFICATION_SUCCESS});
            dispatch({
                type:SHOW_SNACKBAR,
                payload:{
                    message:"Notification marked as read successfully",
                    type:"success"
                }
            })
            dispatch(getAllNotifications());
        }
        else{
            dispatch({type:MARK_AS_READ_NOTIFICATION_FAILURE,payload:res.data.message});
            dispatch({
                type:SHOW_SNACKBAR,
                payload:{
                    message:res.data.message,
                    type:"error"
                }
            })  
        }
    } catch (error) {
        dispatch({type:MARK_AS_READ_NOTIFICATION_FAILURE,payload:error.response.data.message});
        dispatch({
            type:SHOW_SNACKBAR,
            payload:{
                message:error.response.data.message,
                type:"error"
            }
        })
    }
}

export const getNotificationAnalytics=()=>async(dispatch)=>{
    try {
        dispatch({type:GET_NOTIFICATION_ANALYTICS_REQUEST});
        const res=await apiClient.get(getNotificationAnalyticsUrl);
        if(res.data.success){
            dispatch({type:GET_NOTIFICATION_ANALYTICS_SUCCESS,payload:res.data});
        }
        else{
            dispatch({type:GET_NOTIFICATION_ANALYTICS_FAILURE,payload:res.data.message});
        }
    } catch (error) {
        dispatch({type:GET_NOTIFICATION_ANALYTICS_FAILURE,payload:error.response.data.message});
    }
}

