'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/lib/auth/use-current-user';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, loading } = useCurrentUser();

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/admin' || href === '/livreur') {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (loading || !user) return null;

  const role = user.role.toUpperCase();

  return (
    <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border px-4 py-3 flex justify-between items-center z-50">
      {role === 'CLIENT' && (
        <>
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/dashboard')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">home</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
          </Link>

          <Link
            href="/dashboard/product"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/dashboard/product')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">inventory_2</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Products</span>
          </Link>

          <Link
            href="/dashboard/tasks"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/dashboard/tasks')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">explore</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Tasks</span>
          </Link>

          <Link
            href="/dashboard/stats"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/dashboard/stats')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">analytics</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Stats</span>
          </Link>

          <Link
            href="/dashboard/account"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/dashboard/account')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">person</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Account</span>
          </Link>
        </>
      )}

      {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
        <>
          <Link
            href="/admin"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/admin')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">dashboard</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Dashboard</span>
          </Link>

          <Link
            href="/admin/users"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/admin/users')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">group</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Utilisateurs</span>
          </Link>

          <Link
            href="/admin/orders"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/admin/orders')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Commandes</span>
          </Link>

          <Link
            href="/admin/stats"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/admin/stats')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">analytics</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Stats</span>
          </Link>

          <Link
            href="/admin/account"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/admin/account')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">person</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Compte</span>
          </Link>
        </>
      )}

      {role === 'DRIVER' && (
        <>
          <Link
            href="/livreur"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/livreur')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">home</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Accueil</span>
          </Link>

          <Link
            href="/livreur/deliveries"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/livreur/deliveries')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Livraisons</span>
          </Link>

          <Link
            href="/livreur/tasks"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/livreur/tasks')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">explore</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Tâches</span>
          </Link>

          <Link
            href="/livreur/stats"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/livreur/stats')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">analytics</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Stats</span>
          </Link>

          <Link
            href="/livreur/account"
            className={`flex flex-col items-center gap-1 transition ${
              isActive('/livreur/account')
                ? 'text-secondary'
                : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">person</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Compte</span>
          </Link>
        </>
      )}
    </footer>
  );
}