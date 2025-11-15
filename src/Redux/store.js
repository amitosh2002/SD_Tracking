import { configureStore,  } from "@reduxjs/toolkit";
import projectsReducer from "./Reducer/projectsReducer";
import { ticketReducer } from "./Reducer/ticketReducers";
import authReducer from "./Reducer/authReducer";
import { keyValueReducer } from "./Reducer/keyValueReducer";
import { PlatformReducer } from "./Reducer/platformReducer";
import { userReducer } from "./Reducer/userReducer";


export const store = configureStore({
  reducer: {
    // Add your reducers here
    projects:projectsReducer,
    worksTicket: ticketReducer,
    auth :authReducer,
    keyValuePair:keyValueReducer,
    platform:PlatformReducer,
    user:userReducer,

  },
});
