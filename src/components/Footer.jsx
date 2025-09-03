import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <nav className="footerNav">
          <Link to="/ommig" className="footerLink">
            Om Mig
          </Link>
          <Link to="/projekter" className="footerLink">
            Projekter
          </Link>
          <Link to="/kontakt" className="footerLink">
            Kontakt
          </Link>
        </nav>
        <p className="footerCopy">
          © {new Date().getFullYear()} Markus Kristensen
        </p>
      </div>
    </footer>
  );
}
