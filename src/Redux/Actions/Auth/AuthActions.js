import axios from "axios";
import { GET_OTP, REGISTER_USER, REQUIRES_REGISTRATION, VERIFIED_USER_AND_LOGIN, VERIFY_OTP, REGISTER_USER_SUCCESS, CLEAR_AUTH_STATE, ACCOUNT_VERIFIACTION_SUCESS, ACCOUNT_VERIFIACTION_FAIL, TOKEN_VALIDATION_SUCCESS, TOKEN_VALIDATION_FAILED } from "../../Constants/AuthConstants";
import apiClient from "../../../utils/axiosConfig";
import { SHOW_SNACKBAR } from "../../Constants/PlatformConstatnt/platformConstant";


export const registerUserAction = (data) => async (dispatch) => {

    if (!data?.email || !data?.firstName || !data?.password) return;
    try {

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, 
            {data: data},
           { headers: { 'Content-Type': 'application/json' }},
        );
        

        if (response.status === 201) {
      // Registration successful
      dispatch({ type: REGISTER_USER_SUCCESS, payload: response.data });
          
    } else {
      console.log("Failed to register user:", response.data);
    }

    } catch (error) {
        console.log("Error in registerUserAction", error);
    }

}

// Get OTP Action
export const getOtpAction = (email) => async (dispatch) => {
  
  if (!email) {
    console.log("Email is required");
    return;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/send-login-otp`,
      { email: email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    
    if (response.status === 200) {
      dispatch({ type: GET_OTP, payload: response.data });

    } else {
      dispatch({
        type:SHOW_SNACKBAR,
        payload:{
          type:"error",
          message:"Failed to get OTP"
        }
      })
    }
  } catch (error) {
    console.log("Error in getOtpAction:", error.response?.data || error.message);
  }
};

// Verify OTP Action - Fixed
export const verifyOtpAction = (data) => {
  return async (dispatch) => {
    
    if (!data?.email || !data?.otp) {
      console.log("Missing email or OTP, exiting early");
      return;
    }
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-login`,
        {
          email: data.email,
          otp: data.otp
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );
      
      
      if (response.status === 200) {
        if (response?.data?.requiresRegistration) {
          // User needs to register - redirect to registration
          dispatch({ type: REQUIRES_REGISTRATION, payload: true });
          dispatch({ type: VERIFY_OTP, payload: { email: data.email, verified: true } });
        } else {
          // User exists and is verified - login directly
          dispatch({ type: REQUIRES_REGISTRATION, payload: false });
          dispatch({ type: VERIFIED_USER_AND_LOGIN, payload: response?.data?.user });
       
          // After successful login/registration
          localStorage.setItem("token",  response?.data?.token);
              dispatch({
                      type: SHOW_SNACKBAR,
                      payload: {
                        message: `Sucessful login to your workplace !"`,
                        type: "success"
                      }
                    });
        }
      } else {
        // console.log("Failed to verify OTP:", response.data);
          dispatch({
        type:SHOW_SNACKBAR,
        payload:{
          type:"error",
          message:"Failed to verify OTP"
        }
      })
      }
      
    } catch (error) {
      console.log("Error in verifyOtpAction:", error);
    }
  };
};

// Register User Action - Fixed
// export const registerUserAction = (userData) => async (dispatch) => {
//   console.log("registerUserAction called with:", userData);

//   if (!userData?.email || !userData?.firstName || !userData?.password) {
//     console.log("Missing required registration data");
//     return;
//   }

//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, 
//       {userData: userData}, // Send userData directly, not wrapped in {data: userData}
//       { 
//         headers: { 'Content-Type': 'application/json' }
//       }
//     );
    
//     console.log("Registration Response:", response.data);

//     if (response.status === 201) {
//       // Registration successful
//       dispatch({ type: REGISTER_USER_SUCCESS, payload: response.data });
      
//       // If the user is automatically verified after registration
//       if (response?.data?.user) {
//         dispatch({ type: VERIFIED_USER_AND_LOGIN, payload: response.data.user });
//       }
//     } else {
//       console.log("Failed to register user:", response.data);
//     }

//   } catch (error) {
//     console.log("Error in registerUserAction:", error.response?.data || error.message);
//   }
// };

// Resend OTP Action
export const resendOtpRequest = (email) => async (dispatch) => {
  
  if (!email) {
    console.log("Email is required to resend OTP");
    return;
  }
  
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-verification`,
      { email: email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    dispatch({
      type:SHOW_SNACKBAR,
      payload:{
        type:"success",
        message:`Otp is sent to ${email} `
      }
    })
    
    if (response.status === 200) {
      dispatch({ type: GET_OTP, payload: response.data });
    } else {
      console.log("Failed to resend OTP:", response.data);
    }
  } catch (error) {
    console.log("Error in resendOtpRequest:", error.response?.data || error.message);
  }       
};

// Verify Account Action - Fixed
export const verifyAccountAction = (data) => {
  return async (dispatch) => {
    
    if (!data?.email || !data?.otp) {
      console.log("Missing email or OTP, exiting early");
      return;
    }
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-account`,
        {
          email: data.email,
          otp: data.otp
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );
      
      
      if (response.status === 200) {
        if (response?.data?.success) { // Fixed typo: 'sucess' -> 'success'
          // Account verified successfully - login the user

          dispatch({ type: ACCOUNT_VERIFIACTION_SUCESS,  });
          console.log(response?.data);
          localStorage.setItem('token',response?.data?.token)
            dispatch({ type: VERIFIED_USER_AND_LOGIN, payload:response?.data?.user });
              dispatch({
                type:SHOW_SNACKBAR,
                payload:{
                  type:"success",
                  message:`Sucessfully Onborded to Hora `
                }
              })
        } else {
          dispatch({ type: ACCOUNT_VERIFIACTION_FAIL,  });

        }
      } else {
       dispatch({
                type:SHOW_SNACKBAR,
                payload:{
                  type:"error",
                  message:`Failed to verify account `
                }
              })
      }
      
    } catch (error) {
      console.log("Error in verifyAccountAction:", error);
    }
  };
};

// Clear auth state action (useful for logout)
export const clearAuthState = () => (dispatch) => {
  dispatch({ type: CLEAR_AUTH_STATE });
};

// Token validation action
export const validateTokenAction = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    dispatch({ type: TOKEN_VALIDATION_FAILED });
    return false;
  }

  try {
    const response = await apiClient.post('/api/auth/validate-token', {
      token: token
    });
    
    if (response.data.success) {
      dispatch({ type: TOKEN_VALIDATION_SUCCESS, payload: response.data.user });
      return true;
    } else {
      dispatch({ type: TOKEN_VALIDATION_FAILED });
      return false;
    }
  } catch (error) {
    dispatch({ type: TOKEN_VALIDATION_FAILED });
    console.log(error)
    return false;
  }
};

// Initialize auth state from localStorage
export const initializeAuthAction = () => (dispatch) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Validate the token
    dispatch(validateTokenAction());
  } else {
    dispatch({ type: TOKEN_VALIDATION_FAILED });
  }
};

// Logout action
export const logoutAction = () => async(dispatch) => {
  try {
    // Try to logout from server if token exists
    const token = localStorage.getItem('token');
    if (token) {
      await apiClient.post('/api/auth/logout');
    }
  } catch (error) {
    console.log('Logout error:', error);
  } finally {
    // Always clear local storage and state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: CLEAR_AUTH_STATE });
  }
};


