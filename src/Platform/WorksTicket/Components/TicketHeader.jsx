import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CustomDropDownV3 } from '../../../customFiles/customComponent/DropDown';
// import { getAllTicketApiv1 } from '../../../Api/Plat/TicketsApi';
import { SHOW_SNACKBAR } from '../../../Redux/Constants/PlatformConstatnt/platformConstant';
import { GET_TICKET_UPDATED_DETAILS } from '../../../Redux/Constants/ticketReducerConstants';
import './TicketHeader.scss';
import apiClient from '../../../utils/axiosConfig';
import { getAllTicketApiv1 } from '../../../Api/Plat/TicketsApi';
import { ArrowLeft } from 'lucide-react';

const TicketHeader = ({ task }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);

  // Fetch potential parent tickets from the same project
  useEffect(() => {
    const fetchTickets = async () => {
      if (!task?.projectId) return;
      try {
        const res = await apiClient.get(`${getAllTicketApiv1}`, {
          params: { project: task.projectId, limit: 100 }
        });
        if (res.data?.items) {
          const fetchedOptions = res.data.items
            .filter(t => t._id !== task._id)
            .map(t => ({
              label: t.ticketKey,
              value: t._id,
              fullLabel: `${t.ticketKey} - ${t.title}`
            }));
          setOptions(fetchedOptions);
        }
      } catch (err) {
        console.error("Error fetching tickets for parent selection:", err);
      }
    };
    fetchTickets();
  }, [task?.projectId, task?._id]);

  const handleParentChange = async (parentId) => {
    try {
      const res = await apiClient.patch(`${getAllTicketApiv1}/update/${task._id}`, {
        parentTicket: parentId
      });
      if (res.status === 200) {
        dispatch({ type: GET_TICKET_UPDATED_DETAILS });
        dispatch({
          type: SHOW_SNACKBAR,
          payload: { message: "Parent ticket updated successfully", type: "success" }
        });
      }
    } catch (err) {
      console.error("Failed to update parent ticket:", err);
      dispatch({
        type: SHOW_SNACKBAR,
        payload: { message: "Failed to update parent ticket", type: "error" }
      });
    }
  };

  return (
    <div className="ticket-breadcrumb-header">
      <div className="breadcrumb-path">
           <p className=""style={{textAlign:"center",cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",}} onClick={()=>navigate(-1)}>
            <ArrowLeft size={18} />
        
          </p>
        <span className="project-node" onClick={() => navigate(`/workspace/${task.projectId}/insight`)}>
          {task.projectName || 'Project'}
        </span>
        <span className="breadcrumb-separator">/</span>
        <div className="parent-node">
          <CustomDropDownV3
            value={task.parentTicket}
            onChange={handleParentChange}
            options={options}
            placeholder={task.parentTicket ? "Parent" : "+ Add parent"}
            className="parent-select-dropdown"
            searchable={true}
          />
        </div>
        <span className="breadcrumb-separator">/</span>
        <span className="current-ticket-node">{task.ticketKey}</span>
      </div>
    </div>
  );
};

export default TicketHeader;
