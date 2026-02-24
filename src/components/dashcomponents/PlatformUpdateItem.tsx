interface PlatformUpdateItemProps {
  icon: string;
  title: string;
  description: string;
}

export default function PlatformUpdateItem({ icon, title, description }: PlatformUpdateItemProps) {
  return (
    <div className="flex items-start gap-4 p-5 bg-card rounded-lg border border-border shadow-sm">
      <div className="size-14 shrink-0 rounded-lg bg-muted flex items-center justify-center border border-border">
        <span className="material-symbols-outlined text-secondary text-3xl">{icon}</span>
      </div>
      <div>
        <p className="text-secondary font-bold text-base">{title}</p>
        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}