import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeroSection from "../HeroSection";
import CreateBranch from "../CreateBranch";
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
                {/* <Route path="/" element={<LoginPage />} /> */}
                <Route path="/create" element={<TaskGenerator />} />
                <Route path="/all-work" element={<TaskManager />} />
                
                {/* <Route path="/editor" element={<TextEditor />} /> */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/tickets/:id" element={<TicketPage />} />
                <Route path="/v2" element={<Dashboard />} />
                <Route path="/partner" element={<PartnerOnboarding />} />
                <Route path="/Hora-prelogin" element={<HoraShowcase />} />
                {/* // letter it turn down into popup */}
                <Route path="/create/project" element={<CreateProject />} />
                {/* // letter it turn down into popup */}

                {/* <Route path="/register" element={<HoraRegistration />} /> */}
                {/* <Route path="/" element={<LoginPage />} /> */}
                
                {/* Add other routes as needed */}
            </Routes>
        // </BrowserRouter>
    );
}

export default AllRoutes;