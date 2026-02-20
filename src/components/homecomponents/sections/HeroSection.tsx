import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const HeroSection = () => {
  return (
    <section className="relative mesh-gradient overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <Badge variant="featured">Featured</Badge>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              8 min read • Technology
            </span>
          </div>

          <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase text-secondary-blue dark:text-slate-100">
            The Future <br /> Of <span className="text-primary italic">Last-Mile</span><br /> Logistics
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-medium">
            How autonomous scooters and AI-driven routing are redefining urban delivery speeds in hyper-congested environments.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button variant="secondary" size="lg">
              Read Feature <span className="material-symbols-outlined">arrow_forward</span>
            </Button>
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative">
          <div className="aspect-square w-full bg-slate-200 relative overflow-hidden rounded-sm sharp-border">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"
              alt="Modern logistics center"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-blue/40 to-transparent" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-accent-yellow w-24 h-24 -z-10 rounded-sm" />
          <div className="absolute -top-6 -right-6 border-4 border-primary w-32 h-32 -z-10 rounded-sm" />
        </div>
      </div>
    </section>
  );
};