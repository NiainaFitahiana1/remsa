import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuLink } from '@/types';

type SidebarNavProps = {
  links: MenuLink[];
};

export function SidebarNav({ links }: SidebarNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (['/dashboard', '/admin', '/livreur'].includes(href)) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
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
  );
}