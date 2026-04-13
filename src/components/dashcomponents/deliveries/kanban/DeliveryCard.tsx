"use client";

import { useState } from "react";
import type { Delivery } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SendDeliveryRequestModal } from "../modal/SendDeliveryRequestModal";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react"; 
import { Pin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, QrCode } from "lucide-react";
import { toast } from "@/components/ui/sonner";
type DeliveryCardProps = {
  delivery: Delivery;
  isBeingDragged: boolean;
  onDragStart: (delivery: Delivery) => void;
};

export function DeliveryCard({
  delivery,
  isBeingDragged,
  onDragStart,
}: DeliveryCardProps) {
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const shortPickup = delivery.pickupAddress?.split(",")[0]?.trim() || "Départ inconnu";
  const shortDrop = delivery.dropAddress?.split(",")[0]?.trim() || "Destination inconnue";

  // Récupération des tokens via l'API NestJS
  const fetchTokens = async () => {
    if (tokens.length > 0) return; // Évite de recharger si déjà présent
    setIsLoading(true);
    try {
      const response = await fetch(`/api/deliveries/${delivery.id}/tokens`);
      if (response.ok) {
        const data = await response.json();
        setTokens(data);
      }
    } catch (error) {
      console.error("Erreur tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const [isPinning, setIsPinning] = useState(false);
  const handlePin = async () => {
    setIsPinning(true);
    try {
      const response = await fetch(`/api/deliveries/${delivery.id}/epingled`, {
        method: "PATCH",
      });

      if (response.ok) {
        toast.success("Livraison épinglée avec succès 📌");
      } else {
        const error = await response.json();
        toast.error(error.message || "Erreur lors de l'épinglage");
      }
    } catch (error) {
      console.error("Erreur épinglage:", error);
      toast.error("Erreur serveur");
    } finally {
      setIsPinning(false);
    }
  };

  return (
    <div
      draggable
      onDragStart={() => onDragStart(delivery)}
      className={cn(
        "bg-card text-card-foreground rounded-lg border p-4 shadow-sm",
        "hover:shadow-md hover:border-primary/40 transition-all duration-150",
        "cursor-grab active:cursor-grabbing select-none",
        isBeingDragged && "opacity-50 scale-95"
      )}
    >
      {/* En-tête + Statut */}
      <div className="flex items-start justify-between mb-2">
        <div className="font-medium line-clamp-1 flex-1 pr-2">
          {shortPickup} → {shortDrop}
        </div>
        
        {delivery.status && (
          <span className="text-[10px] px-2 py-0.5 rounded-full border bg-secondary text-secondary-foreground font-bold uppercase">
            {delivery.status}
          </span>
        )}
      </div>

      {/* Adresses */}
      <div className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {delivery.pickupAddress}
      </div>

      {/* Prix + Distance */}
      <div className="flex items-center justify-between text-sm mb-4">
        {delivery.distanceKm && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="material-symbols-outlined text-base">distance</span>
            {delivery.distanceKm} km
          </div>
        )}
        <div className="font-bold text-primary text-base">
          {delivery.price?.toFixed(2)} €
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Link
            href={`/dashboard/tasks/${delivery.id}`}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Détails
          </Link>

          {/* MODAL QR CODES */}

          <div className="flex gap-2">
             <Button
                variant="outline"
                size="sm"
                onClick={handlePin}
                disabled={isPinning}
                className="h-8 gap-2 border-primary/20 hover:border-primary/50"
              >
                {isPinning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Pin className="h-4 w-4" />
                )}
                Épingler
              </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchTokens}
                  className="h-8 gap-2 border-primary/20 hover:border-primary/50"
                >
                  <QrCode className="h-4 w-4" />
                  QR Codes
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="text-center">Validation Livraison #{delivery.id}</DialogTitle>
                </DialogHeader>
                
                <div className="flex flex-col gap-4 py-4">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : tokens.length > 0 ? (
                    tokens.map((t) => (
                      <div key={t.id} className="flex flex-col items-center p-4 border rounded-xl bg-muted/30">
                        <p className="text-xs font-black uppercase mb-3 tracking-widest text-muted-foreground">
                          Code {t.type === "PICKUP" ? "de Ramassage" : "de Livraison"}
                        </p>
                        
                        <div className="bg-white p-3 rounded-lg shadow-sm border">
                          <QRCodeSVG 
                            value={t.token} 
                            size={160}
                            level="H" // Haute correction d'erreur pour faciliter le scan
                            includeMargin={false}
                          />
                        </div>
                        
                        <p className="mt-3 text-[10px] font-mono text-muted-foreground bg-white px-2 py-1 rounded border">
                          {t.token}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground italic">
                      Aucun token de vérification généré.
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <SendDeliveryRequestModal delivery={delivery}>
          <Button size="sm" className="w-full gap-2 font-semibold">
            <span className="material-symbols-outlined text-base">send</span>
            Envoyer aux livreurs
          </Button>
        </SendDeliveryRequestModal>
      </div>
    </div>
  );
}