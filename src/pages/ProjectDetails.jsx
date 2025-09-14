/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [err, setErr] = useState("");

  // Hent data og find projektet
  useEffect(() => {
    let alive = true;
    fetch("/projects.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!alive) return;
        const found = (Array.isArray(data) ? data : []).find(
          (p) => p.slug === slug
        );
        setProject(found ?? null);
      })
      .catch(() => alive && setErr("Kunne ikke hente projektet."));
    return () => (alive = false);
  }, [slug]);

  const backToProjects = () =>
    navigate("/", { state: { scrollTo: "#projects" } });

  if (err) {
    return (
      <section
        className="projectDetail container"
        style={{ padding: "80px 24px" }}
      >
        <h1 className="proj-title">Fejl</h1>
        <p>{err}</p>
        <button className="backLink" onClick={backToProjects}>
          ← Tilbage
        </button>
      </section>
    );
  }

  if (!project) {
    return (
      <section
        className="projectDetail container"
        style={{ padding: "80px 24px" }}
      >
        <h1 className="proj-title">Indlæser…</h1>
      </section>
    );
  }

  return (
    <motion.article
      className="projectDetail"
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Sentinel til navbarens transparent/glass logik */}
      <div className="routeTopSentinel" aria-hidden style={{ height: 1 }} />

      <h1 className="projectDetail-title">{project.title}</h1>

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
          <p>{project.longDesc}</p>
        </div>
      </div>

      <footer className="projectDetail-footer">
        <button className="backLink" onClick={backToProjects}>
          ← Tilbage til projekter
        </button>
      </footer>
    </motion.article>
  );
}
