import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* User Profile */}
      <Card className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(48,48,50,0.04)] border border-outline-variant/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary-container flex items-center justify-center text-white font-bold text-lg">
            JD
          </div>
          <div>
            <h4 className="font-headline font-bold text-on-surface">Jean-Dupont Logistics</h4>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Account Premium</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-surface-container-low rounded-lg text-center">
            <p className="text-[10px] font-bold text-outline uppercase">Actifs</p>
            <p className="text-xl font-headline font-bold text-primary">12</p>
          </div>
          <div className="p-3 bg-surface-container-low rounded-lg text-center">
            <p className="text-[10px] font-bold text-outline uppercase">Terminés</p>
            <p className="text-xl font-headline font-bold text-secondary-container">148</p>
          </div>
        </div>
      </Card>

      {/* Live Network Stats */}
      <Card className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(48,48,50,0.04)] border border-outline-variant/20">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface mb-4">Statistiques Réseau</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Noeuds Actifs
            </span>
            <span className="text-sm font-bold font-headline">2,410</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-container" />
              Trafic Moyen
            </span>
            <span className="text-sm font-bold font-headline">1.2 GB/s</span>
          </div>
          <div className="mt-4 pt-4 border-t border-outline-variant/10">
            <div className="flex items-center gap-2 text-primary cursor-pointer hover:underline">
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
              <span className="text-xs font-bold uppercase tracking-widest">Voir le Rapport</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Filter Shortcuts */}
      <Card className="bg-surface p-4 rounded-xl border border-primary/10">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Raccourcis Filtres</h4>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="text-[10px] font-bold">Dernière Heure</Button>
          <Button variant="outline" size="sm" className="text-[10px] font-bold">Volume &gt; 5t</Button>
          <Button variant="outline" size="sm" className="text-[10px] font-bold">International</Button>
        </div>
      </Card>
    </aside>
  );
}