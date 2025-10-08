import "./styles/herosection.scss"
import done from "../assets/platformIcons/greenTick.svg"
import greenTick from "../assets/platformIcons/green_tick.svg"
import createTask from "../assets/platformIcons/TaskPlat/createTask.svg"
import blueTick from "../assets/platformIcons/bluck_tick.svg"
import yellowCLock from "../assets/platformIcons/yellow_tick.svg"
import { ButtonV1 } from "../customFiles/customComponent/CustomButtons"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { getAllProjects } from "../Redux/Actions/projectsActions"
import { useDispatch } from "react-redux"
import { fetchPlatformKeyValueAction } from "../Redux/Actions/KeyValueActions/keyValueActions"
const HeroSection = () => {

    
    // let isCompleted =true

    // const svgClassName = `task-icon ${isCompleted ? 'completed' : ''}`;
    const activity=[
        
        {
        id:0,
        name:"Total Task",
        icon:blueTick,
        count:4
    },
        {
        id:1,
        name:"Completed",
        icon:greenTick,
        count:4
    },
        {
        id:2,
        name:"In Progress",
        icon:yellowCLock,
        count:4
    }

]

// mock data 
const rescentTask =[
    { id: 1, title: 'Design homepage mockup', project: 'Website Redesign', priority: 'high', completed: false, dueDate: '2024-07-25', timeSpent: '2h 30m' },
    { id: 2, title: 'Review client feedback', project: 'Mobile App', priority: 'medium', completed: true, dueDate: '2024-07-24', timeSpent: '1h 15m' },
    { id: 3, title: 'Update documentation', project: 'API Development', priority: 'low', completed: false, dueDate: '2024-07-26', timeSpent: '45m' },
    { id: 4, title: 'Team standup meeting', project: 'General', priority: 'medium', completed: false, dueDate: '2024-07-23', timeSpent: '30m' },
]

const dispatch = useDispatch(); 
useEffect(() => {
    // Simulate fetching data from an API
    dispatch(getAllProjects());
                dispatch(fetchPlatformKeyValueAction());
    
}, [dispatch]);

const navigate = useNavigate();
// const complete =true;
  return (
    <>
    
        <div className="hero_section_body">
            <div className="activity_body">
             {
                activity.map((activity)=>{
                    return(
                           <div className="activity_tab" key={activity.id}>
                                <div className="first_container">
                                    <p className="Lg_body_regular">{activity.name}</p>
                                    <p className="Lg_body_bold">{activity.count}</p>
                                </div>
                                <div className="icon">
                                    <img src={activity.icon} alt="" />
                                </div>
                             </div>
                    )
                })
             }

            </div>
            <div className="rescent_task">
                <p className="Lg_body_bold">Recent Task</p>

                {
                    rescentTask.map((task)=>{
                        return(
                             <div className="tasks">
                   <div className="task_info">
                  <div className={` button_radio ${task.completed ? "done_task" : ""}`}>
                        {
                            task.completed  ? <img src={done} alt="" />:""
                        }
                    </div>
                    <div className="task_data">
                        <p className={` Lg_body_bold ${task.completed ?" completed-task":""}`}>{task.title}</p>
                        <p>{task.project}</p>
                    </div>
                   </div>
                    <div className="priatory">
                        {task.priority}
                    </div>

                </div>
                        )
                    })
                }
               
            </div>

            <div className="quick_actions">
                <p className="Lg_body_bold">Recent Task</p>

                <div className="actions_tabs">
                   <div className="action_tags">
                     <div className="icon">+</div>
                    <p className="Lg_body_regular">actions</p>
                   </div>
                    <img src="" alt="->" />
                </div>
            </div>
             <div className="floating_button">
            <ButtonV1
            icon={createTask}
            text="Create Task"
            type="primary"
            onClick={() => navigate("/editor")}
            />
        </div>
        </div>
        

       

    </>
  )
}

export default HeroSection