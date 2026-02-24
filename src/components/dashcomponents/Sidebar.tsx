'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  // Fonction qui vérifie si le lien est actif (match exact)
  const isActive = (href: string) => {
    // Pour la racine du dashboard → on veut uniquement l'exact match
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    // Pour les sous-pages → match exact OU commence par href + "/"
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-white lg:border-r lg:border-border lg:z-50 lg:overflow-y-auto">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-secondary/10"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/...')",
            }}
          />
          <div>
            <p className="font-bold text-secondary text-lg">Alex</p>
            <span className="bg-secondary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Level 4 Courier
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 flex flex-col gap-1.5">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition ${
            isActive('/dashboard')
              ? 'bg-secondary/10 text-secondary'
              : 'text-muted-foreground hover:bg-muted hover:text-secondary'
          }`}
        >
          <span className="material-symbols-outlined">home</span>
          <span>Home</span>
        </Link>

        <Link
          href="/dashboard/tasks"
          className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition ${
            isActive('/dashboard/tasks')
              ? 'bg-secondary/10 text-secondary'
              : 'text-muted-foreground hover:bg-muted hover:text-secondary'
          }`}
        >
          <span className="material-symbols-outlined">explore</span>
          <span>Tasks</span>
        </Link>

        <Link
          href="/dashboard/stats"
          className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition ${
            isActive('/dashboard/stats')
              ? 'bg-secondary/10 text-secondary'
              : 'text-muted-foreground hover:bg-muted hover:text-secondary'
          }`}
        >
          <span className="material-symbols-outlined">analytics</span>
          <span>Stats</span>
        </Link>

        <Link
          href="/dashboard/account"
          className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition ${
            isActive('/dashboard/account')
              ? 'bg-secondary/10 text-secondary'
              : 'text-muted-foreground hover:bg-muted hover:text-secondary'
          }`}
        >
          <span className="material-symbols-outlined">person</span>
          <span>Account</span>
        </Link>
      </nav>

      <div className="p-5 border-t border-border mt-auto">
        <button className="flex items-center gap-2 text-destructive hover:text-destructive/80 font-medium transition w-full">
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}