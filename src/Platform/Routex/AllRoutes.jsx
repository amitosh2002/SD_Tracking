import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeroSection from "../HeroSection";
import CreateBranch from "../CreateBranch";
import TextEditor from "../Editor";
import Task from "../Task";
import TaskGenerator from "../TaskManagement/TaskCreator";
import LoginPage from "../Authentication/authPage";

const AllRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/create-branch" element={<CreateBranch />} />
                <Route path="/editor" element={<Task />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/create" element={<TaskGenerator />} />
                
                {/* Add other routes as needed */}
            </Routes>
        </BrowserRouter>
    );
}

export default AllRoutes;