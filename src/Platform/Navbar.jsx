import React, { useState, useEffect, useRef } from 'react';
import "./styles/navbar.scss"
import { PopupV1 } from '../customFiles/customComponent/popups';
import { OPEN_CREATE_TICKET_POPUP, SET_FILTERED_TICKETS } from '../Redux/Constants/ticketReducerConstants';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../Redux/Actions/Auth/AuthActions';
import { Navigate, useNavigate } from 'react-router-dom';
import { searchTicketByQuery } from '../Redux/Actions/TicketActions/ticketAction';

// SVG Icon Components for clarity and reusability
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon = () => (
    <svg className="icon icon--chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
);

const SearchIcon = () => (
    <svg className="icon icon--search" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
);

// Main Navbar Component
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileMenuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate=useNavigate();
  // Close profile dropdown when clicking outside
  const {userDetails}=useSelector((state)=>state.user);
  const {filteredTickets}= useSelector((state)=>state.worksTicket)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleSignOut = () => {
    // Implement sign out logic here
    console.log("Sign out clicked");
    dispatch(logoutAction());
    Navigate('/');
    // For example, clear auth tokens, redirect to login, etc.
  }

  useEffect(()=>{

    // initilizing debouncing  check for query if exist update setSearchQuery and dispatch actions
    const debounceSearch =setTimeout(()=>{
          if(searchQuery.trim()){
            setSearchQuery(searchQuery.trim());
            dispatch(searchTicketByQuery(searchQuery.trim()));
          }
          else{
            dispatch({type:SET_FILTERED_TICKETS,payload:[]})
          }
    },500)

    return ()=>{//cleanup function for debounce
      clearTimeout(debounceSearch);
    }
  },[searchQuery,dispatch])

  return (
    <nav className="main-navbar">
      <div className="main-navbar__container">
        
        <div className="main-navbar__left">
          {/* Left Section: Logo */}
          <a href="#" className="main-navbar__logo" onClick={()=>navigate('/')}>Hora</a>
        </div>

        {/* Center Section: Search Bar (Desktop) */}
        <div className="main-navbar__center">
          <div className="search-bar">
            <label htmlFor="search" className="sr-only">Search</label>
            <SearchIcon />
            <input
              id="search"
              name="search"
              className="search-bar__input"
              placeholder="Search..."
              type="search"
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value)}
                }
            />
          </div>
          { filteredTickets && filteredTickets.length > 0 &&
            <div className="flitered_ticket_container">
              {
                Array.isArray(filteredTickets) && filteredTickets.slice(0,5).map((ticket)=>(
                  <div key={ticket._id} className="filtered_ticket_item" onClick={()=>{
                    navigate(`/tickets/${ticket.id}`) 
                    setSearchQuery('')
                  }}>
                    <span className="ticket_key">{ticket.ticketKey}</span> - <span className="ticket_title">{ticket.title}</span>
                  </div>
                ))
              }
            </div>
          }
        </div>
              <div className="nav_routes">
          <a href="#" className="profile-menu__item md_body_bold"  onClick={(e)=>{navigate('/all-work')
                  e.stopPropagation()
                }}>For You</a>
        </div>

        {/* Mobile Menu Button */}
        <div className="main-navbar__mobile-toggle">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
  

        {/* Right Section: Create Button & Profile (Desktop) */}
        <div className="main-navbar__right">
          <button className="button button--primary" onClick={()=>dispatch({type:OPEN_CREATE_TICKET_POPUP,payload:true})}>
            Create
          </button>
          
          {/* Profile Dropdown */}
          <div className="profile" ref={profileMenuRef}>
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="profile__button"
            >
              <span className="sr-only">Open user menu</span>
              <img 
                className="profile__avatar" 
                src={`https://placehold.co/100x100/E2E8F0/4A5568?text=${userDetails?.username[0]} `}
                alt="User avatar"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/E2E8F0/4A5568?text=U'; }}
              />
              <span className="profile__name">{userDetails?.profile?.firstName}</span>
              <ChevronDownIcon />
            </button>

            {/* Dropdown Panel */}
            {isProfileMenuOpen && (
              <div className="profile-menu">
                <a href="#" className="profile-menu__item" onClick={(e)=>{navigate('/profile')
                  e.stopPropagation()
                }}>Your Profile</a>
                <a href="#" className="profile-menu__item">Settings</a>
                <a href="#" className="profile-menu__item" onClick={handleSignOut}>Sign out</a>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu__content">
            <button className="button button--primary button--full-width">
              Create
            </button>
            
            <div className="mobile-menu__user-info">
            <img 
                className="profile__avatar" 
                src={`https://placehold.co/100x100/E2E8F0/4A5568?text=${userDetails?.username[0]} `}
                alt="User avatar"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/E2E8F0/4A5568?text=U'; }}
              />
              <div>
                <div className="mobile-menu__user-name">{userDetails?.username}</div>
                <div className="mobile-menu__user-email">{userDetails?.email}</div>
              </div>
            </div>
            
            <div className="mobile-menu__links">
              <a  className="mobile-menu__link" onClick={(e)=>{navigate('/profile')
                  e.stopPropagation()
                }}>Your Profile</a>
              <a href="#" className="mobile-menu__link">Settings</a>
              <a href="#" className="mobile-menu__link"  onClick={handleSignOut}>Sign out</a>
            </div>
          </div>
        </div>
      )}
    
    </nav>

  );
}

export default Navbar;