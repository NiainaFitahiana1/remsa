"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav
      aria-label="Fil d'Ariane"
      className={cn(
        "flex items-center flex-wrap gap-1.5",
        "text-sm text-muted-foreground",
        "px-4 py-3 md:px-6 md:py-4", 
        "sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b"
      )}
    >
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;

        const label = decodeURIComponent(segment)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/70" />

            {isLast ? (
              <span
                aria-current="page"
                className="font-medium text-foreground"
              >
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}