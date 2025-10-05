import { createReducer } from "@reduxjs/toolkit";
import { FAIL_FETCH_USER_DETAILS, FETCH_USER_DETAILS, SUCESS_FETCH_USER_DETAILS } from "../Constants/PlatformConstatnt/userConstant";
const initialState={
    userDetails:null,
    sucessFetch:false,
    sucessFail:false
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
})