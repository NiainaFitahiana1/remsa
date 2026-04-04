"use client";

import MobileAppBar from "@/components/dashcomponents/MobileAppBar";
import MobileBottomNav from "@/components/dashcomponents/MobileBottomNav";
import Breadcrumb from "@/components/dashcomponents/BreadCrumb";
import { Bell } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import Sidebar from "@/components/dashcomponents/Sidebar";
import { io, Socket } from "socket.io-client";
import { useCurrentUser } from "@/lib/auth/use-current-user";

type Notification = {
  id: number;
  title: string;
  message?: string;
  type: string;
  entityType?: string;
  entityId?: number;
  actionUrl?: string;
  data?: any;
  createdAt: string;
  isRead: boolean;
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useCurrentUser();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  // ====================== CONNEXION WEBSOCKET ======================
  useEffect(() => {
    if (!user?.id) return;

    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000/notifications",
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
      }
    );

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      socketInstance.emit("joinNotifications", user.id);
    });

    socketInstance.on("newNotification", (newNotif: Notification) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id]);

  // ====================== CHARGEMENT INITIAL DES NOTIFICATIONS ======================
  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications?limit=50");
        if (!res.ok) throw new Error("Erreur de chargement");

        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur lors du chargement des notifications :", err);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  // ====================== MISE À JOUR DU COMPTEUR ======================
  useEffect(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  // ====================== ACTIONS ======================
  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
      );
    } catch (err) {
      console.error("Erreur markAsRead :", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (err) {
      console.error("Erreur markAllAsRead :", err);
    }
  };

  // ====================== RENDU CONDITIONNEL (APRÈS TOUS LES HOOKS) ======================
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Vous devez être connecté.</div>;
  }

  return (
    <div className="min-h-screen bg-background-light font-sans text-bleu-fonce antialiased">
      <Sidebar />

      <div className="flex flex-col min-h-screen lg:pl-64">
        <MobileAppBar />

        {/* Bouton Notifications */}
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
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        <main className="flex-1 pb-10 lg:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-5 bg-transparent sticky top-0 z-10">
            <Breadcrumb />
          </div>

          {children}
        </main>

        <MobileBottomNav />
      </div>

      {/* Panneau Notifications */}
      {showNotifications && (
        <div className="fixed top-16 right-6 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200/60 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex items-center justify-between font-medium text-gray-800">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-normal"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                Aucune notification pour le moment...
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notif.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm">{notif.title}</p>
                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                    )}
                  </div>
                  {notif.message && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notif.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notif.createdAt).toLocaleDateString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}