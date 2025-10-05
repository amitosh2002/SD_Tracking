import axios from "axios"
import { FAIL_FETCH_USER_DETAILS, FETCH_USER_DETAILS, SUCESS_FETCH_USER_DETAILS } from "../../Constants/PlatformConstatnt/userConstant"
import { fetchUserDetailsUrl } from "../../../Api/Plat/platformApi"

export const fetchUserDetails=()=>async(dispatch)=>{

    const token = localStorage.getItem("token")
    console.log(token)

    try {
        const res = await axios.post(`${fetchUserDetailsUrl}`,
            {
                token:token,
            },
           {   headers:{
             'Content-Type': 'application/json',
                    // Add authorization header if needed
                   'Authorization': `Bearer ${token}`
        }},
        
    )
    console.log(res,"user details")
    if(res?.data?.success){
           dispatch({type:SUCESS_FETCH_USER_DETAILS,payload:res?.data?.success});
           dispatch({type:FETCH_USER_DETAILS,payload:res?.data?.user})
           
       }
       dispatch({type:FAIL_FETCH_USER_DETAILS,payload:true})
    } catch (error) {
        console.log(error);
    }
}
