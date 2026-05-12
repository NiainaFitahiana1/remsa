"use client";

import Greeting from "@/components/dashcomponents/Greeting";
import StatsCard from "@/components/dashcomponents/StatsCard";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useDeliveries } from "@/hooks/deliveries/useDeliveries";
import { useProducts } from "@/hooks/products/useProducts";

// Shadcn UI
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
import { Eye, Truck, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const { deliveries, count, loading: deliveriesLoading } = useDeliveries();
  const { count_product } = useProducts();

  // Filtrer uniquement les livraisons ACCEPTED
  const acceptedDeliveries = deliveries.filter(
    (d) => d.status === "ACCEPTED" || d.status?.toUpperCase() === "ACCEPTED"
  );

  // ==================== SKELETON LOADING ====================
  if (userLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-8">
        {/* Greeting Skeleton */}
        <div className="p-4 lg:p-6">
          <Skeleton className="h-8 w-64" />
        </div>

        {/* Stats Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-card border rounded-xl p-6">
              <Skeleton className="h-5 w-24 mb-4" />
              <Skeleton className="h-10 w-28 mb-3" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="mt-8 px-4 lg:px-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-9 w-32" />
          </div>

          <div className="rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  {[...Array(8)].map((_, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(8)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Vous devez être connecté pour accéder au dashboard.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 lg:p-6">
        <Greeting />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
        <StatsCard
          title="Livraisons"
          value={count}
          icon="local_shipping"
          trend="+15% vs yesterday"
          trendColor="emerald"
        />
        <StatsCard
          title="Produits"
          value={count_product}
          icon="box"
          trend="On Track"
          trendColor="emerald"
          iconOnlyTrend
        />
      </div>

      {/* Livraisons Acceptées */}
      <div className="mt-8 px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-bleu-fonce text-lg lg:text-xl font-bold uppercase tracking-tight">
            Livraisons
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
            disabled={deliveriesLoading}
          >
            Actualiser
          </Button>
        </div>

        <div className="rounded-xl border bg-card">
          {deliveriesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : acceptedDeliveries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucune livraison acceptée pour le moment.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Adresse de Ramassage</TableHead>
                  <TableHead>Adresse de Livraison</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {acceptedDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">
                      #{delivery.id.toString().padStart(4, "0")}
                    </TableCell>
                    <TableCell>
                      {delivery.client?.nom || "—"}
                    </TableCell>
                    <TableCell>
                      {/* {delivery.product?.name || delivery.productName || "—"} */} Static
                    </TableCell>
                    <TableCell className="text-sm">
                      {delivery.pickupAddress || "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {delivery.dropAddress || "—"}
                    </TableCell>
                    <TableCell>
                      {delivery.distanceKm ? `${delivery.distanceKm} km` : "—"}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {delivery.price ? `${delivery.price.toFixed(2)} €` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/dashboard/tasks/${delivery.id}`}>
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
}