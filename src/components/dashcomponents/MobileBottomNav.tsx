'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Version simple : match EXACT uniquement (adapté pour la nav mobile)
  const isActive = (href: string) => pathname === href;

  return (
    <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border px-4 py-3 flex justify-between items-center z-50">
      <Link
        href="/dashboard"
        className={`flex flex-col items-center gap-1 transition ${
          isActive('/dashboard')
            ? 'text-secondary'
            : 'text-muted-foreground hover:text-secondary'
        }`}
      >
        <span className="material-symbols-outlined text-2xl font-bold">home</span>
        <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
      </Link>

      <Link
        href="/dashboard/product"
        className={`flex flex-col items-center gap-1 transition ${
          isActive('/dashboard/products')
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
    </footer>
  );
}