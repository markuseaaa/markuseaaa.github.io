/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import reactlogo from "/public/assets/react.png";
import jslogo from "/public/assets/javascript.png";
import csslogo from "/public/assets/css.png";
import htmllogo from "/public/assets/html.png";
import githublogo from "/public/assets/github.png";
import figmalogo from "/public/assets/figma.svg";
import premiereprologo from "/public/assets/premierepro.png";
import vscodelogo from "/public/assets/vsc.png";
import canvalogo from "/public/assets/canva.svg";
import adobelogo from "/public/assets/adobe.png";

const ICONS = [
  { src: reactlogo, alt: "React", label: "React" },
  {
    src: jslogo,
    alt: "JavaScript",
    label: "JavaScript",
  },
  { src: csslogo, alt: "CSS" },
  { src: htmllogo, alt: "HTML" },
  { src: githublogo, alt: "GitHub" },
  { src: figmalogo, alt: "Figma" },
  {
    src: premiereprologo,
    alt: "Premiere Pro",
  },
  {
    src: vscodelogo,
    alt: "Visual Studio Code",
  },
  { src: canvalogo, alt: "Canva" },
  { src: adobelogo, alt: "Adobe" },
];

export default function Skills({
  title = "Skills",
  subtitle = "Udvalgte værktøjer og teknologier jeg arbejder med til dagligt.",
  radius = 500,
  maxRotate = 300,
}) {
  const sectionRef = useRef(null);

  const progress = useMotionValue(0);
  const progressSpring = useSpring(progress, {
    stiffness: 120,
    damping: 24,
    mass: 0.6,
  });

  const wheelRotate = useTransform(progressSpring, [0, 1], [0, -maxRotate]);
  const counterRotate = useTransform(wheelRotate, (v) => -v);

  const positioned = useMemo(() => {
    const n = ICONS.length;
    return ICONS.map((icon, i) => {
      const angleDeg = (i / n) * 360;
      const angle = (angleDeg * Math.PI) / 180;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return { ...icon, x, y };
    });
  }, [radius]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const start = vh;
      const end = -rect.height * 0.6;
      const p = (rect.top - end) / (start - end);
      const clamped = Math.max(0, Math.min(1, 1 - p));
      progress.set(clamped);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [progress]);

  const wheelSize = radius * 2 + 200;

  return (
    <section className="skillsSection" ref={sectionRef}>
      <div className="skillsInner">
        <div className="wheelWrap" style={{ minHeight: wheelSize }}>
          {/* Rotating icons */}
          <motion.div
            className="wheel"
            style={{
              rotate: wheelRotate,
              width: wheelSize,
              height: wheelSize,
            }}
            aria-hidden="true"
          >
            {positioned.map((icon, idx) => (
              <div
                key={idx}
                className="wheelItem"
                style={{ transform: `translate(${icon.x}px, ${icon.y}px)` }}
              >
                <motion.div
                  style={{ rotate: counterRotate }}
                  className="wheelItemInner"
                >
                  <img
                    src={icon.src}
                    alt={icon.alt}
                    width="96"
                    height="96"
                    draggable="false"
                  />
                </motion.div>
              </div>
            ))}
          </motion.div>

          {/* Static text overlay in the center */}
          <div className="wheelCenterContent">
            <h2 className="skillsTitle">{title}</h2>
            <p className="skillsSubtitle">{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
