import apiClient from "../../../utils/axiosConfig";
import { SHOW_SNACKBAR } from "../../Constants/PlatformConstatnt/platformConstant";
import { 
  GET_ANALYTICS_MAPPING_FAIL, 
  GET_ANALYTICS_MAPPING_REQUEST, 
  GET_ANALYTICS_MAPPING_SUCCESS, 
  SAVE_ANALYTICS_MAPPING_FAIL, 
  SAVE_ANALYTICS_MAPPING_REQUEST, 
  SAVE_ANALYTICS_MAPPING_SUCCESS 
} from "../../Constants/PlatformConstatnt/sprintConstantV1";

/**
 * Fetch analytics mapping for a project
 */
export const fetchAnalyticsMapping = (projectId) => async (dispatch) => {
  try {
    dispatch({ type: GET_ANALYTICS_MAPPING_REQUEST });

    const res = await apiClient.get(`/api/sprint/mapping/${projectId}`);

    dispatch({
      type: GET_ANALYTICS_MAPPING_SUCCESS,
      payload: res.data.data,
      isDefault: res.data.isDefault
    });
  } catch (error) {
    dispatch({
      type: GET_ANALYTICS_MAPPING_FAIL,
      payload: error?.response?.data?.message || "Failed to fetch analytics mapping"
    });
  }
};

/**
 * Save analytics mapping for a project
 */
export const saveAnalyticsMappingAction = (projectId, mappingData) => async (dispatch) => {
  try {
    dispatch({ type: SAVE_ANALYTICS_MAPPING_REQUEST });

    const res = await apiClient.post(`/api/sprint/mapping/${projectId}`, mappingData);

    dispatch({
      type: SAVE_ANALYTICS_MAPPING_SUCCESS,
      payload: res.data.data
    });

    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "success",
        message: "Analytics mapping saved successfully!"
      }
    });

    return res.data;
  } catch (error) {
    dispatch({
      type: SAVE_ANALYTICS_MAPPING_FAIL,
      payload: error?.response?.data?.message || "Failed to save analytics mapping"
    });

    dispatch({
      type: SHOW_SNACKBAR,
      payload: {
        type: "error",
        message: error?.response?.data?.message || "Failed to save analytics mapping"
      }
    });

    return { success: false, error: error?.response?.data?.message };
  }
};
