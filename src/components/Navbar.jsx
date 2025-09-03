import React from "react";
import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navlink">
        Forside
      </NavLink>
      <NavLink to="/projekter" className="navlink">
        Projekter
      </NavLink>
      <NavLink to="/kontakt" className="navlink">
        Kontakt
      </NavLink>
    </nav>
  );
}
