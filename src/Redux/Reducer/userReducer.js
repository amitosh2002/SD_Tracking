import { createReducer } from "@reduxjs/toolkit";
import { FAIL_FETCH_USER_DETAILS, FETCH_USER_DETAILS, SUCESS_FETCH_USER_DETAILS, USER_MOST_RESCENT_TIME_LOG, USER_MOST_RESCENT_WORK, USER_TEAM_MEMBERS } from "../Constants/PlatformConstatnt/userConstant";
const initialState={
    userDetails:null,
    sucessFetch:false,
    sucessFail:false,
    rescentWork:[],
    suceessFetchUserLog:false,
    totalWorkHours:0,
    currentWeektotalWorkHours:0,
    currentMonthtotalWorkHours:0,
    currentWeek:null,
    teamMembers:[]
}


export const userReducer=createReducer(initialState,(builder)=>{
    builder
    .addCase(FETCH_USER_DETAILS,(state,action)=>{
        state.userDetails=action.payload;

    })
    .addCase(SUCESS_FETCH_USER_DETAILS,(state,action)=>{
        state.sucessFetch=action.payload;
    })
    .addCase(FAIL_FETCH_USER_DETAILS,(state,action)=>{
        state.sucessFail=action.payload;
    })
    .addCase(USER_MOST_RESCENT_WORK,(state,action)=>{
        state.rescentWork=action.payload.mostRescentWork;
    })
    .addCase(USER_MOST_RESCENT_TIME_LOG,(state,action)=>{
        state.totalWorkHours=action.payload.totalWorkHours;
        state.suceessFetchUserLog=action.payload.suceessFetchUserLog;
        state.currentWeektotalWorkHours=action.payload.currentWeektotalWorkHours;
        state.currentMonthtotalWorkHours=action.payload.currentMonthtotalWorkHours;
        state.currentWeek=action.payload.currentWeek;
    })
    .addCase(USER_TEAM_MEMBERS,(state,action)=>{
        state.teamMembers=action.payload.teamMembers;
    })
})