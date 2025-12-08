import { createSprint } from "../../../Api/Plat/sprintAppi";
import apiClient from "../../../utils/axiosConfig";

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


