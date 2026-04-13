import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import logo from '@/../public/logos/logo-text.png';

export default function TopAppBar() {
  return (
    <header className="w-full bg-[#fcf8fb]/80 backdrop-blur-xl z-50 sticky top-0">
      <div className="flex justify-between items-center w-full px-8 py-6 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="#" className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-[#b7102a] via-[#fd8603] to-[#7b2cbf] bg-clip-text text-transparent font-headline">
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

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-[#b7102a] border-b-2 border-[#b7102a] font-bold tracking-tight py-1">Gateway</Link>
            <Link href="#" className="text-[#1b1b1d] opacity-70 hover:opacity-100 transition-all font-bold tracking-tight">Active Shipments</Link>
            <Link href="#" className="text-[#1b1b1d] opacity-70 hover:opacity-100 transition-all font-bold tracking-tight">Network</Link>
          </nav>
        </div>

        <Button className="bg-gradient-to-r from-[#b7102a] to-[#fd8603] text-white hover:scale-[1.02] transition-transform">
          Inscrire
        </Button>
      </div>
    </header>
  );
}