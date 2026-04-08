"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Line,
} from "recharts";

import { Truck, MapPin, DollarSign, Clock, Star } from "lucide-react";

// ==================== DONNÉES ====================
const weeklyPerformance = [
  { day: "Lun", earnings: 1240, deliveries: 12 },
  { day: "Mar", earnings: 1980, deliveries: 18 },
  { day: "Mer", earnings: 1670, deliveries: 14 },
  { day: "Jeu", earnings: 2450, deliveries: 22 },
  { day: "Ven", earnings: 2890, deliveries: 25 },
  { day: "Sam", earnings: 2120, deliveries: 19 },
  { day: "Dim", earnings: 920,  deliveries: 8 },
];

const monthlyTrend = [
  { month: "Jan", earnings: 28500 },
  { month: "Fév", earnings: 32400 },
  { month: "Mar", earnings: 29800 },
  { month: "Avr", earnings: 35100 },
  { month: "Mai", earnings: 41200 },
  { month: "Juin", earnings: 38700 },
  { month: "Juil", earnings: 46500 },
  { month: "Août", earnings: 42800 },
  { month: "Sep", earnings: 39200 },
  { month: "Oct", earnings: 47500 },
  { month: "Nov", earnings: 51000 },
  { month: "Déc", earnings: 49800 },
];

const deliveryTypes = [
  { name: "Express", value: 48 },
  { name: "Standard", value: 35 },
  { name: "Alimentaire", value: 22 },
  { name: "Pharmacie", value: 15 },
  { name: "Documents", value: 8 },
];

const PIE_COLORS = [
  "#e73645", // Rouge principal
  "#f97316", // Orange
  "#eab308", // Jaune
  "#22c55e", // Vert
  "#3b82f6", // Bleu
];

export default function LivreurDashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900">
            Tableau de bord
          </h1>
          <p className="mt-2 text-zinc-600">
            Aperçu de votre activité • Mercredi 8 Avril 2026
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Gains du jour</p>
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-4xl font-bold mt-3">1 240 DA</p>
            <p className="text-emerald-600 text-sm font-medium mt-1">+22% par rapport à hier</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Livraisons aujourd’hui</p>
              <Truck className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-4xl font-bold mt-3">18</p>
            <p className="text-orange-600 text-sm font-medium mt-1">Moyenne : 8.3 / jour</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Distance parcourue</p>
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-4xl font-bold mt-3">87 km</p>
            <p className="text-blue-600 text-sm font-medium mt-1">Zone active : Alger Centre</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Note moyenne</p>
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-4xl font-bold mt-3">4.9</p>
            <p className="text-amber-500 text-sm font-medium mt-1">★★★★☆</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Performance - Bar Chart */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Performance Hebdomadaire</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis yAxisId="left" stroke="#6b7280" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e73645",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="earnings"
                    name="Gains (DA)"
                    fill="#e73645"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="deliveries"
                    name="Livraisons"
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trend - Area + Line */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Évolution des gains 2026</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e73645",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#e73645"
                    fill="#e73645"
                    fillOpacity={0.15}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", stroke: "#fff", strokeWidth: 2, r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Delivery Types - Pie Chart */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm lg:col-span-2">
            <h3 className="text-xl font-bold mb-6">Répartition des types de livraisons</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deliveryTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {deliveryTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e73645",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}