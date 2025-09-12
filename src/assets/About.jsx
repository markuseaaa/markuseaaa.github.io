/* eslint-disable no-unused-vars */
import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import mePortrait from "../assets/markus-portrait.jpg";

/** EXACT order, one word per row, alternating side */
const WORDS_TEXTS = [
  "Kreativ",
  "Ambitiøs",
  "Problemløser",
  "Detaljeorienteret",
  "Innovativ",
  "Historiefortæller",
  "Visuel",
  "Struktureret",
  "Eksperimenterende",
];

/* layout: one lane per word */
const ROWS = WORDS_TEXTS.length;
const ROW_GAP = 80; // vertical distance between rows (fits 9 rows nicely)
const LANES = Array.from(
  { length: ROWS },
  (_, i) => (i - (ROWS - 1) / 2) * ROW_GAP
);

/* one moving word (no randomness) */
function Word({ cfg, progress }) {
  const { t, side, row, size, inAt, outAt } = cfg;

  const fromVW = side === "L" ? -48 : 48;
  const toVW = side === "L" ? 48 : -48;

  const x = useTransform(
    progress,
    [0, inAt, outAt, 1],
    [fromVW, fromVW, toVW, toVW]
  );
  const opacity = useTransform(
    progress,
    [inAt - 0.04, inAt + 0.02, outAt - 0.02, outAt + 0.04],
    [0, 1, 1, 0]
  );
  const mid = (inAt + outAt) / 2;
  const scale = useTransform(progress, [inAt, mid, outAt], [0.98, 1.06, 0.98]);

  return (
    <motion.div
      className="word"
      style={{
        x: useTransform(x, (v) => `${v}vw`),
        y: LANES[row],
        opacity,
        scale,
        fontSize: size,
      }}
    >
      {t}
    </motion.div>
  );
}

export default function AboutWordsParallax() {
  const pinRef = useRef(null);

  // progress 0→1 exactly while the pin wrapper scrolls (see CSS --pinDur)
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });

  // Build a strict sequence: row = index, side alternates, fixed slot gap & travel
  const WORDS = useMemo(() => {
    const start0 = 0.06; // when first word appears
    const slotGap = 0.05; // spacing between words (smaller = faster sequence)
    const travel = 0.18; // how long each word crosses (smaller = faster disappear)

    return WORDS_TEXTS.map((t, i) => {
      const inAt = start0 + i * slotGap;
      const outAt = inAt + travel;
      return {
        t,
        row: i, // one row per word
        side: i % 2 === 0 ? "L" : "R", // alternate left/right
        size: 108, // consistent size
        inAt,
        outAt,
      };
    });
  }, []);

  // Last exit → reveal right after (no long gap)
  const lastExit = useMemo(
    () => Math.max(...WORDS.map((w) => w.outAt)),
    [WORDS]
  );

  const contentOpacity = useTransform(
    scrollYProgress,
    [lastExit + 0.005, lastExit + 0.06, lastExit + 0.12],
    [0, 1, 1]
  );
  const contentBlur = useTransform(
    scrollYProgress,
    [lastExit + 0.005, lastExit + 0.06],
    [12, 0]
  );
  const contentLift = useTransform(
    scrollYProgress,
    [lastExit + 0.02, lastExit + 0.12],
    [14, 0]
  );

  return (
    <section className="aboutWords" aria-labelledby="aboutWordsTitle">
      <div className="aw-pinWrap" ref={pinRef}>
        <div className="aw-stage">
          {/* 1) Words in strict order */}
          <div className="wordsLayer" aria-hidden="true">
            {WORDS.map((w, i) => (
              <Word key={`${w.t}-${i}`} cfg={w} progress={scrollYProgress} />
            ))}
          </div>

          {/* 2) Content reveals immediately after last word clears */}
          <motion.div
            className="aw-contentOverlay"
            style={{
              opacity: contentOpacity,
              filter: useTransform(contentBlur, (v) => `blur(${v}px)`),
              y: contentLift,
            }}
          >
            <header className="aw-header center">
              <h2 id="aboutWordsTitle" className="skillsTitle">
                Om mig
              </h2>
              <p className="skillsSubtitle aboutSubtitle">
                “Jeg bygger oplevelser, der føles flydende, performer godt og
                forstærker brandet.”
              </p>
            </header>

            <div className="aw-grid">
              <figure className="aw-photo">
                <img
                  src={mePortrait}
                  alt="Portræt af Markus Kristensen"
                  className="aw-img"
                />
                <div className="aw-shine" aria-hidden="true" />
              </figure>

              <div className="glass aw-card">
                <p className="aboutLead">
                  Multimediedesigner fra Aarhus med fokus på{" "}
                  <strong>parallax</strong>, <strong>micro-interactions</strong>{" "}
                  og <strong>moderne UI</strong>.
                </p>
                <p className="aboutBody muted">
                  Jeg arbejder struktureret med rene komponenter, tydelig
                  interaktion og performance. Ofte med 3D/animation – altid med
                  læsbarhed og flow i fokus. <br />
                  <br />
                  Når jeg ikke designer eller koder, er min store passion Kpop
                  (koreansk popmusik). Jeg er vild med de farverige
                  musikvideoer, de kreative koncepter og de imponerende danse.
                  Det er en stor inspirationskilde for mig, og jeg elsker at
                  følge med i de nyeste trends inden for genren.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
