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
  ACCOUNT_VERIFIACTION_SUCESS,
  TOKEN_VALIDATION_SUCCESS,
  TOKEN_VALIDATION_FAILED,
  AUTH_LOADING
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
  ssoLoading:false,
  ssoLogin:false,
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
    .addCase(AUTH_LOADING, (state, action) => {
      state.ssoLoading = action.payload;
      state.ssoLogin = action.payload;
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
   
      .addCase(ACCOUNT_VERIFIACTION_SUCESS, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // This action should trigger the final state change and potentially 
        // receive the final verified user object and token (if not done in a separate login)
        state.isAuthenticated = true; 
        state.user = action.payload; // Assuming payload contains the verified user data and token 
        state.registerData = null; // Clear the temporary registration data
        state.verifiedEmail = null; 
    })
    
    .addCase(REGISTER_USER_SUCCESS, (state, action) => {
      state.loading = false;
      state.registerData = action.payload;
      state.error = null;
      state.isAuthenticated = false; 
      // Don't authenticate yet - wait for account verification if needed
    })
    
  .addCase(VERIFIED_USER_AND_LOGIN, (state, action) => {
        // This case is for subsequent direct login or token validation
        state.loading = false;
        state.user = action.payload;
        state.requiresRegistration = false;
        state.isAuthenticated = true; // ✅ Ensure isAuthenticated is TRUE on final login
        state.error = null;
        state.otpData = null;
        state.verifiedEmail = null;
    })
    
    .addCase(TOKEN_VALIDATION_SUCCESS, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    })
    
    .addCase(TOKEN_VALIDATION_FAILED, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
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