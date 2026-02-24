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
  Line
} from "recharts";

const weeklyEarnings = [
  { day: "Mon", earnings: 120, deliveries: 8 },
  { day: "Tue", earnings: 185, deliveries: 12 },
  { day: "Wed", earnings: 210, deliveries: 15 },
  { day: "Thu", earnings: 168, deliveries: 11 },
  { day: "Fri", earnings: 245, deliveries: 18 },
  { day: "Sat", earnings: 320, deliveries: 22 },
  { day: "Sun", earnings: 145, deliveries: 9 },
];

const monthlyTrend = [
  { month: "Jan", earnings: 3200 },
  { month: "Feb", earnings: 3800 },
  { month: "Mar", earnings: 4100 },
  { month: "Apr", earnings: 4500 },
  { month: "May", earnings: 5200 },
  { month: "Jun", earnings: 4800 },
  { month: "Jul", earnings: 5500 },
  { month: "Aug", earnings: 6200 },
  { month: "Sep", earnings: 5800 },
  { month: "Oct", earnings: 6500 },
  { month: "Nov", earnings: 7000 },
  { month: "Dec", earnings: 6800 },
];

const deliveryTypes = [
  { name: "Express", value: 45 },
  { name: "Standard", value: 32 },
  { name: "Medical", value: 12 },
  { name: "Documents", value: 8 },
  { name: "Other", value: 3 },
];

const PIE_COLORS = [
  "#e73645", // primary
  "#d32f3f",
  "#c62839",
  "#b71c2c",
  "#a71a28",
];

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-white text-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">
            Performance Stats
          </h1>
          <p className="mt-2 text-gray-600">
            Your courier activity overview • February 2026
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Total Earnings
            </p>
            <p className="text-3xl font-bold text-secondary mt-2">$7,842</p>
            <p className="text-accent text-sm mt-1 font-medium">+18% vs last month</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Deliveries
            </p>
            <p className="text-3xl font-bold text-secondary mt-2">248</p>
            <p className="text-accent text-sm mt-1 font-medium">Avg 8.3 / day</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Avg Rating
            </p>
            <p className="text-3xl font-bold text-secondary mt-2">4.92</p>
            <p className="text-accent text-sm mt-1">★ ★ ★ ★ ★</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Distance
            </p>
            <p className="text-3xl font-bold text-secondary mt-2">1,684 km</p>
            <p className="text-accent text-sm mt-1 font-medium">Peak efficiency</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Earnings + Deliveries - Bar Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-secondary mb-6">
              Weekly Performance
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis yAxisId="left" stroke="#6b7280" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e73645",
                      borderRadius: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    labelStyle={{ color: "#1D3557" }}
                    itemStyle={{ color: "#1D3557" }}
                  />
                  <Legend wrapperStyle={{ color: "#1D3557" }} />
                  <Bar
                    yAxisId="left"
                    dataKey="earnings"
                    name="Earnings ($)"
                    fill="#e73645" // primary
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="deliveries"
                    name="Deliveries"
                    fill="#F4D35E" // accent
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Earnings Trend - Area + Line */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-secondary mb-6">
              2026 Earnings Trend
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e73645",
                      borderRadius: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    labelStyle={{ color: "#1D3557" }}
                    itemStyle={{ color: "#1D3557" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#e73645" // primary
                    fill="#e73645"
                    fillOpacity={0.12}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#F4D35E" // accent pour la ligne
                    strokeWidth={3}
                    dot={{ fill: "#F4D35E", stroke: "#1D3557", r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Delivery Types - Pie Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm lg:col-span-2">
            <h3 className="text-xl font-bold text-secondary mb-6">
              Delivery Categories Breakdown
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deliveryTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={140}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {deliveryTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e73645",
                      borderRadius: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    labelStyle={{ color: "#1D3557" }}
                    itemStyle={{ color: "#1D3557" }}
                  />
                  <Legend wrapperStyle={{ color: "#1D3557" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}