"use client";

import MobileAppBar from "@/components/dashcomponents/MobileAppBar";
import MobileBottomNav from "@/components/dashcomponents/MobileBottomNav";
import Breadcrumb from "@/components/dashcomponents/BreadCrumb";
import { Bell } from "lucide-react";
import {  useState, type ReactNode } from "react";
import Sidebar from "@/components/dashcomponents/Sidebar";

type User = {
  email: string;
  role: string;
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [showNotifications, setShowNotifications] = useState(false);



  return (
    <div className="min-h-screen bg-background-light font-sans text-bleu-fonce antialiased">
      <Sidebar />

      <div className="flex flex-col min-h-screen lg:pl-64">
        <MobileAppBar />

        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className={`
            fixed top-4 right-9 z-40
            hidden lg:flex items-center justify-center
            w-10 h-10 rounded-full 
            bg-white shadow-lg border border-gray-200/70
            text-gray-700 hover:text-indigo-600 hover:shadow-xl
            transition-all duration-200 active:scale-95
          `}
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-white">
            3
          </span>
        </button>

        <main className="flex-1 pb-10 lg:pb-6">
          <div className="max-w-7xl mx-auto bg-slate-200 px-4 sm:px-6 lg:px-8 py-6 lg:py-4 bg-transparent sticky top-0 z-10">
            <Breadcrumb />
          </div>

          {children}
        </main>

        <MobileBottomNav />
      </div>

      {showNotifications && (
        <div
          className="
            fixed top-16 right-6 z-50 
            w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200/60
            overflow-hidden
          "
        >
          <div className="p-4 border-b bg-gray-50 font-medium text-gray-800">
            Notifications
          </div>
          <div className="max-h-[70vh] overflow-y-auto p-4 text-center text-gray-500 text-sm">
            Aucune notification pour le moment...
          </div>
        </div>
      )}
    </div>
  );
}