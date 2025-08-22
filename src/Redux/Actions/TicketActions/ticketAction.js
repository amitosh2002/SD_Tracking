import axios from "axios";

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