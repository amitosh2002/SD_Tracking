// import { getProjectSprintOverview } from "../../../../../Backend_SD/controllers/SprintController/sprintControllerV1";
import { assignSprintApi, closeSprintApi, createSprint, fetchSprintBoard, fetchSprintFlow, getAllSprint, getCurrentSprint, startSprintApi, updateSprintApi, UpdateSprintBoard, UpdateSprintFlow } from "../../../Api/Plat/sprintApi";
import apiClient from "../../../utils/axiosConfig";
import { SHOW_SNACKBAR } from "../../Constants/PlatformConstatnt/platformConstant";
import { GET_PROJECT_SPRINT_OVERVIEW_FAIL, GET_PROJECT_SPRINT_OVERVIEW_REQUEST, GET_PROJECT_SPRINT_OVERVIEW_SUCCESS, SET_PROJECT_SCRUM_MAPPING_LOADING, SET_PROJECT_SCRUM_MAPPING_SUCCESS, SUCCESS_FETCH_CURRENT_TICKET_SPRINT } from "../../Constants/PlatformConstatnt/sprintConstantV1";

export const createSprintForPartner =
  (startDate, endDate, projectId, sprintName) => async (dispatch) => {
    try {
      dispatch({ type: "LOADING_START" });

      const res = await apiClient.post(createSprint, {
        projectId,
        startDate,
        endDate,
        sprintName,
      });
      console.log(res)
      dispatch({
        type: "CREATE_SPRINT_SUCCESS",
        payload: res.data,
      });
      if (      res.status===200
            ) {
                    
                dispatch({
                  type: "SHOW_SNACKBAR",
                  payload: {
                    type: "success",
                    message: "Sprint created successfully!",
                  },
                });

                  dispatch(fetchProjectSprintOverview())
                
                  }


      return res.data; // return in case UI needs it
    } catch (error) {
      console.error("Error creating sprint:", error);

      dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          type: "error",
          message:
            error?.response?.data?.message || "Failed to create sprint.",
        },
      });

      dispatch({ type: "CREATE_SPRINT_FAILED" });
    } finally {
      dispatch({ type: "LOADING_END" });
    }
  };



// Complete sprint or deactivate sprint



export const completeSprint =(sprintId)=>async (dispatch)=>{
  try {
    if (!sprintId) {
      dispatch({
        type:SHOW_SNACKBAR,
        payload:{
          type:'error',
          message:"Sprint Id is requiree"
        }
      })
    }
      const res= await apiClient.put(
        `${closeSprintApi}/${sprintId}`,
          {
            isActive:false
          }
        )

       if (res.data.success) {
      dispatch(fetchProjectSprintOverview())

          dispatch({
        type:SHOW_SNACKBAR,
        payload:{
          type:'success',
          message:"Sprint closed Successfully !"
        }
      })
       } 
  } catch (error) {
    dispatch({
        type:SHOW_SNACKBAR,
        payload:{
          type:'error',
          message:error
        }
      })
  }
}




export const startSprintAction =(sprintId)=>async (dispatch)=>{
  try {
    if (!sprintId) {
      dispatch({
        type:SHOW_SNACKBAR,
        payload:{
          type:'error',
          message:"Sprint Id is requiree"
        }
      })
    }
      const res= await apiClient.post(
        `${startSprintApi}`,
          {
            sprintId
          }
        )

       if (res.data.success) {
      dispatch(fetchProjectSprintOverview())

          dispatch({
        type:SHOW_SNACKBAR,
        payload:{
          type:'success',
          message:"Sprint closed Successfully !"
        }
      })
       } 
  } catch (error) {
    dispatch({
        type:SHOW_SNACKBAR,
        payload:{
          type:'error',
          message:error
        }
      })
  }
}




export const updateSprintAction =(sprintId,updates)=>async (dispatch)=>{
  try {
    if (!sprintId) {
      dispatch({
        type:SHOW_SNACKBAR,
        payload:{
          type:'error',
          message:"Sprint Id is requiree"
        }
      })
    }
      const res= await apiClient.put(
        `${updateSprintApi}/${sprintId}`,
          {
            updates
          }
        )

       if (res.data.success) {
          dispatch({
        type:SHOW_SNACKBAR,
        payload:{
          type:'success',
          message:"Sprint updated Successfully !"
        }
      })
      dispatch(fetchProjectSprintOverview())
       } 
  } catch (error) {
    dispatch({
        type:SHOW_SNACKBAR,
        payload:{
          type:'error',
          message:error
        }
      })
  }
}




export const fetctCurrentProjectSprint=(projectId)=>async(dispatch)=>{

    try {
      const res = await apiClient.post(
        getCurrentSprint,
        {projectId}
      )

      if ((await res).status===200) {
        dispatch({type:SUCCESS_FETCH_CURRENT_TICKET_SPRINT,payload:{
         sprint: res.data,
        }} )
        
        console.log(res.data)
      }
    } catch (error) {
      console.log(error)
    }
}

export const assignSprintToTicket = (ticketId, sprintId) => async (dispatch) => {
  try {
    const res = await apiClient.post(
      `${assignSprintApi}/${sprintId}/sprint`,
      { ticketId }
    );
    console.log(res)
  if (res.status === 200) {  dispatch({
      type: "SHOW_SNACKBAR",
      payload: {
        type: "success",
        message: "Sprint assigned to ticket successfully",
      },
    });}

    return res.data;
  } catch (error) {
    dispatch({
      type: "SHOW_SNACKBAR",
      payload: {
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to assign sprint to ticket.",
      },
    });

    throw error;
  }
};
export const fetchProjectSprintOverview = (projectId) => async (dispatch) => {
  try {
    dispatch({ type: GET_PROJECT_SPRINT_OVERVIEW_REQUEST });

    const res = await apiClient.post(
      `${getAllSprint}`,{},
      {
        params: projectId ? { projectId } : {},
      }
    );

    dispatch({
      type: GET_PROJECT_SPRINT_OVERVIEW_SUCCESS,
      payload: res.data.projects,
    });

  } catch (error) {
    dispatch({
      type: GET_PROJECT_SPRINT_OVERVIEW_FAIL,
      payload: error?.response?.data?.message || "Failed to fetch sprint overview",
    });

    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "error",
        message:
          error?.response?.data?.message ||
          "Unable to fetch sprint overview",
      },
    });
  }
};


// flow for ticket 
// /api/sprint/configurator



export const fetchProjectScrumFlow = (projectId)=>async(dispatch)=>{

try {
    dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING,payload:true });
    console.debug('fetchProjectScrumFlow: calling', { url: fetchSprintFlow, projectId });
    const res = await apiClient.post(fetchSprintFlow, { projectId });
    if (res.status===200) {
    dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING,payload:false });
      dispatch({type:SET_PROJECT_SCRUM_MAPPING_SUCCESS,payload:res.data})
      // console.log(res.data)
    }


  } catch (error) {
    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "error",
        message:
          error?.response?.data?.message ||
          "Unable to fetch sprint overview",
      },    
    });
    console.error('fetchProjectScrumFlow error:', error?.response || error);
    dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING,payload:false });
  }

}


export const fetchProjectScrumBoard = (projectId)=>async(dispatch)=>{

try {
     dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING,payload:true });
    console.debug('fetchProjectScrumBoard: calling', { url: fetchSprintBoard, projectId });
    const res = await apiClient.post(fetchSprintBoard, { projectId });
        if (res.status===200) {
    dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING,payload:false });
      dispatch({type:SET_PROJECT_SCRUM_MAPPING_SUCCESS,payload:res.data})

      dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "success",
        message:
        "Scrum Board Loaded Sucessfully !",
      },
    });
    }

  } catch (error) {
    console.error('fetchProjectScrumBoard error:', error?.response || error);
    dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING,payload:false });
    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "error",
        message:
          error?.response?.data?.message ||
          "Unable to fetch sprint overview",
      },
    });
  }

}

export const saveProjectScrumBoard = (projectId)=>async(dispatch)=>{

try {
     dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING,payload:true });


    const res = await apiClient.post(
      `${fetchSprintBoard}`,
      {
         projectId 
      }
    );
        if (res.status===200) {
    dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING,payload:false });
      dispatch({type:SET_PROJECT_SCRUM_MAPPING_SUCCESS,payload:res.data})

      dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "success",
        message:
        "Scrum Board Loaded Sucessfully !",
      },
    });
    }

  } catch (error) {
 
    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "error",
        message:
          error?.response?.data?.message ||
          "Unable to fetch sprint overview",
      },
    });
  }

}



export const saveProjectScrumFlow = (projectId)=>async(dispatch)=>{

try {
     dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING,payload:true });


    const res = await apiClient.post(
      `${fetchSprintBoard}`,
      {
         projectId 
      }
    );
        if (res.status===200) {
    dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING,payload:false });
      dispatch({type:SET_PROJECT_SCRUM_MAPPING_SUCCESS,payload:res.data})

      dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "success",
        message:
        "Scrum Board Loaded Sucessfully !",
      },
    });
    }

  } catch (error) {
 
    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "error",
        message:
          error?.response?.data?.message ||
          "Unable to fetch sprint overview",
      },
    });
  }

}
export const updateProjectScrumFlow = (projectId,flowBody) => async (dispatch) => {
  try {
    dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING, payload: true });

    const res = await apiClient.post(`${UpdateSprintFlow}`, { projectId ,flowBody});

    if (res.status === 200) {
      dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING, payload: false });
      dispatch({ type: SET_PROJECT_SCRUM_MAPPING_SUCCESS, payload: res.data });

      // Dynamically use the message from backend, or a default fallback
      dispatch({
        type: SHOW_SNACKBAR,
        payload: {
          type: "success",
          message: res.data?.msg || "Scrum Board Updated Successfully!",
        },
      });
      //fetch the new flow of the project
      dispatch(fetchProjectScrumFlow(projectId));
      
    }
  } catch (error) {
    // Crucial: Turn off loading even if the request fails
    dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING, payload: false });

    const errorMessage = 
      error?.response?.data?.msg ||  // Matches your backend "msg" key
      error?.response?.data?.message || 
      "Unable to update scrum flow";

    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "error",
        message: errorMessage,
      },
    });
  }
};

//  saveProjectScrumBoard,
//   updateProjectScrumBoard,
//   saveProjectScrumFlow,
//   updateProjectScrumFlow

export const updateProjectScrumBoard = (projectId, boardBody) => async (dispatch) => {
  console.log('updateProjectScrumBoard: calling', { projectId, boardBody });
  let columns = boardBody.columns;

  try {
    dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING, payload: true });

    // Make the API call
    const res = await apiClient.post(`${UpdateSprintBoard}`, { projectId, columns });

    console.log('updateProjectScrumBoard: response', res);

    if (res.status === 200) {
      dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING, payload: false });

      dispatch({
        type: SHOW_SNACKBAR,
        payload: {
          type: "success",
          message: res.data?.msg || "Scrum Board Updated Successfully!",
        },
      });

      // Optionally refresh board after save
      dispatch(fetchProjectScrumBoard(projectId));
    }
  } catch (error) {
    console.error('updateProjectScrumBoard error:', error);

    dispatch({ type: SET_PROJECT_SCRUM_MAPPING_LOADING, payload: false });

    const errorMessage = 
      error?.response?.data?.msg || 
      error?.response?.data?.message || 
      "Unable to update scrum board";

    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "error",
        message: errorMessage,
      },
    });
  }
};
