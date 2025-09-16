/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, NavLink } from "react-router";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const getNavH = () => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--navH")
      .trim();
    const n = parseInt(raw || "72", 10);
    return Number.isFinite(n) ? n : 72;
  };

  const scrollToId = useCallback((id) => {
    const el = document.querySelector(id);
    if (!el) return;
    const navH = getNavH();
    const y = el.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const sentinel =
      document.querySelector(".heroFull") ||
      document.querySelector(".routeTopSentinel");

    if (!sentinel || !("IntersectionObserver" in window)) {
      const onScroll = () => setScrolled(window.scrollY > 10);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const r = entries[0]?.intersectionRatio ?? 1;
        setScrolled(r < 0.6);
      },
      { threshold: [0, 0.6, 1] }
    );

    const rect = sentinel.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const visible =
      Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0)) /
      Math.max(1, rect.height || 1);
    setScrolled(visible < 0.6);

    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [pathname]);

  useEffect(() => {
    const ids = ["#about", "#projects", "#contact"];
    const opts = {
      root: null,
      rootMargin: `-${getNavH() + 40}px 0px -60% 0px`,
      threshold: 0.01,
    };
    const handler = (entries) => {
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

  const go = (hash) => {
    const doScroll = () => requestAnimationFrame(() => scrollToId(hash));
    if (pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 30);
    } else {
      doScroll();
    }
    setOpen(false);
  };

  const linkCls = (key) => "navlink" + (active === key ? " active" : "");

  return (
    <motion.nav
      className={`navbar ${scrolled ? "is-scrolled" : ""}`}
      initial={{ opacity: 0, y: -10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="navInner">
        <div className="navLogo">
          <NavLink to="/" aria-label="Forside">
            <img src="/assets/MKLOGO.svg" alt="Logo" className="logoImg" />
          </NavLink>
        </div>

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
    </motion.nav>
  );
}
