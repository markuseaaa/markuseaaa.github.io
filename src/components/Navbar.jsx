import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import logo from "../assets/MKLOGO.svg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // Luk menu når route ændrer sig
  useEffect(() => setOpen(false), [pathname]);

  // Tænd/glass når vi er forbi hero (eller lidt scroll fallback)
  useEffect(() => {
    const hero = document.querySelector(".heroFull");
    let cleanup = () => {};

    if (hero && "IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          // scrolled = true når hero ikke længere fylder det meste af viewport
          setScrolled(e.intersectionRatio < 0.6);
        },
        { threshold: [0, 0.6, 1] }
      );
      obs.observe(hero);
      cleanup = () => obs.disconnect();
    } else {
      const onScroll = () => setScrolled(window.scrollY > 10);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanup = () => window.removeEventListener("scroll", onScroll);
    }

    return cleanup;
  }, []);

  const linkClass = ({ isActive }) => "navlink" + (isActive ? " active" : "");

  return (
    <nav className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
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
            Om Mig
          </NavLink>
          <NavLink to="/projekter" className={linkClass}>
            Projekter
          </NavLink>
          <NavLink to="/kontakt" className={linkClass}>
            Kontakt
          </NavLink>
        </div>

        {/* Højre side: sociale medier + burger */}
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
