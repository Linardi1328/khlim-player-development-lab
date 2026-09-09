export default function Loading() {
  return (
    <div
      className="page"
      aria-busy="true"
      role="status"
      aria-label="Loading development information"
    >
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-hero" />
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton skeleton-stat" />
        ))}
      </div>
      <span className="sr-only">Loading development information…</span>
    </div>
  );
}
