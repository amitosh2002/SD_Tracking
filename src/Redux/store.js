import { configureStore,  } from "@reduxjs/toolkit";
import projectsReducer from "./Reducer/projectsReducer";
import { ticketReducer } from "./Reducer/ticketReducers";
import authReducer from "./Reducer/authReducer";
import { keyValueReducer } from "./Reducer/keyValueReducer";
import { PlatformReducer } from "./Reducer/platformReducer";
import { userReducer } from "./Reducer/userReducer";
import { sprintReducerV1 } from "./Reducer/sprintReducerV1";
import { analyticsMappingReducer } from "./Reducer/AnalyticsReducer/analyticsMappingReducer";
import { serviceReducerV1 } from "./Reducer/ServiceReducer/serviceReducerV1";
import { doraReducerV1 } from "./Reducer/AnalyticsReducer/doraReducer";


export const store = configureStore({
  reducer: {
    // Add your reducers here
    projects:projectsReducer,
    worksTicket: ticketReducer,
    auth :authReducer,
    keyValuePair:keyValueReducer,
    platform:PlatformReducer,
    user:userReducer,
    sprint:sprintReducerV1,
    analyticsMapping: analyticsMappingReducer,
    serviceV1:serviceReducerV1,
    doraV1:doraReducerV1

  },
  devTools: process.env.NODE_ENV !== "DEVELOPMENT",
});
