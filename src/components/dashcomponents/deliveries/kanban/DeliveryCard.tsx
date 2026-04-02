import type { Delivery } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SendDeliveryRequestModal } from "../modal/SendDeliveryRequestModal";
import Link from "next/link";

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
  const shortPickup = delivery.pickupAddress?.split(",")[0]?.trim() || "Départ inconnu";
  const shortDrop = delivery.dropAddress?.split(",")[0]?.trim() || "Destination inconnue";

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
      {/* En-tête + Statut */}
      <div className="flex items-start justify-between mb-2">
        <div className="font-medium line-clamp-1 flex-1 pr-2">
          {shortPickup} → {shortDrop}
        </div>
        
        {delivery.status && (
          <span className="text-xs px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 font-medium">
            {delivery.status}
          </span>
        )}
      </div>

      {/* Adresses complètes */}
      <div className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {delivery.pickupAddress || "Adresse de départ non renseignée"} →{" "}
        {delivery.dropAddress || "Adresse de destination non renseignée"}
      </div>

      {/* Prix + Distance */}
      <div className="flex items-center justify-between text-sm mb-4">
        {delivery.distanceKm && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="material-symbols-outlined text-base">distance</span>
            {delivery.distanceKm} km
          </div>
        )}
        <div className="font-semibold text-primary">
          {delivery.price?.toFixed(2) || "0.00"} €
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t flex flex-col gap-3">
        <Link
          href={`/dashboard/tasks/${delivery.id}`}
          className="text-sm text-primary hover:text-primary/80 hover:underline flex items-center gap-1.5 transition-colors"
        >
          Voir les détails
        </Link>

        <SendDeliveryRequestModal delivery={delivery}>
          <Button size="sm" className="w-full gap-2" variant="default">
            <span className="material-symbols-outlined text-base">send</span>
            Envoyer aux livreurs
          </Button>
        </SendDeliveryRequestModal>
      </div>
    </div>
  );
}