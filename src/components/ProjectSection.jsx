/* eslint-disable no-unused-vars */
import { useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "Portfolio Site",
    image: "/projects/portfolio.jpg",
    tags: "web design, develop, logo design, wordpress",
    desc: "This is my introduction site that also serves as my portfolio.",
    href: "/projekter/portfolio-site",
  },
  {
    id: 2,
    title: "Kokkenes Køkken",
    image: "/projects/kokkenes.jpg",
    tags: "brand, web, performance",
    desc: "Glass UI refresh, accessibility pass, and content architecture.",
    href: "/projekter/kokkenes-koekken",
  },
  {
    id: 3,
    title: "Forenede Service",
    image: "/projects/forenede.jpg",
    tags: "campaigns, year wheel, print",
    desc: "Seasonal storytelling and a practical brand & safety year wheel.",
    href: "/projekter/forenede-service",
  },
];

function ProjectSlide({ project, index, total, progress }) {
  const segments = total + 1; // N slides + 1 fade-out tail
  const segSize = 1 / segments;

  const start = index * segSize;
  const end = (index + 1) * segSize;

  const isFirst = index === 0;
  const isSecond = index === 1;

  // Baseline overlap
  const BASE_IN = segSize * 0.1; // hvor tidligt næste slide må starte
  const BASE_OUT = segSize * 0.06; // hvor længe et slide bliver hængende

  // Per-slide overlap (mere luft efter #1)
  const thisOverlapIn = isSecond ? segSize * 0.02 : BASE_IN;
  const thisOverlapOut = isFirst ? segSize * 0.08 : BASE_OUT;

  // Ekstra spacing kun mellem 1 → 2
  const GAP_1TO2 = segSize * 0.08; // TWEAK: 0.05–0.12

  // #1: lidt senere start
  const FIRST_ENTER_DELAY = segSize * 0.1; // TWEAK: 0.08–0.12

  // Entry-vindue
  const enterStart = isFirst
    ? FIRST_ENTER_DELAY
    : isSecond
    ? start + GAP_1TO2
    : Math.max(0, start - thisOverlapIn);
  const enterEnd = end;

  // --- HOLD (dwell) ---
  const HOLD_FRAC_FIRST = 0.5; // længere/større hold for #1 (TWEAK: 0.28–0.36)
  const HOLD_FRAC_OTHERS = 0.2;
  const HOLD_FRAC = isFirst ? HOLD_FRAC_FIRST : HOLD_FRAC_OTHERS;

  // Lokal progress 0..1
  const t = useTransform(progress, [enterStart, enterEnd], [0, 1], {
    clamp: true,
  });
  const tSpring = useSpring(t, { stiffness: 120, damping: 22, mass: 0.4 });

  // Glide op → HOLD ved y=0
  const y = useTransform(tSpring, [0, 1 - HOLD_FRAC, 1], ["100%", "0%", "0%"]);

  // Bliv synlig tidligt og forbliv 1 under holdet
  const enterOpacity = useTransform(
    tSpring,
    [0, 0.1, 1 - HOLD_FRAC, 1],
    [0, 0.6, 1, 1]
  );

  // Udskyd fade lidt ekstra for #1 så hold’et føles tydeligt
  const extraFadeDelay = isFirst
    ? Math.max(segSize * 0.14, GAP_1TO2 * 0.9) // TWEAK: øg/sænk for mere/mindre hold
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
          <p className="proj-desc">{project.desc}</p>
          <Link className="pill linkPill" to={project.href}>
            Read more
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectSection() {
  const wrapRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.45,
  });

  const N = projects.length;
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

  // Title fades in when entering, fades out with last project
  const titleIn = useTransform(progress, [0.02, 0.12], [0, 1]);
  const titleOut = useTransform(
    progress,
    [segSize * N, segSize * N + 0.04],
    [1, 0]
  );
  const titleOpacity = useTransform([titleIn, titleOut], ([a, b]) => a * b);

  return (
    <section ref={wrapRef} className="proj-wrap">
      {/* Blur overlay */}
      <motion.div
        className="proj-blur"
        style={{ opacity: blurOpacity }}
        aria-hidden
      ></motion.div>

      {/* Sticky section title */}
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
                key={p.id}
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
