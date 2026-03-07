import { createReducer } from "@reduxjs/toolkit";
import { FAIL_FETCH_USER_DETAILS, FETCH_USER_DETAILS, SUCESS_FETCH_USER_DETAILS, USER_MOST_RESCENT_TIME_LOG, USER_MOST_RESCENT_WORK, USER_TEAM_MEMBERS, USER_TEAM_MEMBERS_FAIL, USER_TEAM_MEMBERS_FETCH, USER_TEAM_MEMBERS_LOADING, USER_WORK_DETAILS, USER_WORK_DETAILS_FAIL, USER_WORK_DETAILS_LOADING } from "../Constants/PlatformConstatnt/userConstant";
import { UPDATE_TICKET_STATUS } from "../Constants/ticketReducerConstants";

const initialState={
    userDetails:null,
    sucessFetch:false,
    sucessFail:false,
    rescentWork:[],
    suceessFetchUserLog:false,
    totalWorkHours:0,
    currentWeektotalWorkHours:0,
    currentMonthtotalWorkHours:0,
    currentWeek:null,
    teamMembers:[],
    workDetailsLoading:false,
    workDetails:null,
    workDetailsColumns: [],
    workDetailsFail:false,
    workDetailsErrorMessage:"",
    projectTeamMembers:[],
    projectTeamMembersLoading:false,
    projectTeamMembersFail:false,
    projectTeamMembersErrorMessage:""
}


export const userReducer=createReducer(initialState,(builder)=>{
    builder
    .addCase(FETCH_USER_DETAILS,(state,action)=>{
        state.userDetails=action.payload;

    })
    .addCase(SUCESS_FETCH_USER_DETAILS,(state,action)=>{
        state.sucessFetch=action.payload;
    })
    .addCase(FAIL_FETCH_USER_DETAILS,(state,action)=>{
        state.sucessFail=action.payload;
    })
    .addCase(USER_MOST_RESCENT_WORK,(state,action)=>{
        state.rescentWork=action.payload.mostRescentWork;
    })
    .addCase(USER_MOST_RESCENT_TIME_LOG,(state,action)=>{
        state.totalWorkHours=action.payload.totalWorkHours;
        state.suceessFetchUserLog=action.payload.suceessFetchUserLog;
        state.currentWeektotalWorkHours=action.payload.currentWeektotalWorkHours;
        state.currentMonthtotalWorkHours=action.payload.currentMonthtotalWorkHours;
        state.currentWeek=action.payload.currentWeek;
    })
    .addCase(USER_TEAM_MEMBERS,(state,action)=>{
        state.teamMembers=action.payload.teamMembers;
    })
    .addCase(USER_WORK_DETAILS_LOADING,(state)=>{
        state.workDetailsLoading=true;
        state.workDetailsFail=false;
        state.workDetailsErrorMessage="";
    })
    .addCase(USER_WORK_DETAILS,(state,action)=>{
        state.workDetails=action.payload.workDetails;
        state.workDetailsColumns = action.payload.columns || [];
        state.workDetailsLoading=false;
        state.workDetailsFail=false;
    })
    .addCase(USER_WORK_DETAILS_FAIL,(state,action)=>{
        state.workDetailsFail=true;
        state.workDetailsLoading=false;
        state.workDetails=null;
        state.workDetailsErrorMessage=action.payload;
    })
    .addCase(USER_TEAM_MEMBERS_LOADING,(state)=>{
        state.projectTeamMembersLoading=true;
        state.projectTeamMembersFail=false;
        state.projectTeamMembersErrorMessage="";
    })
    .addCase(USER_TEAM_MEMBERS_FETCH,(state,action)=>{
        state.projectTeamMembers=action.payload.teamMembers;
        state.projectTeamMembersLoading=false;
        state.projectTeamMembersFail=false;
    })
    .addCase(USER_TEAM_MEMBERS_FAIL,(state,action)=>{
        state.projectTeamMembersFail=true;
        state.projectTeamMembersLoading=false;
        state.projectTeamMembers=null;
        state.projectTeamMembersErrorMessage=action.payload;
    })
    .addCase(UPDATE_TICKET_STATUS, (state, action) => {
        const { ticketId, status } = action.payload;
        
        // 1. Update in workDetails (Array of columns)
        if (Array.isArray(state.workDetails)) {
            let foundTicket = null;
            
            // Remove from current column
            state.workDetails.forEach(col => {
                const index = col.tickets?.findIndex(t => (t._id || t.id) === ticketId);
                if (index !== -1 && index !== undefined) {
                    foundTicket = { ...col.tickets[index], status };
                    col.tickets.splice(index, 1);
                }
            });

            // Add to new column
            if (foundTicket) {
                const ns = status.toUpperCase().replace(/[\s_-]/g, '');
                const targetCol = state.workDetails.find(col => 
                    (col.statusKeys || []).some(k => k.toUpperCase().replace(/[\s_-]/g, '') === ns)
                );
                
                if (targetCol) {
                    if (!targetCol.tickets) targetCol.tickets = [];
                    targetCol.tickets.unshift(foundTicket);
                } else {
                    // Fallback: put it back where it was or in first column? 
                    // Better: just find by name if statusKeys match fails
                    const targetColByName = state.workDetails.find(col => 
                        col.name.toUpperCase().replace(/[\s_-]/g, '') === ns
                    );
                    if (targetColByName) {
                        if (!targetColByName.tickets) targetColByName.tickets = [];
                        targetColByName.tickets.unshift(foundTicket);
                    }
                }
            }
        } 
        // 2. Update in workDetails (Legacy Object format)
        else if (state.workDetails && typeof state.workDetails === 'object') {
            let foundTicket = null;
            Object.keys(state.workDetails).forEach(key => {
                const list = state.workDetails[key];
                if (Array.isArray(list)) {
                    const index = list.findIndex(t => (t._id || t.id) === ticketId);
                    if (index !== -1) {
                        foundTicket = { ...list[index], status };
                        list.splice(index, 1);
                    }
                }
            });

            if (foundTicket) {
                // Simplified move for object format
                if (!state.workDetails[status]) state.workDetails[status] = [];
                state.workDetails[status].unshift(foundTicket);
            }
        }
    })
})