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
import { AlertCircle, Package, RefreshCw } from "lucide-react";
import ProductDialog from "./ProductCreateDialog";
import DeliveryFromProductDialog from "../deliveries/kanban/DeliveryFromProductDialog";
type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  stock?: number | null;
  isActive: boolean;
  createdAt: string;
  createdBy?: {
    id: number;
    email: string;
    nom?: string;
  };
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const fetchProducts = async () => {
  setLoading(true);
  setError(null);

  try {
    // On ne passe plus activeOnly=false par défaut
    // On laisse le backend décider (ou on peut forcer ?activeOnly=false pour voir brouillons)
    const url = "/api/products";  // ← plus besoin de query params ici
    // Ou si tu veux absolument voir les brouillons : "/api/products?activeOnly=false"

    const res = await fetch(url, {
      credentials: "include",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!res.ok) {
      if (res.status === 401) throw new Error("Session expirée");
      if (res.status === 403) throw new Error("Accès non autorisé");
      const err = await res.json();
      throw new Error(err.message || "Erreur chargement");
    }

    const data = await res.json();
    setProducts(data);
  } catch (err: any) {
    setError(err.message || "Erreur inattendue");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductCreatedOrUpdated = () => {
    fetchProducts();
  };


  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full rounded-t-lg" />
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
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
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-4">
          {error}
          <Button variant="outline" size="sm" onClick={fetchProducts}>
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
        <h2 className="text-2xl font-bold tracking-tight">Mes produits & Marketplace</h2>
        <ProductDialog mode="create" onSuccess={handleProductCreatedOrUpdated} />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/30">
          <Package className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Aucun produit visible</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Créez votre premier produit ou revenez plus tard.
          </p>
          <div className="mt-6">
            <ProductDialog mode="create" onSuccess={handleProductCreatedOrUpdated} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className={cn(
                "overflow-hidden transition-all hover:shadow-lg",
                !product.isActive && "opacity-65 border-dashed border-amber-400/60"
              )}
            >
              {/* Image */}
              <div className="aspect-video relative bg-muted">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start gap-3">
                  <CardTitle className="line-clamp-2 text-base">{product.name}</CardTitle>
                  <Badge variant={product.isActive ? "default" : "outline"} className="shrink-0">
                    {product.isActive ? "Actif" : "Brouillon"}
                  </Badge>
                </div>
                <CardDescription className="mt-1.5 line-clamp-2 min-h-[2.5rem]">
                  {product.description || "Aucune description"}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-5 pb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {product.price.toFixed(2)} €
                  </span>
                  {product.stock != null && (
                    <span className="text-sm text-muted-foreground">
                      Stock : {product.stock}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="px-5 pt-1 pb-5 flex justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  {new Date(product.createdAt).toLocaleDateString("fr-FR")}
                </div>

                <div className="flex gap-2">
                  {/* Bouton édition existant */}
                  <ProductDialog
                    mode="edit"
                    product={product}
                    onSuccess={handleProductCreatedOrUpdated}
                  />

                  {/* Nouveau bouton : Livrer ce produit */}
                  <DeliveryFromProductDialog
                    product={product}
                    onSuccess={handleProductCreatedOrUpdated}
                    disabled={product.stock != null && product.stock <= 0}   // ← Ajout ici
                  />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}