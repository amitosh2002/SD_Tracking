
import React, { useState, useEffect, useRef } from 'react';
import "./styles/navbar.scss"
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../Redux/Actions/Auth/AuthActions';
import { useLocation, useNavigate } from 'react-router-dom';
import { OPEN_CREATE_TICKET_POPUP, SET_FILTERED_TICKETS } from '../Redux/Constants/ticketReducerConstants';
import { searchTicketByQuery } from '../Redux/Actions/TicketActions/ticketAction';
import logo from '../assets/platformIcons/Hora-logo.svg'

// Icons (Same as your original)
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const ChevronDownIcon = () => <svg className="icon icon--chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>;
const SearchIcon = () => <svg className="icon icon--search" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const profileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userDetails } = useSelector((state) => state.user);
  const { filteredTickets } = useSelector((state) => state.worksTicket);

  // Close profile dropdown clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Debounce Logic
  useEffect(() => {
    if (!isSearchModalOpen) return;
    const debounceSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(searchTicketByQuery(searchQuery.trim()));
      } else {
        dispatch({ type: SET_FILTERED_TICKETS, payload: [] });
      }
    }, 500);
    return () => clearTimeout(debounceSearch);
  }, [searchQuery, isSearchModalOpen, dispatch]);

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchModalOpen]);

  const handleSignOut = () => {
    dispatch(logoutAction());
    navigate('/');
  };

    const location = useLocation().pathname;
    console.log(location)
  return (
    <nav className="main-navbar">
      <div className="main-navbar__container">
          {location!="/" && <img src={logo} style={{width:"5rem"}} alt="" />}
    { location!="/" &&  <div className="main-navbar__left">
          <a href="#" className="main-navbar__logo" onClick={() => navigate('/')}>Hora</a>
        </div>}

        {/* Center Section: Search Trigger */}
        <div className="main-navbar__center">
          <div className="search-bar" onClick={() => setIsSearchModalOpen(true)} style={{ cursor: 'pointer' }}>
            <div className="search-bar__placeholder">Search tickets (Ctrl + K)</div>
            {/* <SearchIcon /> */}
          </div>
        </div>

        <div className="nav_routes">
          <a href="#" className="profile-menu__item md_body_bold" onClick={() => navigate('/all-work')}>For You</a>
          {/* <a href="#" className="profile-menu__item md_body_bold" onClick={() => navigate('/teams')}>Teams</a> */}
        </div>

        {/* Mobile Toggle */}
        <div className="main-navbar__mobile-toggle">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Right Section: Original Buttons */}
        <div className="main-navbar__right">
          <button className="button button--primary" onClick={() => dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: true })}>
            Create
          </button>
          
          <div className="profile" ref={profileMenuRef}>
            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="profile__button">
              <img 
                className="profile__avatar" 
                src={`https://placehold.co/100/E2E8F0/4A5568?text=${userDetails?.username?.[0] || 'U'}`} 
                alt="avatar" 
              />
              <span className="profile__name">{userDetails?.profile?.firstName}</span>
              <ChevronDownIcon />
            </button>

            {isProfileMenuOpen && (
              <div className="profile-menu">
                <a href="#" className="profile-menu__item" onClick={() => navigate('/profile')}>Your Profile</a>
                <a href="#" className="profile-menu__item">Settings</a>
                {/* <a href="#" className="profile-menu__item" onClick={handleSignOut}>Sign out</a> */}
                <button className="sidebar__logout" onClick={handleSignOut}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Log out</span>
            </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- SEARCH MODAL POPUP --- */}
      {isSearchModalOpen && (
        <div className="search-popup-overlay" onClick={() => setIsSearchModalOpen(false)}>
          <div className="search-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="search-popup-header">
              <SearchIcon />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tickets by key or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="close-popup-btn" onClick={() => setIsSearchModalOpen(false)}>Esc</button>
            </div>
            
            <div className="search-popup-results">
              {filteredTickets && filteredTickets.length > 0 ? (
                filteredTickets.slice(0, 8).map((ticket) => (
                  <div key={ticket._id} className="filtered_ticket_item" onClick={() => {
                    navigate(`/tickets/${ticket.id}`);
                    setIsSearchModalOpen(false);
                    setSearchQuery('');
                  }}>
                    <span className="ticket_key">{ticket.ticketKey}</span>
                    <span className="ticket_title">{ticket.title}</span>
                  </div>
                ))
              ) : (
                <div className="search-empty-state">
                  {searchQuery ? "No tickets found" : "Type to search projects and tickets..."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu (Your original) */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu__content">
            <button className="button button--primary button--full-width" onClick={() => dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: true })}>
              Create
            </button>
            <div className="mobile-menu__links">
              <a className="mobile-menu__link" onClick={() => navigate('/profile')}>Your Profile</a>
              {/* <a href="#" className="mobile-menu__link" onClick={handleSignOut}>Sign out</a> */}
              <button className="sidebar__logout " onClick={handleSignOut}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Log out</span>
            </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;