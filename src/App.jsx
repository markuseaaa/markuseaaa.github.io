import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
  return (
    <div className="page">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ommig" element={<About />} />
          <Route path="/projekter" element={<Projects />} />
          <Route path="/kontakt" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}
