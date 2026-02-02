import { createReducer } from "@reduxjs/toolkit";
import { FAIL_FETCH_USER_DETAILS, FETCH_USER_DETAILS, SUCESS_FETCH_USER_DETAILS, USER_MOST_RESCENT_TIME_LOG, USER_MOST_RESCENT_WORK, USER_TEAM_MEMBERS, USER_WORK_DETAILS, USER_WORK_DETAILS_FAIL, USER_WORK_DETAILS_LOADING } from "../Constants/PlatformConstatnt/userConstant";
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
    teamMembers:[],
    workDetailsLoading:false,
    workDetails:null,
    workDetailsFail:false,
    workDetailsErrorMessage:""
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
    .addCase(USER_WORK_DETAILS_LOADING,(state)=>{
        state.workDetailsLoading=true;
        state.workDetailsFail=false;
        state.workDetailsErrorMessage="";
    })
    .addCase(USER_WORK_DETAILS,(state,action)=>{
        state.workDetails=action.payload.workDetails;
        state.workDetailsLoading=false;
        state.workDetailsFail=false;
    })
    .addCase(USER_WORK_DETAILS_FAIL,(state,action)=>{
        state.workDetailsFail=true;
        state.workDetailsLoading=false;
        state.workDetails=null;
        state.workDetailsErrorMessage=action.payload;
    })
})