// app/dashboard/deliveries/page.tsx   (ou l'emplacement que tu utilises)
"use client";

import { useState, useEffect, DragEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

export default function DeliveriesPage() {
  const router = useRouter();

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  // Chargement initial
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Récupérer le profil / rôle
        const profileRes = await fetch("/api/users/profile", {
          credentials: "include",
          cache: "no-store",
        });

        if (!profileRes.ok) {
          if (profileRes.status === 401 || profileRes.status === 403) {
            router.push("/login?redirect=/dashboard/deliveries");
            return;
          }
          throw new Error("Impossible de charger les informations utilisateur");
        }

        const profileData = await profileRes.json();
        setUserRole(profileData.role || null);

        // 2. Récupérer les livraisons
        const deliveriesRes = await fetch("/api/deliveries", {
          credentials: "include",
          cache: "no-store",
        });

        if (!deliveriesRes.ok) {
          throw new Error("Impossible de charger les livraisons");
        }

        const deliveriesData = await deliveriesRes.json();
        setDeliveries(Array.isArray(deliveriesData) ? deliveriesData : []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const canCreate = userRole === "CLIENT";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pickupAddress || !form.dropAddress || !form.price) {
      setError("Veuillez remplir les champs obligatoires");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/deliveries", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupAddress: form.pickupAddress.trim(),
          dropAddress: form.dropAddress.trim(),
          distanceKm: form.distanceKm ? Number(form.distanceKm) : undefined,
          price: Number(form.price),
          scheduledAt: form.scheduledAt || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 403) {
          throw new Error("Vous n'avez pas la permission de créer une livraison (rôle CLIENT requis)");
        }
        if (res.status === 401) {
          router.push("/login?redirect=/dashboard/deliveries");
          return;
        }
        throw new Error(errData.message || "Échec de la création");
      }

      setSuccess("Livraison créée avec succès !");
      setForm({
        pickupAddress: "",
        dropAddress: "",
        distanceKm: "",
        price: "",
        scheduledAt: "",
      });
      setModalOpen(false);

      // Recharger
      const newRes = await fetch("/api/deliveries", { credentials: "include" });
      const newData = await newRes.json();
      setDeliveries(Array.isArray(newData) ? newData : []);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  // ────────────────────────────────────────────────
  // Drag & Drop (similaire à avant)
  // ────────────────────────────────────────────────
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
      setError("Transition non autorisée");
      return;
    }

    try {
      // Mise à jour optimiste
      setDeliveries((prev) =>
        prev.map((d) => (d.id === dragged.id ? { ...d, status: targetStatus } : d))
      );

      const res = await fetch(`/api/deliveries/${dragged.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });

      if (!res.ok) throw new Error("Échec mise à jour statut");

      setSuccess(`Statut mis à jour : ${STATUS_LABELS[targetStatus]}`);
    } catch (err: any) {
      setError("Impossible de changer le statut");
      // Recharger pour rollback
      const res = await fetch("/api/deliveries", { credentials: "include" });
      const data = await res.json();
      setDeliveries(Array.isArray(data) ? data : []);
    } finally {
      setDragged(null);
    }
  };

  const columns = Object.keys(STATUS_LABELS) as DeliveryStatus[];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600 flex items-center gap-3">
          <span className="material-symbols-outlined animate-spin">refresh</span>
          Chargement des livraisons...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-secondary pb-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">
            Livraisons – Kanban
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez et suivez l'état de vos livraisons par glisser-déposer
          </p>
        </div>

        {(error || success) && (
          <div className="mb-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-gray-500">
            {userRole && <span>Connecté en tant que : <strong>{userRole}</strong></span>}
          </div>

          {canCreate ? (
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <span className="material-symbols-outlined mr-2">add</span>
                  Nouvelle livraison
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px] md:max-w-2xl bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-secondary flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">add_task</span>
                    Créer une nouvelle livraison
                  </DialogTitle>
                  <DialogDescription>
                    Renseignez les informations principales de la course.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreate} className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupAddress">Adresse de ramassage</Label>
                    <Textarea
                      id="pickupAddress"
                      name="pickupAddress"
                      value={form.pickupAddress}
                      onChange={handleChange}
                      placeholder="ex : 12 Rue de la Paix, 75002 Paris"
                      required
                      rows={2}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dropAddress">Adresse de livraison</Label>
                    <Textarea
                      id="dropAddress"
                      name="dropAddress"
                      value={form.dropAddress}
                      onChange={handleChange}
                      placeholder="ex : 45 Avenue des Champs-Élysées, 75008 Paris"
                      required
                      rows={2}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
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

                    <div className="space-y-2">
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

                    <div className="space-y-2">
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

                  <DialogFooter className="gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setModalOpen(false)}
                      disabled={saving}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? "Création en cours..." : "Créer la livraison"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <Button variant="outline" disabled>
              <span className="material-symbols-outlined mr-2">add</span>
              Nouvelle livraison (clients uniquement)
            </Button>
          )}
        </div>

        {/* Kanban */}
        <div className="overflow-x-auto pb-6">
          <div className="inline-grid grid-flow-col gap-6 auto-cols-[minmax(400px,1fr)]">
            {columns.map((status) => (
              <div
                key={status}
                className="bg-gray-50/70 rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-[580px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white/80 sticky top-0 z-10 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl text-primary/80">
                      {STATUS_ICONS[status]}
                    </span>
                    <h2 className="text-lg font-semibold text-secondary">
                      {STATUS_LABELS[status]}
                    </h2>
                  </div>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {deliveries.filter((d) => d.status === status).length}
                  </span>
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
                          bg-white rounded-lg border border-gray-200 p-4 shadow-sm
                          hover:shadow-md hover:border-primary/40 transition-all
                          cursor-grab active:cursor-grabbing select-none
                          ${dragged?.id === delivery.id ? "opacity-60 scale-[0.98]" : ""}
                        `}
                      >
                        <div className="font-medium text-secondary mb-1 line-clamp-1">
                          {delivery.pickupAddress.split(",")[0]} → {delivery.dropAddress.split(",")[0]}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {delivery.pickupAddress} → {delivery.dropAddress}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          {delivery.distanceKm && (
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">distance</span>
                              {delivery.distanceKm} km
                            </div>
                          )}
                          <div className="font-bold text-primary">
                            {delivery.price.toFixed(2)} €
                          </div>
                        </div>
                      </div>
                    ))}

                  {deliveries.filter((d) => d.status === status).length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic">
                      Aucune livraison ici
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}