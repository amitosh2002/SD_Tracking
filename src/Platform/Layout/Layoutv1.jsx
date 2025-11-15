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

// Import actions
import { fetchPlatformKeyValueAction } from "../../Redux/Actions/KeyValueActions/keyValueActions";
import { fetchUserDetails } from "../../Redux/Actions/PlatformActions.js/userActions";
import { initializeAuthAction } from "../../Redux/Actions/Auth/AuthActions";
import { useLocation } from "react-router-dom";

const Layoutv1 = () => {
    const dispatch = useDispatch();
    
    // Selectors
    const { createPopup } = useSelector((state) => state.worksTicket);
    const { isAuthenticated, requiresRegistration, loading } = useSelector((state) => state.auth);
    const { TicketType, TicketStatus } = useSelector((state) => state.keyValuePair);
    
    console.log("Layout Rendered", { isAuthenticated, requiresRegistration, loading });
    
    // Initialize authentication on app load
    useEffect(() => {
        dispatch(initializeAuthAction());
    }, [dispatch]);

    // to hide navbar for specific routes
    const location=useLocation();
    const [hideNavbar,setHideNavbar]=useState(false);
    
     useEffect(() => {
    const hideNavbarRoutes = ["/login", "/register", "/Hora-prelogin","/partner","/invite","/create/project"];
    const currentPath = location.pathname;

    if (hideNavbarRoutes.includes(currentPath)) {
      setHideNavbar(true);
    } else {
      setHideNavbar(false);
    }
  }, [location.pathname]); 

    // API calls that should run after authentication
    const loadAppData = useCallback(async () => {
        if (isAuthenticated) {
            try {
                console.log("Loading app data after authentication...");
                
                // Fetch key-value pairs (ticket types, statuses, etc.)
                if (!TicketType || !TicketStatus) {
                    console.log("Fetching key-value pairs...");
                    await dispatch(fetchPlatformKeyValueAction());
                }
                
                // Fetch user details
                console.log("Fetching user details...");
                await dispatch(fetchUserDetails());
                
                console.log("App data loaded successfully");
            } catch (error) {
                console.error("Error loading app data:", error);
            }
        }
    }, [dispatch, isAuthenticated, TicketType, TicketStatus]);

    // Load data when authentication status changes
    useEffect(() => {
        if (isAuthenticated && !loading) {
            loadAppData();
        }
    }, [isAuthenticated, loading, loadAppData]);

    // Handle page refresh - reload data if authenticated
    useEffect(() => {
        const handlePageRefresh = () => {
            if (isAuthenticated && !loading) {
                console.log("Page refreshed, reloading app data...");
                loadAppData();
            }
        };

        // Listen for page visibility change (handles refresh)
        document.addEventListener('visibilitychange', handlePageRefresh);
        
        return () => {
            document.removeEventListener('visibilitychange', handlePageRefresh);
        };
    }, [isAuthenticated, loading, loadAppData]);

    // Show loading state while initializing auth
    if (loading) {
        return (
            <div className="app-container">
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    fontSize: '18px'
                }}>
                    Loading...
                </div>
            </div>
        );
    }

    // Check requiresRegistration FIRST, then isAuthenticated
    if (requiresRegistration === true) {
        console.log("Rendering HoraRegistration");
        return <HoraRegistration />;
    }
    
    if (isAuthenticated === false || isAuthenticated === undefined || isAuthenticated === null && requiresRegistration===false) {
        console.log("Rendering LoginPage");
        return <LoginPage />;
    }
    
    console.log("Rendering main layout");

    return (
        <div className="app-container">
            {!hideNavbar && <Navbar />}
            <AllRoutes />
            
            {/* Conditional rendering for the popup */}
            {createPopup && (
                <CreateTicket />
            )}
        </div>
    );
};

export default Layoutv1;