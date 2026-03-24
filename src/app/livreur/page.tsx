"use client";

import Greeting from "@/components/dashcomponents/Greeting";
import StatsCard from "@/components/dashcomponents/StatsCard";
import UrgentRequestCard from "@/components/dashcomponents/UrgentRequestCard";
import PremiumGuide from "@/components/dashcomponents/PremiumGuide";
import PlatformUpdateItem from "@/components/dashcomponents/PlatformUpdateItem";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export default function LivreurDashboardPage() {

  const { user, loading, error } = useCurrentUser();

  if (loading) return <div>Chargement...</div>;
  if (error || !user) return <div>Vous devez être connecté</div>;

  return (
    <>
      <div className="p-4 lg:p-6">
        {user ? <Greeting name={user?.role} /> : <span>Utilisateur non trouvé</span>}
      </div>

      {/* Statistiques du Livreurr */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
        <StatsCard
          title="Livraisons Aujourd'hui"
          value="18"
          icon="local_shipping"
          trend="+4 vs hier"
          trendColor="emerald"
        />
        <StatsCard
          title="Distance Parcourue"
          value="87 km"
          icon="directions_car"
          trend="Zone active"
          trendColor="amber"
          warning
        />
        <StatsCard
          title="Gains du Jour"
          value="1 240 DA"
          icon="payments"
          trend="+22% vs hier"
          trendColor="emerald"
        />
      </div>

      {/* Tâche Actuelle (Grande carte mise en avant) */}
      <div className="mt-8 px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-bleu-fonce text-lg lg:text-xl font-bold uppercase tracking-tight">
            Tâche Actuelle
          </h3>
          <span className="text-rouge-vif text-sm font-bold uppercase tracking-wider">URGENT</span>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-3xl p-8 shadow-xl">
          <div className="flex justify-between items-start">
            <div className="space-y-6">
              <div>
                <p className="text-orange-200 text-sm uppercase tracking-widest">Adresse</p>
                <p className="text-2xl font-bold">Résidence Les Palmiers - Appart 12B</p>
              </div>

              <div>
                <p className="text-orange-200 text-sm">Client</p>
                <p className="text-xl">Mme Fatima</p>
              </div>

              <div>
                <p className="text-orange-200 text-sm">Colis</p>
                <p className="text-xl">2 pizzas + 1 boisson</p>
              </div>

              <div className="flex gap-10">
                <div>
                  <p className="text-orange-200 text-sm">Distance</p>
                  <p className="text-3xl font-bold">3.2 km</p>
                </div>
                <div>
                  <p className="text-orange-200 text-sm">Temps restant</p>
                  <p className="text-3xl font-bold">8 min</p>
                </div>
              </div>
            </div>

            <div className="text-7xl opacity-80">🛵</div>
          </div>

          <button className="mt-10 w-full bg-white text-orange-600 font-bold text-xl py-5 rounded-2xl hover:bg-gray-100 active:scale-[0.98] transition">
            J'ARRIVE !
          </button>
        </div>
      </div>

      {/* Dernières Livraisons */}
      <div className="mt-10 px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-bleu-fonce text-lg lg:text-xl font-bold uppercase tracking-tight">
            Dernières Livraisons
          </h3>
          <button className="text-rouge-vif text-sm font-bold uppercase tracking-wider hover:underline">
            Voir tout
          </button>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 hide-scrollbar">
          <UrgentRequestCard
            imageUrl="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80"
            price="✓ Livré"
            title="Café Central"
            distance="Il y a 25 min"
            time="2 cafés + croissant"
          />
          <UrgentRequestCard
            imageUrl="https://images.unsplash.com/photo-1589829545856-d10d5c6a19a0?w=800&auto=format&fit=crop&q=80"
            price="✓ Livré"
            title="Pharmacie El Bahia"
            distance="Il y a 1h 10"
            time="Médicaments"
          />
          <UrgentRequestCard
            imageUrl="https://images.unsplash.com/photo-1589829295980-85e0c1b9d8d5?w=800&auto=format&fit=crop&q=80"
            price="✓ Livré"
            title="Supermarché Aziza"
            distance="Il y a 2h"
            time="Courses familiales"
          />
        </div>
      </div>

      <PremiumGuide />

      {/* Mises à jour & Infos Livreurr */}
      <div className="mt-8 px-4 lg:px-6">
        <h3 className="text-bleu-fonce text-lg lg:text-xl font-bold uppercase tracking-tight mb-4">
          Infos & Alertes
        </h3>
        <div className="flex flex-col gap-4">
          <PlatformUpdateItem
            icon="warning"
            title="Pic d’activité - Centre Ville"
            description="Beaucoup de commandes ce soir. Restez dans la zone pour maximiser vos gains."
          />
          <PlatformUpdateItem
            icon="ev_station"
            title="Bonus Électrique"
            description="Passez en scooter électrique et gagnez +18% sur toutes vos courses jusqu’en juin 2026."
          />
          <PlatformUpdateItem
            icon="verified_user"
            title="Rappel Sécurité"
            description="N’oubliez pas de porter le casque et de vérifier vos feux avant chaque départ."
          />
        </div>
      </div>
    </>
  );
}