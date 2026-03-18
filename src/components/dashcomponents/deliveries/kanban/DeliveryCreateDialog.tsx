"use client";

import { useState, useMemo, useEffect } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

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

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [form, setForm] = useState<DeliveryFormData>({
    pickupAddress: "",
    dropAddress: "",
    distanceKm: "",
    price: "",
    scheduledAt: "",
  });

  // Stockage des coordonnées extraites de Geoapify
  const [coords, setCoords] = useState<{
    pickup?: { lat: number; lon: number };
    drop?: { lat: number; lon: number };
  }>({});

  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "";

  if (!GEOAPIFY_API_KEY) {
    console.warn("Clé Geoapify manquante !");
  }

  const handleManualChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceSelect = (
    value: any,
    field: "pickupAddress" | "dropAddress"
  ) => {
    if (value?.properties) {
      const { formatted, lat, lon } = value.properties;

      setForm((prev) => ({
        ...prev,
        [field]: formatted?.trim() || "",
      }));

      setCoords((prev) => ({
        ...prev,
        [field === "pickupAddress" ? "pickup" : "drop"]: { lat, lon },
      }));

      console.log(`Adresse ${field} :`, { formatted, lat, lon });
    }
  };

  // Calcul automatique de la distance via Geoapify Routing API
  useEffect(() => {
    if (!coords.pickup || !coords.drop || !GEOAPIFY_API_KEY) {
      setForm((prev) => ({ ...prev, distanceKm: "" }));
      return;
    }

    const fetchDistance = async () => {
      const waypoints = `${coords.pickup.lat},${coords.pickup.lon}|${coords.drop.lat},${coords.drop.lon}`;
      const url = `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${GEOAPIFY_API_KEY}`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        // Structure typique : features[0].properties.distance (en mètres)
        const route = data?.features?.[0]?.properties;
        if (route?.distance) {
          const distanceKm = (route.distance / 1000).toFixed(1);
          setForm((prev) => ({ ...prev, distanceKm }));
          console.log(`Distance calculée : ${distanceKm} km`);
        } else {
          console.warn("Pas de distance dans la réponse", data);
        }
      } catch (err) {
        console.error("Erreur Geoapify Routing :", err);
        // Optionnel : fallback haversine (à vol d'oiseau)
        const dist = haversine(
          coords.pickup.lat,
          coords.pickup.lon,
          coords.drop.lat,
          coords.drop.lon
        );
        setForm((prev) => ({ ...prev, distanceKm: dist.toFixed(1) }));
      }
    };

    fetchDistance();
  }, [coords.pickup, coords.drop, GEOAPIFY_API_KEY]);

  // Fallback simple à vol d'oiseau si l'API routing échoue
  function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const scheduledAt = useMemo(() => {
    if (!selectedDate || !selectedTime) return "";
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const dateWithTime = new Date(selectedDate);
    dateWithTime.setHours(hours, minutes, 0, 0);
    return dateWithTime.toISOString();
  }, [selectedDate, selectedTime]);

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
          scheduledAt: scheduledAt || undefined,
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

      // Reset
      setForm({
        pickupAddress: "",
        dropAddress: "",
        distanceKm: "",
        price: "",
        scheduledAt: "",
      });
      setCoords({});
      setSelectedDate(undefined);
      setSelectedTime("");
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
                value={form.pickupAddress}
                placeSelect={(val) => handlePlaceSelect(val, "pickupAddress")}
                filterByCountryCode={["mg"]}
                lang="fr"
                placeholder="ex: Antananarivo, Analakely"
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

            {/* Adresse de livraison */}
            <div className="grid gap-2">
              <Label htmlFor="dropAddress">Adresse de livraison</Label>
              <GeoapifyGeocoderAutocomplete
                value={form.dropAddress}
                placeSelect={(val) => handlePlaceSelect(val, "dropAddress")}
                filterByCountryCode={["mg"]}
                lang="fr"
                placeholder="ex: Toamasina, centre ville"
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="distanceKm">Distance (km)</Label>
                <Input
                  id="distanceKm"
                  name="distanceKm"
                  type="number"
                  step="0.1"
                  value={form.distanceKm}
                  onChange={handleManualChange}
                  placeholder={
                    coords.pickup && coords.drop
                      ? "Calcul en cours..."
                      : "ex : 5.8 (auto ou manuel)"
                  }
                  disabled={!!(coords.pickup && coords.drop)} // Lecture seule si calcul auto
                  // Retire disabled si tu veux permettre la modification manuelle
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
                <Label>Date prévue</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: fr })
                      ) : (
                        <span>La date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Heure prévue</Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  disabled={!selectedDate}
                />
              </div>
            </div>

            {/* Optionnel : feedback visuel */}
            {form.distanceKm && (
              <p className="text-sm text-muted-foreground">
                Distance estimée : {form.distanceKm} km (via Geoapify Routing)
              </p>
            )}

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