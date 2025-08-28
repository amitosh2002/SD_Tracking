import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeroSection from "../HeroSection";
import CreateBranch from "../CreateBranch";
import TextEditor from "../Editor";
import TaskGenerator from "../TaskManagement/TaskCreator";
import LoginPage from "../Authentication/authPage";
import TaskManager from "../WorksTicket/TaskManager";
import HoraRegistration from "../Authentication/RegistraionV1";
// import { useSelector } from "react-redux";

const AllRoutes = () => {

   
    return (
        // <BrowserRouter>
            <Routes>
                <Route path="/create-branch" element={<CreateBranch />} />
                {/* <Route path="/" element={<LoginPage />} /> */}
                <Route path="/create" element={<TaskGenerator />} />
                <Route path="/all-work" element={<TaskManager />} />
                {/* <Route path="/register" element={<HoraRegistration />} /> */}
                <Route path="/" element={<HeroSection />} />
                
                {/* Add other routes as needed */}
            </Routes>
        // </BrowserRouter>
    );
}

export default AllRoutes;