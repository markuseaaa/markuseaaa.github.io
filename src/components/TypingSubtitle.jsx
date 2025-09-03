import React, { useEffect, useMemo, useRef, useState } from "react";

export default function TypingSubtitle({
  items = [
    "Multimediedesigner",
    "Grafisk designer",
    "Webdesigner",
    "UX/UI designer",
    "Frontend-udvikler",
    "Videoredigerer",
  ],
  typingSpeed = 55,
  deletingSpeed = 35,
  startPause = 300,
  endPause = 1200,
  className = "",
}) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [mode, setMode] = useState("idle"); // idle → typing → deleting
  const timerRef = useRef();

  const phrases = useMemo(
    () =>
      items
        .filter(Boolean)
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    [items]
  );

  // Hook: detect reduced motion
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Always clear timers when unmounting
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Typing logic (only runs if not reduced motion)
  useEffect(() => {
    if (reduceMotion || phrases.length === 0) return;

    clearTimeout(timerRef.current);
    const current = phrases[phraseIndex];

    if (mode === "idle") {
      timerRef.current = setTimeout(() => setMode("typing"), startPause);
      return;
    }

    if (mode === "typing") {
      if (display.length < current.length) {
        timerRef.current = setTimeout(() => {
          setDisplay(current.slice(0, display.length + 1));
        }, typingSpeed);
      } else {
        timerRef.current = setTimeout(() => setMode("deleting"), endPause);
      }
      return;
    }

    if (mode === "deleting") {
      if (display.length > 0) {
        timerRef.current = setTimeout(() => {
          setDisplay(current.slice(0, display.length - 1));
        }, deletingSpeed);
      } else {
        setPhraseIndex((i) => (i + 1) % phrases.length);
        setMode("typing");
      }
      return;
    }
  }, [
    mode,
    display,
    phraseIndex,
    phrases,
    typingSpeed,
    deletingSpeed,
    startPause,
    endPause,
    reduceMotion,
  ]);

  // If reduced motion → just show first phrase
  const textToShow = reduceMotion ? phrases[0] ?? "" : display;

  return (
    <p aria-live="polite" className={`subtitle typewriter ${className}`}>
      {textToShow}
      {!reduceMotion && <span className="caret" aria-hidden="true" />}
    </p>
  );
}
