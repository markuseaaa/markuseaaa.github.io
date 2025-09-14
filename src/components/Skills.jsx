/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useRef, useState } from "react";
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
  { src: jslogo, alt: "JavaScript", label: "JavaScript" },
  { src: csslogo, alt: "CSS" },
  { src: htmllogo, alt: "HTML" },
  { src: githublogo, alt: "GitHub" },
  { src: figmalogo, alt: "Figma" },
  { src: premiereprologo, alt: "Premiere Pro" },
  { src: vscodelogo, alt: "Visual Studio Code" },
  { src: canvalogo, alt: "Canva" },
  { src: adobelogo, alt: "Adobe" },
];

export default function Skills({
  title = "Skills",
  subtitle = "Udvalgte værktøjer og programmer jeg kan benytte til at opnå de specifikke mål",
  maxRotate = 300,
}) {
  const sectionRef = useRef(null);

  // === Responsiv radius & ikonstørrelse ===
  const [radius, setRadius] = useState(320);
  const [iconSize, setIconSize] = useState(96);

  useEffect(() => {
    const recalc = () => {
      const el = sectionRef.current;
      const containerW =
        (el?.getBoundingClientRect?.().width ?? window.innerWidth) || 1200;

      if (containerW <= 600) {
        // Telefon
        setRadius(165); // lille radius
        setIconSize(52);
      } else if (containerW <= 900) {
        // Tablet
        setRadius(250); // medium radius
        setIconSize(72);
      } else {
        // Desktop → samme som din gamle
        setRadius(500);
        setIconSize(96);
      }
    };

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  // === Scroll progress → rotation ===
  const progress = useMotionValue(0);
  const progressSpring = useSpring(progress, {
    stiffness: 120,
    damping: 24,
    mass: 0.6,
  });

  const wheelRotate = useTransform(progressSpring, [0, 1], [0, -maxRotate]);
  const counterRotate = useTransform(wheelRotate, (v) => -v);

  // Positionér ikoner i cirkel ud fra radius
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

  // Scroll-tracking for rotation
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

  // Wheel “canvas”-størrelse: radius på begge sider + lidt luft til ikoner
  const wheelPadding = Math.round(iconSize + 40);
  const wheelSize = Math.round(radius * 2 + wheelPadding);

  return (
    <section className="skillsSection" ref={sectionRef}>
      <div className="skillsInner">
        {/* Brug minHeight = wheelSize, så wrap ikke klipper */}
        <div className="wheelWrap" style={{ minHeight: wheelSize }}>
          {/* Selve hjulet */}
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
                    width={iconSize}
                    height={iconSize}
                    draggable="false"
                    style={{ display: "block" }}
                  />
                </motion.div>
              </div>
            ))}
          </motion.div>

          {/* Tekst i midten */}
          <div className="wheelCenterContent">
            <h2 className="skillsTitle">{title}</h2>
            <p className="skillsSubtitle">{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
