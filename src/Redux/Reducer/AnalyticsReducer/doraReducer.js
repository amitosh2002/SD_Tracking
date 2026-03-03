import { createReducer } from "@reduxjs/toolkit"
import { SPRINT_VELOCITY_FAIL, SPRINT_VELOCITY_LOADING, SPRINT_VELOCITY_SUCCESS } from "../../Constants/AnalyticsConstants/doraConstant";

const initialState={
    loading:false,
    sprintVelocityData:null,
    sprintAnalyticsData:null,
    error:null
    
}


export const doraReducerV1= createReducer(initialState,(builder)=>{
    builder
    .addCase(SPRINT_VELOCITY_LOADING,(state)=>{
        state.loading=true;
    })
    .addCase(SPRINT_VELOCITY_SUCCESS,(state,action)=>{
        const {data,analytics}=action.payload;
        state.loading=false;
        state.sprintAnalyticsData=analytics;
        state.sprintVelocityData=data;
    })
    .addCase(SPRINT_VELOCITY_FAIL,(state,action)=>{
        state.loading=false;
        state.error=action.payload;
    })
})