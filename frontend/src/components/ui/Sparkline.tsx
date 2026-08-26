interface SparklineProps {
  values: number[];
  colorClassName?: string;
}

/** Small bar-chart trend indicator. Renders oldest-to-newest left-to-right. */
export function Sparkline({ values, colorClassName = 'bg-red-500' }: SparklineProps) {
  if (values.length === 0) return null;
  const ordered = [...values].reverse();
  const min = Math.min(...ordered);
  const max = Math.max(...ordered);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-1 h-6" aria-hidden="true">
      {ordered.map((v, i) => {
        const heightPct = 25 + ((v - min) / range) * 75;
        return (
          <div
            key={i}
            className={`w-1.5 rounded-sm ${colorClassName} ${i === ordered.length - 1 ? 'opacity-100' : 'opacity-40'}`}
            style={{ height: `${heightPct}%` }}
          />
        );
      })}
    </div>
  );
}
