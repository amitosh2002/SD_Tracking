import { assignSprintApi, createSprint, getAllSprint, getCurrentSprint } from "../../../Api/Plat/sprintApi";
import apiClient from "../../../utils/axiosConfig";
import { SHOW_SNACKBAR } from "../../Constants/PlatformConstatnt/platformConstant";
import { GET_PROJECT_SPRINT_OVERVIEW_FAIL, GET_PROJECT_SPRINT_OVERVIEW_REQUEST, GET_PROJECT_SPRINT_OVERVIEW_SUCCESS, SUCCESS_FETCH_CURRENT_TICKET_SPRINT } from "../../Constants/PlatformConstatnt/sprintConstantV1";

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
      `${getAllSprint}`,
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