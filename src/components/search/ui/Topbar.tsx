'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Icônes hamburger et fermeture
import logo from '@/../public/logos/logo-text.png';

export default function TopAppBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="w-full bg-[#fcf8fb]/80 backdrop-blur-xl z-50 sticky top-0">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1440px] mx-auto">
        
        {/* Logo + Navigation Desktop */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-[#b7102a] via-[#fd8603] to-[#7b2cbf] bg-clip-text text-transparent font-headline">
            <div className="flex items-center gap-3 -mb-10 -mt-8 -ms-5">
              <Image
                src={logo}
                alt="Atero Logo"
                width={128}
                height={128}
                className="h-32 w-auto transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`font-bold tracking-tight py-1 transition-all ${
                isActive('/') 
                  ? "text-[#b7102a] border-b-2 border-[#b7102a]" 
                  : "text-[#1b1b1d] opacity-70 hover:opacity-100"
              }`}
            >
              Accueil
            </Link>

            <Link 
              href="/search" 
              className={`font-bold tracking-tight py-1 transition-all ${
                isActive('/search') 
                  ? "text-[#b7102a] border-b-2 border-[#b7102a]" 
                  : "text-[#1b1b1d] opacity-70 hover:opacity-100"
              }`}
            >
              Opportunités
            </Link>

            <Link 
              href="/about" 
              className={`font-bold tracking-tight py-1 transition-all ${
                isActive('/about') 
                  ? "text-[#b7102a] border-b-2 border-[#b7102a]" 
                  : "text-[#1b1b1d] opacity-70 hover:opacity-100"
              }`}
            >
              À propos
            </Link>
          </nav>
        </div>

        {/* Bouton Inscrire + Menu Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Button 
            asChild 
            className="bg-gradient-to-r from-[#b7102a] to-[#fd8603] text-white hover:scale-[1.02] transition-transform hidden sm:block"
          >
            <Link href="/register">
              Inscrire
            </Link>
          </Button>

          {/* Bouton Hamburger - Visible seulement sur sm et en dessous */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-[#1b1b1d] hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-[#fcf8fb]/95 backdrop-blur-xl">
          <nav className="flex flex-col px-6 py-8 gap-6 text-lg">
            <Link 
              href="/" 
              onClick={closeMenu}
              className={`font-bold tracking-tight py-2 transition-all ${
                isActive('/') 
                  ? "text-[#b7102a] border-b-2 border-[#b7102a] w-fit" 
                  : "text-[#1b1b1d] opacity-70 hover:opacity-100"
              }`}
            >
              Accueil
            </Link>

            <Link 
              href="/search" 
              onClick={closeMenu}
              className={`font-bold tracking-tight py-2 transition-all ${
                isActive('/search') 
                  ? "text-[#b7102a] border-b-2 border-[#b7102a] w-fit" 
                  : "text-[#1b1b1d] opacity-70 hover:opacity-100"
              }`}
            >
              Opportunités
            </Link>

            <Link 
              href="/about" 
              onClick={closeMenu}
              className={`font-bold tracking-tight py-2 transition-all ${
                isActive('/about') 
                  ? "text-[#b7102a] border-b-2 border-[#b7102a] w-fit" 
                  : "text-[#1b1b1d] opacity-70 hover:opacity-100"
              }`}
            >
              À propos
            </Link>

            {/* Bouton Inscrire dans le menu mobile */}
            <div className="pt-4">
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-[#b7102a] to-[#fd8603] text-white hover:scale-[1.02] transition-transform"
              >
                <Link href="/register" onClick={closeMenu}>
                  Inscrire
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}