interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend: string;
  trendColor: "emerald" | "amber";
  iconOnlyTrend?: boolean;
  warning?: boolean;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  trendColor,
  iconOnlyTrend = false,
  warning = false,
  className="",
}: StatsCardProps) {
  const trendTextColor = trendColor === "amber" ? "text-amber-600" : "text-emerald-600";

  return (
    <div className="flex flex-col gap-2 rounded-lg p-6 bg-card border border-border shadow-sm">
      <div className="flex justify-between items-start">
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-wide">{title}</p>
        <span className="material-symbols-outlined text-secondary text-2xl">{icon}</span>
      </div>
      <p className="text-secondary text-3xl lg:text-4xl font-bold tracking-tight">{value}</p>
      <p className={`text-sm font-bold flex items-center ${trendTextColor}`}>
        <span className="material-symbols-outlined text-base mr-1">
          {warning ? "warning" : iconOnlyTrend ? "check_circle" : "trending_up"}
        </span>
        {trend}
      </p>
    </div>
  );
}