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
        <ProductList/>
      </div>
    </div>
  );
}