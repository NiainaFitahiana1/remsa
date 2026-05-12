"use client";


import { MapPin, DollarSign, Star } from "lucide-react";

export default function LivreurDashboardPage() {
  return (
    <div className="min-h-screen text-zinc-900">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Planifié aujourd'hui</p>
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-4xl font-bold mt-3">3</p>
            <p className="text-emerald-600 text-sm font-medium mt-1">+22% par rapport à hier</p>
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
      </div>
    </div>
  );
}