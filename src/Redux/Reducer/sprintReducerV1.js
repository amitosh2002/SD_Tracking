import { createReducer } from "@reduxjs/toolkit";
import { GET_PROJECT_SPRINT_OVERVIEW_FAIL, GET_PROJECT_SPRINT_OVERVIEW_REQUEST, GET_PROJECT_SPRINT_OVERVIEW_SUCCESS, SUCCESS_FETCH_CURRENT_TICKET_SPRINT } from "../Constants/PlatformConstatnt/sprintConstantV1";

const initalState={
    ticketSprint:null,
     loading: false,
    sprintOverview: [],
    error: null,
}

export const sprintReducerV1=createReducer(initalState,(builder)=>{
builder
.addCase(SUCCESS_FETCH_CURRENT_TICKET_SPRINT,(state,action)=>{
    // action.payload may be { sprint: <object> } or the sprint object directly.
    // Normalise to store the sprint object on state.ticketSprint so UI consumers
    // (e.g., `refactorSprintData`) receive the expected shape.
    state.ticketSprint = action.payload?.sprint ?? action.payload;
})
.addCase(GET_PROJECT_SPRINT_OVERVIEW_REQUEST,(state)=>{
    state.loading = true
})
.addCase(GET_PROJECT_SPRINT_OVERVIEW_SUCCESS,(state,action)=>{
    state.loading = false,
    state.sprintOverview= action.payload,
    state.error=null
})
.addCase(GET_PROJECT_SPRINT_OVERVIEW_FAIL,(state,action)=>{
    state.loading = false,
    state.sprintOverview= [],
    state.error=action.payload
})



})