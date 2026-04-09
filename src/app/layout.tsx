import type { Metadata } from "next";
import "./globals.css";
import { Work_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"), // ← À MODIFIER avec ton vrai domaine

  title: {
    default: "Atero | Plateforme",
    template: "%s | e-kalité web",
  },

  description:
    "Atero web platform…", // ← À personnaliser


  openGraph: {
    title: "e-kalité web",
    description: "…", // ← À personnaliser
    url: "https://example.com",           // ← À modifier
    siteName: "e-kalité web",
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "e-kalité web",
    description: "…", // ← À personnaliser
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${workSans.variable} scroll-smooth light`}
      suppressHydrationWarning
    >
      <head>
        {/* Changement du favicon */}
        <link rel="icon" href="/logos/logo.ico" />

        <link
          rel="canonical"
          href="https://example.com" 
        />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>

      <body
        className={`
          ${workSans.className}
          font-display
          bg-background-light dark:bg-background-dark
          text-slate-900 dark:text-slate-100
          selection:bg-primary selection:text-white
          antialiased
          min-h-screen
          overflow-x-hidden
        `}
      >
        {children}

        <Toaster
          richColors
          position="top-center"
          closeButton
          toastOptions={{
            classNames: {
              // Toast principal : fond blanc + coins très arrondis
              toast: 
                "bg-white border border-outline-variant shadow-xl rounded-3xl !important",
              title: 
                "font-headline font-bold uppercase tracking-widest text-on-surface",
              description: 
                "text-on-surface-variant text-sm",
              success: 
                "bg-white border-tertiary text-tertiary border-l-4 border-l-tertiary",
              error: 
                "bg-white border-error text-error border-l-4 border-l-error",
              warning: 
                "bg-white border-secondary-container text-secondary-container border-l-4 border-l-secondary-container",
              info: 
                "bg-white border-primary text-primary border-l-4 border-l-primary",
              actionButton: 
                "bg-primary text-white hover:bg-primary/90 rounded-2xl",
              cancelButton: 
                "bg-surface-container text-on-surface-variant hover:bg-surface-container-high rounded-2xl",
            },
          }}
        />
      </body>
    </html>
  );
}