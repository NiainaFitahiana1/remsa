"use client";

import { useState } from "react";
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
import type { DeliveryFormData } from "@/types"; 
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

interface DeliveryCreateDialogProps {
  onCreated?: () => void;
}

export default function DeliveryCreateDialog({
  onCreated,
}: DeliveryCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<DeliveryFormData>({
    pickupAddress: "",
    dropAddress: "",
    distanceKm: "",
    price: "",
    scheduledAt: "",
  });

  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "";

  if (!GEOAPIFY_API_KEY) {
    console.warn(
      "Clé Geoapify manquante. Ajoute NEXT_PUBLIC_GEOAPIFY_API_KEY dans .env.local"
    );
  }

  const handleManualChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Quand l'utilisateur sélectionne une suggestion Geoapify
  const handlePlaceSelect = (
    value: any, // GeoJSON Feature
    field: "pickupAddress" | "dropAddress"
  ) => {
    if (value?.properties?.formatted) {
      setForm((prev) => ({
        ...prev,
        [field]: value.properties.formatted.trim(),
      }));

      // Optionnel : tu peux stocker plus d'informations si besoin
      // ex: latitude, longitude, ville, code postal, etc.
      console.log(`Adresse sélectionnée (${field}):`, value.properties);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.pickupAddress.trim() || !form.dropAddress.trim() || !form.price) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

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
        if (res.status === 403) {
          alert("Vous n'avez pas la permission (rôle CLIENT requis)");
          return;
        }
        if (res.status === 401) {
          alert("Session expirée. Veuillez vous reconnecter.");
          return;
        }
        const errText = await res.text();
        throw new Error(errText || "Erreur lors de la création");
      }

      // Reset + fermeture
      setForm({
        pickupAddress: "",
        dropAddress: "",
        distanceKm: "",
        price: "",
        scheduledAt: "",
      });
      setOpen(false);
      onCreated?.();
    } catch (err: any) {
      console.error("Erreur création livraison:", err);
      alert(err.message || "Échec de la création de la livraison");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <GeoapifyContext apiKey={GEOAPIFY_API_KEY}>
          <form onSubmit={handleCreate} className="space-y-6 py-4">
            {/* Adresse de ramassage */}
            <div className="grid gap-2">
              <Label htmlFor="pickupAddress">Adresse de ramassage</Label>
              <GeoapifyGeocoderAutocomplete
                placeholder="ex : 12 Rue de la Paix, 75002 Paris"
                value={form.pickupAddress}
                placeSelect={(val) => handlePlaceSelect(val, "pickupAddress")}
                // suggestionsChange={(val) => console.log("suggestions pickup:", val)}
                // filterByCountryCode={["fr"]}
                lang="fr"
                limit={7}
                // biasByProximity={{ lat: 48.8566, lon: 2.3522 }} // optionnel : biais Paris
                // biasByCircle={{ lon: 2.3522, lat: 48.8566, radiusMeters: 50000 }}
                inputStyle={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  border: "1px solid hsl(var(--input))",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                }}
              />
            </div>

            {/* Adresse de livraison */}
            <div className="grid gap-2">
              <Label htmlFor="dropAddress">Adresse de livraison</Label>
              <GeoapifyGeocoderAutocomplete
                placeholder="ex : 45 Avenue des Champs-Élysées, 75008 Paris"
                value={form.dropAddress}
                placeSelect={(val) => handlePlaceSelect(val, "dropAddress")}
                filterByCountryCode={["fr"]}
                lang="fr"
                limit={7}
                inputStyle={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  border: "1px solid hsl(var(--input))",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                }}
              />
            </div>

            {/* Distance, Prix, Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="distanceKm">Distance (km)</Label>
                <Input
                  id="distanceKm"
                  name="distanceKm"
                  type="number"
                  step="0.1"
                  value={form.distanceKm}
                  onChange={handleManualChange}
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
                  onChange={handleManualChange}
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
                  onChange={handleManualChange}
                />
              </div>
            </div>

            <DialogFooter className="sm:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Créer la livraison</Button>
            </DialogFooter>
          </form>
        </GeoapifyContext>
      </DialogContent>
    </Dialog>
  );
}