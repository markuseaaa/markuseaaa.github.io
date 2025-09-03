import React, { useEffect, useRef, useState } from "react";

export default function ParallaxStack({
  children,
  speed = 0.18,
  className = "",
}) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const activeRef = useRef(false);
  const rafRef = useRef();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisible(true); // reveal once
          activeRef.current = true;
          start();
        } else {
          activeRef.current = false;
          stop();
          if (innerRef.current) innerRef.current.style.transform = "";
        }
      },
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function start() {
    if (rafRef.current) return;
    const tick = () => {
      if (!activeRef.current) {
        rafRef.current = null;
        return;
      }
      applyParallax();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }
  function stop() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function applyParallax() {
    const el = wrapRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    // relative center: -1 at top, 0 center, +1 bottom
    const rel = (rect.top + rect.height / 2 - vh / 2) / vh;
    const offset = -rel * (speed * vh); // invert for premium feel
    inner.style.transform = `translateY(${offset.toFixed(1)}px)`;
  }

  return (
    <div
      ref={wrapRef}
      className={`stackItem ${visible ? "is-visible" : ""} ${className}`}
    >
      <div ref={innerRef} className="stackParallax">
        {children}
      </div>
    </div>
  );
}
