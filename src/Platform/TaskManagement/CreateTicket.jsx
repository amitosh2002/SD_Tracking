// import React, {  useState } from 'react';
// import { PopupV1 } from '../../customFiles/customComponent/popups';
// import { DropDownV1, DropDownV2 } from '../../customFiles/customComponent/DropDown';
// import "./styles/createTicket.scss";
// import TextEditor from '../Editor';
// import { ButtonV1 } from '../../customFiles/customComponent/CustomButtons';
// import { useDispatch, useSelector } from 'react-redux';
// import { createTicket, getAllWorkTicket } from '../../Redux/Actions/TicketActions/ticketAction';
// import { IIV2Icon } from '../../customFiles/customComponent/inputContainer';
// import { OPEN_CREATE_TICKET_POPUP } from '../../Redux/Constants/ticketReducerConstants';
// import { SHOW_SNACKBAR } from '../../Redux/Constants/PlatformConstatnt/platformConstant';

// const CreateTicket = () => {
//     const dispatch = useDispatch();
//     const {userDetails}=useSelector((state)=>state.user)
//   const [ticketData, setTicketData] = useState({
//     title: "",
//     type: "BUG",
//     priority: "Medium",
//     description: ""
//   });
//   const {TicketType}=useSelector((state)=>state.keyValuePair)||{}
//   // console.log("Ticket Types from Redux:", TicketType);
//   const handleChange = (field, value) => {
//     setTicketData(prev => ({ ...prev, [field]: value }));
    
//   };

//   const handeleCreateTicket =()=>{
//     if (!ticketData.title || !ticketData.type || !ticketData.priority ) {
//          dispatch({
//                type: SHOW_SNACKBAR,
//                payload: {
//                  message: `Failed to create Ticket"`,
//                  type: "success"
//                }
//              });
//     }
//       if (ticketData ) {
//         dispatch(createTicket(ticketData,userDetails?.id))
//         // console.log(ticketData,userDetails,"data sent to backend")
//     }
//     console.log(ticketData,"ticket data")
//     dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: false  })
//     dispatch({
//       type:SHOW_SNACKBAR,
//         payload: {
//            message: `Sucessful created ticket ${ticketData?.title}"`,
//            type: "success"
//          }
//     })
//     dispatch(getAllWorkTicket())
//   }

//   return (
//     <PopupV1 title={"Create Ticket"} onClose={() => dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: false  })}>
//       <div className="ticket_name_container">
//        <div className="drop_down_container">
//          <DropDownV2
//           label="Type"
//           // defaultType={ticketData}
//           data={TicketType}
//           onChange={val => handleChange("type", val)}
//           className="ticket_type_dropdown"
//         />
//         <DropDownV1
//           label="Priority"
//           ticketTypes={["LOW", "MEDIUM", "HIGH", "CRITICAL"]}
//           defaultType={ticketData.priority}
//           onChange={val => handleChange("priority", val)}
//           className="ticket_priority_dropdown"
//         />
//        </div>
//         {/* <input
//           type="text"
//           className="ticket-input"
//           value={ticketData.title}
//           onChange={e => handleChange("title", e.target.value)}
//           placeholder="Enter the ticket name"
//         /> */}
//         <label htmlFor="input-create">Ticket name</label>
//         <IIV2Icon id="input-create" value={ticketData.title}  onChange={e => handleChange("title", e.target.value)}  placeholder="Enter the ticket name"/>
//       </div>
//       <div className="ticket-body">
//         <TextEditor
//           initialData={ticketData.description}
//           onSave={val => handleChange("description", val)}
//         />
//       </div>
//       <ButtonV1
//         text="Create Ticket"
//         type="primary"
//         onClick={ handeleCreateTicket}
//       />
//     </PopupV1>
//   );
// };

// export default CreateTicket;


import React, { useState, useEffect } from "react";
import { PopupV1 } from "../../customFiles/customComponent/popups";
import { DropDownV1, DropDownV2 } from "../../customFiles/customComponent/DropDown";
import "./styles/createTicket.scss";
import TextEditor from "../Editor";
import { ButtonV1 } from "../../customFiles/customComponent/CustomButtons";
import { useDispatch, useSelector } from "react-redux";
import { createTicket, getAllWorkTicket } from "../../Redux/Actions/TicketActions/ticketAction";
import { getAllProjects } from "../../Redux/Actions/PlatformActions.js/projectsActions";
import { useParams } from "react-router-dom";
import { IIV2Icon } from "../../customFiles/customComponent/inputContainer";
import { OPEN_CREATE_TICKET_POPUP } from "../../Redux/Constants/ticketReducerConstants";
import { SHOW_SNACKBAR } from "../../Redux/Constants/PlatformConstatnt/platformConstant";

const CreateTicket = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  const { TicketType } = useSelector((state) => state.keyValuePair) || {};
  const { projects } = useSelector((state) => state.projects || {});
  const { projectId: projectIdParam } = useParams();

  const [ticketData, setTicketData] = useState({
    title: "",
    type: "BUG",
    priority: "Medium",
    description: "",
    projectId: null,
  });

  // Load projects when component mounts
  useEffect(() => {
    if (userDetails?.id) {
      console.log('Fetching projects for user:', userDetails.id);
      dispatch(getAllProjects(userDetails.id));
    }
  }, [dispatch, userDetails?.id]);

  // 🔹 When projects load or projectIdParam changes, auto-select if available
  useEffect(() => {
    if (projectIdParam && Array.isArray(projects) && projects.length > 0) {
      const matched = projects.find(
        (p) => String(p._id) === String(projectIdParam) || String(p.projectId) === String(projectIdParam)
      );
      if (matched) {
        setTicketData((prev) => ({
          ...prev,
          // Prefer the canonical projectId (UUID) that backend expects.
          projectId: matched.projectId || matched._id,
        }));
      }
    }
  }, [projectIdParam, projects]);

  const handleChange = (field, value) => {
    console.log(`Setting ${field} to:`, value); // Debug log
    setTicketData((prev) => {
      const updated = { ...prev, [field]: value };
      console.log('Updated ticketData:', updated); // Debug log
      return updated;
    });
  };

  const handleCreateTicket = () => {
    if (!ticketData.title || !ticketData.type || !ticketData.priority) {
      return dispatch({
        type: SHOW_SNACKBAR,
        payload: { message: "Failed to create ticket", type: "error" },
      });
    }

    dispatch(createTicket(ticketData, userDetails?.id));
    dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: false });
    dispatch({
      type: SHOW_SNACKBAR,
      payload: { message: `Successfully created ticket "${ticketData.title}"`, type: "success" },
    });
    dispatch(getAllWorkTicket());
  };

  // Debug effect to log ticket data changes
  useEffect(() => {
    if (ticketData.projectId) {
      const projectFound = projects?.some(p => 
        String(p.projectId) === String(ticketData.projectId) ||
        String(p._id) === String(ticketData.projectId)
      );
      console.log('Ticket data updated:', {
        title: ticketData.title,
        type: ticketData.type,
        priority: ticketData.priority,
        projectId: ticketData.projectId,
        projectFound,
        availableProjects: projects?.map(p => ({ 
          id: p.projectId || p._id,
          name: p.name 
        }))
      });
    }
  }, [ticketData, projects]);

  return (
    <PopupV1
      title="Create Ticket"
      onClose={() => dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: false })}
    >
      <div className="ticket_name_container">
        <div className="drop_down_container">
          <DropDownV2
            label="Type"
            data={TicketType}
            onChange={(val) => handleChange("type", val)}
            className="ticket_type_dropdown"
          />

          <DropDownV1
            label="Priority"
            ticketTypes={["LOW", "MEDIUM", "HIGH", "CRITICAL"]}
            defaultType={ticketData.priority}
            onChange={(val) => handleChange("priority", val)}
            className="ticket_priority_dropdown"
          />

          {/* ✅ Project Dropdown — auto-select if from URL, else full list */}
          <div style={{ marginTop: 8 }}>
          <DropDownV2
  label="Project"
  data={Array.isArray(projects) ? projects.map(p => ({
    type: p.name || 'Unnamed Project',  // Display name
    icon: null,                         // Optional icon
    projectId: p.projectId || p._id,    // Store ID for internal use
    _id: p._id                          // Keep Mongo ID as backup
  })) : []}
  defaultType={projectIdParam ? (
    // If we have a project ID from URL, find and select that project
    projects?.find(p => 
      String(p.projectId) === String(projectIdParam) || 
      String(p._id) === String(projectIdParam)
    ) || { type: 'Loading...' }
  ) : undefined}
  onChange={(selectedProject) => {
    console.log('Project selected:', selectedProject);
    // Extract projectId from the full project object
    const projectId = selectedProject?.projectId || selectedProject?._id;
    if (projectId) {
      handleChange('projectId', projectId);
    }
  }}
  className="ticket_project_dropdown"
/>

          </div>
        </div>

        <label htmlFor="input-create">Ticket name</label>
        <IIV2Icon
          id="input-create"
          value={ticketData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter the ticket name"
        />
      </div>

      <div className="ticket-body">
        <TextEditor
          initialData={ticketData.description}
          onSave={(val) => handleChange("description", val)}
        />
      </div>

      <ButtonV1 text="Create Ticket" type="primary" onClick={handleCreateTicket} />
    </PopupV1>
  );
};

export default CreateTicket;
