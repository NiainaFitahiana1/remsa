import { useState, useCallback } from "react";
import type { Product } from "@/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    setIsRefreshing(true);

    try {
      const res = await fetch("/api/products", {
        credentials: "include",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Session expirée, veuillez vous reconnecter");
        if (res.status === 403) throw new Error("Accès non autorisé");

        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erreur lors du chargement des produits");
      }

      const data = await res.json();

      setProducts(Array.isArray(data) ? data : data?.products || []);
    } catch (err: any) {
      setError(err.message || "Erreur inattendue");
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const count_product = products.length;

  return {
    products,
    count_product,
    loading,
    isRefreshing,
    error,
    fetchProducts,
  };
}