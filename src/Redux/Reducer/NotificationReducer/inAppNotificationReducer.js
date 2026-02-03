
import {createReducer} from "@reduxjs/toolkit";
import { FETCH_IN_APP_NOTIFICATIONS_FAILURE, FETCH_IN_APP_NOTIFICATIONS_REQUEST, FETCH_IN_APP_NOTIFICATIONS_SUCCESS, GET_NOTIFICATION_ANALYTICS_FAILURE, GET_NOTIFICATION_ANALYTICS_REQUEST, GET_NOTIFICATION_ANALYTICS_SUCCESS, MARK_AS_READ_NOTIFICATION_FAILURE, MARK_AS_READ_NOTIFICATION_REQUEST, MARK_AS_READ_NOTIFICATION_SUCCESS } from "../../Constants/NotificationConstants/inAppNotificationConstant";

const initialState = {
    loading: false,
    inAppNotifications: [],
    error: null,
    markNotificationSuccess:false,
    notificationAnalytics:[],
    totalNotifications:0,
    unreadNotifications:0,
    readNotifications:0,
}


export const inAppNotificationReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(FETCH_IN_APP_NOTIFICATIONS_REQUEST, (state) => {
            state.loading = true;
        })
        .addCase(FETCH_IN_APP_NOTIFICATIONS_SUCCESS, (state, action) => {
            state.loading = false;
            state.inAppNotifications = action.payload;
        })
        .addCase(FETCH_IN_APP_NOTIFICATIONS_FAILURE, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(MARK_AS_READ_NOTIFICATION_REQUEST, (state) => {
            state.loading = true;
            state.markNotificationSuccess = false;
        })
        .addCase(MARK_AS_READ_NOTIFICATION_SUCCESS, (state ) => {
            state.loading = false;
            state.markNotificationSuccess = true;
        })
        .addCase(MARK_AS_READ_NOTIFICATION_FAILURE, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(GET_NOTIFICATION_ANALYTICS_REQUEST, (state) => {
            state.loading = true;
        })
        .addCase(GET_NOTIFICATION_ANALYTICS_SUCCESS, (state, action) => {
            state.loading = false;
            const {analytics,totalNotifications,unreadNotifications,readNotifications}=action.payload;
            state.notificationAnalytics = analytics;
            state.totalNotifications = totalNotifications;
            state.unreadNotifications = unreadNotifications;
            state.readNotifications = readNotifications;
        })
        .addCase(GET_NOTIFICATION_ANALYTICS_FAILURE, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
});
