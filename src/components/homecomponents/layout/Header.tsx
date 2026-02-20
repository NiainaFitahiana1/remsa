import Link from 'next/link';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-sm">
              <Icon name="local_shipping" className="text-white !leading-none" size="text-2xl" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">DeliverFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider">
            <Link href="#" className="hover:text-primary transition-colors">Fleet</Link>
            <Link href="#" className="hover:text-primary transition-colors border-b-2 border-primary">Technology</Link>
            <Link href="#" className="hover:text-primary transition-colors">Stories</Link>
            <Link href="#" className="hover:text-primary transition-colors">Logistics</Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <button className="hidden lg:flex items-center gap-2 text-slate-500 hover:text-primary">
            <Icon name="search" />
          </button>
          <Button>Subscribe</Button>
        </div>
      </div>
    </header>
  );
};