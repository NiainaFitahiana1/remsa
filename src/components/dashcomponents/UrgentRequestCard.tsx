interface UrgentRequestCardProps {
  imageUrl: string;
  price: string;
  title: string;
  distance: string;
  time: string;
}

export default function UrgentRequestCard({
  imageUrl,
  price,
  title,
  distance,
  time,
}: UrgentRequestCardProps) {
  return (
    <div className="snap-center flex flex-col gap-3 rounded-lg min-w-[280px] bg-card p-4 border border-border shadow-sm">
      <div
        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-md"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground bg-primary px-2 py-0.5 rounded">
            Urgent
          </span>
          <span className="text-base font-bold text-secondary">{price}</span>
        </div>
        <p className="text-secondary text-base font-bold leading-tight">{title}</p>
        <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground text-sm">
          <span className="material-symbols-outlined text-sm">distance</span>
          {distance} • {time}
        </div>
      </div>
    </div>
  );
}