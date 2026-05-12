import { MenuLink, Role } from '@/types';

export const menuLinks: Record<Role, MenuLink[]> = {
  CLIENT: [
    { href: '/dashboard', icon: 'home', label: 'Home' },
    { href: '/dashboard/product', icon: 'inventory_2', label: 'Produits' },
    { href: '/dashboard/tasks', icon: 'explore', label: 'Livraisons' },
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