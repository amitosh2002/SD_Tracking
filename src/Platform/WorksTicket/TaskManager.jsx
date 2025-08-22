import  {  useEffect, useState } from 'react';
import './TaskManager.scss';
import TaskItem from './TaskItem';
import TaskDetails from './TaskDetails';
// import TextEditor from '../Editor';
// import IssueDetails from '../LeftControll';
import { useDispatch, useSelector } from 'react-redux';
import { getAllWorkTicket } from '../../Redux/Actions/TicketActions/ticketAction';


const TaskManager = () => {
    const dispatch = useDispatch();
// calling the all WorksTicket
useEffect(() => {
    // Simulate fetching data from an API
    dispatch(getAllWorkTicket());

}, [dispatch]);

const {tickets} = useSelector((state) => state.worksTicket);
    // const [tasks, setTasks] = useState(tickets || []);
    // console.log("Tickets data:", tickets.items);
  const [selectedTaskId, setSelectedTaskId] = useState( null);
  
// letting the first ticket as selected
  useEffect(()=>{
    if(tickets?.items?.length > 0 && !selectedTaskId) {
        setSelectedTaskId(tickets.items[0]?._id);
    }
},[tickets,selectedTaskId]);

  const selectedTask = tickets?.items?.find(task => task?._id === selectedTaskId);
  console.log("Selected Task:", selectedTask);

  return (
    <div className="task-manager-container">
      <div className="task-list-panel">
        <h2>Tasks</h2>
        { Array.isArray(tickets?.items)&& tickets?.items?.map(task => (
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