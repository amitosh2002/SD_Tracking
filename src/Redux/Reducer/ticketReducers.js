import { createReducer } from "@reduxjs/toolkit";
import { CREATE_TICKET, DELETE_TICKET, GET_ALL_TICKETS, GET_TICKET_BY_ID, OPEN_CREATE_TICKET_POPUP, UPDATE_TICKET, UPDATE_TICKET_STATUS, ADD_TICKET_TIME_LOG, ASSIGN_TICKET, SET_SELECTED_TICKET, SET_FILTERED_TICKETS, GET_TICKET_UPDATED_DETAILS } from "../Constants/ticketReducerConstants";

const initialState = {
  tickets: [],
  selectedTicket: null, // Add a state for a single ticket
  createPopup: false,
  filteredTickets: [], // Add a state for ,filtered tickets if needed
  filteredTicketsLenth:0,
  ticketDetailsChange:false,

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
            state.tickets.push(action.payload.data);
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
        .addCase(SET_SELECTED_TICKET, (state, action) => {
            state.selectedTicket = action.payload;
        })
        .addCase(UPDATE_TICKET_STATUS, (state, action) => {
            const { ticketId, status } = action.payload;
            const ticketIndex = state.tickets.items?.findIndex(ticket => ticket._id === ticketId);
            if (ticketIndex !== -1 && state.tickets.items) {
                state.tickets.items[ticketIndex].status = status;
            }
            // Also update selectedTicket if it's the same ticket
            if (state.selectedTicket && state.selectedTicket._id === ticketId) {
                state.selectedTicket.status = status;
            }
        })
        .addCase(ADD_TICKET_TIME_LOG, (state, action) => {
            const { ticketId, timeLog } = action.payload;
            const ticketIndex = state.tickets.items?.findIndex(ticket => ticket._id === ticketId);
            if (ticketIndex !== -1 && state.tickets.items) {
                if (!state.tickets.items[ticketIndex].timeLogs) {
                    state.tickets.items[ticketIndex].timeLogs = [];
                }
                state.tickets.items[ticketIndex].timeLogs.push(timeLog);
            }
            // Also update selectedTicket if it's the same ticket
            if (state.selectedTicket && state.selectedTicket._id === ticketId) {
                if (!state.selectedTicket.timeLogs) {
                    state.selectedTicket.timeLogs = [];
                }
                state.selectedTicket.timeLogs.push(timeLog);
            }
        })
        .addCase(ASSIGN_TICKET, (state, action) => {
            const { ticketId, assignee } = action.payload;
            const ticketIndex = state.tickets.items?.findIndex(ticket => ticket._id === ticketId);
            if (ticketIndex !== -1 && state.tickets.items) {
                state.tickets.items[ticketIndex].assignee = assignee;
            }
            // Also update selectedTicket if it's the same ticket
            if (state.selectedTicket && state.selectedTicket._id === ticketId) {
                state.selectedTicket.assignee = assignee;
            }
        })
        .addCase(SET_FILTERED_TICKETS,(state,action)=>{
            state.filteredTickets=action.payload.resultTicket;
            state.filteredTicketsLenth=action.payload.total;
        })
        .addCase(GET_TICKET_UPDATED_DETAILS,(state)=>{
            state.ticketDetailsChange=!state.ticketDetailsChange;
        })
}))