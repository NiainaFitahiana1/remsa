"use client";

import { useState, useEffect, useMemo } from "react";
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
import { CalendarIcon, Package, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  stock?: number | null;
};

type DeliveryFromProductDialogProps = {
  product: Product;
  onSuccess?: () => void;
  disabled?: boolean;
};

export default function DeliveryFromProductDialog({
  product,
  onSuccess,
  disabled = false,
}: DeliveryFromProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [form, setForm] = useState({
    pickupAddress: "",
    dropAddress: "",
    distanceKm: "",
    price: "",
    quantity: 1,
  });

  const [coords, setCoords] = useState<{
    pickup?: { lat: number; lon: number };
    drop?: { lat: number; lon: number };
  }>({});

  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "";

  // Suggestion de prix
  const suggestedTotalPrice = useMemo(() => {
    const productTotal = product.price * form.quantity;
    const deliveryFee = 5.0;
    return (productTotal + deliveryFee).toFixed(2);
  }, [product.price, form.quantity]);

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceSelect = (value: any, field: "pickupAddress" | "dropAddress") => {
    if (value?.properties) {
      const { formatted, lat, lon } = value.properties;
      setForm((prev) => ({ ...prev, [field]: formatted?.trim() || "" }));
      setCoords((prev) => ({
        ...prev,
        [field === "pickupAddress" ? "pickup" : "drop"]: { lat, lon },
      }));
    }
  };

  // === NOUVEAU : Utiliser la position actuelle ===
  const useCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsGettingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude: lat, longitude: lon } = position.coords;

      // Reverse geocoding avec Geoapify
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=fr&apiKey=${GEOAPIFY_API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      const feature = data.features?.[0];
      if (feature?.properties?.formatted) {
        const address = feature.properties.formatted;

        setForm((prev) => ({ ...prev, pickupAddress: address }));

        setCoords((prev) => ({
          ...prev,
          pickup: { lat, lon },
        }));
      } else {
        alert("Impossible d'obtenir une adresse à partir de votre position.");
      }
    } catch (err: any) {
      console.error("Erreur géolocalisation :", err);
      if (err.code === 1) {
        alert("Vous avez refusé l'accès à la localisation.");
      } else if (err.code === 2) {
        alert("Position actuelle indisponible.");
      } else if (err.code === 3) {
        alert("Délai d'attente dépassé.");
      } else {
        alert("Erreur lors de la récupération de votre position.");
      }
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Calcul automatique de la distance
  useEffect(() => {
    if (!coords.pickup || !coords.drop || !GEOAPIFY_API_KEY) return;

    const fetchDistance = async () => {
      const waypoints = `${coords.pickup!.lat},${coords.pickup!.lon}|${coords.drop!.lat},${coords.drop!.lon}`;
      const url = `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${GEOAPIFY_API_KEY}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        const route = data?.features?.[0]?.properties;
        if (route?.distance) {
          const distanceKm = (route.distance / 1000).toFixed(1);
          setForm((prev) => ({ ...prev, distanceKm }));
        }
      } catch (err) {
        console.error("Erreur calcul distance", err);
      }
    };

    fetchDistance();
  }, [coords, GEOAPIFY_API_KEY]);

  const scheduledAt = useMemo(() => {
    if (!selectedDate || !selectedTime) return undefined;
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const dateWithTime = new Date(selectedDate);
    dateWithTime.setHours(hours, minutes, 0, 0);
    return dateWithTime.toISOString();
  }, [selectedDate, selectedTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pickupAddress || !form.dropAddress) {
      alert("Veuillez remplir les adresses de ramassage et de livraison.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/deliveries", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupAddress: form.pickupAddress.trim(),
          dropAddress: form.dropAddress.trim(),
          distanceKm: form.distanceKm ? Number(form.distanceKm) : undefined,
          price: Number(form.price) || Number(suggestedTotalPrice),
          scheduledAt: scheduledAt,
          items: [
            {
              productId: product.id,
              quantity: Number(form.quantity),
            },
          ],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Erreur lors de la création");
      }

      // Reset
      setForm({ pickupAddress: "", dropAddress: "", distanceKm: "", price: "", quantity: 1 });
      setCoords({});
      setSelectedDate(undefined);
      setSelectedTime("");
      setOpen(false);

      onSuccess?.();
      alert("Livraison créée avec succès !");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Échec de la création de la livraison");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          disabled={disabled}
          className={cn(disabled && "opacity-50 cursor-not-allowed")}
        >
          <Package className="mr-2 h-4 w-4" />
          Livrer
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px] md:max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="h-5 w-5" />
            Livraison pour : {product.name}
          </DialogTitle>
          <DialogDescription>
            Créez une livraison contenant ce produit.
          </DialogDescription>
        </DialogHeader>

        <GeoapifyContext apiKey={GEOAPIFY_API_KEY}>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Info produit */}
            <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-lg font-bold text-primary">
                  {product.price.toFixed(2)} € × {form.quantity} ={" "}
                  {(product.price * form.quantity).toFixed(2)} €
                </p>
                {product.stock && (
                  <p className="text-xs text-muted-foreground">
                    Stock disponible : {product.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Quantité */}
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                max={product.stock || 999}
                value={form.quantity}
                onChange={handleManualChange}
                required
              />
            </div>

            {/* Adresse de ramassage avec bouton position actuelle */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Adresse de ramassage (Pickup)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={useCurrentLocation}
                  disabled={isGettingLocation}
                  className="flex items-center gap-1.5 text-xs h-8"
                >
                  <MapPin className="h-4 w-4" />
                  {isGettingLocation ? "Localisation..." : "Ma position actuelle"}
                </Button>
              </div>

              <GeoapifyGeocoderAutocomplete
                value={form.pickupAddress}
                placeSelect={(val) => handlePlaceSelect(val, "pickupAddress")}
                filterByCountryCode={["mg"]}
                lang="fr"
                placeholder="Adresse de départ..."
              />
            </div>

            {/* Adresse de livraison */}
            <div className="grid gap-2">
              <Label>Adresse de livraison (Drop)</Label>
              <GeoapifyGeocoderAutocomplete
                value={form.dropAddress}
                placeSelect={(val) => handlePlaceSelect(val, "dropAddress")}
                filterByCountryCode={["mg"]}
                lang="fr"
                placeholder="Adresse de destination..."
              />
            </div>

            {/* Distance + Prix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Distance (km)</Label>
                <Input
                  name="distanceKm"
                  type="number"
                  step="0.1"
                  value={form.distanceKm}
                  onChange={handleManualChange}
                  placeholder="Calcul automatique"
                />
              </div>

              <div className="grid gap-2">
                <Label>Prix total de la livraison (€)</Label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price || suggestedTotalPrice}
                  onChange={handleManualChange}
                  placeholder={suggestedTotalPrice}
                />
                <p className="text-xs text-muted-foreground">
                  Suggestion : {suggestedTotalPrice} € (produit + frais)
                </p>
              </div>
            </div>

            {/* Date et Heure */}
            <div className="grid grid-cols-2 gap-4">
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
                      {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label>Heure prévue</Label>
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  disabled={!selectedDate}
                />
              </div>
            </div>

            <DialogFooter className="gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Création en cours..." : "Créer la livraison"}
              </Button>
            </DialogFooter>
          </form>
        </GeoapifyContext>
      </DialogContent>
    </Dialog>
  );
}