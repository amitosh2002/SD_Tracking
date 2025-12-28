import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "./SearchIcon";
import "./styles/searchPopup.scss"

export default function SearchPopup({
  searchQuery,
  setSearchQuery,
  filteredTickets
}) {
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const [open, setOpen] = useState(true);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="main-navbar__center" ref={popupRef}>
      <div className="search-bar">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search tickets..."
          className="search-bar__input"
          value={searchQuery}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setOpen(true);
          }}
        />
      </div>

      {open && searchQuery && filteredTickets?.length > 0 && (
        <div className="search-popup">
          {filteredTickets.slice(0, 5).map((ticket) => (
            <div
              key={ticket._id}
              className="search-popup__item"
              onClick={() => {
                navigate(`/tickets/${ticket.id}`);
                setSearchQuery("");
                setOpen(false);
              }}
            >
              <span className="ticket_key">{ticket.ticketKey}</span>
              <span className="ticket_title">{ticket.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
