"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Truck, RefreshCw, MapPin, User } from "lucide-react";

type DeliveryRequest = {
  id: number;
  status: string;
  createdAt: string;
  delivery: {
    id: number;
    pickupAddress: string;
    dropAddress: string;
    price: number;
    distanceKm?: number | null;
    status: string;
  };
  client: {
    id: number;
    nom: string;
    prenom: string;
    telephone?: string;
  };
  driver?: {
    id: number;
    nom: string;
    prenom: string;
  };
};

export default function DeliveryRequestsReceivedList() {
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReceivedRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/delivery-requests/received", {
        credentials: "include",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Session expirée, veuillez vous reconnecter");
        if (res.status === 403) throw new Error("Accès refusé : vous devez être livreur");
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erreur lors du chargement des demandes");
      }

      const data = await res.json();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedRequests();
  }, []);

  // Fonction pour afficher un badge de statut lisible
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">En attente</Badge>;
      case "SENT":
        return <Badge variant="default">Envoyée</Badge>;
      case "ACCEPTED":
        return <Badge variant="default" className="bg-green-600">Acceptée</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Refusée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Erreur de chargement</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-4">
          {error}
          <Button variant="outline" size="sm" onClick={fetchReceivedRequests}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Demandes reçues</h2>
          <p className="text-muted-foreground mt-1">
            Liste des demandes de livraison qui vous ont été envoyées
          </p>
        </div>
        <Button onClick={fetchReceivedRequests} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/30">
          <Truck className="mx-auto h-20 w-20 text-muted-foreground" />
          <h3 className="mt-6 text-2xl font-semibold">Aucune demande reçue pour le moment</h3>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Les clients n’ont pas encore envoyé de demandes vers vous.
            <br /> Elles apparaîtront ici dès qu’elles seront envoyées.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <Card
              key={req.id}
              className="overflow-hidden transition-all hover:shadow-lg flex flex-col"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Demande #{req.id}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(req.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-5">
                {/* Client */}
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {req.client.prenom} {req.client.nom}
                    </p>
                    {req.client.telephone && (
                      <p className="text-sm text-muted-foreground">
                        {req.client.telephone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Adresses */}
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-700">Départ</p>
                      <p className="text-muted-foreground">{req.delivery.pickupAddress}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-700">Arrivée</p>
                      <p className="text-muted-foreground">{req.delivery.dropAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Prix & Distance */}
                <div className="flex justify-between items-end border-t pt-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      {req.delivery.price.toFixed(2)} €
                    </p>
                    {req.delivery.distanceKm && (
                      <p className="text-xs text-muted-foreground">
                        {req.delivery.distanceKm} km
                      </p>
                    )}
                  </div>

                  <Badge variant="outline">
                    {req.delivery.status}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter className="pt-6">
                <Button className="w-full" size="lg">
                  Voir les détails & Répondre
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}