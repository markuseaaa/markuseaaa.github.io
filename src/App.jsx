import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage.jsx";
import ProjectDetail from "./pages/ProjectDetails.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AnimatedGradientBG from "./components/AnimatedGradientBG.jsx";
import PageTransition from "./components/PageTransition.jsx";
import Shape from "./components/Shape.jsx";
import bubbleUrl from "/public/assets/bubble.png";

export default function App() {
  const location = useLocation();

  return (
    <div>
      <AnimatedGradientBG />
      <Shape imgSrc={bubbleUrl} />
      <Navbar />
      <main className="pageContent">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />
            <Route
              path="/projekter/:slug"
              element={
                <PageTransition>
                  <ProjectDetail />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
