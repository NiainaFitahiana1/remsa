"use client";

import {
  MapPin,
  DollarSign,
  Star,
  Package,
  Bell,
  Clock3,
  QrCode,
  Truck,
} from "lucide-react";

export default function LivreurDashboardPage() {
  const missions = [
    {
      id: 1,
      client: "Sarah M.",
      pickup: "Analakely",
      drop: "Ambatoroka",
      price: "12 000 Ar",
      status: "En attente",
    },
    {
      id: 2,
      client: "TechStore",
      pickup: "Ankorondrano",
      drop: "67Ha",
      price: "18 500 Ar",
      status: "Acceptée",
    },
  ];

  const notifications = [
    "Nouvelle mission disponible à Analakely",
    "Le client Sarah a validé votre livraison",
    "Paiement reçu • 18 500 Ar",
  ];

  return (
    <div className="min-h-screen text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Tableau de bord
            </h1>

            <p className="mt-2 text-zinc-600">
              Aperçu de votre activité • Mercredi 8 Avril 2026
            </p>
          </div>

          <button className="bg-emerald-600 hover:bg-emerald-700 transition text-white px-5 py-3 rounded-2xl font-medium shadow-sm">
            🟢 En ligne
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-zinc-500 text-sm uppercase font-medium">
                Revenus du jour
              </p>

              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>

            <p className="text-4xl font-bold mt-3">48K</p>

            <p className="text-emerald-600 text-sm mt-1">
              +22% par rapport à hier
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-zinc-500 text-sm uppercase font-medium">
                Distance
              </p>

              <MapPin className="h-5 w-5 text-blue-600" />
            </div>

            <p className="text-4xl font-bold mt-3">87 km</p>

            <p className="text-blue-600 text-sm mt-1">
              Zone active : Antananarivo
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-zinc-500 text-sm uppercase font-medium">
                Note moyenne
              </p>

              <Star className="h-5 w-5 text-amber-500" />
            </div>

            <p className="text-4xl font-bold mt-3">4.9</p>

            <p className="text-amber-500 text-sm mt-1">
              ★★★★★ Excellent
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-zinc-500 text-sm uppercase font-medium">
                Livraisons
              </p>

              <Truck className="h-5 w-5 text-red-500" />
            </div>

            <p className="text-4xl font-bold mt-3">12</p>

            <p className="text-red-500 text-sm mt-1">
              3 en cours actuellement
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Missions */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                Missions disponibles
              </h2>

              <button className="text-sm text-red-500 font-medium hover:underline">
                Voir tout
              </button>
            </div>

            <div className="space-y-4">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className="border border-zinc-200 rounded-xl p-4 hover:border-red-300 transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {mission.client}
                      </h3>

                      <div className="flex items-center gap-2 text-zinc-500 text-sm mt-1">
                        <MapPin className="w-4 h-4" />
                        {mission.pickup} → {mission.drop}
                      </div>

                      <div className="flex items-center gap-2 text-zinc-500 text-sm mt-2">
                        <Clock3 className="w-4 h-4" />
                        {mission.status}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-bold text-lg text-emerald-600">
                        {mission.price}
                      </p>

                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                        Postuler
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* QR Scanner */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <QrCode className="w-6 h-6 text-red-500" />

                <h2 className="text-lg font-bold">
                  Scanner QR
                </h2>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-xl font-medium">
                  Scanner Pickup
                </button>

                <button className="w-full bg-zinc-900 hover:bg-zinc-800 transition text-white py-3 rounded-xl font-medium">
                  Scanner Livraison
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-amber-500" />

                <h2 className="text-lg font-bold">
                  Notifications
                </h2>
              </div>

              <div className="space-y-4">
                {notifications.map((notif, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 border-b border-zinc-100 pb-3 last:border-none"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>

                    <p className="text-sm text-zinc-600">
                      {notif}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-blue-500" />

                <h2 className="text-lg font-bold">
                  Résumé
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">
                    Missions terminées
                  </span>

                  <span className="font-semibold">
                    128
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">
                    En cours
                  </span>

                  <span className="font-semibold">
                    3
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">
                    Taux réussite
                  </span>

                  <span className="font-semibold text-emerald-600">
                    98%
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}