import React from "react";
import { NavLink } from "react-router-dom";

function Home() {
  
  return(
    <header>
      <i>
        <h1 style={{ fontSize: "7.5vw", textAlign: "center" }}>
          Meme Generator
        </h1>
      </i>
      <NavLink to="/generator" exact="true" className="goto">
        <button>
          <p>
            Onward!
          </p>
        </button>
      </NavLink>
    </header>
  ); 
}

export default Home;
