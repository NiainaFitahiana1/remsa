import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="w-full border-t-4 border-[#b7102a] bg-[#1b1b1d] text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-12 py-20 max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-6">
          <span className="text-xl font-bold font-headline">atero</span>
          <p className="text-gray-400 font-body text-sm leading-relaxed max-w-xs">
            Architecting the future of kinetic logistics. High-precision routing and global delivery nodes for the modern enterprise.
          </p>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-[#fd8603] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-white text-sm">language</span>
            </div>
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-[#fd8603] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-white text-sm">share</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Services</h4>
            <nav className="flex flex-col gap-2 text-sm text-gray-400">
              <a href="#" className="hover:text-[#fd8603] transition-colors">Carriers</a>
              <a href="#" className="hover:text-[#fd8603] transition-colors">Business Solutions</a>
              <a href="#" className="hover:text-[#fd8603] transition-colors">Security</a>
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Platform</h4>
            <nav className="flex flex-col gap-2 text-sm text-gray-400">
              <a href="#" className="hover:text-[#fd8603] transition-colors">Global Tracking</a>
              <a href="#" className="hover:text-[#fd8603] transition-colors">API Docs</a>
              <a href="#" className="hover:text-[#fd8603] transition-colors">Privacy Policy</a>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-white font-bold text-sm uppercase tracking-widest">Newsletter Technical</h4>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="ENTER SYSTEM EMAIL"
              className="bg-white/5 border-none text-white text-xs px-4 py-3 rounded focus:ring-1 focus:ring-[#fd8603] outline-none"
            />
            <Button className="bg-[#fd8603] text-[#1b1b1d] font-bold text-xs py-3 rounded uppercase tracking-tighter hover:bg-white">
              Subscribe
            </Button>
          </div>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-loose">
            © 2026 Atero Logistics Gateway. Precision Kinetic Engineering.
          </p>
        </div>
      </div>
    </footer>
  );
}