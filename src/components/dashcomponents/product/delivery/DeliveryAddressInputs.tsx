
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import { toast } from "sonner";

import { DeliveryFormData } from "@/types";
import { useCurrentLocation } from "@/hooks/deliveries/useCurrentLocation";

type DeliveryAddressInputsProps = {
  form: DeliveryFormData;
  setForm: React.Dispatch<React.SetStateAction<DeliveryFormData>>;
  coords: {
    pickup?: { lat: number; lon: number };
    drop?: { lat: number; lon: number };
  };
  setCoords: React.Dispatch<React.SetStateAction<{
    pickup?: { lat: number; lon: number };
    drop?: { lat: number; lon: number };
  }>>;
};

export function DeliveryAddressInputs({
  form,
  setForm,
  coords,
  setCoords,
}: DeliveryAddressInputsProps) {
  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "";
  const { isGettingLocation, getCurrentLocation } = useCurrentLocation(setForm, setCoords);

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

  return (
    <GeoapifyContext apiKey={GEOAPIFY_API_KEY}>
      <div className="space-y-6">
        {/* Adresse de ramassage */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label>Adresse de ramassage (Pickup)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
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
      </div>
    </GeoapifyContext>
  );
}