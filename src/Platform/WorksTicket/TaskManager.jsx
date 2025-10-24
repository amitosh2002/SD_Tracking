import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './TaskManager.scss';
import TaskItem from './TaskItem';
import TaskDetails from './TaskDetails';
import { useDispatch, useSelector } from 'react-redux';
import { getAllWorkTicket } from '../../Redux/Actions/TicketActions/ticketAction';

const TaskManager = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  const { tickets } = useSelector((state) => state.worksTicket);
  const { projectId } = useParams();

  // Fetch tickets: if projectId is present, fetch by project; otherwise by user
  useEffect(() => {
    if (projectId) {
      dispatch(getAllWorkTicket({ projectId }));
    } else if (userDetails?.id) {
      dispatch(getAllWorkTicket({ userId: userDetails.id }));
    }
  }, [dispatch, projectId, userDetails?.id]);

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Auto-select first task when list loads
  useEffect(() => {
    if (tickets?.items?.length > 0 && !selectedTaskId) {
      setSelectedTaskId(tickets.items[0]?._id);
    }
  }, [tickets, selectedTaskId]);

  const selectedTask = tickets?.items?.find((task) => task?._id === selectedTaskId);

  return (
    <div className="task-manager-container">
      <div className="task-list-panel">
        <h2>Tasks</h2>
        {Array.isArray(tickets?.items) &&
          tickets.items.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              isSelected={selectedTaskId === task?._id}
              onClick={setSelectedTaskId}
            />
          ))}
      </div>
      <div className="task-details-panel">
        <TaskDetails task={selectedTask} />
      </div>
    </div>
  );
};

export default TaskManager;