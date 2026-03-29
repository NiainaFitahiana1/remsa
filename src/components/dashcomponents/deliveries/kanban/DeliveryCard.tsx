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
  const shortPickup = delivery.pickupAddress.split(",")[0];
  const shortDrop = delivery.dropAddress.split(",")[0];

  const deliverySlug = `${shortPickup.toLowerCase()}-to-${shortDrop.toLowerCase()}`
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

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
      {/* En-tête : Trajet court */}
      <div className="font-medium mb-1.5 line-clamp-1">
        {shortPickup} → {shortDrop}
      </div>

      {/* Adresses complètes */}
      <div className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {delivery.pickupAddress} → {delivery.dropAddress}
      </div>

      {/* Infos prix + distance */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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

      {/* Section Actions */}
      <div className="pt-2 border-t flex flex-col gap-3">
        {/* Lien vers les détails */}
        <Link
          href={`/dashboard/tasks/${delivery.id}`} 
          className="text-sm text-primary hover:text-primary/80 hover:underline flex items-center gap-1.5 transition-colors"
        >
          Voir les détails
        </Link>

        {/* Bouton Envoyer aux livreurs */}
        <SendDeliveryRequestModal delivery={delivery}>
          <Button
            size="sm"
            className="w-full gap-2"
            variant="default"
          >
            <span className="material-symbols-outlined text-base">send</span>
            Envoyer aux livreurs
          </Button>
        </SendDeliveryRequestModal>
      </div>
    </div>
  );
}