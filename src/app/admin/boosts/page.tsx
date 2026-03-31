"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Crown, 
  Zap, 
  Calendar, 
  Clock, 
  DollarSign,
  UserCheck 
} from "lucide-react";

interface BoostedUser {
  id: number;
  name: string;
  prenom: string;
  role: "CLIENT" | "DRIVER";
  type: "Premium" | "Ultra";
  dateDebut: string;
  dateFin: string;
  dureeRestante: string;
  prix: number;
  status: "Actif" | "Expiré" | "En attente";
  boostLevel: number;
}

export default function BoostManagementPage() {
  const [activeTab, setActiveTab] = useState<"all" | "premium" | "ultra">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 20 utilisateurs boostés (statiques)
  const [boostedUsers] = useState<BoostedUser[]>([
    { id: 1, name: "Ahmed", prenom: "Benali", role: "DRIVER", type: "Premium", dateDebut: "2026-03-15", dateFin: "2026-04-14", dureeRestante: "14 jours", prix: 49, status: "Actif", boostLevel: 1 },
    { id: 2, name: "Fatima", prenom: "Zahra", role: "CLIENT", type: "Ultra", dateDebut: "2026-03-20", dateFin: "2026-05-19", dureeRestante: "49 jours", prix: 99, status: "Actif", boostLevel: 2 },
    { id: 3, name: "Mohamed", prenom: "Kamel", role: "DRIVER", type: "Premium", dateDebut: "2026-03-10", dateFin: "2026-03-25", dureeRestante: "Expiré", prix: 49, status: "Expiré", boostLevel: 1 },
    { id: 4, name: "Aicha", prenom: "Amrani", role: "CLIENT", type: "Ultra", dateDebut: "2026-03-25", dateFin: "2026-04-24", dureeRestante: "24 jours", prix: 99, status: "Actif", boostLevel: 2 },
    { id: 5, name: "Youssef", prenom: "Tazi", role: "DRIVER", type: "Premium", dateDebut: "2026-03-28", dateFin: "2026-04-27", dureeRestante: "27 jours", prix: 49, status: "Actif", boostLevel: 1 },
    { id: 6, name: "Leila", prenom: "Bouazza", role: "CLIENT", type: "Premium", dateDebut: "2026-03-05", dateFin: "2026-04-04", dureeRestante: "4 jours", prix: 49, status: "Actif", boostLevel: 1 },
    { id: 7, name: "Omar", prenom: "Farid", role: "DRIVER", type: "Ultra", dateDebut: "2026-03-12", dateFin: "2026-05-11", dureeRestante: "41 jours", prix: 99, status: "Actif", boostLevel: 2 },
    { id: 8, name: "Nadia", prenom: "El Alaoui", role: "CLIENT", type: "Premium", dateDebut: "2026-03-30", dateFin: "2026-04-29", dureeRestante: "29 jours", prix: 49, status: "Actif", boostLevel: 1 },
    { id: 9, name: "Rachid", prenom: "Benkirane", role: "DRIVER", type: "Ultra", dateDebut: "2026-02-28", dateFin: "2026-04-29", dureeRestante: "29 jours", prix: 99, status: "Actif", boostLevel: 2 },
    { id: 10, name: "Sofia", prenom: "Rami", role: "CLIENT", type: "Premium", dateDebut: "2026-03-18", dateFin: "2026-04-17", dureeRestante: "17 jours", prix: 49, status: "Actif", boostLevel: 1 },
    { id: 11, name: "Khalid", prenom: "Moussaoui", role: "DRIVER", type: "Premium", dateDebut: "2026-03-22", dateFin: "2026-04-21", dureeRestante: "21 jours", prix: 49, status: "Actif", boostLevel: 1 },
    { id: 12, name: "Meryem", prenom: "Saidi", role: "CLIENT", type: "Ultra", dateDebut: "2026-03-01", dateFin: "2026-04-30", dureeRestante: "30 jours", prix: 99, status: "Actif", boostLevel: 2 },
    { id: 13, name: "Yassin", prenom: "El Fassi", role: "DRIVER", type: "Premium", dateDebut: "2026-03-27", dateFin: "2026-04-26", dureeRestante: "26 jours", prix: 49, status: "Actif", boostLevel: 1 },
    { id: 14, name: "Imane", prenom: "Tazi", role: "CLIENT", type: "Ultra", dateDebut: "2026-03-08", dateFin: "2026-05-07", dureeRestante: "37 jours", prix: 99, status: "Actif", boostLevel: 2 },
    { id: 15, name: "Bilal", prenom: "Amrani", role: "DRIVER", type: "Premium", dateDebut: "2026-03-29", dateFin: "2026-04-28", dureeRestante: "28 jours", prix: 49, status: "Actif", boostLevel: 1 },
    { id: 16, name: "Hassan", prenom: "El Idrissi", role: "CLIENT", type: "Ultra", dateDebut: "2026-03-14", dateFin: "2026-05-13", dureeRestante: "43 jours", prix: 99, status: "Actif", boostLevel: 2 },
    { id: 17, name: "Salim", prenom: "Berrada", role: "DRIVER", type: "Premium", dateDebut: "2026-03-03", dateFin: "2026-04-02", dureeRestante: "2 jours", prix: 49, status: "Actif", boostLevel: 1 },
    { id: 18, name: "Karim", prenom: "El Amrani", role: "DRIVER", type: "Ultra", dateDebut: "2026-02-25", dateFin: "2026-04-26", dureeRestante: "26 jours", prix: 99, status: "Actif", boostLevel: 2 },
    { id: 19, name: "Zineb", prenom: "Lahlou", role: "CLIENT", type: "Premium", dateDebut: "2026-03-19", dateFin: "2026-04-18", dureeRestante: "18 jours", prix: 49, status: "Actif", boostLevel: 1 },
    { id: 20, name: "Hamza", prenom: "Chraibi", role: "DRIVER", type: "Ultra", dateDebut: "2026-03-24", dateFin: "2026-05-23", dureeRestante: "53 jours", prix: 99, status: "Actif", boostLevel: 2 },
  ]);

  const filteredUsers = useMemo(() => {
    let result = [...boostedUsers];

    if (activeTab === "premium") {
      result = result.filter(u => u.type === "Premium");
    } else if (activeTab === "ultra") {
      result = result.filter(u => u.type === "Ultra");
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(u => 
        `${u.prenom} ${u.name}`.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term) ||
        u.type.toLowerCase().includes(term) ||
        u.dateFin.includes(term) ||
        u.dureeRestante.toLowerCase().includes(term)
      );
    }

    return result;
  }, [boostedUsers, activeTab, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTabChange = (value: "all" | "premium" | "ultra") => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const getBoostColor = (type: string) => {
    return type === "Ultra" 
      ? "bg-gradient-to-r from-orange-700 to-orange-800 text-white" 
      : "bg-gradient-to-r from-orange-600 to-amber-600 text-white";
  };

  const getStatusBadge = (status: string) => {
    if (status === "Actif") return <Badge className="bg-emerald-100 text-emerald-700">Actif</Badge>;
    if (status === "Expiré") return <Badge variant="destructive">Expiré</Badge>;
    return <Badge variant="secondary">En attente</Badge>;
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-orange-800">Gestion des Offres & Boost Comptes</h1>
        <Button className="bg-orange-700 hover:bg-orange-800 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Créer une nouvelle offre
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => handleTabChange(v as "all" | "premium" | "ultra")}>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
          <TabsList>
            <TabsTrigger value="all">Tous les boosts</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="ultra">Ultra</TabsTrigger>
          </TabsList>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un utilisateur, type de boost..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedUsers.map((user) => (
              <Card key={user.id} className="overflow-hidden hover:shadow-md transition-all border-orange-100">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-orange-950">
                        {user.prenom} {user.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {user.role === "DRIVER" ? "Chauffeur" : "Client"}
                      </p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getBoostColor(user.type)}`}>
                      {user.type}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span>Fin : <strong className="text-orange-900">{user.dateFin}</strong></span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>Restant : 
                      <strong className={user.dureeRestante.includes("Expiré") ? "text-red-600" : "text-orange-700"}>
                        {user.dureeRestante}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                    <span>Prix : <strong className="text-orange-700">{user.prix} €</strong></span>
                  </div>

                  <div className="pt-2">
                    {getStatusBadge(user.status)}
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1 border-orange-200 hover:bg-orange-50">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Voir profil
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-orange-700 hover:bg-orange-800"
                    >
                      Prolonger
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {paginatedUsers.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              Aucun utilisateur boosté trouvé pour cette recherche.
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="border-orange-200"
              >
                Précédent
              </Button>
              <div className="px-6 py-2 bg-orange-50 text-orange-900 rounded-lg font-medium">
                Page {currentPage} sur {totalPages}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-orange-200"
              >
                Suivant
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}