
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import "../../App.css";
import Navbar from "../Navbar";
import AllRoutes from "../Route/AllRoutes";
import { PopupV1 } from "../../customFiles/customComponent/popups";
import { OPEN_CREATE_TICKET_POPUP } from "../../Redux/Constants/ticketReducerConstants";
import LoginPage from "../Authentication/authPage";
import HoraRegistration from "../Authentication/RegistraionV1";
import CreateTicket from "../TaskManagement/CreateTicket";

import { fetchPlatformKeyValueAction } from "../../Redux/Actions/KeyValueActions/keyValueActions";
import { fetchUserDetails } from "../../Redux/Actions/PlatformActions.js/userActions";
import { initializeAuthAction } from "../../Redux/Actions/Auth/AuthActions";
import { useLocation } from "react-router-dom";

import FullInvitationPage from "../AccessControl/InvitaionAcceptancePage/InvitaionAcceptancePage";
import HoraShowcase from "../Onboarding/prelogin";
import { getAllNotifications } from "../../Redux/Actions/NotificationActions/inAppNotificationAction";

const Layoutv1 = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { createPopup } = useSelector((state) => state.worksTicket);
  const { isAuthenticated, requiresRegistration, loading } = useSelector(
    (state) => state.auth
  );
  const { TicketType, TicketStatus } = useSelector(
    (state) => state.keyValuePair
  );
  // const {userDetails}=useSelector((state)=>state.user)

  const [hideNavbar, setHideNavbar] = useState(false);

  // 1️⃣ INITIALIZE AUTH ONCE
  useEffect(() => {
    dispatch(initializeAuthAction());
  }, [dispatch]);

  // 2️⃣ HIDE NAVBAR FOR FEW ROUTES
  useEffect(() => {
    const hideNavbarRoutes = [
      "/login",
      "/register",
      "/Hora-prelogin",
      "/partner",
      "/invite",
      "/create/project",
      "/admin",
      "/create-branch",
      "/",
      "/auth/google/callback" // important for SSO
    ];

    setHideNavbar(hideNavbarRoutes.includes(location.pathname));
  }, [location.pathname]);

  // 3️⃣ LOAD DATA ONLY AFTER AUTH
  const loadAppData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      if (!TicketType || !TicketStatus) {
        await dispatch(fetchPlatformKeyValueAction());
      }
      await dispatch(fetchUserDetails());
      await dispatch(getAllNotifications());
    } catch (error) {
      console.error("Error loading app data:", error);
    }
  }, [dispatch, isAuthenticated, TicketType, TicketStatus]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      loadAppData();
    }
  }, [isAuthenticated, loading, loadAppData]);

  //  Socket connection 

  // 4️⃣ PUBLIC ROUTES (NO AUTH REQUIRED)
  const publicRoutes = ["/invitation", "/forgot-password", "/reset-password", "/verify-email","/Hora-prelogin",];

  if (publicRoutes.includes(location.pathname)) {
    if (location.pathname === "/invitation") return <FullInvitationPage />;
    if (location.pathname === "/Hora-prelogin") return <HoraShowcase />;
    return <div>Public Route</div>;
  }

  // 5️⃣ SSO CALLBACK — DO NOT RENDER LAYOUT
  if (location.pathname === "/auth/google/callback") {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        Processing Google Login...
      </div>
    );
  }

  // 6️⃣ AUTH CHECKS — CLEAN & CORRECT
  if (loading) {
    return (
      <div className="app-container">
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px"
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (requiresRegistration) {
    return <HoraRegistration />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }





  // 8 MAIN APP LAYOUT
  return (
    <div className="app-container">
      {!hideNavbar && <Navbar />}
      <AllRoutes />

      {createPopup && <CreateTicket />}
    </div>
  );
};

export default Layoutv1;
