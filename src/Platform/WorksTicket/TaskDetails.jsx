import './TaskDetails.scss';
// import TextEditor from '../Editor';
import TextEditor from '../../Platform/Editor';
import IssueDetails from '../LeftControll';
import CommentActivitySection from '../CommentAndActivity/CommentAndActivity';
import { useNavigate } from 'react-router-dom';

const TaskDetails = ({ task }) => {
  const navigate = useNavigate();

  if (!task) {
    return (
      <div className="placeholder">
        <h2>Select a task to view details.</h2>
        <p>Your task description will appear here.</p>
      </div>
    );
  }


  return (
    <>
   
    <div className="task-details">
      <div className="task-details-container">
      <p className="task-id" onClick={()=>navigate(`/tickets/${task?._id}`)}>ID: {task.ticketKey}</p>
      <h2 className="task-title">{task.title}</h2>
      {/* <p className="task-description">{task.description || 'No description available.'}</p> */}
      <TextEditor initialData={task?.description} taskId={task?.task_id}/>
      <CommentActivitySection task={task}/>
      
      </div>
      {/* <TextEditor/> */}
                    <IssueDetails task={task}/>
      
    </div>
    </>
  );
};

export default TaskDetails;