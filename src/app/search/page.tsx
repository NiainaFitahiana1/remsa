import TopAppBar from "@/components/search/ui/Topbar";
import OfferCard from "@/components/search/ui/OfferCard";
import SearchAndFilterBar from "@/components/search/SearchAndFilterBar";
import Sidebar from "@/components/search/ui/Sidebar";
import Footer from "@/components/search/ui/Footer";
const offers = [
  {
    id: "AT-8821",
    from: "Paris",
    to: "Lyon",
    weight: "1,240 kg",
    price: "850,00 €",
    description: "Fourgon 20m³ • Matériel Médical • Express",
    status: "EN TRANSIT" as const,
    avatar: "https://lh3.googleusercontent.com/...",
    vehicle: "Fourgon 20m³",
    cargoType: "Matériel Médical",
    deadline: "Aujourd'hui 18:00",
    distance: "460 km",
    estimatedTime: "4h 30min",
    driver: "Marc Dubois",
    fallback: "AT",
  },
  {
    id: "AT-8904",
    from: "Marseille",
    to: "Nice",
    weight: "450 kg",
    price: "320,00 €",
    description: "Utilitaire Léger • Pièces Auto • < 18:00",
    status: "URGENT" as const,
    avatar: "https://lh3.googleusercontent.com/...",
    vehicle: "Utilitaire Léger",
    cargoType: "Pièces Automobiles",
    deadline: "Aujourd'hui 14:00",
    distance: "190 km",
    estimatedTime: "2h 15min",
    driver: "Sophie Laurent",
    fallback: "AT",
  },
  {
    id: "AT-9011",
    from: "Bordeaux",
    to: "Nantes",
    weight: "2,800 kg",
    price: "1,150,00 €",
    description: "Poids Lourd • Vins • Palette Europe",
    status: "PROGRAMMÉ" as const,
    avatar: "https://lh3.googleusercontent.com/...",
    vehicle: "Semi-remorque",
    cargoType: "Vins & Spiritueux",
    deadline: "Demain 10:00",
    distance: "380 km",
    estimatedTime: "5h 45min",
    driver: "Lucas Moreau",
    fallback: "AT",
  },
];

export default function SearchPage() {
  return (
    <>
      <TopAppBar />

      <main className="relative min-h-screen kinetic-dot-grid">
        <div className="max-w-[1440px] mx-auto px-8 py-8 flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-headline text-4xl font-black tracking-tight text-on-surface">
                  Logistics{" "}
                  <span className="bg-gradient-to-r from-primary via-secondary-container to-tertiary bg-clip-text text-transparent uppercase">
                    Kinetic
                  </span>
                </h1>
                <p className="text-on-surface-variant font-medium opacity-80 mt-1">
                  Surveillance du réseau en temps réel.
                </p>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <SearchAndFilterBar />

            {/* Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>

            <div className="flex justify-center py-4">
              <button className="group flex items-center gap-4 text-on-surface hover:text-primary transition-colors">
                <span className="h-[2px] w-12 bg-on-surface group-hover:bg-primary transition-all" />
                <span className="font-headline font-bold text-xs uppercase tracking-widest">
                  Charger plus
                </span>
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <Sidebar />
        </div>
      </main>

      <Footer />
    </>
  );
}