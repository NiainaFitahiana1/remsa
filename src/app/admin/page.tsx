"use client";

import Greeting from "@/components/dashcomponents/Greeting";
import StatsCard from "@/components/dashcomponents/StatsCard";
import UrgentRequestCard from "@/components/dashcomponents/UrgentRequestCard";
import PremiumGuide from "@/components/dashcomponents/PremiumGuide";
import PlatformUpdateItem from "@/components/dashcomponents/PlatformUpdateItem";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { user, loading, error } = useCurrentUser();

  // Statistiques (adaptées à une plateforme livraison freelance)
  const [stats, setStats] = useState({
    inscriptionsToday: 47,
    totalUsers: 12480,
    trafficToday: 1246,        // nombre de trajets/commandes aujourd’hui
    revenueToday: 2847.50,     // argent entré aujourd’hui
  });

  // Données pour le graphique unique (Traffic + Inscriptions)
  const [chartData, setChartData] = useState<any[]>([]);

  // Top 5 (gardé tel quel)
  const [topUsers, setTopUsers] = useState<any[]>([]);

  useEffect(() => {
    // Données simulées pour le chart : 12 jours réels + 2 jours estimés
    const days = [
      "12 mars", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
      "24 (est.)", "25 (est.)"
    ];

    const generatedData = days.map((day, index) => {
      const baseTraffic = 820 + Math.random() * 320 + Math.sin(index / 1.5) * 110;
      const baseInscriptions = 18 + Math.random() * 28 + Math.cos(index / 2) * 8;

      return {
        day,
        traffic: Math.round(baseTraffic),
        inscriptions: Math.round(baseInscriptions),
        isEstimate: index >= 12,
      };
    });

    setChartData(generatedData);

    // Top 5 utilisateurs par traffic aujourd’hui
    setTopUsers([
      { name: "Ahmed Benali", role: "Chauffeur", traffic: 87, revenue: 142 },
      { name: "Fatima Zahra", role: "Client", traffic: 64, revenue: 89 },
      { name: "Mohamed Kamel", role: "Chauffeur", traffic: 59, revenue: 134 },
      { name: "Aicha Amrani", role: "Client", traffic: 52, revenue: 67 },
      { name: "Youssef Tazi", role: "Chauffeur", traffic: 48, revenue: 98 },
    ]);
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error || !user) return <div>Vous devez être connecté</div>;

  return (
    <>
      <div className="p-4 lg:p-6">
        {user ? <Greeting name={user?.role} /> : <span>Utilisateur non trouvé</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
        <StatsCard
          title="Inscriptions aujourd’hui"
          value={stats.inscriptionsToday.toString()}
          icon="person_add"
          trend="+12% vs hier"
          trendColor="emerald"
        />
        <StatsCard
          title="Utilisateurs totaux"
          value={stats.totalUsers.toLocaleString()}
          icon="group"
          trend="+238 cette semaine"
          trendColor="emerald"
        />
        <StatsCard
          title="Traffic aujourd’hui"
          value={stats.trafficToday.toString()}
          icon="money"
          trend="+8% vs hier"
          trendColor="emerald"
        />
        <StatsCard
          title="Argent entré aujourd’hui"
          value={`${stats.revenueToday.toFixed(2)} €`}
          icon="payments"
          trend="+21% vs hier"
          trendColor="emerald"
        />
      </div>

      {/* Graphique unique : Traffic + Inscriptions */}
      <div className="mt-8 px-4 lg:px-6">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-bleu-fonce text-lg lg:text-xl font-bold uppercase tracking-tight">
              Évolution Traffic & Inscriptions
            </h3>
            <div className="flex items-center gap-2 text-emerald-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              12 jours + estimation
            </div>
          </div>

          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12, fill: "#666" }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12, fill: "#666" }}
                orientation="left"
              />
              <YAxis 
                yAxisId="right"
                tick={{ fontSize: 12, fill: "#666" }}
                orientation="right"
              />
              <Tooltip />
              <Legend />

              {/* Traffic - Ligne réelle + estimée */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="traffic"
                stroke="#2563eb"
                strokeWidth={3.5}
                dot={{ fill: "#2563eb", r: 4 }}
                name="Traffic (trajets)"
                data={chartData.filter(d => !d.isEstimate)}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="traffic"
                stroke="#2563eb"
                strokeWidth={3.5}
                strokeDasharray="6 4"
                dot={{ fill: "#2563eb", r: 4 }}
                name="Estimation Traffic"
                data={chartData.filter(d => d.isEstimate)}
              />

              {/* Inscriptions - Ligne réelle + estimée */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="inscriptions"
                stroke="#10b981"
                strokeWidth={3.5}
                dot={{ fill: "#10b981", r: 4 }}
                name="Inscriptions"
                data={chartData.filter(d => !d.isEstimate)}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="inscriptions"
                stroke="#10b981"
                strokeWidth={3.5}
                strokeDasharray="6 4"
                dot={{ fill: "#10b981", r: 4 }}
                name="Estimation Inscriptions"
                data={chartData.filter(d => d.isEstimate)}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 Utilisateurs par traffic aujourd’hui */}
      <div className="mt-8 px-4 lg:px-6">
        <h3 className="text-bleu-fonce text-lg lg:text-xl font-bold uppercase tracking-tight mb-4">
          Top 5 Utilisateurs (Traffic aujourd’hui)
        </h3>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="divide-y">
            {topUsers.map((u, index) => (
              <div key={index} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-bleu-fonce">{u.name}</div>
                    <div className="text-sm text-gray-500">{u.role}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">{u.traffic} trajets</div>
                  <div className="text-sm text-emerald-600">+{u.revenue}€</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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