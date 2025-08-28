// import { createReducer } from "@reduxjs/toolkit";
// import { GET_OTP, REQUIRES_REGISTRATION, VERIFIED_USER_AND_LOGIN, VERIFY_OTP } from "../Constants/AuthConstants";

// const initialState = {
//   loading: false,
//     isAuthenticated: false,
//     user: null,
//     otpData:null,
//     error: null,
//     requiresRegistration:false,
//     registerData:null
// };  
// const authReducer = createReducer(initialState, (builder)=>{
//     builder
//     .addCase(GET_OTP,(state,action) =>{
//         state.otpData=action.payload;
//     })
//     .addCase(REQUIRES_REGISTRATION,(state,action) =>{
//         console.log("Setting requiresRegistration to", action.payload);
//         state.requiresRegistration=action.payload;
//     })
//     .addCase(VERIFY_OTP,(state,action) =>{
//         state.isAuthenticated=true;
//         state.user=action.payload;

//     })
//     .addCase(VERIFIED_USER_AND_LOGIN,(state,action) =>{
//         // state.isAuthenticated=true;
//         state.user=action.payload;
//         state.requiresRegistration=false;
//     })


// } ) ;
// export default authReducer;

import { createReducer } from "@reduxjs/toolkit";
import { 
  GET_OTP, 
  REQUIRES_REGISTRATION, 
  VERIFIED_USER_AND_LOGIN, 
  VERIFY_OTP,
  REGISTER_USER_SUCCESS,
  CLEAR_AUTH_STATE,
  ACCOUNT_VERIFIACTION_FAIL,
  ACCOUNT_VERIFIACTION_SUCESS
} from "../Constants/AuthConstants";

const initialState = {
  loading: false,
  isAuthenticated:!!localStorage.getItem("token"),
  user: null,
  otpData: null,
  error: null,
  requiresRegistration: false,
  registerData: null,
  verifiedEmail: null, // Store verified email for registration
};

const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(GET_OTP, (state, action) => {
      state.loading = false;
      state.otpData = action.payload;
      state.error = null;
    })
    
    .addCase(VERIFY_OTP, (state, action) => {
      state.loading = false;
      state.verifiedEmail = action.payload?.email; // Store verified email
      state.error = null;
      // Don't set isAuthenticated here - wait for registration or login
    })
    
    .addCase(REQUIRES_REGISTRATION, (state, action) => {
      console.log("Setting requiresRegistration to", action.payload);
      state.requiresRegistration = action.payload;
      state.loading = false;
      
      // If registration is not required, user should already be authenticated
      if (!action.payload) {
        state.isAuthenticated = true;
      }
    })
    .addCase(ACCOUNT_VERIFIACTION_SUCESS,(state)=>{
      state.isAuthenticated = true; // ✅ Fixed: Set authentication to true
        
    })
    .addCase(ACCOUNT_VERIFIACTION_FAIL,(state)=>{
      state.isAuthenticated = false; // ✅ Fixed: Set authentication to true
        
    })
    
    .addCase(REGISTER_USER_SUCCESS, (state, action) => {
      state.loading = false;
      state.registerData = action.payload;
      state.error = null;
      // Don't authenticate yet - wait for account verification if needed
    })
    
    .addCase(VERIFIED_USER_AND_LOGIN, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.requiresRegistration = false; // ✅ Clear registration requirement
      state.error = null;
      
      // Clear temporary data after successful login
      state.otpData = null;
      state.verifiedEmail = null;
      
      console.log("User authenticated successfully:", action.payload);
    })
    
    .addCase(CLEAR_AUTH_STATE, (state) => {
      // Reset to initial state for logout
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.otpData = null;
      state.error = null;
      state.requiresRegistration = false;
      state.registerData = null;
      state.verifiedEmail = null;
    })
    
    // Loading states
    .addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    )
    
    .addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'An error occurred';
      }
    );
});

export default authReducer;