// import axios from "axios";
// import { GET_OTP, REGISTER_USER, REQUIRES_REGISTRATION, VERIFIED_USER_AND_LOGIN, VERIFY_OTP } from "../../Constants/AuthConstants";

// // Option 1: Using Axios (Recommended)
// export const getOtpAction = (email) => async (dispatch) => {
//   console.log("getOtpAction called with email:", email);
  
//   if (!email) {
//     console.log("Email is required");
//     return;
//   }

//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/api/auth/send-login-otp`,
//       { email: email }, // Data object for axios
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log("OTP Response:", response.data);
    
//     if (response.status === 200) {
//       dispatch({ type: GET_OTP, payload: response.data });
//     } else {
//       console.log("Failed to get OTP:", response.data);
//     }
//   } catch (error) {
//     console.log("Error in getOtpAction:", error.response?.data || error.message);
    
//     // Dispatch error action if needed
//     // dispatch({
//     //   type: GET_OTP_ERROR,
//     //   payload: error.response?.data?.message || "Failed to send OTP"
//     // });
//   }
// };
// // export const verifyOtpAction= (data)=>async(dispatch)=>{
// //     console.log("verifyOtpAction called with data:", data);
    

// //     if(!data?.email || !data?.otp) return;

// //     try {

// //          const response = await axios.post(
// //       `${import.meta.env.VITE_BACKEND_URL}api/auth/verify-login`,
// //       { 
// //         email: data.email, 
// //         otp: data.otp 
// //       }, // Data object - axios handles JSON conversion
// //       {
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         timeout: 10000,
// //       }
// //     );

// //         if (response.status === 200) {
// //             dispatch({type:VERIFY_OTP,payload:response.data});
// //         } else {
// //             console.log("Failed to verify OTP:", response.data);
// //         }
        
// //     } catch (error) {
// //         console.log("Error in verifyOtpAction",error); 
// //     }

// // }
// export const verifyOtpAction = (data) => {
//   return async (dispatch) => {
//     console.log("verifyOtpAction called with data:", data);
    
//     // Add more detailed logging for debugging
//     console.log("Email:", data?.email);
//     console.log("OTP:", data?.otp);
    
//     if (!data?.email || !data?.otp) {
//       console.log("Missing email or OTP, exiting early");
//       return;
//     }
    
//     console.log("Entering try block");
    
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-login`,
//         {
//           email: data.email,
//           otp: data.otp
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           timeout: 10000,
//         }
//       );
      
//       console.log("Response received:", response);
      
//       if (response.status === 200) {
//         if (response?.data?.requiresRegistration) {
//             dispatch({ type: REQUIRES_REGISTRATION, payload: true });
            
//         }
//         else{
//             dispatch({ type:REQUIRES_REGISTRATION, payload: false });
//         dispatch({ type: VERIFY_OTP, payload: response?.data?.user });

//         }
//         console.log("OTP verified successfully");
//       } else {
//         console.log("Failed to verify OTP:", response.data);
//       }
      
//     } catch (error) {
//       console.log("Error in verifyOtpAction:", error);
//       // Consider dispatching an error action here
//       // dispatch({ type: VERIFY_OTP_ERROR, payload: error.message });
//     }
//   };
// };
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
      
      // If the user is automatically verified after registration
      if (response?.data?.user) {
        dispatch({ type: VERIFIED_USER_AND_LOGIN, payload: response.data.user });
      }
    } else {
      console.log("Failed to register user:", response.data);
    }

    } catch (error) {
        console.log("Error in registerUserAction", error);
    }

}

// export const resendOtpRequest = (email) => async (dispatch) => {
//     console.log("resendOtpRequest called with email:", email);
    
//     if (!email) {
//         console.log("Email is required to resend OTP");
//         return;
//     }
    
//     try {
//         const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-verification`,
//         { email: email },
//         {
//             headers: {
//             'Content-Type': 'application/json',
//             },
//         }
//         );
    
//         console.log("Resend OTP Response:", response.data);
        
//         if (response.status === 200) {
//         dispatch({ type: GET_OTP, payload: response.data });
//         } else {
//         console.log("Failed to resend OTP:", response.data);
//         }
//     } catch (error) {
//         console.log("Error in resendOtpRequest:", error.response?.data || error.message);
        
//         // Dispatch error action if needed
//         // dispatch({
//         //   type: RESEND_OTP_ERROR,
//         //   payload: error.response?.data?.message || "Failed to resend OTP"
//         // });
//     }       
// }


// export const verifyAccountAction = (data) => {
//   return async (dispatch) => {
//     console.log("verifyOtpAction called with data:", data);
    
//     // Add more detailed logging for debugging
//     console.log("Email:", data?.email);
//     console.log("OTP:", data?.otp);
    
//     if (!data?.email || !data?.otp) {
//       console.log("Missing email or OTP, exiting early");
//       return;
//     }
    
//     console.log("Entering try block");
    
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-account`,
//         {
//           email: data.email,
//           otp: data.otp
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           timeout: 10000,
//         }
//       );
      
//       console.log("Response received:", response);
      
//       if (response.status === 200) {
//         if (response?.data?.sucess) {
//             dispatch({ type: VERIFIED_USER_AND_LOGIN, payload: response?.data?.user });
//             console.log(response?.data?.message);
            
//         }
//         else{
//             dispatch({ type:REQUIRES_REGISTRATION, payload: false });
//         dispatch({ type: VERIFY_OTP, payload: response?.data?.user });

//         }
//         console.log("OTP verified successfully");
//       } else {
//         console.log("Failed to verify OTP:", response.data);
//       }
      
//     } catch (error) {
//       console.log("Error in verifyOtpAction:", error);
//       // Consider dispatching an error action here
//       // dispatch({ type: VERIFY_OTP_ERROR, payload: error.message });
//     }
//   };
// };

import axios from "axios";
import { GET_OTP, REGISTER_USER, REQUIRES_REGISTRATION, VERIFIED_USER_AND_LOGIN, VERIFY_OTP, REGISTER_USER_SUCCESS, CLEAR_AUTH_STATE, ACCOUNT_VERIFIACTION_SUCESS, ACCOUNT_VERIFIACTION_FAIL } from "../../Constants/AuthConstants";

// Get OTP Action
export const getOtpAction = (email) => async (dispatch) => {
  console.log("getOtpAction called with email:", email);
  
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

    console.log("OTP Response:", response.data);
    
    if (response.status === 200) {
      dispatch({ type: GET_OTP, payload: response.data });
    } else {
      console.log("Failed to get OTP:", response.data);
    }
  } catch (error) {
    console.log("Error in getOtpAction:", error.response?.data || error.message);
  }
};

// Verify OTP Action - Fixed
export const verifyOtpAction = (data) => {
  return async (dispatch) => {
    console.log("verifyOtpAction called with data:", data);
    
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
      
      console.log("Response received:", response);
      
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
        }
        console.log("OTP verified successfully");
      } else {
        console.log("Failed to verify OTP:", response.data);
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
  console.log("resendOtpRequest called with email:", email);
  
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

    console.log("Resend OTP Response:", response.data);
    
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
    console.log("verifyAccountAction called with data:", data);
    
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
      
      console.log("Account verification response:", response);
      
      if (response.status === 200) {
        if (response?.data?.success) { // Fixed typo: 'sucess' -> 'success'
          // Account verified successfully - login the user

          dispatch({ type: ACCOUNT_VERIFIACTION_SUCESS,  });
          console.log(response?.data);
        } else {
          console.log("Account verification failed:", response?.data?.message);
          dispatch({ type: ACCOUNT_VERIFIACTION_FAIL,  });

        }
      } else {
        console.log("Failed to verify account:", response.data);
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

// Logout action
export const logoutAction = () => (dispatch) => {
  // Clear any stored tokens
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Clear auth state
  dispatch({ type: CLEAR_AUTH_STATE });
};