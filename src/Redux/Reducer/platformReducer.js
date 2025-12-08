import { createReducer } from "@reduxjs/toolkit";
import { HIDE_SNACKBAR, SHOW_SNACKBAR } from "../Constants/PlatformConstatnt/platformConstant";

const initialValue = {
   message: '',
  type: 'info',
  isVisible: false,
};

export const PlatformReducer = createReducer(initialValue, (builder) => {
 
    builder
        .addCase(SHOW_SNACKBAR, (state, action) => {
            state.type= action.payload.type,
            state.message= action.payload.message,
        state.isVisible= true
        })
        .addCase(HIDE_SNACKBAR, (state, ) => {
        state.isVisible=false
        })
      
});