import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navLogo">
        <NavLink to="/">
          <img src="/logo.png" alt="Logo" className="logoImg" />
        </NavLink>
      </div>
      <div className="navCenter">
        <NavLink to="/ommig" className="navlink">
          OM MIG
        </NavLink>
        <NavLink to="/projekter" className="navlink">
          PROJEKTER
        </NavLink>
        <NavLink to="/kontakt" className="navlink">
          KONTAKT
        </NavLink>
      </div>
    </nav>
  );
}
