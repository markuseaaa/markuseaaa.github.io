import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router";
import GlassCard from "./components/GlassCard.jsx";
import GlassPill from "./components/GlassPill.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  // Respect reduced motion for any future animations
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const set = () => root.classList.toggle("reduce-motion", mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  return (
    <div className="page">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projekter" element={<Projects />} />
          <Route path="/kontakt" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="heroInner glass">
          <div className="heroText">
            <h1 className="title">Markus Kristensen</h1>
            <p className="subtitle">
              Multimediedesigner • Frontend • Interaktive oplevelser
            </p>
            <div className="ctaRow">
              <GlassPill
                onClick={() => (window.location = "mailto:markus@example.com")}
              >
                Kontakt mig
              </GlassPill>
              <Link to="/projekter" className="pill linkPill">
                Se projekter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <GlassCard>
        <h2 className="h2">Udvalgte højdepunkter</h2>
        <div className="stats">
          <div className="stat">
            <strong>20+</strong>
            <span>Web/UX leverancer</span>
          </div>
          <div className="stat">
            <strong>5</strong>
            <span>Brandguides</span>
          </div>
          <div className="stat">
            <strong>10k+</strong>
            <span>Brugere nået</span>
          </div>
        </div>
      </GlassCard>

      {/* FEATURED PROJECTS PREVIEW */}
      <GlassCard>
        <h2 className="h2">Udvalgte projekter</h2>
        <div className="grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="tile">
              <div className="thumb" />
              <div className="tileCaption">Projekt {i + 1}</div>
              <div className="shine" aria-hidden="true" />
            </div>
          ))}
        </div>
        <div className="center" style={{ marginTop: "1rem" }}>
          <Link to="/projekter" className="pill linkPill">
            Se alle projekter
          </Link>
        </div>
      </GlassCard>

      {/* ABOUT SHORT */}
      <GlassCard>
        <h2 className="h2">Kort om mig</h2>
        <p className="muted">
          Jeg designer og udvikler moderne, interaktive oplevelser med fokus på
          performance, micro-interactions og klar brandidentitet. Elsker at
          kombinere motion, React og visuelt stærke interfaces.
        </p>
      </GlassCard>
    </>
  );
}

function Projects() {
  return (
    <GlassCard>
      <h2 className="h2">Alle projekter</h2>
      <div className="grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="tile">
            <div className="thumb" />
            <div className="tileCaption">Projekt {i + 1}</div>
            <div className="shine" aria-hidden="true" />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function Contact() {
  return (
    <div className="center">
      <GlassCard>
        <h2 className="h2">Kontakt mig</h2>
        <p className="muted">Send en mail til: markus@example.com</p>
        <div style={{ marginTop: "1rem" }}>
          <GlassPill
            onClick={() => (window.location = "mailto:markus@example.com")}
          >
            Skriv en mail
          </GlassPill>
        </div>
      </GlassCard>
    </div>
  );
}
