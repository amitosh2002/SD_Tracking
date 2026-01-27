import { 
  GET_ANALYTICS_MAPPING_FAIL, 
  GET_ANALYTICS_MAPPING_REQUEST, 
  GET_ANALYTICS_MAPPING_SUCCESS, 
  SAVE_ANALYTICS_MAPPING_FAIL, 
  SAVE_ANALYTICS_MAPPING_REQUEST, 
  SAVE_ANALYTICS_MAPPING_SUCCESS 
} from "../../Constants/PlatformConstatnt/sprintConstantV1";

const initialState = {
  loading: false,
  mapping: null,
  error: null,
  isDefault: true
};

export const analyticsMappingReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ANALYTICS_MAPPING_REQUEST:
    case SAVE_ANALYTICS_MAPPING_REQUEST:
      return {
        ...state,
        loading: true
      };

    case GET_ANALYTICS_MAPPING_SUCCESS:
      return {
        ...state,
        loading: false,
        mapping: action.payload,
        isDefault: action.isDefault,
        error: null
      };

    case SAVE_ANALYTICS_MAPPING_SUCCESS:
      return {
        ...state,
        loading: false,
        mapping: action.payload,
        isDefault: false,
        error: null
      };

    case GET_ANALYTICS_MAPPING_FAIL:
    case SAVE_ANALYTICS_MAPPING_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};
