import GlassCard from "../components/GlassCard.jsx";
import GlassPill from "../components/GlassPill.jsx";

export default function Contact() {
  return (
    <div className="center">
      <GlassCard>
        <h2 className="h2">Kontakt mig</h2>
        <p className="muted">Send en mail til: markus@example.com</p>
        <div style={{ marginTop: "1rem" }}>
          <GlassPill
            onClick={() => (window.location = "mailto:markus@example.com")}
          >
            Skriv en mail
          </GlassPill>
        </div>
      </GlassCard>
    </div>
  );
}
