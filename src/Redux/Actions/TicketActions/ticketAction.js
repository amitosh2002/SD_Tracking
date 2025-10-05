import axios from "axios";
import {createTicketV2,assignTask, ticketStatusurl, tickettimelogsurl, getAllTicketApiv1} from "../../../Api/Plat/TicketsApi"

export const getAllWorkTicket = ()=>async(dispatch)=>{

    try{
        const response = await axios.get(`${getAllTicketApiv1}`);
        if(response.status === 200){
            dispatch({
                type: 'GET_ALL_TICKETS',
                payload: response.data
            });
        }
        console.log("All tickets fetched successfully:", response.data);
    }catch(error){
        console.error("Error fetching all tickets:", error);
    }

}

export const createTicket =(ticketData,userId)=>async()=>{
    if (!ticketData) {
        console.log("mo ticket found")
    }
    const token = localStorage.getItem("token")
    try {
        await axios.post(`${createTicketV2}`,
           { ...ticketData,userId:userId},
           {
            headers:{
                 'Content-Type': 'application/json',
                    // Add authorization header if needed
                   'Authorization': `Bearer ${token}`
            }
           }
        )
    } catch (error) {
        console.log(error)
        
    }


}
// api for assigning hte task
export const assignTaskApi = (taskId, userId) => async () => {
    // 💡 Dispatch a request action if you want to show a loading state
    // dispatch({ type: ASSIGN_TASK_REQUEST }); \
    console.log(userId,"fsdhsuhdu")

    const token = localStorage.getItem("token");
    
    if (!token) {
        console.error("Authorization token not found.");
        // dispatch({ type: ASSIGN_TASK_FAIL, payload: "Token missing" });
        return; 
    }

    try {
        const res = await axios.post(
            `${assignTask}/${taskId}/assignee`,
            {
                userId: userId // Correctly passes MongoDB ID in the body
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        console.log("Task assigned successfully:", res.data);
        
        // 💡 Dispatch a success action with the updated data
        // dispatch({ type: ASSIGN_TASK_SUCCESS, payload: res.data.ticket }); 

        // ❌ REMOVED: const assigne = localStorage.getItem("user") and the log, 
        // as they were unused and irrelevant here.

    } catch (error) {
        console.error("Error assigning task:", error.response?.data || error.message);
        // 💡 Dispatch a failure action
        // dispatch({ type: ASSIGN_TASK_FAIL, payload: error.response?.data?.message || error.message });
    }
};


// change the status for ticket

export const changeTicketStatus = async(ticketId,status)=>{
    // const assigne = localStorage.getItem("user")
    
    // if (!assigne) {
    //     console.log("user not available")
        
        
    // }
    console.log(ticketId,status,"njsndjs")
    const token = localStorage.getItem("token")
    // /v1/tickets/:id/status
    try {
        await axios.post (`${ticketStatusurl}/${ticketId}/status`,{
            status
        },
    {
        headers:{
             'Content-Type': 'application/json',
                    // Add authorization header if needed
                   'Authorization': `Bearer ${token}`
        }
    })

    } catch (error) {
        console.log(error)
        
    }
}

//Time log adding to ticket


export const addTimeLogForWork =(ticketId,userId,timelogged,note)=>async()=>{
        const token = localStorage.getItem('token')
    try {
        await axios.post(`${tickettimelogsurl}`,{
           ticketId: ticketId,
            loggedBy:userId,
            durationSeconds:timelogged,
            note:note
        },
         {headers:{
             'Content-Type': 'application/json',
                    // Add authorization header if needed
                   'Authorization': `Bearer ${token}`
        }},
        )   

    } catch (error) {
        console.log(error)
    }
}

export const getTicketByKey=async(key)=>{
    try {
        if (!key) {
            console.log("invalid key")
        }
        const token = localStorage.getItem('token')
          const res = await axios.get(`${getTicketByKey}/${key}`,{
                headers:{
                   'Content-Type': 'application/json',
                    // Add authorization header if needed
                   'Authorization': `Bearer ${token}`
                }
            })
        return res.data;

    } catch (error) {
        console.log(error)
        
    }
}