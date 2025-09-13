/* eslint-disable no-unused-vars */
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import projects from "../data/projects.json";

// Hjælpemetode: læs navbar-højde
function getNavH() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--navH")
    .trim();
  const n = parseInt(raw || "72", 10);
  return Number.isFinite(n) ? n : 72;
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const project = projects.find((p) => p.slug === slug);

  // Når man klikker tilbage
  const backToProjects = () => {
    navigate("/", { state: { scrollTo: "#projects" } });
  };

  if (!project) {
    return (
      <section className="projectDetail container">
        <h1 className="proj-title">Projekt ikke fundet</h1>
        <button className="backLink" onClick={backToProjects}>
          ← Tilbage
        </button>
      </section>
    );
  }

  return (
    <motion.article
      className="projectDetail"
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* sentinel til navbar-scroll logik */}
      <div className="routeTopSentinel" aria-hidden />

      {/* titel */}
      <h1 className="projectDetail-title">{project.title}</h1>

      {/* grid: billede venstre, tekst højre */}
      <div className="projectDetail-grid">
        <figure className="projectDetail-figure">
          <img
            src={project.image}
            alt={project.title}
            className="projectDetail-image"
          />
        </figure>

        <div className="projectDetail-body glass">
          {project.tags && <p className="projectDetail-tags">{project.tags}</p>}
          <p>{project.desc}</p>
        </div>
      </div>

      {/* tilbage-knap */}
      <footer className="projectDetail-footer">
        <button className="backLink" onClick={backToProjects}>
          ← Tilbage til projekter
        </button>
      </footer>
    </motion.article>
  );
}
