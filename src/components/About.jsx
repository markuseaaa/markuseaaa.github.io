/* eslint-disable no-unused-vars */
import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
const ROW_GAP = 80;
const LANES = Array.from(
  { length: ROWS },
  (_, i) => (i - (ROWS - 1) / 2) * ROW_GAP
);

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

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });

  const WORDS = useMemo(() => {
    const start0 = 0.06;
    const slotGap = 0.05;
    const travel = 0.18;

    return WORDS_TEXTS.map((t, i) => {
      const inAt = start0 + i * slotGap;
      const outAt = inAt + travel;
      return {
        t,
        row: i,
        side: i % 2 === 0 ? "L" : "R",
        size: 108,
        inAt,
        outAt,
      };
    });
  }, []);

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
          <div className="wordsLayer" aria-hidden="true">
            {WORDS.map((w, i) => (
              <Word key={`${w.t}-${i}`} cfg={w} progress={scrollYProgress} />
            ))}
          </div>

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
                  src="/assets/markus-portrait.jpg"
                  alt="Portræt af Markus Kristensen"
                  className="aw-img"
                />
                <div className="aw-shine" aria-hidden="true" />
              </figure>

              <div className="glass aw-card">
                <p className="aboutLead">
                  Multimediedesign studerende fra Aarhus med fokus på{" "}
                  <strong>effekter</strong>, <strong>impactful design</strong>{" "}
                  og <strong>moderne UI</strong>.
                </p>
                <p className="aboutBody muted">
                  Jeg arbejder struktureret med rene komponenter, tydelig
                  interaktion og moderne design. Ofte med gradueringer – altid
                  med læsbarhed og flow i fokus. <br />
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
