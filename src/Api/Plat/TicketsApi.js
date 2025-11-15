export const getAllTicketApi = `${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/projects`; 
export const getAllTicketApiv1 = `${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/tickets`; 
export const createTicketV2 = `${import.meta.env.VITE_BACKEND_URL}/api/platform/v2/tickets/create`;
export const loginAPI = `${import.meta.env.VITE_BACKEND_URL}/api/api/auth`;
export const assignTask =`${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/tickets`;
export const ticketStatusurl =`${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/tickets`;
export const tickettimelogsurl =`${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/tickets/time-log`;
export const ticketbyKeyurl =`${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/tickets/by-key/`;
export const ticketSearchQueryApi =`${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/tickets/fetch/searchTicket`;// if using axiosClient do not use import from env it already imported into axiosclient
export const createProjectApi =`${import.meta.env.VITE_BACKEND_URL}/api/platform/v1/projects`;// if using axiosClient do not use import from env it already imported into axiosclient


/*

All accessible tickets
GET /api/tickets?userId=68a9f7f1eda6ac5064a5d87e

Filtered by project
GET /api/tickets?userId=68a9f7f1eda6ac5064a5d87e&projectId=64b8f4f5f1d2c926d8e4b8c1

Filtered by status
GET /api/tickets?userId=68a9f7f1eda6ac5064a5d87e&status=open

*/