import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Delivery } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DeliveryWithRelations extends Omit<Delivery, "client" | "driver"> {
  client?: { id: number; nom: string; prenom: string } | null;
  driver?: { id: number; nom: string; prenom: string } | null;
  createdAt?: string;
}
async function getDelivery(id: string): Promise<DeliveryWithRelations | null> {
  const cookieStore = await cookies();           // ← Correction importante : await
  const token = cookieStore.get("token")?.value; // Change "token" si ton cookie a un autre nom

  // Si pas de token → rediriger vers la page de login
  if (!token) {
    redirect("/login");   // ou "/auth/login" selon ta route
  }

  const res = await fetch(`${process.env.API_URL}/deliveries/${id}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    if (res.status === 403) {
      // Accès interdit (ex: pas le bon client/driver)
      redirect("/dashboard"); 
    }
    throw new Error(`Erreur ${res.status}: Impossible de charger la livraison`);
  }

  return res.json();
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DeliveryDetailPage({ params }: Props) {
  const { id } = await params;

  let delivery: DeliveryWithRelations | null = null;

  try {
    delivery = await getDelivery(id);
  } catch (error) {
    console.error("Erreur lors du chargement :", error);
    // En production, tu peux rediriger ou afficher une page d'erreur
    notFound();
  }

  if (!delivery) {
    notFound();
  }

  const shortPickup = delivery.pickupAddress?.split(",")[0] || "Départ";
  const shortDrop = delivery.dropAddress?.split(",")[0] || "Destination";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Livraison {shortPickup} → {shortDrop}
        </h1>
        <p className="text-muted-foreground">ID #{delivery.id}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Détails du trajet + Prix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">route</span>
              Détails du trajet
            </h2>
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">Adresse de départ</p>
                <p className="font-medium mt-1">{delivery.pickupAddress}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Adresse de destination</p>
                <p className="font-medium mt-1">{delivery.dropAddress}</p>
              </div>

              {delivery.distanceKm && (
                <div className="flex items-center gap-3 pt-3">
                  <span className="material-symbols-outlined text-2xl">distance</span>
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="text-xl font-semibold">{delivery.distanceKm} km</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Prix</h2>
            <div className="text-5xl font-bold text-primary">
              {delivery.price.toFixed(2)} €
            </div>
          </div>
        </div>

        {/* Sidebar : Client, Livreur, Actions */}
        <div className="space-y-6">
          {delivery.client && (
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-3">Client</h2>
              <p className="font-medium">
                {delivery.client.prenom} {delivery.client.nom}
              </p>
            </div>
          )}

          {delivery.driver ? (
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-3">Livreur assigné</h2>
              <p className="font-medium">
                {delivery.driver.prenom} {delivery.driver.nom}
              </p>
            </div>
          ) : (
            <div className="bg-card border rounded-xl p-6 text-amber-600">
              Aucun livreur assigné pour le moment
            </div>
          )}

          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Actions</h2>
            <div className="flex flex-col gap-3">
              <Button className="w-full gap-2" size="lg">
                <span className="material-symbols-outlined">send</span>
                Envoyer aux livreurs
              </Button>

              <Button variant="outline" className="w-full" size="lg">
                Modifier la livraison
              </Button>

              <Link href="/dashboard/tasks">
                <Button variant="ghost" className="w-full">
                  ← Retour à la liste
                </Button>
              </Link>
            </div>
          </div>

          {/* Infos supplémentaires */}
          <div className="text-sm bg-muted/50 p-5 rounded-xl space-y-1 text-muted-foreground">
            {delivery.createdAt && (
              <p>
                Créée le : {new Date(delivery.createdAt).toLocaleDateString("fr-FR")}
              </p>
            )}
            {delivery.status && <p>Statut : <span className="font-medium">{delivery.status}</span></p>}
          </div>
        </div>
      </div>
    </div>
  );
}