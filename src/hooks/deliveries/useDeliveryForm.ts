import { useState, useEffect, useMemo } from "react";

export function useDeliveryForm(itemsToDeliver: any[], open: boolean, GEOAPIFY_API_KEY: string) {
  const [loading, setLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [form, setForm] = useState({ pickupAddress: "", dropAddress: "", distanceKm: "", price: "" });
  const [coords, setCoords] = useState<{ pickup?: { lat: number; lon: number }; drop?: { lat: number; lon: number } }>({});

  // Initialisation quantités
  useEffect(() => {
    if (!open || itemsToDeliver.length === 0) return;
    setQuantities((prev) => {
      const alreadyInitialized = itemsToDeliver.every(p => prev[p.id] !== undefined);
      if (alreadyInitialized) return prev;
      const initial: Record<number, number> = {};
      itemsToDeliver.forEach((p) => { initial[p.id] = 1; });
      return initial;
    });
  }, [open, itemsToDeliver]);

  // Calculs de prix
  const totalPrice = useMemo(() => {
    return itemsToDeliver.reduce((sum, p) => sum + p.price * (quantities[p.id] || 1), 0);
  }, [itemsToDeliver, quantities]);

  const suggestedTotalPrice = useMemo(() => (totalPrice + 5.0).toFixed(2), [totalPrice]);

  // Calcul Distance
  useEffect(() => {
    if (!coords.pickup || !coords.drop || !GEOAPIFY_API_KEY) return;
    const fetchDistance = async () => {
      const waypoints = `${coords.pickup!.lat},${coords.pickup!.lon}|${coords.drop!.lat},${coords.drop!.lon}`;
      const url = `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${GEOAPIFY_API_KEY}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        const route = data?.features?.[0]?.properties;
        if (route?.distance) setForm(prev => ({ ...prev, distanceKm: (route.distance / 1000).toFixed(1) }));
      } catch (err) { console.error(err); }
    };
    fetchDistance();
  }, [coords, GEOAPIFY_API_KEY]);

  const handleQuantityChange = (productId: number, newValue: number | string) => {
    let numValue = typeof newValue === "string" ? parseInt(newValue, 10) : newValue;
    if (isNaN(numValue) || numValue < 1) numValue = 1;
    const maxStock = itemsToDeliver.find(p => p.id === productId)?.stock ?? 999;
    setQuantities(prev => ({ ...prev, [productId]: Math.min(numValue, maxStock) }));
  };

  const handlePlaceSelect = (value: any, field: "pickupAddress" | "dropAddress") => {
    if (value?.properties) {
      const { formatted, lat, lon } = value.properties;
      setForm(prev => ({ ...prev, [field]: formatted?.trim() || "" }));
      setCoords(prev => ({ ...prev, [field === "pickupAddress" ? "pickup" : "drop"]: { lat, lon } }));
    }
  };

  return {
    loading, setLoading, isGettingLocation, setIsGettingLocation,
    selectedDate, setSelectedDate, selectedTime, setSelectedTime,
    form, setForm, quantities, setQuantities, setCoords,
    totalPrice, suggestedTotalPrice, handleQuantityChange, handlePlaceSelect
  };
}