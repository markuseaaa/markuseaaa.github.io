import TypingSubtitle from "../components/TypingSubtitle.jsx";
import GlassCard from "../components/GlassCard.jsx";
import GlassPill from "../components/GlassPill.jsx";
import { Link } from "react-router";
import CinematicStage from "../components/CinematicStage.jsx";
import ParallaxStack from "../components/ParallaxStack.jsx";
import ProjectSection from "../components/ProjectSection.jsx";
import Skills from "../components/Skills.jsx";

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

      <ProjectSection />

      <Skills />

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
    </>
  );
}
