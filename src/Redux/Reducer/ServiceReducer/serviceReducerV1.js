import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    allHoraService: [],
    loading: false,
    currentProjectService: [],
    error: null,
};

export const serviceReducerV1 = createReducer(initialState,(builder)=>{
    builder.addCase("GET_ALL_HORA_SERVICE_SUCCESS",(state,action)=>{
        state.allHoraService = action.payload;
        state.loading=false;
        state.error=null;
    })
    builder.addCase("GET_ALL_HORA_SERVICE_FAILURE",(state,action)=>{
        state.error = action.payload;
        state.loading=false;
    })
    builder.addCase("GET_ALL_HORA_SERVICE_LOADING",(state)=>{
        state.loading = true;
    })
    builder.addCase("GET_ALL_HORA_SERVICE_LOADING_STOP",(state)=>{
        state.loading = false;
    })
    builder.addCase("GET_PROJECT_SERVICES_BY_ID_SUCCESS",(state,action)=>{
        state.currentProjectService = action.payload;
        state.loading=false;
        state.error=null;
    })
    builder.addCase("RESET_PROJECT_SERVICES",(state)=>{
        state.currentProjectService = [];
        state.loading=false;
        state.error=null;
    })
})