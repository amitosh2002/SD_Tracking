import { useDispatch, useSelector } from "react-redux";
import "../../App.css";
import Navbar from "../Navbar";
import AllRoutes from "../Routex/AllRoutes";
import { PopupV1 } from "../../customFiles/customComponent/popups";
import { OPEN_CREATE_TICKET_POPUP } from "../../Redux/Constants/ticketReducerConstants";
import LoginPage from "../Authentication/authPage";
const Layoutv1 = () => {
    const dispatch = useDispatch();
    // ticketReducer
    const {createPopup} = useSelector((state) => state.worksTicket);
    // const Authentication=false

    // if(!Authentication) return <LoginPage />
   

  return (
    <div className="app-container">
    <Navbar />
      {/* You can add a header or any other component here if needed */}

      <AllRoutes  />
      

      {/* // Conditional rendering for the popup */}
        {createPopup && <PopupV1
        title={"Create Ticket"}
        onClose={() => dispatch({type:OPEN_CREATE_TICKET_POPUP,payload:false})}
        />}
      </div>
  )
}

export default Layoutv1