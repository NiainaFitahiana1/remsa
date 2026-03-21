"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ProductList from "@/components/dashcomponents/product/ProductList";
const productStats = [
  { category: "Électronique", count: 48, revenue: 12480 },
  { category: "Vêtements", count: 95, revenue: 7580 },
  { category: "Maison", count: 62, revenue: 9430 },
  { category: "Beauté", count: 37, revenue: 4120 },
  { category: "Alimentation", count: 19, revenue: 2380 },
];

const topProducts = [
  { name: "Écouteurs sans fil", sold: 124, revenue: 3720, stock: 18 },
  { name: "T-shirt oversize", sold: 89, revenue: 2314, stock: 42 },
  { name: "Lampe LED connectée", sold: 67, revenue: 2680, stock: 8 },
  { name: "Crème hydratante", sold: 54, revenue: 1620, stock: 31 },
  { name: "Cahier spirale A5", sold: 48, revenue: 960, stock: 65 },
];

const COLORS = ["#e73645", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

export default function ProductsPage() {
  const [period] = useState("Février 2026"); // tu peux le rendre dynamique plus tard

  const totalProducts = topProducts.reduce((sum, p) => sum + p.sold, 0);
  const totalRevenue = topProducts.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div className="min-h-screen text-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">
            Gestion des Produits
          </h1>
          <p className="mt-2 text-gray-600">
            Aperçu stock • ventes • catégories • {period}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Total Produits vendus
            </p>
            <p className="text-3xl font-bold text-secondary mt-2">{totalProducts}</p>
            <p className="text-accent text-sm mt-1 font-medium">ce mois</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Revenu Produits
            </p>
            <p className="text-3xl font-bold text-secondary mt-2">
              {totalRevenue.toLocaleString()} €
            </p>
            <p className="text-accent text-sm mt-1 font-medium">+14% vs mois dernier</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Références actives
            </p>
            <p className="text-3xl font-bold text-secondary mt-2">261</p>
            <p className="text-accent text-sm mt-1 font-medium">dont 23 en rupture</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Catégories
            </p>
            <p className="text-3xl font-bold text-secondary mt-2">12</p>
            <p className="text-accent text-sm mt-1 font-medium">les + performantes</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Bar chart - Revenu par catégorie */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Revenu par catégorie</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" axisLine={false} tick={{ fill: '#6b7280' }} />
                  <YAxis axisLine={false} tick={{ fill: '#6b7280' }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#e73645" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top produits */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Top 5 produits vendus</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendus
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenu
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock restant
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topProducts.map((product, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                        {product.sold}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                        {product.revenue.toLocaleString()} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={product.stock < 15 ? "text-red-600 font-medium" : ""}>
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <ProductList/>
      </div>
    </div>
  );
}