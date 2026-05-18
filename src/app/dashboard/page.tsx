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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Eye, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const { deliveries, count, loading: deliveriesLoading } = useDeliveries();
  const { count_product } = useProducts();

  // Filtrer uniquement les livraisons ACCEPTED
  const acceptedDeliveries = deliveries.filter(
    (d) => d.status === "ACCEPTED" || d.status?.toUpperCase() === "ACCEPTED"
  );

  const plannedDeliveries = 24; // À remplacer par vraie donnée plus tard
  const activeItems = 87; // Nb colis actifs

  const topOrders = [
    { name: "iPhone 15 Pro", commandes: 42 },
    { name: "Samsung Galaxy S24", commandes: 35 },
    { name: "MacBook Air M3", commandes: 28 },
    { name: "AirPods Pro 2", commandes: 21 },
    { name: "Sony WH-1000XM5", commandes: 18 },
  ];

  const topDropLocations = [
    { name: "Paris Centre", value: 38, fill: "#3b82f6" },
    { name: "Lyon Part-Dieu", value: 29, fill: "#10b981" },
    { name: "Marseille Vieux-Port", value: 24, fill: "#f59e0b" },
    { name: "Bordeaux Centre", value: 19, fill: "#8b5cf6" },
    { name: "Toulouse Matabiau", value: 15, fill: "#ec4899" },
  ];

  if (userLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-8">
        {/* Greeting Skeleton */}
        <div className="p-4 lg:p-6">
          <Skeleton className="h-8 w-64" />
        </div>

        {/* Stats Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border rounded-xl p-6">
              <Skeleton className="h-5 w-24 mb-4" />
              <Skeleton className="h-10 w-28 mb-3" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        {/* Table & Charts Skeleton */}
        <div className="mt-8 px-4 lg:px-6">
          <Skeleton className="h-10 w-80 mb-6" />
          <div className="rounded-xl border bg-card h-96" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
        <StatsCard
          title="Livraisons Totales"
          value={count}
          icon="local_shipping"
          trend="+15% vs hier"
          trendColor="emerald"
        />
        <StatsCard
          title="Livraisons Planifiées"
          value={plannedDeliveries}
          icon="truck"
          trend="+8% cette semaine"
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
        <StatsCard
          title="Colis Actifs"
          value={activeItems}
          icon="package"
          trend="12 en cours"
          trendColor="amber"
        />
      </div>

      {/* Livraisons Acceptées */}
      <div className="mt-8 px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-bleu-fonce text-lg lg:text-xl font-bold uppercase tracking-tight">
            Livraisons Acceptées
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
                      Static
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

      {/* Analyses & Top 5 */}
      <div className="mt-10 px-4 lg:px-6">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="orders">Top 5 Commandes</TabsTrigger>
            <TabsTrigger value="locations">Top 5 Lieux de Drop</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Produits les plus commandés</CardTitle>
                <CardDescription>Ces 30 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={topOrders}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="commandes" fill="#3b82f6" radius={8} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Lieux de Livraison</CardTitle>
                <CardDescription>Distribution géographique</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1 w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topDropLocations}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        dataKey="value"
                      >
                        {topDropLocations.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lieu</TableHead>
                        <TableHead className="text-right">Livraisons</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topDropLocations.map((loc, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{loc.name}</TableCell>
                          <TableCell className="text-right font-semibold">{loc.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Guide Premium */}
      <div className="mt-12 px-4 lg:px-6 pb-12">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 Guide d’utilisation Premium
            </CardTitle>
            <CardDescription>
              Débloquez tout le potentiel de votre tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-semibold text-primary">Fonctionnalités Premium :</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Rapports détaillés et export Excel/PDF</li>
                  <li>• Suivi en temps réel des livreurs</li>
                  <li>• Analyse prédictive des délais</li>
                  <li>• Support prioritaire 24/7</li>
                </ul>
              </div>
              <div>
                <Button className="w-full" size="lg">
                  Passer en Premium dès maintenant
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-3">
                  9,99 € / mois • Annulez quand vous voulez
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}