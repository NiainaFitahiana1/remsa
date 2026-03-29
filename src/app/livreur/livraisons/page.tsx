"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertCircle, 
  Truck, 
  RefreshCw, 
  MapPin, 
  User, 
  CheckCircle, 
  XCircle,
  Eye 
} from "lucide-react";

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
  const [selectedRequest, setSelectedRequest] = useState<DeliveryRequest | null>(null);
  const [responseNote, setResponseNote] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchReceivedRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/delivery-requests/received", {
        credentials: "include",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
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

  // Filtre : on ne garde que les demandes ACCEPTÉES
  const acceptedRequests = requests.filter(req => req.status === "ACCEPTED");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">En attente</Badge>;
      case "SENT":
        return <Badge variant="default">Envoyée</Badge>;
      case "ACCEPTED":
        return <Badge variant="default" className="bg-green-600 hover:bg-green-600">Acceptée</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Refusée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleResponse = async (status: "ACCEPTED" | "REJECTED") => {
    if (!selectedRequest) return;

    setIsResponding(true);
    try {
      const res = await fetch(`/api/delivery-requests/${selectedRequest.id}/respond`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          note: status === "ACCEPTED" && responseNote.trim() ? responseNote.trim() : undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Erreur lors de la réponse à la demande");
      }

      await fetchReceivedRequests(); // Rafraîchir
      setOpenDialog(false);
      setResponseNote("");
      setSelectedRequest(null);
    } catch (err: any) {
      alert(err.message || "Une erreur est survenue");
    } finally {
      setIsResponding(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="rounded-xl border overflow-hidden">
            <Skeleton className="h-12 w-full" />
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full border-t" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-10">
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
    <div className="min-h-screen text-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Demandes Acceptées</h2>
            <p className="text-muted-foreground mt-1">
              Liste des demandes de livraison que vous avez acceptées
            </p>
          </div>
          <Button onClick={fetchReceivedRequests} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>

        {acceptedRequests.length === 0 ? (
          <div className="text-center py-20 border rounded-xl bg-muted/30">
            <CheckCircle className="mx-auto h-20 w-20 text-green-600" />
            <h3 className="mt-6 text-2xl font-semibold">Aucune demande acceptée</h3>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Les demandes que vous acceptez apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Trajet</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {acceptedRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">#{req.id}</TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {req.client.prenom} {req.client.nom}
                          </p>
                          {req.client.telephone && (
                            <p className="text-sm text-muted-foreground">{req.client.telephone}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="text-muted-foreground line-clamp-1">
                            {req.delivery.pickupAddress}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-red-600" />
                          <span className="text-muted-foreground line-clamp-1">
                            {req.delivery.dropAddress}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-semibold text-lg text-primary">
                          {req.delivery.price.toFixed(2)} €
                        </p>
                        {req.delivery.distanceKm && (
                          <p className="text-xs text-muted-foreground">
                            {req.delivery.distanceKm} km
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm text-muted-foreground">
                        {new Date(req.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(req.status)}
                    </TableCell>

                    <TableCell className="text-right">
                      <Dialog
                        open={openDialog && selectedRequest?.id === req.id}
                        onOpenChange={(open) => {
                          setOpenDialog(open);
                          if (!open) {
                            setResponseNote("");
                            setSelectedRequest(null);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRequest(req)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Détails
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Demande Acceptée #{req.id}</DialogTitle>
                            <DialogDescription>
                              Client : {req.client.prenom} {req.client.nom}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Départ</p>
                                <p className="font-medium">{req.delivery.pickupAddress}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Arrivée</p>
                                <p className="font-medium">{req.delivery.dropAddress}</p>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium block mb-2">
                                Note / Commentaire
                              </label>
                              <Textarea
                                placeholder="Ajoutez une note..."
                                value={responseNote}
                                onChange={(e) => setResponseNote(e.target.value)}
                                rows={4}
                                disabled={isResponding}
                              />
                            </div>
                          </div>

                          <DialogFooter className="flex flex-col sm:flex-row gap-3">
                            <Button
                              variant="destructive"
                              onClick={() => handleResponse("REJECTED")}
                              disabled={isResponding}
                              className="flex-1"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Refuser maintenant
                            </Button>
                            <Button
                              onClick={() => handleResponse("ACCEPTED")}
                              disabled={isResponding}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Confirmer
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}