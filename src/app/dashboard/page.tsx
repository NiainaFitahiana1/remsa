"use client";

import Greeting from "@/components/dashcomponents/Greeting";
import StatsCard from "@/components/dashcomponents/StatsCard";
import UrgentRequestCard from "@/components/dashcomponents/UrgentRequestCard";
import PremiumGuide from "@/components/dashcomponents/PremiumGuide";
import PlatformUpdateItem from "@/components/dashcomponents/PlatformUpdateItem";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export default function DashboardPage() {

 const { user, loading, error } = useCurrentUser();

  if (loading) return <div>Chargement...</div>;
  if (error || !user) return <div>Vous devez être connecté</div>;


  return (
    <>
      <div className="p-4 lg:p-6">
        {user ? <Greeting name={user?.nom} /> : <span>Utilisateur non trouvé</span>}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
        <StatsCard
          title="Daily Earnings"
          value="$142.50"
          icon="payments"
          trend="+15% vs yesterday"
          trendColor="emerald"
        />
        <StatsCard
          title="Completed"
          value="12"
          icon="local_shipping"
          trend="On Track"
          trendColor="emerald"
          iconOnlyTrend
        />
        <StatsCard
          title="Distance Today"
          value="68 km"
          icon="directions_car"
          trend="Peak zone active"
          trendColor="amber"
          warning
        />
      </div>

      {/* Urgent Requests */}
      <div className="mt-6 px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-bleu-fonce text-lg lg:text-xl font-bold uppercase tracking-tight">
            Urgent Requests
          </h3>
          <button className="text-rouge-vif text-sm font-bold uppercase tracking-wider hover:underline">
            View all
          </button>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 hide-scrollbar">
          <UrgentRequestCard
            imageUrl="https://lh3.googleusercontent.com/..."
            price="$25.00"
            title="Downtown Express Delivery"
            distance="2.4 km"
            time="Pickup in 5 mins"
          />
          <UrgentRequestCard
            imageUrl="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80"
            price="$17.80"
            title="Birthday Cupcakes – Same Hour Surprise"
            distance="4.4 km"
            time="Pickup in 12 mins"
            />

            <UrgentRequestCard
            imageUrl="https://images.unsplash.com/photo-1589829545856-d10d5c6a19a0?w=800&auto=format&fit=crop&q=80"
            price="$35.00"
            title="Court Documents – Filing Deadline Today"
            distance="5.7 km"
            time="Pickup in 6 mins"
            />

            <UrgentRequestCard
            imageUrl="https://images.unsplash.com/photo-1589829295980-85e0c1b9d8d5?w=800&auto=format&fit=crop&q=80"
            price="$42.25"
            title="Legal Contracts – Attorney to Client Rush"
            distance="2.8 km"
            time="Pickup now"
            />

            <UrgentRequestCard
            imageUrl="https://images.unsplash.com/photo-1581235720704-06d1018152dc?w=800&auto=format&fit=crop&q=80"
            price="$31.40"
            title="iPhone Repair Parts – Urgent Technician Need"
            distance="6.2 km"
            time="Pickup in 10 mins"
            />

            <UrgentRequestCard
            imageUrl="https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&auto=format&fit=crop&q=80"
            price="$48.00"
            title="Mother's Day Rose Bouquet – Last Minute"
            distance="3.5 km"
            time="Pickup in 9 mins"
            />

            <UrgentRequestCard
            imageUrl="https://images.unsplash.com/photo-1581092160560-1c1e428e9d65?w=800&auto=format&fit=crop&q=80"
            price="$55.75"
            title="Car Battery Replacement – Roadside Urgent"
            distance="7.1 km"
            time="Pickup in 15 mins"
            />
        </div>
      </div>

      <PremiumGuide />

      <div className="mt-8 px-4 lg:px-6">
        <h3 className="text-bleu-fonce text-lg lg:text-xl font-bold uppercase tracking-tight mb-4">
          Platform Updates
        </h3>
        <div className="flex flex-col gap-4">
          <PlatformUpdateItem
            icon="verified_user"
            title="Enhanced Safety Policy – 2026"
            description="New medical coverage extended + free protective gear for night shifts."
          />
          <PlatformUpdateItem
            icon="ev_station"
            title="EV Transition Bonus"
            description="Switch to electric and get 18% bonus on all city routes until June 2026."
          />
        </div>
      </div>
    </>
  );
}