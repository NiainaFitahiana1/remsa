import type { Delivery, DeliveryStatus } from "@/types";
import { StatusHeader } from "./StatusHeader";
import { DeliveryCard } from "./DeliveryCard";

interface DeliveryColumnProps {
  status: DeliveryStatus;
  deliveries: Delivery[];
  onDragStart: (delivery: Delivery) => void;
  onDrop: () => void;
  isDropAllowed: boolean;
  draggedId?: number;
}

export default function DeliveryColumn({
  status,
  deliveries,
  onDragStart,
  onDrop,
  isDropAllowed,
  draggedId,
}: DeliveryColumnProps) {
  return (
    <div
      className={`bg-muted/30 rounded-xl border shadow-sm flex flex-col min-h-[580px] transition-all ${
        isDropAllowed ? "ring-2 ring-primary/30" : "opacity-70"
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <StatusHeader status={status} count={deliveries.length} />

      <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
        {deliveries.map((delivery) => (
          <DeliveryCard
            key={delivery.id}
            delivery={delivery}
            isBeingDragged={draggedId === delivery.id}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}