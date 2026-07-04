"use client";

import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Package, RefreshCw, Truck } from "lucide-react";
import { toast } from "sonner";

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

type ProductListClientProps = {
  initialProducts: Product[];
  initialError: string | null;
};

export default function ProductListClient({
  initialProducts,
  initialError,
}: ProductListClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [error, setError] = useState<string | null>(initialError);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsRefetching(true);
    setError(null);

    try {
      const res = await fetch("/api/products", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Erreur lors du rechargement");

      const data = await res.json();
      setProducts(data);
      setSelectedProducts([]);
      // toast.success("Liste actualisée avec succès");
    } catch (err: any) {
      setError(err.message || "Impossible d'actualiser");
      // toast.error("Erreur lors de l'actualisation");
    } finally {
      setIsRefetching(false);
    }
  }, []);

  // === Gestion sélection ===
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedProductsData = products.filter((p) =>
    selectedProducts.includes(p.id)
  );

  // === Erreur ===
  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-4">
          {error}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProducts}
            disabled={isRefetching}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
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
        <div className="flex gap-3">
          <ProductDialog
            mode="create"
            onProductCreated={(newProduct) => {
              setProducts((prev) => [newProduct, ...prev]);
            }}
          />

          {selectedProducts.length > 0 && (
            <DeliveryFromProductDialog
              products={selectedProductsData}
              onSuccess={() => {
                toast.success(`Livraison créée avec ${selectedProducts.length} produit${selectedProducts.length > 1 ? "s" : ""}`);
                setSelectedProducts([]);
                fetchProducts();
              }}
            >
              <Button variant="default" className="gap-2">
                <Truck className="h-4 w-4" />
                Créer livraison ({selectedProducts.length})
              </Button>
            </DeliveryFromProductDialog>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/30">
          <Package className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Aucun produit visible</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Créez votre premier produit ou revenez plus tard.
          </p>
          <div className="mt-6">
            <ProductDialog
              mode="create"
              onProductCreated={(newProduct) => {
                setProducts((prev) => [newProduct, ...prev]);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedProducts.length === products.length && products.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Tout sélectionner"
                  />
                </TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Prix</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const isSelected = selectedProducts.includes(product.id);
                return (
                  <TableRow
                    key={product.id}
                    className={!product.isActive ? "opacity-75" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelectProduct(product.id)}
                        aria-label={`Sélectionner ${product.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="font-medium">{product.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {product.description || "Aucune description"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {product.price.toFixed(2)} €
                    </TableCell>
                    <TableCell className="text-center">
                      {product.stock != null ? (
                        <span className={product.stock <= 0 ? "text-red-600 font-medium" : ""}>
                          {product.stock}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "default" : "outline"}>
                        {product.isActive ? "Actif" : "Brouillon"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <ProductDialog
                          mode="edit"
                          product={product}
                          onProductUpdated={(updatedProduct) => {
                            setProducts((prev) =>
                              prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
                            );
                          }}
                        />
                        <DeliveryFromProductDialog
                          product={product}
                          onSuccess={() => {
                            toast.success("Livraison créée avec succès");
                            fetchProducts();
                          }}
                          disabled={product.stock != null && product.stock <= 0}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
