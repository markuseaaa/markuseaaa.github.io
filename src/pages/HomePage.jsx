import TypingSubtitle from "../components/TypingSubtitle.jsx";
import ProjectSection from "../components/ProjectSection.jsx";
import Skills from "../components/Skills.jsx";
import About from "../assets/About.jsx";

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

      <About />
    </>
  );
}
