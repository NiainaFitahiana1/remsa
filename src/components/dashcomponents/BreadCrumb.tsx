"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/dashboard" || pathname === "/admin" || pathname === "/livreur") {
    return null;
  }

  const pathSegments = pathname.split("/").filter(Boolean);
  const prefix = pathSegments[0];
  const segments = pathSegments.slice(1);

  const crumbs = segments.map((segment, index) => {
    const isLast = index === segments.length - 1;
    const href = `/${prefix}/${segments.slice(0, index + 1).join("/")}`;

    let label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    if (label === "Product") label = "Products";
    if (label === "Delivery") label = "Deliveries";

    return { label, href, isLast };
  });

  const homeCrumb = {
    label: prefix === "dashboard" ? "Dashboard" : 
           prefix === "admin" ? "Admin" : 
           "Livreur",
    href: `/${prefix}`,
    isLast: false,
  };

  const fullCrumbs = [homeCrumb, ...crumbs];

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap text-sm">
        {fullCrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2 bg-background p-2">
            {index > 0 && (
              <span className="text-gray-400 material-symbols-outlined text-base">
                chevron_right
              </span>
            )}

            {crumb.isLast ? (
              <span className="font-medium text-secondary">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-gray-500 hover:text-primary font-medium transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}