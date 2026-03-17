import { useState } from "react";
import type { Delivery, DeliveryStatus } from "@/types";
import { STATUS_CONFIG } from "@/constants/status";

export function useDeliveryDragDrop(
  updateDeliveryStatus: (id: number, status: DeliveryStatus) => Promise<void>
) {
  const [dragged, setDragged] = useState<Delivery | null>(null);

  const handleDragStart = (delivery: Delivery) => {
    setDragged(delivery);
  };

  const isDropAllowed = (targetStatus: DeliveryStatus) => {
    if (!dragged) return false;
    return STATUS_CONFIG[dragged.status]?.allowedNext.includes(targetStatus);
  };

  const handleDrop = async (targetStatus: DeliveryStatus) => {
    if (!dragged || !isDropAllowed(targetStatus)) {
      if (dragged) alert("Transition non autorisée");
      return;
    }

    try {
      await updateDeliveryStatus(dragged.id, targetStatus);
    } catch {
      alert("Impossible de mettre à jour le statut");
    } finally {
      setDragged(null);
    }
  };

  return {
    dragged,
    handleDragStart,
    handleDrop,
    isDropAllowed,
  };
}