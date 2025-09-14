/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

function ProjectSlide({ project, index, total, progress }) {
  const segments = total + 1; // N slides + 1 tail
  const segSize = 1 / segments;

  const start = index * segSize;
  const end = (index + 1) * segSize;

  const isFirst = index === 0;
  const isSecond = index === 1;

  const BASE_IN = segSize * 0.1;
  const BASE_OUT = segSize * 0.06;

  const thisOverlapIn = isSecond ? segSize * 0.02 : BASE_IN;
  const thisOverlapOut = isFirst ? segSize * 0.08 : BASE_OUT;

  const GAP_1TO2 = segSize * 0.08;
  const FIRST_ENTER_DELAY = segSize * 0.1;

  const enterStart = isFirst
    ? FIRST_ENTER_DELAY
    : isSecond
    ? start + GAP_1TO2
    : Math.max(0, start - thisOverlapIn);
  const enterEnd = end;

  const HOLD_FRAC_FIRST = 0.5;
  const HOLD_FRAC_OTHERS = 0.2;
  const HOLD_FRAC = isFirst ? HOLD_FRAC_FIRST : HOLD_FRAC_OTHERS;

  const t = useTransform(progress, [enterStart, enterEnd], [0, 1], {
    clamp: true,
  });
  const tSpring = useSpring(t, { stiffness: 120, damping: 22, mass: 0.4 });

  const y = useTransform(tSpring, [0, 1 - HOLD_FRAC, 1], ["100%", "0%", "0%"]);
  const enterOpacity = useTransform(
    tSpring,
    [0, 0.1, 1 - HOLD_FRAC, 1],
    [0, 0.6, 1, 1]
  );

  const extraFadeDelay = isFirst
    ? Math.max(segSize * 0.14, GAP_1TO2 * 0.9)
    : segSize * (HOLD_FRAC * 0.15);
  const fadeStart = end + thisOverlapOut + extraFadeDelay;
  const fadeEnd = fadeStart + segSize * 0.25;
  const fadeAway = useTransform(progress, [fadeStart, fadeEnd], [1, 0], {
    clamp: true,
  });

  const opacity = useTransform([enterOpacity, fadeAway], ([a, b]) => a * b);

  return (
    <motion.article
      className="proj-slide"
      style={{ y, opacity, zIndex: 10 + index }}
    >
      <div className="proj-sep" />
      <div className="proj-body">
        <div className="proj-media">
          <img
            src={project.image}
            alt={project.title}
            className="proj-img"
            loading="lazy"
          />
        </div>
        <div className="proj-info">
          <h3 className="proj-title">{project.title}</h3>
          {project.tags && <p className="proj-tags">{project.tags}</p>}
          <p className="proj-desc">{project.shortDesc}</p>
          <Link className="pill linkPill" to={`/projekter/${project.slug}`}>
            Læs mere
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectSection() {
  const [projects, setProjects] = useState([]);
  const [err, setErr] = useState("");
  const wrapRef = useRef(null);

  // Hent data fra public/projects.json
  useEffect(() => {
    let alive = true;
    fetch("/projects.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (alive) setProjects(Array.isArray(data) ? data : []);
      })
      .catch((e) => alive && setErr("Kunne ikke hente projekter."));
    return () => (alive = false);
  }, []);

  // Framer Motion scroll
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.45,
  });

  const N = projects.length || 1;
  const segments = N + 1;
  const segSize = 1 / segments;

  const blurStart = segSize * 0.36;
  const blurIn = useTransform(
    progress,
    [blurStart, blurStart + segSize * 0.22],
    [0, 1]
  );
  const blurOut = useTransform(progress, [segSize * N, 1], [1, 0]);
  const blurOpacity = useTransform([blurIn, blurOut], ([a, b]) =>
    Math.max(0, Math.min(1, a * b))
  );

  const contentIn = useTransform(
    progress,
    [blurStart + 0.04, blurStart + 0.18],
    [0, 1]
  );
  const contentOut = useTransform(progress, [segSize * N, 1], [1, 0]);
  const contentOpacity = useTransform([contentIn, contentOut], ([a, b]) =>
    Math.max(0, Math.min(1, a * b))
  );

  const titleIn = useTransform(progress, [0.02, 0.12], [0, 1]);
  const titleOut = useTransform(
    progress,
    [segSize * N, segSize * N + 0.04],
    [1, 0]
  );
  const titleOpacity = useTransform([titleIn, titleOut], ([a, b]) => a * b);

  if (err) {
    return (
      <section className="proj-wrap">
        <h2 className="proj-sectionTitle">Projekter</h2>
        <p style={{ opacity: 0.8 }}>{err}</p>
      </section>
    );
  }

  return (
    <section ref={wrapRef} className="proj-wrap">
      <motion.div
        className="proj-blur"
        style={{ opacity: blurOpacity }}
        aria-hidden
      />
      <motion.h2
        className="proj-sectionTitle"
        style={{ opacity: titleOpacity }}
      >
        Projekter
      </motion.h2>

      <div className="proj-stage">
        <motion.div
          className="proj-content"
          style={{ opacity: contentOpacity }}
        >
          <div className="proj-stack">
            {projects.map((p, i) => (
              <ProjectSlide
                key={p.id ?? p.slug ?? i}
                project={p}
                index={i}
                total={projects.length}
                progress={progress}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
