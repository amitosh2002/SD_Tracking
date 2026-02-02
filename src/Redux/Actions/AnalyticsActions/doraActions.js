import { sprintVelocityApi } from "../../../Api/Plat/sprintApi";
import apiClient from "../../../utils/axiosConfig";
import { SPRINT_VELOCITY_FAIL, SPRINT_VELOCITY_LOADING, SPRINT_VELOCITY_SUCCESS } from "../../Constants/AnalyticsConstants/doraConstant";
import { SHOW_SNACKBAR } from "../../Constants/PlatformConstatnt/platformConstant";

export const getSprintVelocityAction = (projectId) => async (dispatch) => {
  try {
    dispatch({ type: SPRINT_VELOCITY_LOADING });

    const res = await apiClient.post(sprintVelocityApi, { projectId }, { timeout: 60000 });

    if (res.data.success === true) {
      dispatch({ type: SPRINT_VELOCITY_SUCCESS, payload: res.data });
    }
    console.log("res", res);
  } catch (error) {
    console.error("Sprint Velocity Error:", error);
    dispatch({
      type: SPRINT_VELOCITY_FAIL,
      payload: error?.response?.data?.message || error.message
    });
    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "error",
        message: error?.response?.data?.message || "Failed to fetch sprint analytics"
      }
    });
  }
};