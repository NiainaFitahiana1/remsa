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
        "sticky top-0 z-10 bg-background backdrop-blur-sm border-b"
      )}
    >
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;

        const label = decodeURIComponent(segment)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <div key={href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />

            {isLast ? (
              <span
                aria-current="page"
                className={cn(
                  "px-2.5 py-1 rounded-md",
                  "bg-primary/10 text-primary",
                  "font-medium"
                )}
              >
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className={cn(
                  "px-2.5 py-1 rounded-md",
                  "bg-muted hover:bg-muted/70",
                  "transition-all duration-200",
                  "hover:text-foreground"
                )}
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}