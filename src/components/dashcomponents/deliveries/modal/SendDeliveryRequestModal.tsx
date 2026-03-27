"use client";

import { useState, useEffect } from "react";
import type { Delivery } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Star, MapPin, Car, User } from "lucide-react";
import { toast } from "sonner";

type Driver = {
  id: number;
  nom: string;
  prenom: string;
  rating: number;
  telephone?: string;
  driverProfile: {
    vehicleType: string;
    zone: string;
    isPremium?: boolean;
    isApproved: boolean;     
  };
};

type SendDeliveryRequestModalProps = {
  delivery: Delivery;
  children: React.ReactNode;
};

export function SendDeliveryRequestModal({
  delivery,
  children,
}: SendDeliveryRequestModalProps) {
  const [open, setOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState<number[]>([]);

  // Critères optionnels
  const [maxDistanceKm, setMaxDistanceKm] = useState<number | "">("");
  const [minRating, setMinRating] = useState<number | "">(4.0);

  // Charger les drivers quand le modal s'ouvre
  useEffect(() => {
    if (!open) return;

    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/drivers", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erreur lors du chargement des livreurs");

        const data: Driver[] = await res.json();
        
        // Sécurité supplémentaire
        const validDrivers = data.filter((d) => d.driverProfile);
        
        setDrivers(validDrivers);
        setFilteredDrivers(validDrivers);
      } catch (err) {
        toast.error("Impossible de charger les livreurs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [open]);

  // Filtre en temps réel
  useEffect(() => {
    let result = [...drivers];

    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (d) =>
          `${d.nom} ${d.prenom}`.toLowerCase().includes(term) ||
          d.driverProfile.zone.toLowerCase().includes(term)
      );
    }

    if (minRating) {
      result = result.filter((d) => d.rating >= Number(minRating));
    }

    setFilteredDrivers(result);
  }, [search, drivers, minRating]);

  const toggleDriver = (driverId: number) => {
    setSelectedDrivers((prev) =>
      prev.includes(driverId)
        ? prev.filter((id) => id !== driverId)
        : [...prev, driverId]
    );
  };

  const sendRequest = async () => {
    if (selectedDrivers.length === 0) {
      toast.error("Veuillez sélectionner au moins un livreur");
      return;
    }

    setSending(true);

    try {
      const promises = selectedDrivers.map((driverId) =>
        fetch("/api/delivery-requests", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deliveryId: delivery.id,
            driverId,
            maxDistanceKm: maxDistanceKm ? Number(maxDistanceKm) : undefined,
            minRating: minRating ? Number(minRating) : undefined,
            message: `Demande pour la livraison ${delivery.pickupAddress} → ${delivery.dropAddress}`,
          }),
        })
      );

      await Promise.all(promises);

      toast.success(`${selectedDrivers.length} demande(s) envoyée(s) avec succès !`);
      setOpen(false);
      setSelectedDrivers([]);
    } catch (err) {
      toast.error("Erreur lors de l'envoi de la demande");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Envoyer une demande aux livreurs</DialogTitle>
          <DialogDescription>
            Livraison : {delivery.pickupAddress.split(",")[0]} →{" "}
            {delivery.dropAddress.split(",")[0]}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1">
          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Rechercher un livreur</Label>
              <Input
                placeholder="Nom, prénom ou zone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <Label>Note minimum</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : "")}
              />
            </div>

            <div>
              <Label>Distance max (km)</Label>
              <Input
                type="number"
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(e.target.value ? Number(e.target.value) : "")}
                placeholder="Ex: 15"
              />
            </div>
          </div>

          {/* Liste des drivers */}
          <div className="flex-1 flex flex-col">
            <div className="text-sm text-muted-foreground mb-2">
              {filteredDrivers.length} livreur(s) trouvé(s)
            </div>

            <ScrollArea className="flex-1 pr-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredDrivers.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  Aucun livreur trouvé
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredDrivers.map((driver) => {
                    const isSelected = selectedDrivers.includes(driver.id);

                    return (
                      <Card
                        key={driver.id}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          isSelected && "ring-2 ring-primary"
                        )}
                        onClick={() => toggleDriver(driver.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {driver.prenom} {driver.nom}
                                </p>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  {driver.rating.toFixed(1)}
                                </div>
                              </div>
                            </div>

                            {/* Correction principale ici */}
                            {driver.driverProfile?.isPremium && (
                              <Badge variant="secondary">Premium</Badge>
                            )}
                          </div>

                          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Car className="h-4 w-4" />
                              {driver.driverProfile.vehicleType}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {driver.driverProfile.zone}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={sendRequest} 
            disabled={sending || selectedDrivers.length === 0}
          >
            {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Envoyer aux {selectedDrivers.length} livreur(s) sélectionné(s)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}