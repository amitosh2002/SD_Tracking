import './style/ConfigurationPage.scss';
import { 
  ChevronDown, 
  CheckCircle, LayoutGrid, Info 
} from 'lucide-react';
import LabelManager from './component/LabelManager';
import ColumnStatusManager from './component/BoardConfigration';
import SprintFLowBoard from './Board/sprintFlowBoard';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TicketTypeManager from './component/TicketTypeLabel';
import TicketPriorityManager from './component/TicketPriorityManager';
import { use, useEffect } from 'react';
import { ticketConfiguratorActionV1 } from '../../Redux/Actions/PlatformActions.js/projectsActions';

const WorkspaceConfig = () => {
  // const [selectedProject, setSelectedProject] = useState("Alpha CRM System");
  const projectId = useParams().projectId;
  const {projects}= useSelector((state)=>state.projects)
   const getProjectDetails = (projectId) => {
    return projects.find(
      (project) => project.projectId === projectId
    )
  };
  // ============================Hooks initilization ===========================
      const dispatch = useDispatch();
  // ============================Hooks initilization ===========================

  // =========================================== Api calls here ==================

  useEffect(()=>{

    // fetching all project confriguration here
    dispatch(ticketConfiguratorActionV1(projectId))
  },[dispatch,projectId])



  // =========================================== Api calls here ==================

  return (
    <div className="workspace-page">
      {/* HEADER WITH PROJECT SELECTOR */}
      <header className="main-header">
        <div className="project-selector">
          <div className="project-icon">
            <LayoutGrid size={20} />
          </div>
          <div className="dropdown-area">
            <span className="label">Project Workspace</span>
            <div className="current-select">
              {getProjectDetails(projectId)?.projectName} <ChevronDown size={14} />
            </div>
          </div>
        </div>
        {/* <button className="btn-save-main" onClick={handleSave}>Create Workspace</button> */}
      </header>

      <div className="config-layout">
        <div className="config-grid">
          <TicketTypeManager projectId={projectId}/>
          <TicketPriorityManager projectId={projectId}/>
          <LabelManager projectId={projectId}/>


        </div>
      </div>
      <SprintFLowBoard projectId={projectId} Flow={"FLOW"}/>
      <ColumnStatusManager projectId={projectId}/>
    </div>
  );
};

export default WorkspaceConfig;