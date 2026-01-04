import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeroSection from "../HeroSection";
import CreateBranch from "../CreateBranch";
import GithubAdminConfig from "../GithubAdminConfig";
import TextEditor from "../Editor";
import TaskGenerator from "../TaskManagement/TaskCreator";
import LoginPage from "../Authentication/authPage";
import TaskManager from "../WorksTicket/TaskManager";
import HoraRegistration from "../Authentication/RegistraionV1";
import UserProfile from "../profile";
// import { useEffect } from "react";
// import { fetchUserDetails } from "../../Redux/Actions/PlatformActions.js/userActions";
// import { useDispatch } from "react-redux"
import TicketPage from "../WorksTicket/TicketPage";
import Dashboard from "../HeroSection/HeroSectionV1";
import PartnerOnboarding from "../Onboarding/onboarding";
import HoraShowcase from "../Onboarding/prelogin";
import CreateProject from "../AccessControl/createProject";
import TeamInvitationPage from "../AccessControl/invitationPage";
import FullInvitationPage from "../AccessControl/InvitaionAcceptancePage/InvitaionAcceptancePage";
import HoraAdminDashboard from "../AccessControl/Administration/AdminDashBoard";
import DeveloperMetricsMatrix from "../AccessControl/Analytics/DoraDash";
import SprintBoard from "../Sprint/sprintBoard";
import WorkflowManager from "../Sprint/component/WorkFlow";
import SprintBoardManager from "../Sprint/component/SprintBoardManager";
import ScrumMasterDashboard from "../Sprint/component/sprintBoardConfriguratro";
import SprintManagement from "../Sprint/SprintManagement";
import SprintHome from "../Sprint/sprintHome";
import ConfigurationPage from "../Sprint/TicketConfigurator";
import WorkspaceConfig from "../Sprint/TicketConfigurator";
import SprintFLowBoard from "../Sprint/Board/sprintFlowBoard";
import TeamsPage from "../HeroSection/TeamsPage";
import SprintFlowUserEducation from "../Sprint/component/OnboardingScreens/WorkFlowOnboarding";
import ProjectCreationFlow from "../GenerailForms/projectCreationFlow";

// import { useSelector } from "react-redux";

const AllRoutes = () => {   
    // const dispatch = useDispatch();

  //     useEffect(() => {
  //   dispatch(fetchUserDetails());
  //   // dispatch(fetch)
  // }, [dispatch]);
    return (
        // <BrowserRouter>
            <Routes>
                <Route path="/create-branch" element={<CreateBranch />} />
                <Route path="/admin/github-config" element={<GithubAdminConfig />} />
                {/* <Route path="/" element={<LoginPage />} /> */}
                <Route path="/create" element={<TaskGenerator />} />
                <Route path="/all-work" element={<TaskManager />} />
                {/* Project specific tasks - TaskManager will read projectId from route params */}
                <Route path="/projects/:projectId/tasks" element={<TaskManager />} />
                
                {/* <Route path="/editor" element={<TextEditor />} /> */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/tickets/:id" element={<TicketPage />} />
                <Route path="/v2" element={<Dashboard />} />
                <Route path="/partner" element={<PartnerOnboarding />} />
                <Route path="/invite" element={<TeamInvitationPage />} />
                <Route path="/Hora-prelogin" element={<HoraShowcase />} />
                {/* // letter it turn down into popup */}
                <Route path="/create/project" element={<CreateProject />} />
                <Route path="/invitation" element={<FullInvitationPage />} />
                <Route path="/admin" element={<HoraAdminDashboard />} />
                <Route path="/analytics" element={<DeveloperMetricsMatrix />} />
                <Route path="/sprint/dashboard" element={<SprintManagement />} />
                <Route path="/sprint" element={<SprintHome />} />
                <Route path="/create/project-space" element={<ProjectCreationFlow />} />

                <Route path="/sprint/board" element={<SprintBoard />} />
                <Route path="/confrigurator/flow" element={<WorkflowManager />} />
                <Route path="/work-space/confrigurator" element={<ScrumMasterDashboard />} />
                <Route path="/scrum/configurator/:projectId" element={<SprintBoardManager />} />
                <Route path="/workspace/:projectId" element={<ConfigurationPage />} />


                {/* // letter it turn down into popup */}

                {/* <Route path="/register" element={<HoraRegisration />} /> */}
                {/* <Route path="/" element={<LoginPage />} /> */}
                
                {/* Add other routes as needed */}


                {/* <Route path="/test" element={<SprintFLowBoard />} /> */}
                <Route path="/test" element={<SprintFlowUserEducation />} />

            </Routes>
        // </BrowserRouter>
    );
}

export default AllRoutes;