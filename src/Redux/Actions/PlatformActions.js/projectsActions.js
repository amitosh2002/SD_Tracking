import axios from "axios";
import { FETCH_PROJECT_WITH_HIGHER_ACCESS, GET_ALL_PROJECTS, PROJECT_CONFIG_FETCH_LOADING, PROJECT_CONFIG_FETCH_SUCESS, PROJECT_MEMBERS_ERROR, PROJECT_MEMBERS_LOADING, PROJECT_MEMBERS_SUCCESS } from "../../Constants/projectConstant";
import { acceptInvitationApi, getAlluserAccessProject, getUserProjectsLogsAgg, invitationDetails, inviteUsersToProject, projectUserManageApi, ticketConfigurl, userProjectWithRights } from "../../../Api/Plat/projectApi";
import { createProjectApi, getAllTicketApiv1 } from "../../../Api/Plat/TicketsApi";
import apiClient from "../../../utils/axiosConfig";
import { SHOW_SNACKBAR } from "../../Constants/PlatformConstatnt/platformConstant";

export const getAllProjects = (userId) =>async( dispatch)=>{

    try{

        const response = await axios.post(getAlluserAccessProject,{
            userId:userId
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        console.log("Get All Projects Response:", response);
        if(response.status === 200){
            dispatch({
                type: GET_ALL_PROJECTS,
                payload: {
                    projects: response.data.projects,
                    projectCount: response.data.projectCount
                }
            });
        }
        console.log("All projects fetched successfully:", response.data);
    }catch(error){
        console.error("Error fetching all projects:", error);
    }}
export const getProjectWithHigherAccess = (userId) =>async( dispatch)=>{

    try{

        const response = await axios.post(userProjectWithRights,{
            userId:userId
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        console.log(response)
        if(response.status === 200){
         dispatch({type:FETCH_PROJECT_WITH_HIGHER_ACCESS,payload:{
          projectWithAccess:response.data.userProjectWithRights,
          sucessFetchProjects:response.data.success
         }})
        }
        console.log("All projects fetched successfully: userProjectWithRights", response.data);
    }catch(error){
        console.error("Error fetching all projects:", error);
    }
}
export const getProjectById = (projectId) => async (dispatch) => {
    try {
        const response = await axios.get(`${getAllTicketApiv1}/${projectId}`);
        if (response.status === 200) {
            dispatch({
                type: 'GET_PROJECT_BY_ID',
                payload: response.data
            });
        }
        console.log("Project fetched successfully:", response.data);
    } catch (error) {
        console.error("Error fetching project by ID:", error);
    }
}

export const createProject = (projectData,userId) => async (dispatch) => {
  try {
    if (!projectData) {
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          type: "error",
          message: "Project data is required",
        },
      });
      return;
    }

    const response = await axios.post(
      createProjectApi,
     { projectData,
      userId,},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("Create Project Response:", response);
    if (response.status !== 201) {
      dispatch({
      type: "SHOW_SNACKBAR",
      payload: {
        type: "error",
        message: "Failed to create project!",
      },

    });
    }
    // ✅ success case
    dispatch({
      type: "SHOW_SNACKBAR",
      payload: {
        type: "success",
        message: "Project created successfully!",
      },
    });

    dispatch({
      type: "CREATE_PROJECT_SUCCESS",
      payload: response.data,
    });

  } catch (error) {
    console.error("Error creating project:", error);

    dispatch({
      type: "SHOW_SNACKBAR",
      payload: {
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to create project. Please try again.",
      },
    });

    dispatch({
      type: "CREATE_PROJECT_FAILURE",
      payload: error,
    });
  }
};

export const invitationToProjet = (invitationBody) => async (dispatch) => {
  console.log("API call started:", invitationBody);

  try {
    // 1️⃣ Validate before API call
    if (!invitationBody.projectId || !invitationBody.emails || !invitationBody.invitedBy) {
      return dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          type: "error",
          message: "Missing required fields!",
        },
      });
    }

    // 2️⃣ API CALL (ALWAYS outside validation block)
    const response = await axios.post(
      inviteUsersToProject,
      invitationBody,  // FIXED
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("API RESPONSE:", response.data);

    // 3️⃣ Success SnackBar
    dispatch({
      type: "SHOW_SNACKBAR",
      payload: {
        type: "success",
        message: "Invitation sent successfully!",
      },
    });

    return response.data; // helps in awaiting
  } catch (error) {
    console.error("API ERROR:", error);

    dispatch({
      type: "SHOW_SNACKBAR",
      payload: {
        type: "error",
        message: error.response?.data?.message || "Invitation failed!",
      },
    });

    throw error; // so frontend catch works
  }
};

export const fetchInvitationDetails = (invitationBody) => async (dispatch) => {
  console.log("API call started:", invitationBody);

  try {
    // 1️⃣ Validate before API call
    if (!invitationBody.projectId ||  !invitationBody.invitedBy) {
      return dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          type: "error",
          message: "Missing required fields!",
        },
      });
    }

    // 2️⃣ API CALL (ALWAYS outside validation block)
    // Log the endpoint to ensure env var is set correctly
    console.log('Posting to invitationDetails URL:', invitationDetails);

    const response = await axios.post(
      invitationDetails,
      {
        projectId: invitationBody.projectId,
        invitedBy: invitationBody.invitedBy,
      },
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("API RESPONSE:", response.data);

    // 3️⃣ Success SnackBar (this action fetches details, so messaging updated)
    dispatch({
      type: "SHOW_SNACKBAR",
      payload: {
        type: "success",
        message: "Invitation details fetched successfully!",
      },
    });

    return response.data; // helps in awaiting
  } catch (error) {
    // Log more details for debugging (network, response, request)
    console.error("API ERROR:", error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received, request info:', error.request);
    }

    dispatch({
      type: "SHOW_SNACKBAR",
      payload: {
        type: "error",
        message: error.response?.data?.message || "Invitation failed!",
      },
    });

    throw error; // so frontend catch works
  }
};

export const acceptProjectInvitation = (invitationId) => async (dispatch) => {
  try {
    // Validate input
    if (!invitationId) {
      return dispatch({
        type: "SHOW_SNACKBAR",
        payload: { type: "error", message: "Invitation ID missing" },
      });
    }

    // 1️⃣ API call
    const response = await axios.post(
      acceptInvitationApi,
      { invitationId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    // 2️⃣ Show success message
    dispatch({
      type: "SHOW_SNACKBAR",
      payload: {
        type: "success",
        message: result.message || "Invitation accepted successfully!",
      },
    });

    // 3️⃣ Return response data for UI usage
    return result;
  } catch (error) {
    console.error("Invitation acceptance error:", error);

    const errorMsg =
      error.response?.data?.message || "Failed to accept the invitation";

    dispatch({
      type: "SHOW_SNACKBAR",
      payload: {
        type: "error",
        message: errorMsg,
      },
    });

    throw error;
  }
};


// actions/userAnalyticsActions.js

export const getUserProjectAggreation =
  (startDate, endDate) =>
  async (dispatch) => {
    try {
      // 🔄 Start loading
      dispatch({
        type: "USER_PROJECT_AGG_LOADING",
      });

      // 🔗 Build query params
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await apiClient.get(getUserProjectsLogsAgg, {
        params,
      });

      // ✅ Success
      dispatch({
        type: "USER_PROJECT_AGG_SUCCESS",
        payload: res.data.data,
      });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch project analytics";

      // ❌ Failure state
      dispatch({
        type: "USER_PROJECT_AGG_ERROR",
      });

      // 🔔 Snackbar error
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          type: "error",
          message: errorMsg,
        },
      });
    }
  };


  export const ticketConfiguratorActionV1 = (projectId, type, data) => async (dispatch) => {
    try {
        if (!projectId) {
            dispatch({
                type:SHOW_SNACKBAR,
                payload:{
                    type:"error",
                    message:"Ticket id is required"
                }
            })
        }
        // adding loading state here
           dispatch({type:PROJECT_CONFIG_FETCH_LOADING,})

        const res = await apiClient.post(`${ticketConfigurl}${projectId}/config`, { type, data });

        if (res.status === 200) {
            dispatch({
                type:PROJECT_CONFIG_FETCH_SUCESS,
                payload:res.data
            })
            dispatch({
                type: SHOW_SNACKBAR,
                payload: {
                    type: "success",
                    message: "Ticket configured successfully"
                }
            });
        }

    } catch (error) {
           dispatch({
                type: SHOW_SNACKBAR,
                payload: {
                    type: "error",
                    message: error?.response?.data?.message || "Failed to configure ticket"
                }
            });
    }
}

export const handleUsersInProjects = (projectId, action, memberIds = [], role = null) => async (dispatch) => {
    dispatch({ type: PROJECT_MEMBERS_LOADING });
    try {
        const res = await apiClient.post(`${projectUserManageApi}`, { 
            projectId, 
            action, 
            memberIds, 
            role 
        });

        if (res.data.success) {
            // For 'get' action, we store the members
            if (action.toLowerCase() === "get") {
                dispatch({
                    type: PROJECT_MEMBERS_SUCCESS,
                    payload: res.data.members || []
                });
            } else {
                // For 'update' or 'delete', we re-fetch the list to keep UI in sync
                dispatch(handleUsersInProjects(projectId, "get"));
                
                dispatch({
                    type: SHOW_SNACKBAR,
                    payload: {
                        type: "success",
                        message: res.data.msg || `${action} operation successful`
                    }
                });
            }
        }
    } catch (error) {
        dispatch({ type: PROJECT_MEMBERS_ERROR });
        dispatch({
            type: SHOW_SNACKBAR,
            payload: {
                type: "error",
                message: error?.response?.data?.msg || `Failed to ${action} users in projects`
            }
        });
    }
}