import GlassCard from "../components/GlassCard.jsx";

export default function Projects() {
  return (
    <GlassCard>
      <h2 className="h2">Alle projekter</h2>
      <div className="grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="tile">
            <div className="thumb" />
            <div className="tileCaption">Projekt {i + 1}</div>
            <div className="shine" aria-hidden="true" />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
