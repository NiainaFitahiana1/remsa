'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/lib/auth/use-current-user';

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

  const role = user.role.toUpperCase() as keyof typeof menuLinks;
  const links = menuLinks[role] || [];

  return (
    <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border px-4 py-2 flex justify-around items-center z-50">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex flex-col items-center gap-1 transition py-1 px-2 rounded-md ${
            isActive(link.href)
              ? 'text-secondary'
              : 'text-muted-foreground hover:text-secondary'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">{link.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            {link.label}
          </span>
        </Link>
      ))}
    </footer>
  );
}