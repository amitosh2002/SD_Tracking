// keyValueReducer.js
import { createReducer } from '@reduxjs/toolkit';
import { SET_TICKET_STATUS, SET_TICKET_TYPE } from "../Constants/KeyValueConstant";

const initialState = {
    TicketType: null,
    TicketPriority: null,
    TicketStatus: null, 
};

export const keyValueReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(SET_TICKET_TYPE, (state, action) => {
            state.TicketType = action?.payload ?? "No Data";
        })
        .addCase('SET_TICKET_PRIORITY', (state, action) => {
            state.TicketPriority = action?.payload ?? "No Data";
        })
        .addCase(SET_TICKET_STATUS, (state, action) => {
            state.TicketStatus = action?.payload ?? "No Data ticket status";
        });
});