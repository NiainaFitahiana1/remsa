// components/blog/StatsCard.tsx

export const StatsCard = () => {
  return (
    <div className="aspect-[4/3] rounded-sm bg-secondary-blue p-10 text-white">
      <h4 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-primary">
        Platform Growth
      </h4>

      <div className="space-y-6">
        <div>
          <span className="block text-5xl font-black leading-none text-white">
            12.4M
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Monthly Shipments
          </span>
        </div>

        <div className="h-px w-full bg-slate-700" />

        <div>
          <span className="block text-5xl font-black leading-none text-accent-yellow">
            24/7
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            System Uptime
          </span>
        </div>
      </div>
    </div>
  );
};