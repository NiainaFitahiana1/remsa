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
  metadataBase: new URL("https://aingavao.com"), // remplace par ton vrai domaine

  title: {
    default: "Ainga Vao - Plateforme de livreurs freelances rapide et sécurisée",
    template: "%s | Ainga Vao",
  },

  description:
    "Ainga Vao est une plateforme de livreurs freelances rapide, simple et sécurisée. Trouvez un livreur en quelques minutes ou commencez à livrer dès aujourd’hui.",

  keywords: [
    "Ainga Vao",
    "livreur freelance",
    "plateforme livraison",
    "livraison rapide",
    "livraison sécurisée",
    "livreur indépendant",
    "service livraison Madagascar",
  ],

  authors: [{ name: "Ainga Vao" }],
  creator: "Ainga Vao",
  publisher: "Ainga Vao",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Ainga Vao - Plateforme de livreurs freelances",
    description:
      "Livraison rapide, simple et sécurisée avec des livreurs freelances vérifiés.",
    url: "https://aingavao.com",
    siteName: "Ainga Vao",
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ainga Vao - Livraison freelance rapide",
    description:
      "Trouvez un livreur freelance fiable en quelques minutes.",
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
        <link
          rel="icon"
          href="/favicon.ico"
        />
        <link
          rel="canonical"
          href="https://aingavao.com"
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