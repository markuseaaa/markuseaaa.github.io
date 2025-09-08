import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import logo from "../assets/MKLOGO.svg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  const linkClass = ({ isActive }) => "navlink" + (isActive ? " active" : "");

  return (
    <nav className="navbar">
      <div className="navInner">
        {/* Logo (venstre) */}
        <div className="navLogo">
          <NavLink to="/" aria-label="Forside">
            <img src={logo} alt="Logo" className="logoImg" />
          </NavLink>
        </div>

        {/* Links (midt) */}
        <div className={"navCenter" + (open ? " open" : "")}>
          <NavLink to="/ommig" className={linkClass}>
            OM MIG
          </NavLink>
          <NavLink to="/projekter" className={linkClass}>
            PROJEKTER
          </NavLink>
          <NavLink to="/kontakt" className={linkClass}>
            KONTAKT
          </NavLink>
        </div>

        {/* Højre side: sociale medier */}
        <div className="navRight">
          <a
            href="mailto:markuskristensen04@gmail.com"
            className="social"
            aria-label="Email"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope />
          </a>
          <a
            href="https://github.com/markuseaaa"
            className="social"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/markus-kristensen-570953201/"
            className="social"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>

          {/* Burger menu til mobil */}
          <button
            className={"navToggle" + (open ? " is-open" : "")}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </div>
    </nav>
  );
}
