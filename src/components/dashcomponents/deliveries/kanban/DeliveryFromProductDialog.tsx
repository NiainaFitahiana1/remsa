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
import { CalendarIcon, Package, MapPin, Truck } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import { toast } from "sonner";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  stock?: number | null;
};

type DeliveryFromProductDialogProps = {
  product?: Product;
  products?: Product[];
  onSuccess?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

export default function DeliveryFromProductDialog({
  product,
  products = [],
  onSuccess,
  disabled = false,
  children,
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
  });

  // Quantités par produit (clé = product.id)
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const [coords, setCoords] = useState<{
    pickup?: { lat: number; lon: number };
    drop?: { lat: number; lon: number };
  }>({});

  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "";
  const itemsToDeliver = useMemo(() => {
    return products.length > 0 ? products : product ? [product] : [];
  }, [products, product]);

  // Initialiser les quantités à 1 pour chaque produit quand le dialog s'ouvre
  useEffect(() => {
    if (!open || itemsToDeliver.length === 0) return;

    const initialQuantities: Record<number, number> = {};
    itemsToDeliver.forEach((p) => {
      initialQuantities[p.id] = 1;
    });

    setQuantities((prev) => {
      // ✅ éviter update inutile
      const isSame =
        Object.keys(prev).length === Object.keys(initialQuantities).length &&
        Object.keys(initialQuantities).every(
          (key) => prev[Number(key)] === initialQuantities[Number(key)]
        );

      return isSame ? prev : initialQuantities;
    });
  }, [open, itemsToDeliver]);

  // Calcul du prix total dynamique
  const totalPrice = useMemo(() => {
    return itemsToDeliver.reduce((sum, product) => {
      const qty = quantities[product.id] || 1;
      return sum + product.price * qty;
    }, 0);
  }, [itemsToDeliver, quantities]);

  const suggestedTotalPrice = useMemo(() => {
    const deliveryFee = 5.0;
    return (totalPrice + deliveryFee).toFixed(2);
  }, [totalPrice]);

  const handleQuantityChange = (productId: number, value: string) => {
    const numValue = Math.max(1, Number(value) || 1);
    setQuantities((prev) => ({ ...prev, [productId]: numValue }));
  };

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

  const useCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur.");
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
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=fr&apiKey=${GEOAPIFY_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      const feature = data.features?.[0];

      if (feature?.properties?.formatted) {
        setForm((prev) => ({ ...prev, pickupAddress: feature.properties.formatted }));
        setCoords((prev) => ({ ...prev, pickup: { lat, lon } }));
        toast.success("Position actuelle récupérée");
      } else {
        toast.error("Impossible d'obtenir l'adresse.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 1) toast.error("Accès à la localisation refusé.");
      else toast.error("Erreur lors de la récupération de la position.");
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Calcul de la distance (inchangé)
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
      toast.error("Veuillez remplir les adresses de ramassage et de livraison.");
      return;
    }

    if (itemsToDeliver.length === 0) {
      toast.error("Aucun produit sélectionné.");
      return;
    }

    setLoading(true);

    try {
      // Préparer les items avec leurs quantités respectives
      const deliveryItems = itemsToDeliver.map((p) => ({
        productId: p.id,
        quantity: quantities[p.id] || 1,
      }));

      const res = await fetch("/api/deliveries", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupAddress: form.pickupAddress.trim(),
          dropAddress: form.dropAddress.trim(),
          distanceKm: form.distanceKm ? Number(form.distanceKm) : undefined,
          price: form.price ? Number(form.price) : undefined,   // optionnel
          scheduledAt: scheduledAt,
          items: deliveryItems,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Erreur lors de la création de la livraison");
      }

      toast.success(
        `Livraison créée avec succès pour ${itemsToDeliver.length} produit${itemsToDeliver.length > 1 ? "s" : ""} !`
      );

      // Reset du formulaire
      setForm({ pickupAddress: "", dropAddress: "", distanceKm: "", price: "" });
      setQuantities({});
      setCoords({});
      setSelectedDate(undefined);
      setSelectedTime("");
      setOpen(false);

      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Échec de la création de la livraison");
    } finally {
      setLoading(false);
    }
  };

  if (itemsToDeliver.length === 0) return null;

  const isMultiple = itemsToDeliver.length > 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="default" size="sm" disabled={disabled}>
            <Package className="mr-2 h-4 w-4" />
            Livrer
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] md:max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Truck className="h-5 w-5" />
            {isMultiple ? `Livraison multiple (${itemsToDeliver.length} produits)` : `Livraison pour : ${itemsToDeliver[0].name}`}
          </DialogTitle>
          <DialogDescription>
            Configurez les quantités et les détails de la livraison.
          </DialogDescription>
        </DialogHeader>

        <GeoapifyContext apiKey={GEOAPIFY_API_KEY}>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Liste des produits avec quantité individuelle */}
            <div className="space-y-4">
              {itemsToDeliver.map((p) => (
                <div key={p.id} className="flex gap-4 p-4 bg-muted/50 rounded-lg items-center">
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {p.price.toFixed(2)} € / unité
                    </p>
                  </div>

                  <div className="w-32">
                    <Label htmlFor={`qty-${p.id}`} className="text-xs">Quantité</Label>
                    <Input
                      id={`qty-${p.id}`}
                      type="number"
                      min={1}
                      max={p.stock || 999}
                      value={quantities[p.id] || 1}
                      onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="text-right w-24">
                    <p className="font-semibold text-sm">
                      {(p.price * (quantities[p.id] || 1)).toFixed(2)} €
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Prix total */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total produits :</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Frais de livraison estimés :</span>
                <span>5.00 €</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Total livraison :</span>
                <span>{suggestedTotalPrice} €</span>
              </div>
            </div>

            {/* Adresse de ramassage */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Adresse de ramassage (Pickup)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={useCurrentLocation}
                  disabled={isGettingLocation}
                >
                  <MapPin className="mr-1 h-4 w-4" />
                  Ma position
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

            {/* Distance + Prix personnalisé */}
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
                  value={form.price !== "" ? form.price : suggestedTotalPrice}
                  onChange={handleManualChange}
                />
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