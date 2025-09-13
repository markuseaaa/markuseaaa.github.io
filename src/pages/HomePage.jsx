/* eslint-disable no-unused-vars */
// src/pages/HomePage.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";

import TypingSubtitle from "../components/TypingSubtitle.jsx";
import ProjectSection from "../components/ProjectSection.jsx";
import Skills from "../components/Skills.jsx";
import About from "../assets/About.jsx";
import Contact from "../components/Contact.jsx";

// Læs navbar-højde fra CSS variabel
function getNavH() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--navH")
    .trim();
  const n = parseInt(raw || "72", 10);
  return Number.isFinite(n) ? n : 72;
}

const heroParent = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.22, delayChildren: 0.15 },
  },
};
const heroChild = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll til sektion hvis der er sendt state (fx fra ProjectDetail)
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;

    let tries = 0;
    const maxTries = 30; // prøv i ~600ms
    const tick = () => {
      const el = document.querySelector(target);
      if (el) {
        const y =
          el.getBoundingClientRect().top + window.scrollY - getNavH() - 8;
        window.scrollTo({ top: y, behavior: "smooth" });
        // Fjern state så det ikke kører igen
        navigate(location.pathname, { replace: true, state: null });
      } else if (tries++ < maxTries) {
        setTimeout(tick, 20);
      }
    };
    requestAnimationFrame(() => setTimeout(tick, 0));
  }, [location.state, location.pathname, navigate]);

  return (
    <>
      {/* HERO */}
      <section className="heroFull" id="top">
        <motion.div
          className="heroCenter"
          variants={heroParent}
          initial="hidden"
          animate="show"
        >
          <motion.h1 className="title" variants={heroChild}>
            Markus Kristensen
          </motion.h1>
          <motion.div variants={heroChild}>
            <TypingSubtitle />
          </motion.div>
          <motion.div
            className="scrollArrow"
            variants={heroChild}
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* About */}
      <section id="about">
        <About />
      </section>

      {/* Skills */}
      <section id="skills">
        <Skills />
      </section>

      {/* Projects */}
      <section id="projects">
        <ProjectSection />
      </section>

      {/* Contact */}
      <section id="contact">
        <Contact />
      </section>
    </>
  );
}
