const statistics = [
  {
    value: "100+",
    label: "Tools planned",
  },
  {
    value: "24/7",
    label: "Free access",
  },
  {
    value: "1",
    label: "Connected learning platform",
  },
  {
    value: "Global",
    label: "Built for students everywhere",
  },
];

export function Statistics() {
  return (
    <section className="stats-section">
      <div className="site-container stats-grid">
        {statistics.map((stat) => (
          <div key={stat.label} className="stat">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}