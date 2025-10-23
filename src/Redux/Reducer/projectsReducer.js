import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  selectedProject: null, // Add a state for a single project
};

const projectsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('GET_ALL_PROJECTS', (state, action) => {
      // Immer allows direct mutation
      state.projects = action.payload.projects;
    })
    .addCase('GET_PROJECT_BY_ID', (state, action) => {
      // Find the project and store it in a dedicated state field
      state.selectedProject = state.projects.find(p => p.id === action.payload);
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
    });
});

export default projectsReducer;