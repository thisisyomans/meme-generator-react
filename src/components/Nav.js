import React, { useState } from "react";

import { NavLink } from "react-router-dom";

import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";

function Nav() {
  // open == true, closed == false
  const [navState, setNavState] = useState(false);

  const links = [
    {
      id: 0,
      path: "/",
      text: "Home"
    },
    {
      id: 1,
      path: "/generator",
      text: "Generator"
    }
  ]

  const navToggle = function() {
    setNavState(!navState);
  }

  const closeNav = function() {
    setNavState(false);
  }

  return(
    <nav className="navIcon">
      <button onClick={() => navToggle()}>
        {
          navState ? 
          <MdClose 
            style={{ color: "#fff", width: "3em", height: "3em" }}
          /> : 
          <FiMenu
            style={{ color: "#444", width: "3em", height: "3em" }}
          />
        }
      </button>
      <ul className={`navDefault ${navState ? " navOpen" : ""}`}>
        {links.map((link) => {
          return(
            <li key={link.id}>
              <NavLink
                to={link.path}
                className={(navData) => (navData.isActive ? "active-link" : "")}
                onClick={() => closeNav()}
                exact="true"
              >
                {link.text}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  );
}

export default Nav;
