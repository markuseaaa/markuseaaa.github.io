import React, { useEffect, useRef, useState } from "react";

export default function CinematicStage({
  captions = [
    "Smuk. Enkel. Moderne.",
    "Flydende glass-effekt.",
    "Fokus på detaljer.",
    "Bygget til performance.",
  ],
  heightVh = 400,
  bgUrl = "/baggrund.png",
  deviceContent,
}) {
  const wrapRef = useRef(null);
  const [p, setP] = useState(0); // 0..1 scroll progress

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let ticking = false;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(total, Math.max(0, -rect.top));
      const progress = total > 0 ? scrolled / total : 0;
      setP(progress);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };
    const onResize = () => onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Easing helpers
  const ease = (t) =>
    t < 0
      ? 0
      : t > 1
      ? 1
      : t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;

  // Device subtle motion (feels premium)
  const scale = 0.92 + 0.12 * ease(p); // 0.92 → 1.04
  const translateY = (1 - ease(p)) * 28 - 14; // drift −14px…+14px
  const backdropSat = 120 + Math.round(60 * ease(p));
  const backdropBlur = 14 + Math.round(10 * ease(p));

  // Caption crossfade: divide progress across captions
  const n = Math.max(1, captions.length);
  const idxFloat = p * (n - 1);
  const opFor = (i) => {
    const d = Math.abs(i - idxFloat); // distance from active
    return Math.max(0, 1 - d * 2); // fade out fast when leaving
  };

  return (
    <section
      ref={wrapRef}
      className="cin-wrap"
      style={{ height: `${heightVh}vh` }}
    >
      <div className="cin-stage" style={{ ["--bgUrl"]: `url('${bgUrl}')` }}>
        <div
          className="cin-device"
          style={{
            transform: `translateY(${translateY}px) scale(${scale})`,
            backdropFilter: `saturate(${backdropSat}%) blur(${backdropBlur}px)`,
            WebkitBackdropFilter: `saturate(${backdropSat}%) blur(${backdropBlur}px)`,
          }}
        >
          {/* Device / visual */}
          {deviceContent ?? (
            <div className="cin-device-placeholder">
              {/* Placeholder visual — replace with an <img src="/your-image.png" /> if you want */}
              <div className="device-screen" />
            </div>
          )}
        </div>

        <div className="cin-captions" aria-live="polite">
          {captions.map((t, i) => (
            <div key={i} className="cin-cap" style={{ opacity: opFor(i) }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
