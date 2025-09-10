import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Contact from "./pages/Contact.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AnimatedGradientBG from "./components/AnimatedGradientBG.jsx";
import Shape from "./components/Shape.jsx";
import bubbleUrl from "./assets/bubble.png";

export default function App() {
  return (
    <div>
      <AnimatedGradientBG />
      <Shape imgSrc={bubbleUrl} />
      <Navbar />
      <main className="pageContent">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ommig" element={<About />} />
          <Route path="/projekter" element={<Projects />} />
          <Route path="/kontakt" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
