import { configureStore,  } from "@reduxjs/toolkit";
import projectsReducer from "./Reducer/projectsReducer";
import { ticketReducer } from "./Reducer/ticketReducers";
import authReducer from "./Reducer/authReducer";


export const store = configureStore({
  reducer: {
    // Add your reducers here
    projects:projectsReducer,
    worksTicket: ticketReducer,
    auth :authReducer,

  },
});
