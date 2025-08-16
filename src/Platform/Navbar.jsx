import React from 'react'
import "./styles/navbar.scss"
import notification from "../assets/platformIcons/notification.svg"
import horaLogo from "../assets/platformIcons/horaLogo.svg"
import user from "../assets/platformIcons/user.svg"
const Navbar = () => {
  return (
    <nav>
        <div className="nav_container">
            <div className="logo_container">
                <img src={horaLogo} alt="" />
            </div>
          <div className="nav_body">
            <div className="search_container">
                <input type="text" placeholder='Search (ctrl + K)' />
            </div>
            <div className="notifications">
                <img src={notification} alt="notification" />
            </div>
                <div className="user">
                    <img src={user} alt="user" />
                </div>
          </div>
        </div>
    </nav>
  )
}

export default Navbar