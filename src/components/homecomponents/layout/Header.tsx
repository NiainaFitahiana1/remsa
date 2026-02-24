"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo + Desktop Nav */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            <div className="bg-primary p-1.5 rounded-sm">
              <Icon name="local_shipping" className="text-white !leading-none" size="text-2xl" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              DeliverFlow
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider">
            <Link href="#" className="hover:text-primary transition-colors">
              Fleet
            </Link>
            <Link
              href="#"
              className="hover:text-primary transition-colors border-b-2 border-primary"
            >
              Technology
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Stories
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Logistics
            </Link>
          </nav>
        </div>

        {/* Desktop right side + Mobile Hamburger */}
        <div className="flex items-center gap-6">
          <button className="hidden lg:flex items-center gap-2 text-slate-500 hover:text-primary">
            <Icon name="search" />
          </button>

          <Button className="hidden md:block">Subscribe</Button>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-2xl text-slate-700 dark:text-slate-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <Icon name={isOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <nav className="flex flex-col items-center gap-6 py-8 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800">
          <Link
            href="#"
            className="text-lg font-semibold hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            Fleet
          </Link>
          <Link
            href="#"
            className="text-lg font-semibold text-primary border-b-2 border-primary"
            onClick={closeMenu}
          >
            Technology
          </Link>
          <Link
            href="#"
            className="text-lg font-semibold hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            Stories
          </Link>
          <Link
            href="#"
            className="text-lg font-semibold hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            Logistics
          </Link>

          <div className="pt-4">
            <Button size="lg">Subscribe</Button>
          </div>

          <button
            className="mt-2 flex items-center gap-2 text-slate-500 hover:text-primary"
            onClick={closeMenu}
          >
            <Icon name="search" size="text-xl" />
            <span>Search</span>
          </button>
        </nav>
      </div>
    </header>
  );
};