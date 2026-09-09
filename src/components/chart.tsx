import { formatDate } from "@/lib/domain";
export function LineChart({
  points,
  label,
  unit,
  min = 0,
  max,
  color = "#4d6b38",
}: {
  points: { date: Date; value: number }[];
  label: string;
  unit: string;
  min?: number;
  max: number;
  color?: string;
}) {
  const width = 640,
    height = 210,
    left = 40,
    right = 22,
    top = 18,
    bottom = 38;
  const start = points[0]?.date.getTime() ?? 0;
  const end = points.at(-1)?.date.getTime() ?? start;
  const x = (date: Date) =>
    end === start
      ? (width + left - right) / 2
      : left +
        ((date.getTime() - start) / (end - start)) * (width - left - right);
  const y = (value: number) =>
    top + (1 - (value - min) / (max - min)) * (height - top - bottom);
  const line = points.map((p) => `${x(p.date)},${y(p.value)}`).join(" ");
  return (
    <div className="chart">
      <svg
        role="img"
        aria-label={`${label}. ${points.length} recorded check-ins. ${points.map((p) => `${formatDate(p.date)}: ${p.value.toFixed(1)} ${unit}`).join("; ")}`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <title>{label}</title>
        {[0, 1, 2, 3, 4].map((step) => {
          const value = min + ((max - min) * step) / 4;
          return (
            <g key={step}>
              <line
                x1={left}
                x2={width - right}
                y1={y(value)}
                y2={y(value)}
                stroke="#e7e8e0"
                strokeDasharray="3 4"
              />
              <text
                x={left - 12}
                y={y(value) + 4}
                textAnchor="end"
                fill="#64705e"
                fontSize="11"
              >
                {Number(value.toFixed(1))}
              </text>
            </g>
          );
        })}
        {points.length > 1 && (
          <polygon
            points={`${left},${height - bottom} ${line} ${width - right},${height - bottom}`}
            fill={color}
            opacity="0.07"
          />
        )}
        <polyline
          points={line}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={x(p.date)}
              cy={y(p.value)}
              r="4"
              fill={color}
              stroke="white"
              strokeWidth="2"
            >
              <title>
                {formatDate(p.date)}: {p.value.toFixed(2)} {unit}
              </title>
            </circle>
            {(i === 0 || i === points.length - 1 || points.length <= 5) && (
              <text
                x={x(p.date)}
                y={height - 10}
                textAnchor={
                  i === 0 && points.length > 1
                    ? "start"
                    : i === points.length - 1 && points.length > 1
                      ? "end"
                      : "middle"
                }
                fill="#64705e"
                fontSize="11"
              >
                {new Intl.DateTimeFormat("en-GB", {
                  day: "numeric",
                  month: "short",
                  timeZone: "UTC",
                }).format(p.date)}
              </text>
            )}
          </g>
        ))}
      </svg>
      {points.length === 1 && (
        <p className="field-help">
          One check-in recorded. The next will start a trend.
        </p>
      )}
    </div>
  );
}
