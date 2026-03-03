import { cn } from "@/lib/utils";

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  className?: string;
  barColor?: string;
}

export function BarChart({
  data,
  height = 200,
  className,
  barColor = "var(--color-primary)",
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.max(100 / data.length - 1, 2);

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${data.length * 28} ${height + 30}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {data.map((d, i) => {
          const barH = (d.value / maxValue) * height;
          const x = i * 28 + 2;
          const y = height - barH;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={Math.min(barWidth, 22)}
                height={barH}
                rx={3}
                fill={barColor}
                opacity={0.85}
              >
                <title>{`${d.label}: ${d.value}`}</title>
              </rect>
              {data.length <= 15 && (
                <text
                  x={x + Math.min(barWidth, 22) / 2}
                  y={height + 14}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize="8"
                >
                  {d.label}
                </text>
              )}
              {d.value > 0 && (
                <text
                  x={x + Math.min(barWidth, 22) / 2}
                  y={y - 4}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize="7"
                >
                  {d.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
