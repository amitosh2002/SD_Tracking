import axios from "axios";
import { getAllTicketApi } from "../../Api/Plat/TicketsApi";

export const getAllProjects = () =>async( dispatch)=>{

    try{

        const response = await axios.get(getAllTicketApi);
        if(response.status === 200){
            dispatch({
                type: 'GET_ALL_PROJECTS',
                payload: response.data
            });
        }
        console.log("All projects fetched successfully:", response.data);
    }catch(error){
        console.error("Error fetching all projects:", error);
    }
}
export const getProjectById = (projectId) => async (dispatch) => {
    try {
        const response = await axios.get(`${getAllTicketApi}/${projectId}`);
        if (response.status === 200) {
            dispatch({
                type: 'GET_PROJECT_BY_ID',
                payload: response.data
            });
        }
        console.log("Project fetched successfully:", response.data);
    } catch (error) {
        console.error("Error fetching project by ID:", error);
    }
}

