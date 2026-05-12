import { useState, useEffect, useCallback } from "react";
import type { Delivery, DeliveryStatus } from "@/types";

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/deliveries", {
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Session expirée");
        if (res.status === 403) throw new Error("Accès non autorisé");
        throw new Error(`Erreur ${res.status}`);
      }

      const data = await res.json();
      setDeliveries(Array.isArray(data) ? data : data?.deliveries || []);
      setError(null);
    } catch (err: any) {
      console.error("loadDeliveries error:", err);
      setError(err.message || "Impossible de charger les livraisons");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const updateDeliveryStatus = useCallback(
    async (id: number, newStatus: DeliveryStatus) => {
      // Mise à jour optimiste
      setDeliveries((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );

      try {
        const res = await fetch(`/api/deliveries/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) throw new Error("Échec mise à jour statut");

        await loadDeliveries(); // rechargement pour cohérence
      } catch (err) {
        console.error(err);
        setDeliveries((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: d.status } : d))
        ); // rollback
        throw err;
      }
    },
    [loadDeliveries]
  );

  return {
    deliveries,
    loading,
    error,
    loadDeliveries,
    count: deliveries.length,
    updateDeliveryStatus,
  };
}