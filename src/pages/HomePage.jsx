import TypingSubtitle from "../components/TypingSubtitle.jsx";
import GlassCard from "../components/GlassCard.jsx";
import GlassPill from "../components/GlassPill.jsx";
import { Link } from "react-router";
import CinematicStage from "../components/CinematicStage.jsx";
import ParallaxStack from "../components/ParallaxStack.jsx";

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

      {/* APPLE-STYLE CINEMATIC STAGE */}
      <CinematicStage
        heightVh={400} // try 400–600 depending on how long you want it pinned
        bgUrl="/baggrund.png" // fixed background during this section
        captions={[
          "Smuk. Enkel. Moderne.",
          "Flydende glass-effekt.",
          "Fokus på detaljer.",
          "Bygget til performance.",
        ]}
        // optional: replace the placeholder with a real image or composition:
        deviceContent={
          <img
            src="/placeholder-wide.jpg" // swap to your asset, or keep placeholder
            alt="Showcase"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: 22,
            }}
          />
        }
      />

      <ParallaxStack speed={0.2}>
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
      </ParallaxStack>

      <ParallaxStack speed={0.16}>
        <GlassCard>
          <h2 className="h2">Udvalgte projekter</h2>
          <div className="grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="tile">
                <div className="thumb" />
                <div className="tileCaption">Projekt {i + 1}</div>
              </div>
            ))}
          </div>
          <div className="center" style={{ marginTop: "1rem" }}>
            <Link to="/projekter" className="pill linkPill">
              Se alle projekter
            </Link>
          </div>
        </GlassCard>
      </ParallaxStack>

      <ParallaxStack speed={0.12}>
        <GlassCard>
          <h2 className="h2">Kontakt</h2>
          <p className="muted">markus@example.com</p>
          <div style={{ marginTop: "1rem" }}>
            <GlassPill
              onClick={() => (window.location = "mailto:markus@example.com")}
            >
              Skriv en mail
            </GlassPill>
          </div>
        </GlassCard>
      </ParallaxStack>
    </>
  );
}
