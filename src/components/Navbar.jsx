import React from "react";
import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navlink">
        OM MIG
      </NavLink>
      <NavLink to="/projekter" className="navlink">
        PROJEKTER
      </NavLink>
      <NavLink to="/kontakt" className="navlink">
        KONTAKT
      </NavLink>
    </nav>
  );
}
