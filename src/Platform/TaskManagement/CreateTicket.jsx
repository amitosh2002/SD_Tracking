import React, {  useState } from 'react';
import { PopupV1 } from '../../customFiles/customComponent/popups';
import { DropDownV1, DropDownV2 } from '../../customFiles/customComponent/DropDown';
import "./styles/createTicket.scss";
import TextEditor from '../Editor';
import { ButtonV1 } from '../../customFiles/customComponent/CustomButtons';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../../Redux/Actions/TicketActions/ticketAction';
import { IIV2Icon } from '../../customFiles/customComponent/inputContainer';
import { OPEN_CREATE_TICKET_POPUP } from '../../Redux/Constants/ticketReducerConstants';

const CreateTicket = () => {
    const dispatch = useDispatch();
    const {userDetails}=useSelector((state)=>state.user)
  const [ticketData, setTicketData] = useState({
    title: "",
    type: "BUG",
    priority: "Medium",
    description: ""
  });
  const {TicketType}=useSelector((state)=>state.keyValuePair)||{}
  // console.log("Ticket Types from Redux:", TicketType);
  const handleChange = (field, value) => {
    setTicketData(prev => ({ ...prev, [field]: value }));
    
  };

  const handeleCreateTicket =()=>{
    if (!ticketData.title || !ticketData.type || !ticketData.priority ) {
        alert("Fill all details")
    }
      if (ticketData ) {
        dispatch(createTicket(ticketData,userDetails?.id))
        // console.log(ticketData,userDetails,"data sent to backend")
    }
    dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: false  })

  }

  return (
    <PopupV1 title={"Create Ticket"} onClose={() => dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: false  })}>
      <div className="ticket_name_container">
       <div className="drop_down_container">
         <DropDownV2
          label="Type"
          // defaultType={ticketData}
          data={TicketType}
          onChange={val => handleChange("type", val)}
          className="ticket_type_dropdown"
        />
        <DropDownV1
          label="Priority"
          ticketTypes={["LOW", "MEDIUM", "HIGH", "CRITICAL"]}
          defaultType={ticketData.priority}
          onChange={val => handleChange("priority", val)}
          className="ticket_priority_dropdown"
        />
       </div>
        {/* <input
          type="text"
          className="ticket-input"
          value={ticketData.title}
          onChange={e => handleChange("title", e.target.value)}
          placeholder="Enter the ticket name"
        /> */}
        <label htmlFor="input-create">Ticket name</label>
        <IIV2Icon id="input-create" value={ticketData.title}  onChange={e => handleChange("title", e.target.value)}  placeholder="Enter the ticket name"/>
      </div>
      <div className="ticket-body">
        <TextEditor
          initialData={ticketData.description}
          onSave={val => handleChange("description", val)}
        />
      </div>
      <ButtonV1
        text="Create Ticket"
        type="primary"
        onClick={ handeleCreateTicket}
      />
    </PopupV1>
  );
};

export default CreateTicket;