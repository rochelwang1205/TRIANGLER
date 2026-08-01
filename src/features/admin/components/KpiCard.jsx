export default function KpiCard({ label, value, prefix = '' }) {
  return (
    <div className="kpi-card">
      <p className="kpi-card__label">{label}</p>
      <strong className="kpi-card__value">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
      </strong>
    </div>
  );
}
