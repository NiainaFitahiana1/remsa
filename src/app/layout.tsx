import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk, Rubik } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ClientProvider } from "@/provider/ClientProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Mini-Assoc - Créateurs de lien social",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`${spaceGrotesk.className} ${rubik.className} 
          bg-background-light text-neutral-dark 
          overflow-x-hidden 
          selection:bg-primary selection:text-neutral-dark`}
      >
        <ClientProvider>
          {children}
        </ClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
