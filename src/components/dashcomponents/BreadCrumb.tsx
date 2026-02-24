"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();

  // On split le chemin et on filtre les segments vides
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment !== "" && segment !== "dashboard");

  // On construit les "crumbs" avec leur chemin cumulatif
  const crumbs = pathSegments.map((segment, index) => {
    const isLast = index === pathSegments.length - 1;
    const href = `/dashboard/${pathSegments.slice(0, index + 1).join("/")}`;

    // Transformation humaine du segment (slug → titre lisible)
    let label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    // Cas spéciaux si besoin
    if (label === "") label = "Dashboard";

    return { label, href, isLast };
  });

  // Toujours commencer par "Dashboard" comme premier élément
  const fullCrumbs = [{ label: "Dashboard", href: "/dashboard", isLast: false }, ...crumbs];

  if (pathname === "/dashboard") {
    // Pas de breadcrumb sur la page d'accueil du dashboard
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="">
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        {fullCrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
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
                className="text-gray-500 hover:text-primary transition-colors"
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