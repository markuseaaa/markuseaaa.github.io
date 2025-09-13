import TypingSubtitle from "../components/TypingSubtitle.jsx";
import ProjectSection from "../components/ProjectSection.jsx";
import Skills from "../components/Skills.jsx";
import About from "../assets/About.jsx";
import Contact from "../components/Contact.jsx";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="heroFull" id="top">
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

      {/* About anchor */}
      <section id="about">
        <About />
      </section>

      {/* Skills (optional anchor if you ever want a nav link) */}
      <section id="skills">
        <Skills />
      </section>

      {/* Projects anchor */}
      <section id="projects">
        <ProjectSection />
      </section>

      {/* Contact anchor (wrap without touching your Contact component) */}
      <section id="contact">
        <Contact />
      </section>
    </>
  );
}
