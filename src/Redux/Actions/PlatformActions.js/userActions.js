import { FAIL_FETCH_USER_DETAILS, FETCH_USER_DETAILS, SUCESS_FETCH_USER_DETAILS, USER_MOST_RESCENT_TIME_LOG, USER_MOST_RESCENT_WORK, USER_TEAM_MEMBERS_FAIL, USER_TEAM_MEMBERS_FETCH, USER_TEAM_MEMBERS_LOADING, USER_WORK_DETAILS, USER_WORK_DETAILS_FAIL, USER_WORK_DETAILS_LOADING } from "../../Constants/PlatformConstatnt/userConstant"
import apiClient from "../../../utils/axiosConfig"
import axios from "axios";
import { getRescentUserTimeLogApi, getRescentUserWorkApi, getUserMembers, getUserTeamMembersApi, getUserWorkDetailsApi } from "../../../Api/Plat/userPlatformApi";
import { SHOW_SNACKBAR } from "../../Constants/PlatformConstatnt/platformConstant";

export const fetchUserDetails = () => async (dispatch) => {
    try {
        const res = await apiClient.post('/api/auth/session/getUser', {
            token: localStorage.getItem("token")
        });
        
        
        if (res?.data?.success) {
            dispatch({ type: SUCESS_FETCH_USER_DETAILS, payload: res?.data?.success });
            dispatch({ type: FETCH_USER_DETAILS, payload: res?.data?.user });
        } else {
            dispatch({ type: FAIL_FETCH_USER_DETAILS, payload: true });
        }
    } catch (error) {
        console.log("Error fetching user details:", error);
        dispatch({ type: FAIL_FETCH_USER_DETAILS, payload: true });
        
        // Handle token expiration
        if (error.response?.status === 401) {
            console.log("Authentication failed, redirecting to login");
        }
    }
};


// This will can be reused for all work for user also
export const getRescentUserWork =(userId)=>async(dispatch)=>{
    if (!userId) {
        console.log("user not found")
    }
    const token = localStorage.getItem('token')
    try {
        const res = await axios.post(`${getRescentUserWorkApi}`,
            {
                userId:userId,
            },
            {
                  headers:{
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}`
                }
            }
        )
        console.log(res)
         if (res.data.success) {
                dispatch({type:USER_MOST_RESCENT_WORK,payload:{
                    mostRescentWork:res.data.data
                }})
            }
            else{
                dispatch({type:SHOW_SNACKBAR,
                    payload:{
                        type:"error",
                        message:"Someting Went Wrong"
                    }
                })
                
            }
    } catch (error) {
        console.log(error)
    }
}

// This will can be reused for all work for user also
export const getRescentUserTimeLog =(userId)=>async(dispatch)=>{
    if (!userId) {
        console.log("user not found")
    }
    const token = localStorage.getItem('token')
    try {
        const res = await axios.post(`${getRescentUserTimeLogApi}`,
            {
                userId:userId,
            },
            {
                  headers:{
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}`
                }
            }
        )
        console.log(res)
         if (res.data.success) {
                dispatch({type:USER_MOST_RESCENT_TIME_LOG,payload:{
                    totalWorkHours:res.data.totalWorkTime,
                    currentWeek:res.data.currentWeekAndMonth?.currentWeek?.dailyAggregates,
                    currentWeektotalWorkHours:res.data.currentWeekAndMonth?.currentWeek?.totalTime?.totalHours,
                    currentMonthtotalWorkHours:res.data.currentWeekAndMonth?.currentMonth?.totalTime?.totalHours,
                    suceessFetchUserLog:res.data.success
                }})
        }
            else{
                dispatch({type:SHOW_SNACKBAR,
                    payload:{
                        type:"error",
                        message:"Someting Went Wrong"
                    }
                })
                
            }
    } catch (error) {
        console.log(error)
    }
}

export const getUserTeamMembers =()=>async(dispatch)=>{

try {

    const res= await apiClient.get(getUserMembers)
    dispatch({type:"USER_ACTION_LOADING",})
    if (res.data.success) {
     dispatch({
        type:"USER_TEAM_MEMBERS",payload:{
            teamMembers:res.data.data
        }
     })   
    }
    else{
        dispatch({type:SHOW_SNACKBAR,
            payload:{
                type:"error",
                message:"Someting Went Wrong"
            }
        })
        
    }


} catch (error) {
   dispatch({type:SHOW_SNACKBAR,
            payload:{
                type:"error",
                message:error.message
            }
        })
}



}


export const getUserWorkDetails =(projectId)=>async(dispatch)=>{
    if (!projectId) {
        console.log("project not found")
    }
    try {
        const res = await apiClient.post(`${getUserWorkDetailsApi}?projectId=${projectId}`);
        dispatch({type:USER_WORK_DETAILS_LOADING,})
        if (res.data.success) {
         dispatch({
            type:USER_WORK_DETAILS,payload:{
                workDetails:res.data.data,
                columns: res.data.columns
            }
         })   
        }
        else{
            dispatch({type:USER_WORK_DETAILS_FAIL, payload: res.data.message || "Something Went Wrong"})
            dispatch({type:SHOW_SNACKBAR,
                payload:{
                    type:"error",
                    message: res.data.message || "Someting Went Wrong"
                }
            })
            
        }
    } catch (error) {
        dispatch({type:USER_WORK_DETAILS_FAIL, payload: error.response?.data?.message || error.message})
    }

}


export const getProjectTeamMembers=(projectId)=>async(dispatch)=>{
    if (!projectId) {
        console.log("project not found")
    }
    try {
        const res = await apiClient.post(`${getUserTeamMembersApi}?projectId=${projectId}`);
        dispatch({type:USER_TEAM_MEMBERS_LOADING,})
        if (res.data.success) {
         dispatch({
            type:USER_TEAM_MEMBERS_FETCH,payload:{
                teamMembers:res.data.data
            }
         })   
        }
        else{
            dispatch({type:USER_TEAM_MEMBERS_FAIL, payload: res.data.message || "Something Went Wrong"})
            dispatch({type:SHOW_SNACKBAR,
                payload:{
                    type:"error",
                    message: res.data.message || "Someting Went Wrong"
                }
            })
            
        }
    } catch (error) {
        dispatch({type:USER_WORK_DETAILS_FAIL, payload: error.response?.data?.message || error.message})
    }
}