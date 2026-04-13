"use client";
import { useState, useEffect } from "react";
import TopAppBar from "@/components/search/ui/Topbar";
import OfferCard from "@/components/search/ui/OfferCard";
import SearchAndFilterBar from "@/components/search/SearchAndFilterBar";
import Sidebar from "@/components/search/ui/Sidebar";
import Footer from "@/components/search/ui/Footer";

import { DeliveryOffer } from "@/types";

export default function SearchPage() {
  const [offers, setOffers] = useState<DeliveryOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/deliveries/public", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: Impossible de charger les livraisons`);
      }

      const data: DeliveryOffer[] = await res.json();
      
      const sortedData = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOffers(sortedData);
    } catch (err: any) {
      console.error("Erreur lors du chargement des livraisons publiques:", err);
      setError(err.message || "Impossible de charger les offres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicDeliveries();
  }, []);

  return (
    <>
      <TopAppBar />

      <main className="relative min-h-screen kinetic-dot-grid">
        <div className="max-w-[1440px] mx-auto px-8 py-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-headline text-4xl font-black tracking-tight text-on-surface">
                  Logistics{" "}
                  <span className="bg-gradient-to-r from-primary via-secondary-container to-tertiary bg-clip-text text-transparent uppercase">
                    Kinetic
                  </span>
                </h1>
                <p className="text-on-surface-variant font-medium opacity-80 mt-1">
                  Livraisons épinglées disponibles en temps réel
                </p>
              </div>

              <button
                onClick={fetchPublicDeliveries}
                disabled={loading}
                className="text-sm flex items-center gap-2 text-on-surface-variant hover:text-primary disabled:opacity-50"
              >
                ↻ Actualiser
              </button>
            </div>

            <SearchAndFilterBar />

            {loading && (
              <div className="text-center py-12 text-on-surface-variant">
                Chargement des livraisons épinglées...
              </div>
            )}

            {error && (
              <div className="text-center py-12 text-red-500">{error}</div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.length > 0 ? (
                  offers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={{
                        ...offer,
                        scheduledAt: offer.scheduledAt ?? undefined,
                      }}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-16 text-on-surface-variant">
                    Aucune livraison épinglée disponible pour le moment.
                  </div>
                )}
              </div>
            )}

            {!loading && !error && offers.length > 0 && (
              <div className="flex justify-center py-8">
                <button className="group flex items-center gap-4 text-on-surface hover:text-primary transition-colors">
                  <span className="h-[2px] w-12 bg-on-surface group-hover:bg-primary transition-all" />
                  <span className="font-headline font-bold text-xs uppercase tracking-widest">
                    Charger plus
                  </span>
                </button>
              </div>
            )}
          </div>

          <Sidebar />
        </div>
      </main>

      <Footer />
    </>
  );
}