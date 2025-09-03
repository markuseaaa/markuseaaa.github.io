import TypingSubtitle from "../components/TypingSubtitle.jsx";
import GlassCard from "../components/GlassCard.jsx";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="heroFull">
        <div className="heroCenter">
          <h1 className="title">Markus Kristensen</h1>
          <TypingSubtitle />
          <div
            className="scrollArrow"
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            ↓
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
    </>
  );
}
