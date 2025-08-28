import axios from "axios";
import {createTicketV2,assignTask} from "../../../Api/Plat/TicketsApi"

export const getAllWorkTicket = ()=>async(dispatch)=>{

    try{
        const response = await axios.get("http://localhost:8000/api/platform/v1/tickets");
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

export const createTicket =(ticketData)=>async()=>{
    const userId='68a9f7f1eda6ac5064a5d87e';
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
export const assignTaskApi = async(taskId)=>{
    const assigne = localStorage.getItem("user")

    if (!assigne) {
        console.log("user not available")
    }
    const token = localStorage.getItem("token")

    try {
        await axios.post (`${assignTask}/${taskId}/assignee`,{
            assigne
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