import { useState } from "react";
import { toast } from "sonner";
import { DeliveryFormData } from "@/types";

export function useCurrentLocation(
  setForm: React.Dispatch<React.SetStateAction<DeliveryFormData>>,
  setCoords: React.Dispatch<React.SetStateAction<{
    pickup?: { lat: number; lon: number };
    drop?: { lat: number; lon: number };
  }>>
) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "";

  const getCurrentLocation = async () => {
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
        toast.success("Position actuelle récupérée avec succès");
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

  return { isGettingLocation, getCurrentLocation };
}