"use client";

import { useState, DragEvent, useRef, useEffect } from "react";

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

  const [dragged, setDragged] = useState<Delivery | null>(null);

  const modalRef = useRef<HTMLDialogElement>(null);

  const [form, setForm] = useState({
    pickupAddress: "",
    dropAddress: "",
    distanceKm: "",
    price: "",
    scheduledAt: "",
  });

  // Chargement initial + rechargement après modification
  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/deliveries", {
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}`);
      }

      const data = await res.json();
      setDeliveries(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Impossible de charger les livraisons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const openModal = () => modalRef.current?.showModal();
  const closeModal = () => modalRef.current?.close();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        throw new Error(await res.text());
      }

      // Reset formulaire
      setForm({
        pickupAddress: "",
        dropAddress: "",
        distanceKm: "",
        price: "",
        scheduledAt: "",
      });

      closeModal();

      // Recharger la liste
      await loadDeliveries();
    } catch (err: any) {
      console.error(err);
      alert("Échec de la création de la livraison");
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

    const currentStatus = dragged.status;

    if (!allowedTransitions[currentStatus]?.includes(targetStatus)) {
      alert("Cette transition n'est pas autorisée");
      return;
    }

    try {
      // Mise à jour optimiste
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === dragged.id ? { ...d, status: targetStatus } : d
        )
      );

      const res = await fetch(`/api/deliveries/${dragged.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });

      if (!res.ok) {
        throw new Error("Échec PATCH");
      }

      // Recharger pour être sûr (au cas où le backend aurait modifié d'autres champs)
      await loadDeliveries();
    } catch (err: any) {
      console.error(err);
      alert("Impossible de mettre à jour le statut");
      // Recharger pour revenir à l'état serveur
      await loadDeliveries();
    }

    setDragged(null);
  };

  const columns = Object.keys(STATUS_LABELS) as DeliveryStatus[];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-secondary pb-12">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">
              Livraisons – Kanban
            </h1>
            <p className="mt-2 text-gray-600">
              Glissez-déposez pour changer le statut des livraisons
            </p>
          </div>
          <button onClick={openModal} className="btn btn-primary text-white">
            + Nouvelle livraison
          </button>
        </div>

        {/* Modal création */}
        <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-2xl bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-3xl text-primary">add_task</span>
              <h3 className="text-xl font-bold text-secondary">Nouvelle livraison</h3>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">Adresse de ramassage</span>
                </label>
                <input
                  name="pickupAddress"
                  value={form.pickupAddress}
                  onChange={handleChange}
                  placeholder="ex : 12 Rue de la Paix, 75002 Paris"
                  className="input input-bordered w-full border-gray-300 focus:border-primary focus:ring-primary/30"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">Adresse de livraison</span>
                </label>
                <input
                  name="dropAddress"
                  value={form.dropAddress}
                  onChange={handleChange}
                  placeholder="ex : 45 Avenue des Champs-Élysées, 75008 Paris"
                  className="input input-bordered w-full border-gray-300 focus:border-primary focus:ring-primary/30"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium">Distance (km)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="distanceKm"
                    value={form.distanceKm}
                    onChange={handleChange}
                    placeholder="ex : 5.8"
                    className="input input-bordered w-full border-gray-300 focus:border-primary focus:ring-primary/30"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium">Prix (€)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="ex : 24.50"
                    className="input input-bordered w-full border-gray-300 focus:border-primary focus:ring-primary/30"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium">Date / heure prévue</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledAt"
                    value={form.scheduledAt}
                    onChange={handleChange}
                    className="input input-bordered w-full border-gray-300 focus:border-primary focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="modal-action mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                  onClick={closeModal}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn bg-primary hover:bg-primary/90 text-white border-none"
                >
                  Créer la livraison
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        {/* Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {columns.map((status) => (
            <div
              key={status}
              className="bg-gray-50/70 rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-[500px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl text-secondary">
                    {STATUS_ICONS[status]}
                  </span>
                  <h2 className="text-lg font-bold text-secondary">{STATUS_LABELS[status]}</h2>
                </div>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600 shadow-sm">
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
                        ${dragged?.id === delivery.id ? "opacity-40 scale-[0.98]" : ""}
                      `}
                    >
                      <div className="font-semibold text-secondary line-clamp-1 mb-1">
                        {delivery.pickupAddress.split(",")[0]} → {delivery.dropAddress.split(",")[0]}
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {delivery.pickupAddress} → {delivery.dropAddress}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {delivery.distanceKm && (
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">distance</span>
                            {delivery.distanceKm} km
                          </div>
                        )}
                        <div className="ml-auto font-bold text-primary">
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
  );
}