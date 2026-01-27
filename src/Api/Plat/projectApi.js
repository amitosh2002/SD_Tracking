
export const getAlluserAccessProject = `${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/user-projects`; 
export const userProjectWithRights = `${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/userProjectWithRights`; 
export const inviteUsersToProject = `${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/invite/invitaion`; 
export const invitationDetails = `${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/invite/invitation-details`; 
export const acceptInvitationApi = `${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/invite/invitation-accept`; 
export const getUserProjectsLogsAgg = `${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/user-projects/getAll`; 
export const ticketConfigurl =`${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/projects/`;// if using axiosClient do not use import from env it already imported into axiosclient
export const projectUserManageApi =`${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/projects/manage`;// if using axiosClient do not use import from env it already imported into axiosclient
