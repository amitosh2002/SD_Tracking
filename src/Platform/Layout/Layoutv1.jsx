import {  useSelector } from "react-redux";
import "../../App.css";
import Navbar from "../Navbar";
import AllRoutes from "../Routex/AllRoutes";
import { PopupV1 } from "../../customFiles/customComponent/popups";
import { OPEN_CREATE_TICKET_POPUP } from "../../Redux/Constants/ticketReducerConstants";
import LoginPage from "../Authentication/authPage";
import HoraRegistration from "../Authentication/RegistraionV1";
import CreateTicket from "../TaskManagement/CreateTicket";

const Layoutv1 = () => {
    // const dispatch = useDispatch();
    
    // ticketReducer
    const { createPopup } = useSelector((state) => state.worksTicket);
    const { isAuthenticated, requiresRegistration } = useSelector((state) => state.auth);
    
    console.log("Layout Rendered", { isAuthenticated, requiresRegistration });
    
    // Fix 1: Add explicit type checking and more detailed logging
    console.log("Auth state details:", {
        isAuthenticated: isAuthenticated,
        isAuthenticatedType: typeof isAuthenticated,
        requiresRegistration: requiresRegistration,
        requiresRegistrationType: typeof requiresRegistration
    });
    
    // Fix 2: Check requiresRegistration FIRST, then isAuthenticated
    if (requiresRegistration === true) {
        console.log("Rendering HoraRegistration");
        return <HoraRegistration />;
    }
    
    if (isAuthenticated === false || isAuthenticated === undefined || isAuthenticated === null) {
        console.log("Rendering LoginPage");
        return <LoginPage />;
    }
    
    console.log("Rendering main layout");
    
    return (
        <div className="app-container">
                <Navbar />
                <AllRoutes />
            
            {/* Conditional rendering for the popup */}
            {createPopup && (
            //   <PopupV1
            //         title={"Create Ticket"}
            //         onClose={() => dispatch({ 
            //           type: OPEN_CREATE_TICKET_POPUP, 
            //           payload: false 
            //         })}
            //     />
            <CreateTicket  />
              )}
        </div>
    );
};

export default Layoutv1;