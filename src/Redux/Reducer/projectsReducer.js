import { createReducer } from '@reduxjs/toolkit';
import { FETCH_PROJECT_WITH_HIGHER_ACCESS, GET_ALL_PROJECTS } from '../Constants/projectConstant';

const initialState = {
  projects: [],
  selectedProject: null, // Add a state for a single project
  projectCreateSucess:false,
  projectWithAccess:null,
  sucessFetchProjects:false,
  userProjectAgg: [],
  loadingUserProjectAgg: false,
  errorUserProjectAgg: false
};

const projectsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(GET_ALL_PROJECTS, (state, action) => {
      // Immer allows direct mutation
      state.projects = action.payload.projects;
    })
    .addCase('GET_PROJECT_BY_ID', (state, action) => {
      // Store the full project object from the response
      state.selectedProject = action.payload;
    })
    .addCase('CREATE_PROJECT', (state, action) => {
      state.projects.push(action.payload);
      
    })
    .addCase('UPDATE_PROJECT', (state, action) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    })
    .addCase('DELETE_PROJECT', (state, action) => {
      // Filter returns a new array, which Immer handles
      state.projects = state.projects.filter(p => p.id !== action.payload);
    })
    .addCase('SUCESS_CREATE_PROJECT', (state) => {

      state.projectCreateSucess = true;
      // Filter returns a new array, which Immer handles
    })
    .addCase(FETCH_PROJECT_WITH_HIGHER_ACCESS, (state,action) => {
      state.projectWithAccess = action.payload.projectWithAccess;
      state.sucessFetchProjects=action.payload.sucessFetchProjects;
      
      // Filter returns a new array, which Immer handles
    })
    .addCase("USER_PROJECT_AGG_LOADING", (state) => {
      state.loadingUserProjectAgg = true;
      state.errorUserProjectAgg = false;
    })
    .addCase("USER_PROJECT_AGG_SUCCESS", (state, action) => {
      state.loadingUserProjectAgg = false;
      state.userProjectAgg = action.payload; // hierarchical data
      state.errorUserProjectAgg = false;
    })
    .addCase("USER_PROJECT_AGG_ERROR", (state) => {
      state.loadingUserProjectAgg = false;
      state.errorUserProjectAgg = true;
    });
});

export default projectsReducer;