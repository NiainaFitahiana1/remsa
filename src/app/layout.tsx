// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RED•ACTED | Modern Fullstack Developer",
  description: "Crafting premium digital experiences with intent. Fullstack developer specialized in high-performance SaaS products.",
  keywords: ["developer", "fullstack", "react", "next.js", "typescript", "portfolio"],
  authors: [{ name: "RED•ACTED" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${rubik.variable} 
                   font-sans antialiased 
                   bg-background text-foreground 
                   selection:bg-primary selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}