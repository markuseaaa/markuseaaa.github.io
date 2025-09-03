export default function GlassPill({ children, onClick }) {
  return (
    <button className="pill" type="button" onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}
