import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, NavLink } from "react-router"; // keep NavLink for logo-home
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import logo from "../assets/MKLOGO.svg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(""); // "about" | "projects" | "contact"
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Utility: read CSS var --navH (px number, fallback 72)
  const getNavH = () => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--navH")
      .trim();
    const n = parseInt(raw || "72", 10);
    return Number.isFinite(n) ? n : 72;
  };

  // Smooth scroll with sticky offset
  const scrollToId = useCallback((id) => {
    const el = document.querySelector(id);
    if (!el) return;
    const navH = getNavH();
    const y = el.getBoundingClientRect().top + window.scrollY - navH - 8; // extra 8px breathing room
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  // Close mobile menu when route changes
  useEffect(() => setOpen(false), [pathname]);

  // Toggle glass when past hero (or small scroll fallback)
  useEffect(() => {
    const hero = document.querySelector(".heroFull");
    let cleanup = () => {};
    if (hero && "IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => setScrolled(entries[0].intersectionRatio < 0.6),
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

  // Scroll spy: highlight nav item based on section in view
  useEffect(() => {
    const ids = ["#about", "#projects", "#contact"];
    const opts = {
      // Trigger when section crosses slightly below the navbar
      root: null,
      rootMargin: `-${getNavH() + 40}px 0px -60% 0px`,
      threshold: 0.01,
    };
    const handler = (entries) => {
      // Pick the topmost visible section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    };
    const obs = new IntersectionObserver(handler, opts);
    ids.forEach((id) => {
      const el = document.querySelector(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // If user is on another route, navigate home first then scroll
  const go = (hash) => {
    const doScroll = () => {
      requestAnimationFrame(() => scrollToId(hash));
    };
    if (pathname !== "/") {
      navigate("/");
      // wait a tick for home to render sections
      setTimeout(doScroll, 30);
    } else {
      doScroll();
    }
    setOpen(false);
  };

  const linkCls = (key) => "navlink" + (active === key ? " active" : "");

  return (
    <nav className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="navInner">
        {/* Logo (left) - back to home */}
        <div className="navLogo">
          <NavLink to="/" aria-label="Forside">
            <img src={logo} alt="Logo" className="logoImg" />
          </NavLink>
        </div>

        {/* Center links (smooth scroll buttons) */}
        <div className={"navCenter" + (open ? " open" : "")}>
          <button className={linkCls("about")} onClick={() => go("#about")}>
            Om Mig
          </button>
          <button
            className={linkCls("projects")}
            onClick={() => go("#projects")}
          >
            Projekter
          </button>
          <button className={linkCls("contact")} onClick={() => go("#contact")}>
            Kontakt
          </button>
        </div>

        {/* Right: socials + burger */}
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
