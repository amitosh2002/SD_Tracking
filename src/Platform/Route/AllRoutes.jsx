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
import ProjectCreationFlow from "../GenerailForms/projectCreationFlow";
import ForYouPage from "../HeroSection/Components/forYouPage";
import GitHubAdminPanel from "../AccessControl/Administration/githubControlPanel";
import WorkspaceConfig from "../Sprint/WorkspacConfigurator";
import ScrumMasterSetup from "../Confriguration/DoraConfig";
import ProjectSettings from "../ProjectSetting/ProjectSettings";
import HoraServiceManagement from "../../../CurrentHoraInternal/ServiceKVP";
import AnalyticsDashBoardV2 from "../Analytics/AnalyticsDashBoard";
import { EmptyStateGraphic } from "../../customFiles/customComponent/emptyState";
import UserCalendar from "../HeroSection/Components/UserCalendar";
import TimeLogTracker from "../HeroSection/Components/TimeLogTracker";
import WorkSpace from "../HeroSection/Components/WorkSpace";
import TeamsPage from "../HeroSection/TeamsPage";
import InAppNotifications from "../HeroSection/Components/inAppNotification";
import SettingPageV1 from "../HeroSection/Components/settingPage";
import SprintTaskList from "../TaskManagement/SprintTaskList";
import ProjectCreationPage from "../GenerailForms/projectCreationFlow";
import GitHubConnect from "../Github/GithubConnect";

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
                
                {/* Sidebar Routes */}
                <Route path="/calendar" element={<UserCalendar />} />
                <Route path="/timer" element={<TimeLogTracker />} />
                <Route path="/projects" element={<WorkSpace />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/notifications" element={<InAppNotifications />} />
                <Route path="/settings" element={<SettingPageV1 />} />


                <Route path="/profile" element={<UserProfile />} />
                <Route path="/tickets/:id" element={<TicketPage />} />
                <Route path="/v2" element={<Dashboard />} />
                <Route path="/partner" element={<PartnerOnboarding />} />
                <Route path="/invite" element={<TeamInvitationPage />} />
                <Route path="/Hora-prelogin" element={<HoraShowcase />} />
                {/* // letter it turn down into popup */}
                {/* <Route path="/create/project" element={<CreateProject />} />. decrepted as we have new flow for now ,compatable with our current flow of creation */}
                <Route path="/invitation" element={<FullInvitationPage />} />
                <Route path="/admin" element={<HoraAdminDashboard />} />
                <Route path="/analytics" element={<DeveloperMetricsMatrix />} />
                <Route path="/sprint/dashboard" element={<SprintManagement />} />
                <Route path="/sprint" element={<SprintHome />} />
                <Route path="/create/project-space" element={<ProjectCreationPage />} />
                <Route path="/user-work-space" element={<SprintTaskList />} />


                <Route path="/sprint/board" element={<SprintBoard />} />
                <Route path="/confrigurator/flow" element={<WorkflowManager />} />
                <Route path="/work-space/confrigurator" element={<ScrumMasterDashboard />} />
                <Route path="/scrum/configurator/:projectId" element={<SprintBoardManager />} />
                <Route path="/workspace/:projectId" element={<WorkspaceConfig />} />
                <Route path="/workspace/:projectId/setting" element={<ProjectSettings />} />
                <Route path="/workspace/:projectId/analytics" element={<AnalyticsDashBoardV2 />} />
                <Route path="/service" element={<HoraServiceManagement />} />

                {/* // letter it turn down into popup */}


                <Route path="/api/auth/github/github/setup" element={<GitHubConnect />} />


                {/* <Route path="/register" element={<HoraRegisration />} /> */}
                {/* <Route path="/" element={<LoginPage />} /> */}
                
                {/* Add other routes as needed */}


                {/* <Route path="/test" element={<SprintFLowBoard />} /> */}
                {/* <Route path="/test" element={<GitHubServicePage />} /> */}
                {/* <Route path="/test2" element={<SprintAnalyticsDashboard />} /> */}

            </Routes>
        // </BrowserRouter>
    );
}

export default AllRoutes;