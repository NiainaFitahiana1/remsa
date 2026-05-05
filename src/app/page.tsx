"use client";

import TopAppBar from "@/components/search/ui/Topbar";
import Footer from "@/components/search/ui/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import heroImage from "@/../public/illustrations/ivi.png";

export default function HomePage() {
  return (
    <>
      <TopAppBar />

      <main className="min-h-screen bg-surface">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden kinetic-dot-grid">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Contenu Texte - Gauche */}
              <div className="lg:col-span-7">
                <h1 className="font-headline text-6xl md:text-7xl font-black tracking-tighter text-on-surface leading-none mb-6">
                  La logistique<br />
                  <span className="bg-gradient-to-r from-primary via-secondary-container to-tertiary bg-clip-text text-transparent">
                    en temps réel
                  </span>
                </h1>

                <p className="text-xl text-on-surface-variant mb-10 max-w-lg">
                  Connectez transporteurs et chargeurs instantanément. 
                  Suivez vos cargaisons en direct avec une précision militaire.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/search">Trouver un transport maintenant</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#premium">Découvrir Premium</Link>
                  </Button>
                </div>

                <div className="mt-12 flex items-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 text-2xl">●</span>
                    <span>2 410 noeuds actifs</span>
                  </div>
                  <div>4,98/5 • 1 284 transporteurs</div>
                </div>
              </div>

              {/* Illustration - Droite */}
              <div className="lg:col-span-5 hidden md:block">
                <div className="relative">
                  {/* Remplace cette div par ton image ou illustration */}
                  <div className="aspect-square lg:aspect-[4/auto] -mt-16">
                    
                    {/* Option 1 : Image via Next/Image (recommandé) */}
                    
                    <Image 
                      src={heroImage} 
                      alt="Illustration logistique en temps réel - Camion et réseau connecté"
                      fill 
                      className="object-contain"
                      priority
                    />
                   
                   
                  </div>

                  {/* Effet décoratif optionnel */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guide d’utilisation */}
        <section className="py-20">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl font-bold tracking-tight mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-on-surface-variant">3 étapes simples pour révolutionner votre logistique</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  step: "01",
                  title: "Publiez votre besoin",
                  desc: "Créez une offre de transport en moins de 30 secondes (origine, destination, poids, type de marchandise…)",
                },
                {
                  step: "02",
                  title: "Recevez des propositions",
                  desc: "Les transporteurs disponibles vous envoient leurs meilleures offres en temps réel.",
                },
                {
                  step: "03",
                  title: "Choisissez & Suivez",
                  desc: "Sélectionnez le meilleur transporteur et suivez votre cargaison en direct jusqu’à la livraison.",
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="text-8xl font-black text-outline/10 mb-4">{item.step}</div>
                  <h3 className="font-headline text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Button size="lg" asChild>
                <Link href="/search">Commencer maintenant →</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Section Premium */}
        <section id="premium" className="py-20 bg-surface-container-lowest">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                  Recommandé
                </div>
                <h2 className="font-headline text-5xl font-black tracking-tight mb-6">
                  Passez en <span className="text-primary">Premium</span>
                </h2>
                <p className="text-xl text-on-surface-variant mb-10">
                  Accédez à des fonctionnalités avancées et optimisez votre activité logistique au maximum.
                </p>

                <ul className="space-y-5 text-lg">
                  <li className="flex items-start gap-4">
                    <span className="text-green-500 mt-1">✓</span>
                    Priorité sur toutes les offres
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-green-500 mt-1">✓</span>
                    Accès aux transporteurs vérifiés "Elite"
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-green-500 mt-1">✓</span>
                    Alertes intelligentes et matching automatique
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-green-500 mt-1">✓</span>
                    Statistiques détaillées et rapports exportables
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-green-500 mt-1">✓</span>
                    Support dédié 24/7
                  </li>
                </ul>

                <div className="mt-10">
                  <Button size="lg" className="text-lg px-10">
                    Devenir Premium — 49€/mois
                  </Button>
                  <p className="text-sm text-on-surface-variant mt-4">
                    Annulable à tout moment • 14 jours d’essai gratuit
                  </p>
                </div>
              </div>

              <Card className="p-10 bg-gradient-to-br from-surface to-surface-container-low shadow-2xl">
                <div className="space-y-8">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-on-surface-variant">Premium</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black">49</span>
                      <span className="text-2xl text-on-surface-variant">€ / mois</span>
                    </div>
                  </div>

                  <div className="h-px bg-outline-variant" />

                  <ul className="space-y-6">
                    {["Matching IA avancé", "Visibilité maximale", "Rapports analytiques", "Support prioritaire"].map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <span className="text-primary">→</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}