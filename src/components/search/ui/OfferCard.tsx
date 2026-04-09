"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

type Offer = {
  id: string;
  from: string;
  to: string;
  weight: string;
  price: string;
  status: "EN TRANSIT" | "URGENT" | "PROGRAMMÉ";
  description: string;
  avatar: string;
  fallback?: string;
  // Données supplémentaires pour le dialog
  vehicle?: string;
  cargoType?: string;
  deadline?: string;
  distance?: string;
  estimatedTime?: string;
  driver?: string;
};

export default function OfferCard({ offer }: { offer: Offer }) {
  const [open, setOpen] = useState(false);

  const statusClasses =
    offer.status === "URGENT"
      ? "bg-error-container text-on-error-container"
      : offer.status === "EN TRANSIT"
      ? "bg-tertiary-container text-on-tertiary-container"
      : "bg-secondary-container/10 text-on-secondary-container";

  return (
    <>
      <Card className="bg-surface-container-low border border-outline-variant/20 p-6 flex flex-col gap-5 hover:bg-surface-container-lowest hover:shadow-[0_20px_50px_rgba(48,48,50,0.1)] transition-all group">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-outline-variant/30">
              <AvatarImage src={offer.avatar} alt={`Avatar ${offer.id}`} />
              <AvatarFallback className="bg-surface-container-high text-on-surface text-sm font-medium">
                {offer.fallback || offer.id.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-60">
                #{offer.id}
              </span>
              <h3 className="font-headline text-lg font-bold tracking-tight">
                {offer.from} <span className="text-outline">→</span> {offer.to}
              </h3>
            </div>
          </div>

          <Badge className={`${statusClasses} px-3 py-1 text-[10px] font-bold uppercase tracking-widest`}>
            {offer.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Poids</span>
            <span className="block text-base font-headline font-bold">{offer.weight}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Prix Fixe</span>
            <span className="block text-xl font-headline font-black text-primary">{offer.price}</span>
          </div>
        </div>

        <div className="h-px bg-outline-variant/10 w-full" />

        <p className="text-xs text-on-surface-variant font-medium">{offer.description}</p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full py-3 rounded-md bg-surface-container-highest font-headline font-bold text-[10px] tracking-widest uppercase group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary-container group-hover:text-white transition-all"
            >
              Voir les détails
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="p-8 pb-6 border-b">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={offer.avatar} />
                  <AvatarFallback className="text-2xl">
                    {offer.fallback || offer.id.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-3xl font-headline font-black tracking-tight">
                    {offer.from} → {offer.to}
                  </DialogTitle>
                  <p className="text-xl text-primary font-headline font-bold mt-1">{offer.price}</p>
                  <Badge className={`${statusClasses} mt-2`}>{offer.status}</Badge>
                </div>
              </div>
            </DialogHeader>

            <div className="p-8 space-y-8">
              {/* Informations principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-outline mb-3">Détails du Transport</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Poids</span>
                        <span className="font-headline font-bold">{offer.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Véhicule</span>
                        <span className="font-medium">{offer.vehicle || "Fourgon 20m³"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Type de cargaison</span>
                        <span className="font-medium">{offer.cargoType || "Matériel Médical"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Distance</span>
                        <span className="font-medium">{offer.distance || "460 km"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-outline mb-3">Délai & Planning</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Délai souhaité</span>
                        <span className="font-medium text-primary">{offer.deadline || "< 18:00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Temps estimé</span>
                        <span className="font-medium">{offer.estimatedTime || "4h 30min"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-outline mb-3">Informations Transporteur</h4>
                  <div className="bg-surface-container-low rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={offer.avatar} />
                        <AvatarFallback>{offer.fallback || "JD"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-headline font-semibold">Jean-Dupont Logistics</p>
                        <p className="text-sm text-on-surface-variant">Transporteur Premium • Note 4.98</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Chauffeur</span>
                        <span>{offer.driver || "Marc Dubois"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Véhicule immatriculé</span>
                        <span className="font-mono">AB-392-CD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description longue */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-outline mb-3">Description</h4>
                <p className="text-on-surface-variant leading-relaxed">
                  {offer.description} — Transport express de matériel sensible nécessitant une chaîne du froid maintenue entre 2°C et 8°C. 
                  Traçabilité GPS en temps réel et assurance complète incluse.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button 
                  className="flex-1 bg-gradient-to-r from-primary to-secondary-container text-white py-6 text-base font-headline font-bold tracking-wide"
                  onClick={() => alert("Offre acceptée ! (simulation)")}
                >
                  Accepter l’offre
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 py-6 text-base font-headline font-bold"
                  onClick={() => setOpen(false)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}