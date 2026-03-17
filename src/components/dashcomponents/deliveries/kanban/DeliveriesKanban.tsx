"use client";

import { useDeliveries } from "@/hooks/deliveries/useDeliveries";
import { useUserRole } from "@/hooks/deliveries/useUserRole";
import { useDeliveryDragDrop } from "@/hooks/deliveries/useDeliveryDragDrop";
import { STATUSES, STATUS_CONFIG } from "@/constants/status";
import DeliveryColumn from "@/components/dashcomponents/deliveries/kanban/DeliveryColumn";
import DeliveryCreateDialog from "@/components/dashcomponents/deliveries/kanban/DeliveryCreateDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";

export default function DeliveriesKanban() {
  const { deliveries, loading, error, loadDeliveries, updateDeliveryStatus } =
    useDeliveries();
  const { role } = useUserRole();
  const { dragged, handleDragStart, handleDrop, isDropAllowed } =
    useDeliveryDragDrop(updateDeliveryStatus);

  const isClient = role === "CLIENT";

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-primary">
              Livraisons – Kanban
            </h1>
            <p className="mt-2 text-muted-foreground">
              Glissez-déposez pour changer le statut des livraisons
            </p>
          </div>

          {isClient ? (
            <DeliveryCreateDialog onCreated={loadDeliveries} />
          ) : (
            <Button
              variant="outline"
              disabled
              title="Seuls les clients peuvent créer une livraison"
            >
              + Nouvelle livraison
            </Button>
          )}
        </div>

        <div className="overflow-x-auto pb-6">
          <div className="inline-grid grid-flow-col gap-6 auto-cols-[minmax(400px,1fr)]">
            {STATUSES.map((status) => (
              <DeliveryColumn
                key={status}
                status={status}
                deliveries={deliveries.filter((d) => d.status === status)}
                onDragStart={handleDragStart}
                onDrop={() => handleDrop(status)}
                isDropAllowed={isDropAllowed(status)}
                draggedId={dragged?.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}