import React, { useState, useEffect, useRef } from 'react';
import "./styles/navbar.scss"
import { PopupV1 } from '../customFiles/customComponent/popups';
import { OPEN_CREATE_TICKET_POPUP } from '../Redux/Constants/ticketReducerConstants';
import { useDispatch } from 'react-redux';

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
  // Close profile dropdown when clicking outside
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

  return (
    <nav className="main-navbar">
      <div className="main-navbar__container">
        
        <div className="main-navbar__left">
          {/* Left Section: Logo */}
          <a href="#" className="main-navbar__logo">Hora</a>
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
                src="https://placehold.co/100x100/E2E8F0/4A5568?text=A" 
                alt="User avatar"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/E2E8F0/4A5568?text=U'; }}
              />
              <span className="profile__name">Amitosh</span>
              <ChevronDownIcon />
            </button>

            {/* Dropdown Panel */}
            {isProfileMenuOpen && (
              <div className="profile-menu">
                <a href="#" className="profile-menu__item">Your Profile</a>
                <a href="#" className="profile-menu__item">Settings</a>
                <a href="#" className="profile-menu__item">Sign out</a>
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
                src="https://placehold.co/100x100/E2E8F0/4A5568?text=A" 
                alt="User avatar"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/E2E8F0/4A5568?text=U'; }}
              />
              <div>
                <div className="mobile-menu__user-name">Amitosh</div>
                <div className="mobile-menu__user-email">amitosh@example.com</div>
              </div>
            </div>
            
            <div className="mobile-menu__links">
              <a href="#" className="mobile-menu__link">Your Profile</a>
              <a href="#" className="mobile-menu__link">Settings</a>
              <a href="#" className="mobile-menu__link">Sign out</a>
            </div>
          </div>
        </div>
      )}
    
    </nav>

  );
}

export default Navbar;