'use client';
import React, { useEffect, useState } from 'react';
import { useCurrentUser } from '@/lib/auth/use-current-user';
import { useRouter } from 'next/navigation';
import { Delivery } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MapPin, User, Package, DollarSign, Users } from 'lucide-react';

interface DeliveryRequest {
  id: number;
  status: string;
  createdAt: string;
  driver?: {
    id: number;
    nom: string;
    prenom: string;
  };
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function DeliveryDetailPage({ params }: Props) {
  const { id } = React.use(params);
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch des détails de la livraison
  useEffect(() => {
    async function fetchDelivery() {
      if (!user) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/deliveries/${id}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error(res.status === 404 ? "Livraison non trouvée" : "Erreur de chargement");
        }

        const data: Delivery = await res.json();
        setDelivery(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (user && !userLoading) fetchDelivery();
  }, [id, user, userLoading]);

  // Fetch des demandes envoyées (avec clientId + deliveryId)
  useEffect(() => {
    async function fetchRequests() {
      if (!delivery || !user) return;

      try {
        setRequestsLoading(true);

        const res = await fetch(
          `/api/delivery-requests/sent?clientId=${user.id}&deliveryId=${delivery.id}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!res.ok) {
          if (res.status === 403 || res.status === 404) {
            setRequests([]);
            return;
          }
          throw new Error("Erreur lors du chargement des demandes envoyées");
        }

        const data: DeliveryRequest[] = await res.json();
        setRequests(data);
      } catch (err: any) {
        console.error("Erreur lors du chargement des requests :", err);
        setRequests([]);
      } finally {
        setRequestsLoading(false);
      }
    }

    if (delivery && !userLoading) fetchRequests();
  }, [delivery, user, userLoading]);

  // Navigation vers les détails d'une demande
  const handleViewDetails = (requestId: number) => {
    router.push(`/delivery-requests/${requestId}`);
  };

  if (userLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Chargement des détails...</p>
      </div>
    );
  }

  if (error || !delivery) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error || "Livraison non trouvée"}
      </div>
    );
  }

  const statusColor = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACCEPTED: 'bg-blue-100 text-blue-700',
    PICKED_UP: 'bg-purple-100 text-purple-700',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }[delivery.status] || 'bg-slate-100 text-slate-700';

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold tracking-tight text-secondary-blue uppercase">
            Livraison #{delivery.id}
          </h1>
          <Badge className={`px-4 py-1.5 text-sm font-bold uppercase ${statusColor}`}>
            {delivery.status}
          </Badge>
        </div>
        <p className="text-slate-500">
          {new Date(delivery.createdAt).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Itinéraire */}
          <Card className="sharp-border overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-secondary-blue">
                <MapPin className="w-5 h-5" />
                Itinéraire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Départ</p>
                <p className="font-medium">{delivery.pickupAddress}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Destination</p>
                <p className="font-medium">{delivery.dropAddress}</p>
              </div>
            </CardContent>
          </Card>

          {/* Articles */}
          {delivery.items && delivery.items.length > 0 && (
            <Card className="sharp-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-secondary-blue">
                  <Package className="w-5 h-5" />
                  Articles ({delivery.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {delivery.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-0">
                      <div>
                        <p className="font-semibold">
                          {item.product?.name || item.customName}
                        </p>
                        <p className="text-sm text-slate-500">Quantité : {item.quantity}</p>
                      </div>
                      <p className="font-bold text-secondary-blue">
                        {item.subtotal} FCFA
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prix */}
          <Card className="sharp-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-secondary-blue">
                <DollarSign className="w-5 h-5" />
                Montant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-secondary-blue">
                {delivery.price} <span className="text-2xl">FCFA</span>
              </div>
              {delivery.commission && (
                <p className="text-sm text-slate-500 mt-2">
                  Commission : {delivery.commission} FCFA
                </p>
              )}
            </CardContent>
          </Card>

          {/* Client */}
          <Card className="sharp-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-secondary-blue">
                <User className="w-5 h-5" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold">
                {delivery.client?.prenom} {delivery.client?.nom}
              </p>
              <p className="text-slate-600">{delivery.client?.telephone}</p>
              <p className="text-slate-600">{delivery.client?.email}</p>
            </CardContent>
          </Card>

          {/* Chauffeur */}
          <Card className="sharp-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-secondary-blue">
                <User className="w-5 h-5" />
                Chauffeur
              </CardTitle>
            </CardHeader>
            <CardContent>
              {delivery.driver ? (
                <p className="font-semibold">
                  {delivery.driver.prenom} {delivery.driver.nom}
                </p>
              ) : (
                <p className="text-slate-500 italic">Non encore assigné</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tableau des Demandes Envoyées */}
      <Card className="sharp-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-secondary-blue">
            <Users className="w-5 h-5" />
            Demandes envoyées ({requests.length})
          </CardTitle>
          <p className="text-sm text-slate-500">
            Liste des demandes de livraison envoyées aux livreurs pour cette course
          </p>
        </CardHeader>
        <CardContent>
          {requestsLoading ? (
            <p className="text-slate-500 py-12 text-center">Chargement des demandes envoyées...</p>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p className="text-slate-500 italic">
                Aucune demande n'a été envoyée pour cette livraison pour le moment.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">ID Demande</TableHead>
                    <TableHead>Chauffeur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date d'envoi</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">#{req.id}</TableCell>
                      <TableCell>
                        {req.driver ? (
                          `${req.driver.prenom} ${req.driver.nom}`
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize font-medium">
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(req.id)}
                        >
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}