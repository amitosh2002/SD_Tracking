import { createReducer } from "@reduxjs/toolkit";
import { CREATE_TICKET, DELETE_TICKET, GET_ALL_TICKETS, GET_TICKET_BY_ID, OPEN_CREATE_TICKET_POPUP, UPDATE_TICKET, UPDATE_TICKET_STATUS, ADD_TICKET_TIME_LOG, ASSIGN_TICKET, SET_SELECTED_TICKET, SET_FILTERED_TICKETS, GET_TICKET_UPDATED_DETAILS, GET_ACTIVITY_LOGS_REQUEST, GET_ACTIVITY_LOGS_SUCCESS, APPEND_TICKETS, GET_SORT_KEY_VALUES_REQUEST, GET_SORT_KEY_VALUES_SUCCESS } from "../Constants/ticketReducerConstants";

const initialState = {
  tickets: { items: [], total: 0 },
  selectedTicket: null, // Add a state for a single ticket
  createPopup: false,
  filteredTickets: [], // Add a state for ,filtered tickets if needed
  filteredTicketsLenth:0,
  ticketDetailsChange:false,
  activityLogLoading:false,
  activityLogs:null,
  projects:null,
  status:null,
  sprints:null,
  users:null,
    labels:null,
    priority:null,
    ticketConvention:null,
  sortKeyValuesLoading:false,
};

export const ticketReducer = createReducer(initialState,(builder=>{
    builder
        .addCase(GET_ALL_TICKETS, (state, action) => {
            state.tickets = action.payload;
        })
        .addCase(APPEND_TICKETS, (state, action) => {
            // For cumulative limits, we can often just replace, but we deduplicate for safety
            const existingItems = state.tickets?.items || [];
            const newItems = action.payload?.items || [];
            const combinedItems = [...existingItems, ...newItems];
            const uniqueItems = Array.from(
                new Map(combinedItems.map(item => [item._id, item])).values()
            );

            state.tickets = {
                ...action.payload,
                items: uniqueItems
            };
        })
        .addCase(GET_TICKET_BY_ID, (state, action) => {
            state.selectedTicket = state.tickets.find(ticket => ticket.id === action.payload);
        })
        .addCase(CREATE_TICKET, (state, action) => {
            if (!state.tickets.items) {
                state.tickets.items = [];
            }
            state.tickets.items.push(action.payload.data);
            state.tickets.total += 1;
        })
        .addCase(UPDATE_TICKET, (state, action) => {
            const index = state.tickets.items?.findIndex(ticket => ticket._id === action.payload._id);
            if (index !== -1 && state.tickets.items) {
                state.tickets.items[index] = action.payload;
            }
             if (state.selectedTicket && state.selectedTicket._id === action.payload._id) {
                state.selectedTicket = action.payload;
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
        .addCase(GET_ACTIVITY_LOGS_REQUEST,(state)=>{
            state.activityLogLoading=true;
        })
        .addCase(GET_ACTIVITY_LOGS_SUCCESS,(state,action)=>{
            state.activityLogLoading=false;
            state.activityLogs=action.payload
        })
        .addCase(GET_SORT_KEY_VALUES_REQUEST,(state)=>{
            state.sortKeyValuesLoading=true;
        })
        .addCase(GET_SORT_KEY_VALUES_SUCCESS, (state, action) => {
            const { users, status, projects, sprints,labels,priority,ticketConvention } = action.payload;

            state.sortKeyValuesLoading = false;

            // USERS → Dropdown format
            state.users = (users || []).map(user => ({
                label: `${user?.profile?.firstName ?? ''} ${user?.profile?.lastName ?? ''}`.trim(),
                value: user._id
            }));

            // STATUS → Dropdown format
            state.status = (status || []).map(s => ({
                label: s,
                value: s
            }));

            // PROJECTS → Dropdown format
            state.projects = (projects || []).map(project => ({
                label: project.projectName,
                value: project.projectId
            }));

            // SPRINTS → Dropdown format
            state.sprints = (sprints || []).map(sprint => ({
                label: sprint.name || sprint.sprintName || sprint._id,
                value: sprint._id
            }));
            state.labels = (labels || []).map(label => ({
                label: label.name || label.labelName || label._id,
                value:  label.id || label.id || label._id
            }));
            state.priority = (priority || []).map(priority => ({
                label: priority.name || priority.priorityName || priority._id,
                value: priority.id || priority.id || priority._id
            }));
            state.ticketConvention = (ticketConvention || []).map(convention => ({
                label: convention?.suffix || convention.conventionName || convention._id,
                value: convention?.id || convention.id || convention._id,
            }));
            });

}))