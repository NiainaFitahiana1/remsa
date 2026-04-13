"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { getShortAddress } from "@/lib/utils";

type DeliveryOffer = {
  id: number;
  pickupAddress: string;
  dropAddress: string;
  price: number | string;           // ← On accepte les deux
  distanceKm?: number | string;
  status: string;
  scheduledAt?: string;
  createdAt: string;
  client?: {
    nom: string;
    prenom: string;
  };
  items?: Array<any>;
};

export default function OfferCard({ offer }: { offer: DeliveryOffer }) {
  const [open, setOpen] = useState(false);

  // Conversion sécurisée du prix en nombre
  const priceNumber = typeof offer.price === "string" 
    ? parseFloat(offer.price) 
    : offer.price;

  const formattedPrice = isNaN(priceNumber) ? "0.00" : priceNumber.toFixed(2);

  // Conversion sécurisée de la distance
  const distance = typeof offer.distanceKm === "string" 
    ? parseFloat(offer.distanceKm) 
    : offer.distanceKm;

  const formattedDistance = isNaN(distance as number) ? "—" : `${distance} km`;

  // Gestion du statut
  const getStatusInfo = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return { label: "EN ATTENTE", class: "bg-amber-500/10 text-amber-600" };
      case "ACCEPTED":
        return { label: "ACCEPTÉE", class: "bg-blue-500/10 text-blue-600" };
      case "PICKED_UP":
        return { label: "RÉCUPÉRÉE", class: "bg-purple-500/10 text-purple-600" };
      case "IN_PROGRESS":
        return { label: "EN TRANSIT", class: "bg-emerald-500/10 text-emerald-600" };
      case "DELIVERED":
        return { label: "LIVRÉE", class: "bg-green-500/10 text-green-600" };
      default:
        return { label: status || "INCONNU", class: "bg-secondary-container/10 text-on-secondary-container" };
    }
  };

  const statusInfo = getStatusInfo(offer.status);

  return (
    <>
      <Card className="bg-surface-container-low border border-outline-variant/20 p-6 flex flex-col gap-5 hover:bg-surface-container-lowest hover:shadow-[0_20px_50px_rgba(48,48,50,0.1)] transition-all group">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-outline-variant/30">
              <AvatarFallback className="bg-surface-container-high text-on-surface text-sm font-medium">
                {offer.client 
                  ? `${offer.client.prenom?.[0] || ""}${offer.client.nom?.[0] || ""}`
                  : "LD"
                }
              </AvatarFallback>
            </Avatar>

            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-60">
                #{offer.id}
              </span>
              <h3 className="font-headline text-lg font-bold tracking-tight">
                {getShortAddress(offer.pickupAddress)} <span className="text-outline">→</span> {getShortAddress(offer.dropAddress)}
              </h3>
            </div>
          </div>

          <Badge className={`${statusInfo.class} px-3 py-1 text-[10px] font-bold uppercase tracking-widest`}>
            {statusInfo.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Distance</span>
            <span className="block text-base font-headline font-bold">
              {formattedDistance}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Prix</span>
            <span className="block text-xl font-headline font-black text-primary">
              {formattedPrice} €
            </span>
          </div>
        </div>

        <div className="h-px bg-outline-variant/10 w-full" />

        <p className="text-xs text-on-surface-variant font-medium line-clamp-2">
          {offer.items?.length || 0} article(s) • 
          {offer.scheduledAt 
            ? new Date(offer.scheduledAt).toLocaleDateString('fr-FR') 
            : "Dès que possible"}
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full py-3 rounded-md bg-surface-container-highest font-headline font-bold text-[10px] tracking-widest uppercase group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary-container group-hover:text-white transition-all">
              Voir les détails
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="p-8 pb-6 border-b">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-2xl">
                    {offer.client 
                      ? `${offer.client.prenom?.[0] || ""}${offer.client.nom?.[0] || ""}`
                      : "LD"
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-xl font-headline font-black tracking-tight">
                    {offer.pickupAddress} → {offer.dropAddress}
                  </DialogTitle>
                  <p className="text-2xl text-primary font-headline font-bold mt-1">
                    {formattedPrice} €
                  </p>
                  <Badge className={`${statusInfo.class} mt-2`}>
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-outline mb-3">Détails du Transport</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Distance</span>
                        <span className="font-headline font-bold">{formattedDistance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Articles</span>
                        <span className="font-medium">{offer.items?.length || 0}</span>
                      </div>
                      {offer.scheduledAt && (
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant">Date prévue</span>
                          <span className="font-medium">
                            {new Date(offer.scheduledAt).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-outline mb-3">Client</h4>
                  <div className="bg-surface-container-low rounded-xl p-6">
                    <p className="font-semibold">
                      {offer.client?.prenom} {offer.client?.nom}
                    </p>
                    <p className="text-sm text-on-surface-variant mt-1">Demandeur de la livraison</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button 
                  className="flex-1 bg-gradient-to-r from-primary to-secondary-container text-white py-6 text-base font-headline font-bold tracking-wide"
                  onClick={() => alert("Demande de prise en charge envoyée !")}
                >
                  Proposer mes services
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