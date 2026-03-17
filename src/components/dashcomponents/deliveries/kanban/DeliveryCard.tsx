import type { Delivery } from "@/types";
import { cn } from "@/lib/utils";

type DeliveryCardProps = {
  delivery: Delivery;
  isBeingDragged: boolean;
  onDragStart: (delivery: Delivery) => void;
};

export function DeliveryCard({
  delivery,
  isBeingDragged,
  onDragStart,
}: DeliveryCardProps) {
  const shortPickup = delivery.pickupAddress.split(",")[0];
  const shortDrop = delivery.dropAddress.split(",")[0];

  return (
    <div
      draggable
      onDragStart={() => onDragStart(delivery)}
      className={cn(
        "bg-card text-card-foreground rounded-lg border p-4 shadow-sm",
        "hover:shadow-md hover:border-primary/40 transition-all duration-150",
        "cursor-grab active:cursor-grabbing select-none",
        isBeingDragged && "opacity-50 scale-95"
      )}
    >
      <div className="font-medium mb-1.5 line-clamp-1">
        {shortPickup} → {shortDrop}
      </div>
      <div className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {delivery.pickupAddress} → {delivery.dropAddress}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {delivery.distanceKm && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">distance</span>
            {delivery.distanceKm} km
          </div>
        )}
        <div className="font-semibold text-primary">
          {delivery.price.toFixed(2)} €
        </div>
      </div>
    </div>
  );
}