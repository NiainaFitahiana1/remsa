import { Input } from "@/components/ui/input";

export default function SearchAndFilterBar() {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(48,48,50,0.08)] p-3 flex flex-col md:flex-row gap-3 items-center">
      <div className="flex-1 w-full flex items-center gap-3 px-4 py-2.5 bg-surface-container-low rounded-lg focus-within:bg-surface-container-lowest focus-within:ring-2 ring-primary transition-all">
        <span className="material-symbols-outlined text-outline">search</span>
        <Input
          placeholder="Rechercher une destination..."
          className="bg-transparent border-none focus:ring-0 w-full text-on-surface font-label text-sm placeholder:text-on-surface-variant"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-full whitespace-nowrap cursor-pointer hover:bg-surface-container-highest transition-colors">
          <span className="material-symbols-outlined text-[18px]">local_shipping</span>
          <span className="text-[10px] font-bold font-label uppercase tracking-wider">Véhicule</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-error-container text-on-error-container rounded-full whitespace-nowrap cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">priority_high</span>
          <span className="text-[10px] font-bold font-label uppercase tracking-wider">Urgent</span>
        </div>
      </div>
    </div>
  );
}