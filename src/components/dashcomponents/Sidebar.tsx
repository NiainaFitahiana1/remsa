'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLogout } from '@/hooks/useLogout';
import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type UserProfile = {
  id: string;
  nom: string;
  prenom: string;
  role: string;
};

const menuLinks = {
  CLIENT: [
    { href: '/dashboard', icon: 'home', label: 'Home' },
    { href: '/dashboard/product', icon: 'inventory_2', label: 'Products' },
    { href: '/dashboard/tasks', icon: 'explore', label: 'Tasks' },
    { href: '/dashboard/stats', icon: 'analytics', label: 'Stats' },
    { href: '/dashboard/account', icon: 'person', label: 'Account' },
  ],
  ADMIN: [
    { href: '/admin', icon: 'dashboard', label: 'Home' },
    { href: '/admin/users', icon: 'group', label: 'Utilisateurs' },
    { href: '/admin/traffics', icon: 'shopping_cart', label: 'Traffic' },
    { href: '/admin/boosts', icon: 'analytics', label: 'Boosting' },
    { href: '/admin/report', icon: 'warning', label: 'Reports' },
    { href: '/admin/account', icon: 'person', label: 'Compte' },
  ],
  SUPER_ADMIN: [
    { href: '/admin', icon: 'dashboard', label: 'Dashboard Admin' },
    { href: '/admin/users', icon: 'group', label: 'Utilisateurs' },
    { href: '/admin/traffics', icon: 'shopping_cart', label: 'Traffic' },
    { href: '/admin/stats', icon: 'analytics', label: 'Stats' },
    { href: '/admin/account', icon: 'person', label: 'Compte' },
  ],
  DRIVER: [
    { href: '/livreur', icon: 'home', label: 'Accueil' },
    { href: '/livreur/livraisons', icon: 'local_shipping', label: 'Livraisons' },
    { href: '/livreur/requests', icon: 'explore', label: 'Tâches' },
    { href: '/livreur/account', icon: 'person', label: 'Compte' },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, loading: logoutLoading } = useLogout();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push("/login");
            return;
          }
          throw new Error("Impossible de charger le profil");
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/admin' || href === '/livreur') {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogoutClick = () => setShowLogoutConfirm(true);

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  if (loading || !profile) {
    return (
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-white lg:border-r lg:border-border lg:z-50 lg:overflow-y-auto">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-28 bg-muted rounded animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const role = profile.role.toUpperCase() as keyof typeof menuLinks;
  const links = menuLinks[role] || [];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-white lg:border-r lg:border-border lg:z-50 lg:overflow-y-auto">
      {/* Header Profil */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-secondary/10"
            style={{
              backgroundImage: "url('https://scontent.ftnr4-2.fna.fbcdn.net/v/t39.30808-1/646132825_1724770132265747_3867069056553141167_n.jpg?stp=c0.0.928.928a_dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeGT-ffAViQUtyK_46mMduBfBSXTuM7gAeMFJdO4zuAB4xxDNtmbTcgWTncFy0hmHBMF4TfTxWMX70Mz8z2tq1j_&_nc_ohc=niPp83kseAUQ7kNvwHciDRP&_nc_oc=AdrQeIAweUy4-vDQmsLQWoMIrW1MotBVLKFGKsaU04UjJN4mf5tBp7stY4CFUngYUog&_nc_zt=24&_nc_ht=scontent.ftnr4-2.fna&_nc_gid=AWuWrQRIflgJnwbaVAuM4Q&_nc_ss=7a32e&oh=00_Afy3MDzw5weP-NSJi8BYsRSVWICaDn-rKCk1CW1s5w8mUA&oe=69C8C405')",
            }}
          />
          <div>
            <p className="font-bold text-secondary text-lg">
              {profile.nom} {profile.prenom}
            </p>
            <span className="bg-secondary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation dynamique */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition ${
              isActive(link.href)
                ? 'bg-secondary/10 text-secondary'
                : 'text-muted-foreground hover:bg-muted hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bouton Déconnexion */}
      <div className="p-5 border-t border-border mt-auto">
        <button
          onClick={handleLogoutClick}
          disabled={logoutLoading}
          className="flex items-center gap-2 text-destructive hover:text-destructive/80 font-medium transition w-full"
        >
          <span className="material-symbols-outlined">logout</span>
          {logoutLoading ? "Déconnexion..." : "Se déconnecter"}
        </button>
      </div>

      {/* Dialog de confirmation */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Déconnexion</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? "Déconnexion..." : "Oui, me déconnecter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}