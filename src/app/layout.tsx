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
    default: "e-kalité web",
    template: "%s | e-kalité web",
  },

  description:
    "e-kalité web – votre plateforme / service / solution …", // ← À personnaliser


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
          href="https://example.com" // ← À modifier avec ton vrai domaine
        />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
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
          toastOptions={{
            classNames: {
              toast: "border sharp-border rounded-sm",
              title: "font-bold uppercase tracking-wider",
              description: "text-sm",
              success: "bg-green-50 border-green-400 text-green-900",
              error: "bg-red-50 border-red-400 text-red-900",
            },
          }}
        />
      </body>
    </html>
  );
}