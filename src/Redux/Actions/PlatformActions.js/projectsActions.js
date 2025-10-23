import axios from "axios";
import { GET_ALL_PROJECTS } from "../../Constants/projectConstant";
import { getAlluserAccessProject } from "../../../Api/Plat/projectApi";
import { getAllTicketApiv1 } from "../../../Api/Plat/TicketsApi";

export const getAllProjects = (userId) =>async( dispatch)=>{

    try{

        const response = await axios.post(getAlluserAccessProject,{
            userId:userId
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        if(response.status === 200){
            dispatch({
                type: GET_ALL_PROJECTS,
                payload: {
                    projects: response.data.projects,
                    projectCount: response.data.projectCount
                }
            });
        }
        console.log("All projects fetched successfully:", response.data);
    }catch(error){
        console.error("Error fetching all projects:", error);
    }
}
export const getProjectById = (projectId) => async (dispatch) => {
    try {
        const response = await axios.get(`${getAllTicketApiv1}/${projectId}`);
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

