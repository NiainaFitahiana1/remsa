import { STATUS_CONFIG } from "@/constants/status";
import type { DeliveryStatus } from "@/types";

type StatusHeaderProps = {
  status: DeliveryStatus;
  count: number;
};

export function StatusHeader({ status, count }: StatusHeaderProps) {
  const { label, icon } = STATUS_CONFIG[status];

  return (
    <div className="p-4 border-b flex items-center justify-between bg-background/80 sticky top-0 z-10 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-2xl text-primary/80">
          {icon}
        </span>
        <h2 className="text-lg font-semibold">{label}</h2>
      </div>
      <div className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
        {count}
      </div>
    </div>
  );
}