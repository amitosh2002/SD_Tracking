import { createReducer } from "@reduxjs/toolkit";
import { CREATE_TICKET, DELETE_TICKET, GET_ALL_TICKETS, GET_TICKET_BY_ID, OPEN_CREATE_TICKET_POPUP, UPDATE_TICKET } from "../Constants/ticketReducerConstants";

const initialState = {
  tickets: [],
  selectedTicket: null, // Add a state for a single ticket
  createPopup:false
};

export const ticketReducer = createReducer(initialState,(builder=>{
    builder
        .addCase(GET_ALL_TICKETS, (state, action) => {
            state.tickets = action.payload;
        })
        .addCase(GET_TICKET_BY_ID, (state, action) => {
            state.selectedTicket = state.tickets.find(ticket => ticket.id === action.payload);
        })
        .addCase(CREATE_TICKET, (state, action) => {
            state.tickets.push(action.payload);
        })
        .addCase(UPDATE_TICKET, (state, action) => {
            const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
            if (index !== -1) {
                state.tickets[index] = action.payload;
            }
        })
        .addCase(DELETE_TICKET, (state, action) => {
            state.tickets = state.tickets.filter(ticket => ticket.id !== action.payload);
        })
        .addCase(OPEN_CREATE_TICKET_POPUP, (state, action) => {
            state.createPopup = action.payload;
        })
}))