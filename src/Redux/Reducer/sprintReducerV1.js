import { createReducer } from "@reduxjs/toolkit";
import { GET_PROJECT_SPRINT_OVERVIEW_FAIL, GET_PROJECT_SPRINT_OVERVIEW_REQUEST, GET_PROJECT_SPRINT_OVERVIEW_SUCCESS,  SET_PROJECT_SCRUM_MAPPING_LOADING, SET_PROJECT_SCRUM_MAPPING_SUCCESS, SUCCESS_FETCH_CURRENT_TICKET_SPRINT } from "../Constants/PlatformConstatnt/sprintConstantV1";

const initalState={
    ticketSprint:null,
     loading: false,
    sprintOverview: [],
    error: null,
     scrumLoading:false,
    boardId:null,
    boardColumn:null,
    boardName:null,
    projectId:null,
    statusWorkFlow:null,
    ticketFlowTypes:null,
    statusColors:null,
    flowName:null,
    flowId:null,
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


// flowId
// : 
// "f98b6e1d-ff5a-4335-8487-95e82f530a9e"
// flowName
// : 
// "Default Scrum Flow"
// projectId
// : 
// "09d2a1bc-8615-4196-842c-fc5fc308a2fe"
// statusColors
// : 
// {OPEN: {bg: "#3b82f622", text: "#3b82f6", border: "#3b82f6"},…}
// statusWorkflow
// : 
// {OPEN: ["IN_PROGRESS", "IN_REVIEW"], IN_PROGRESS: ["OPEN", "IN_REVIEW"],…}
// ticketFlowTypes
// : 
// ["OPEN", "IN_PROGRESS", "IN_REVIEW", "CLOSED"]

.addCase(SET_PROJECT_SCRUM_MAPPING_LOADING,(state,action)=>{
    state.scrumLoading=action.payload;
})
.addCase(SET_PROJECT_SCRUM_MAPPING_SUCCESS, (state, action) => {
  const {
    source,
    projectId,
    boardId,
    flowId,
    boardName,
    columns,
    statusWorkflow,
    ticketFlowTypes,
    statusColors,
  } = action.payload;

  state.scrumLoading = false;

  // common
  state.projectId = projectId;
  state.source = source;
  state.boardName = boardName;
    // normalize columns to `boardColumn` shape expected by UI
    state.boardColumn = Array.isArray(columns)
        ? columns.map((c) => ({
                id: c.columnId || c.id || `col_${Math.random().toString(36).slice(2, 9)}`,
                name: c.name || 'Column',
                statusKeys: Array.isArray(c.statusKeys) ? c.statusKeys : [],
                color: c.color || '#6366f1',
                wipLimit: c.wipLimit ?? null,
                order: c.order ?? 0,
            }))
        : [];

    // build `statusWorkFlow` object with `statuses` array for UI
    const statuses = Array.isArray(ticketFlowTypes)
        ? ticketFlowTypes.map((key) => ({
                key,
                label: key, // could be humanized later
                color: statusColors && statusColors[key]
                    ? {
                            bg: statusColors[key].bg,
                            text: statusColors[key].text,
                            border: statusColors[key].border,
                        }
                    : { bg: '#f3f4f6', text: '#111827', border: '#9ca3af' },
            }))
        : [];

    state.statusWorkFlow = {
        statuses,
        workflow: statusWorkflow || {},
    };

    state.ticketFlowTypes = Array.isArray(ticketFlowTypes) ? ticketFlowTypes : [];
    state.statusColors = statusColors || {};

  // identifiers
  state.boardId = boardId || null;
  state.flowId = flowId || null;
    })})