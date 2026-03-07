"use client";

import { useState, DragEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type DeliveryStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PICKED_UP"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "CANCELLED";

interface Delivery {
  id: number;
  pickupAddress: string;
  dropAddress: string;
  distanceKm?: number | null;
  price: number;
  status: DeliveryStatus;
  scheduledAt?: string | null;
  client?: { nom: string; prenom: string };
}

const STATUS_LABELS: Record<DeliveryStatus, string> = {
  PENDING: "À accepter",
  ACCEPTED: "Acceptée",
  PICKED_UP: "Ramassée",
  IN_PROGRESS: "En cours",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const STATUS_ICONS: Record<DeliveryStatus, string> = {
  PENDING: "pending",
  ACCEPTED: "thumb_up",
  PICKED_UP: "package",
  IN_PROGRESS: "local_shipping",
  DELIVERED: "check_circle",
  CANCELLED: "cancel",
};

export default function DeliveriesKanban() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [dragged, setDragged] = useState<Delivery | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    pickupAddress: "",
    dropAddress: "",
    distanceKm: "",
    price: "",
    scheduledAt: "",
  });

  // ────────────────────────────────────────────────
  // Chargement des livraisons + tentative de récupération du rôle
  // ────────────────────────────────────────────────
  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/deliveries", {
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Session expirée. Veuillez vous reconnecter.");
        } else if (res.status === 403) {
          setError("Accès non autorisé.");
        } else {
          setError(`Erreur ${res.status} lors du chargement des livraisons`);
        }
        return;
      }

      const data = await res.json();
      setDeliveries(Array.isArray(data) ? data : data?.deliveries || []);
      setError(null);
    } catch (err) {
      console.error("Erreur loadDeliveries:", err);
      setError("Impossible de charger les livraisons");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRole = async () => {
    try {
      const res = await fetch("/api/auth/me", {  // ← adaptez cette URL selon votre projet
        credentials: "include",
      });

      if (res.ok) {
        const user = await res.json();
        setUserRole(user?.role || null);
      }
    } catch (err) {
      console.error("Impossible de récupérer le rôle utilisateur", err);
    }
  };

  useEffect(() => {
    loadDeliveries();
    fetchUserRole();
  }, []);

  const canCreateDelivery = userRole === "CLIENT";

  // ────────────────────────────────────────────────
  // Gestion du formulaire
  // ────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.pickupAddress || !form.dropAddress || !form.price) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    try {
      const res = await fetch("/api/deliveries", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupAddress: form.pickupAddress,
          dropAddress: form.dropAddress,
          distanceKm: form.distanceKm ? Number(form.distanceKm) : undefined,
          price: Number(form.price),
          scheduledAt: form.scheduledAt || undefined,
        }),
      });

      if (!res.ok) {
        if (res.status === 403) {
          alert("Vous n'avez pas la permission de créer une livraison (rôle CLIENT requis)");
          return;
        }
        if (res.status === 401) {
          alert("Session expirée. Veuillez vous reconnecter.");
          return;
        }
        const errText = await res.text();
        throw new Error(errText || "Erreur lors de la création");
      }

      // Reset + fermeture + refresh
      setForm({
        pickupAddress: "",
        dropAddress: "",
        distanceKm: "",
        price: "",
        scheduledAt: "",
      });

      setModalOpen(false);
      await loadDeliveries();
    } catch (err: any) {
      console.error("Erreur création livraison:", err);
      alert(err.message || "Échec de la création de la livraison");
    }
  };

  const allowedTransitions: Record<DeliveryStatus, DeliveryStatus[]> = {
    PENDING: ["ACCEPTED"],
    ACCEPTED: ["PICKED_UP"],
    PICKED_UP: ["IN_PROGRESS"],
    IN_PROGRESS: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, delivery: Delivery) => {
    setDragged(delivery);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, targetStatus: DeliveryStatus) => {
    e.preventDefault();
    if (!dragged) return;

    if (!allowedTransitions[dragged.status]?.includes(targetStatus)) {
      alert("Cette transition n'est pas autorisée");
      return;
    }

    try {
      setDeliveries((prev) =>
        prev.map((d) => (d.id === dragged.id ? { ...d, status: targetStatus } : d))
      );

      const res = await fetch(`/api/deliveries/${dragged.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });

      if (!res.ok) throw new Error("Échec de la mise à jour du statut");

      await loadDeliveries();
    } catch (err) {
      console.error(err);
      alert("Impossible de mettre à jour le statut");
      await loadDeliveries(); // rollback visuel
    }

    setDragged(null);
  };

  const columns = Object.keys(STATUS_LABELS) as DeliveryStatus[];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

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

          {canCreateDelivery ? (
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button>+ Nouvelle livraison</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nouvelle livraison</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour créer une nouvelle livraison.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreate} className="space-y-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pickupAddress">Adresse de ramassage</Label>
                    <Textarea
                      id="pickupAddress"
                      name="pickupAddress"
                      value={form.pickupAddress}
                      onChange={handleChange}
                      placeholder="ex : 12 Rue de la Paix, 75002 Paris"
                      required
                      rows={2}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="dropAddress">Adresse de livraison</Label>
                    <Textarea
                      id="dropAddress"
                      name="dropAddress"
                      value={form.dropAddress}
                      onChange={handleChange}
                      placeholder="ex : 45 Avenue des Champs-Élysées, 75008 Paris"
                      required
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="distanceKm">Distance (km)</Label>
                      <Input
                        id="distanceKm"
                        name="distanceKm"
                        type="number"
                        step="0.1"
                        value={form.distanceKm}
                        onChange={handleChange}
                        placeholder="ex : 5.8"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="price">Prix (€)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="ex : 24.50"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="scheduledAt">Date / heure prévue</Label>
                      <Input
                        id="scheduledAt"
                        name="scheduledAt"
                        type="datetime-local"
                        value={form.scheduledAt}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <DialogFooter className="sm:justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">Créer la livraison</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <Button variant="outline" disabled title="Seuls les clients peuvent créer une livraison">
              + Nouvelle livraison
            </Button>
          )}
        </div>

        {/* Kanban */}
        <div className="overflow-x-auto pb-6">
          <div className="inline-grid grid-flow-col gap-6 auto-cols-[minmax(400px,1fr)]">
            {columns.map((status) => (
              <div
                key={status}
                className="bg-muted/30 rounded-xl border shadow-sm flex flex-col min-h-[580px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="p-4 border-b flex items-center justify-between bg-background/80 sticky top-0 z-10 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl text-primary/80">
                      {STATUS_ICONS[status]}
                    </span>
                    <h2 className="text-lg font-semibold">{STATUS_LABELS[status]}</h2>
                  </div>
                  <div className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
                    {deliveries.filter((d) => d.status === status).length}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
                  {deliveries
                    .filter((d) => d.status === status)
                    .map((delivery) => (
                      <div
                        key={delivery.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, delivery)}
                        className={`
                          bg-card text-card-foreground rounded-lg border p-4 shadow-sm
                          hover:shadow-md hover:border-primary/40 transition-all duration-150
                          cursor-grab active:cursor-grabbing select-none
                          ${dragged?.id === delivery.id ? "opacity-50 scale-95" : ""}
                        `}
                      >
                        <div className="font-medium mb-1.5 line-clamp-1">
                          {delivery.pickupAddress.split(",")[0]} →{" "}
                          {delivery.dropAddress.split(",")[0]}
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
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}