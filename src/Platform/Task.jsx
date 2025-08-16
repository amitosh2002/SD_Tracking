import TextEditor from './Editor';
import IssueDetails from './LeftControll'
import "./styles/task.scss"; // Import the SCSS file

const Task = () => {
  return (
    <div className='Task_container'>

        <div className="task_heading">
            <p className="Lg_body_bold">Task</p>
        </div>
        <div className="task_body">

            <div className="task_view">
                <TextEditor/>
            </div>
        <div className="status_info">

            <IssueDetails/>
        </div>
        </div>
    </div>
  )
}

export default Task