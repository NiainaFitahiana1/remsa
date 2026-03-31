"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BoostRequest {
  id: string;
  userName: string;
  userPrenom: string;
  role: "CLIENT" | "DRIVER";
  requestedType: "Premium" | "Ultra";
  requestDate: string;
  desiredDuration: string;
  message: string;
  status: "En attente" | "Approuvé" | "Refusé";
  price: number;
}

export default function BoostRequestsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "all" | "approved" | "rejected">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Données statiques
  const [requests] = useState<BoostRequest[]>([
    { id: "REQ-001", userName: "Benali", userPrenom: "Ahmed", role: "DRIVER", requestedType: "Ultra", requestDate: "30/03/2026", desiredDuration: "3 mois", message: "Je veux booster mon profil pour avoir plus de courses le soir.", status: "En attente", price: 99 },
    { id: "REQ-002", userName: "Zahra", userPrenom: "Fatima", role: "CLIENT", requestedType: "Premium", requestDate: "30/03/2026", desiredDuration: "1 mois", message: "", status: "En attente", price: 49 },
    { id: "REQ-003", userName: "Kamel", userPrenom: "Mohamed", role: "DRIVER", requestedType: "Ultra", requestDate: "29/03/2026", desiredDuration: "2 mois", message: "Besoin de visibilité pour les courses longue distance.", status: "Approuvé", price: 99 },
    { id: "REQ-004", userName: "Amrani", userPrenom: "Aicha", role: "CLIENT", requestedType: "Premium", requestDate: "29/03/2026", desiredDuration: "1 mois", message: "Je commande souvent.", status: "En attente", price: 49 },
    { id: "REQ-005", userName: "Tazi", userPrenom: "Youssef", role: "DRIVER", requestedType: "Premium", requestDate: "28/03/2026", desiredDuration: "15 jours", message: "", status: "Refusé", price: 49 },
    { id: "REQ-006", userName: "Bouazza", userPrenom: "Leila", role: "CLIENT", requestedType: "Ultra", requestDate: "28/03/2026", desiredDuration: "2 mois", message: "Je veux tester Ultra.", status: "En attente", price: 99 },
    { id: "REQ-007", userName: "Farid", userPrenom: "Omar", role: "DRIVER", requestedType: "Premium", requestDate: "27/03/2026", desiredDuration: "1 mois", message: "Mon activité a augmenté.", status: "Approuvé", price: 49 },
    { id: "REQ-008", userName: "El Alaoui", userPrenom: "Nadia", role: "CLIENT", requestedType: "Ultra", requestDate: "27/03/2026", desiredDuration: "3 mois", message: "", status: "En attente", price: 99 },
    { id: "REQ-009", userName: "Benkirane", userPrenom: "Rachid", role: "DRIVER", requestedType: "Premium", requestDate: "26/03/2026", desiredDuration: "1 mois", message: "Je livre dans plusieurs zones.", status: "Refusé", price: 49 },
    { id: "REQ-010", userName: "Rami", userPrenom: "Sofia", role: "CLIENT", requestedType: "Premium", requestDate: "26/03/2026", desiredDuration: "15 jours", message: "Test pour voir les avantages.", status: "Approuvé", price: 49 },
    { id: "REQ-011", userName: "Moussaoui", userPrenom: "Khalid", role: "DRIVER", requestedType: "Ultra", requestDate: "25/03/2026", desiredDuration: "2 mois", message: "", status: "En attente", price: 99 },
    { id: "REQ-012", userName: "Saidi", userPrenom: "Meryem", role: "CLIENT", requestedType: "Premium", requestDate: "25/03/2026", desiredDuration: "1 mois", message: "", status: "En attente", price: 49 },
    { id: "REQ-013", userName: "El Fassi", userPrenom: "Yassin", role: "DRIVER", requestedType: "Premium", requestDate: "24/03/2026", desiredDuration: "3 mois", message: "Besoin pour la haute saison.", status: "Approuvé", price: 49 },
    { id: "REQ-014", userName: "Tazi", userPrenom: "Imane", role: "CLIENT", requestedType: "Ultra", requestDate: "24/03/2026", desiredDuration: "1 mois", message: "", status: "En attente", price: 99 },
    { id: "REQ-015", userName: "Amrani", userPrenom: "Bilal", role: "DRIVER", requestedType: "Premium", requestDate: "23/03/2026", desiredDuration: "15 jours", message: "", status: "Refusé", price: 49 },
  ]);

  // Filtrage
  const filteredRequests = useMemo(() => {
    let result = [...requests];

    if (activeTab === "pending") result = result.filter(r => r.status === "En attente");
    if (activeTab === "approved") result = result.filter(r => r.status === "Approuvé");
    if (activeTab === "rejected") result = result.filter(r => r.status === "Refusé");

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(r =>
        `${r.userPrenom} ${r.userName}`.toLowerCase().includes(term) ||
        r.id.toLowerCase().includes(term) ||
        r.requestedType.toLowerCase().includes(term) ||
        r.message.toLowerCase().includes(term)
      );
    }

    return result;
  }, [requests, activeTab, searchTerm]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = (id: string) => {
    alert(`Demande ${id} approuvée !`);
    // TODO: Appel API PATCH
  };

  const handleReject = (id: string) => {
    if (confirm(`Refuser la demande ${id} ?`)) {
      alert(`Demande ${id} refusée.`);
      // TODO: Appel API PATCH
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "Approuvé") return <Badge className="bg-emerald-100 text-emerald-700">Approuvé</Badge>;
    if (status === "Refusé") return <Badge variant="destructive">Refusé</Badge>;
    return <Badge className="bg-amber-100 text-amber-700 font-medium">En attente</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return type === "Ultra" 
      ? <Badge className="bg-orange-700 text-white">Ultra</Badge>
      : <Badge className="bg-orange-600 text-white">Premium</Badge>;
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-orange-800">Demandes de Boost</h1>
          <p className="text-gray-500">Gestion des demandes de Premium et Ultra</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => {
        setActiveTab(v as any);
        setCurrentPage(1);
      }}>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
          <TabsList>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="all">Toutes les demandes</TabsTrigger>
            <TabsTrigger value="approved">Approuvées</TabsTrigger>
            <TabsTrigger value="rejected">Refusées</TabsTrigger>
          </TabsList>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, référence ou message..."
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
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Type demandé</TableHead>
                  <TableHead>Date de demande</TableHead>
                  <TableHead>Durée souhaitée</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-sm">{req.id}</TableCell>
                    
                    <TableCell>
                      <div className="font-medium">
                        {req.userPrenom} {req.userName}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        {req.role === "DRIVER" ? "Chauffeur" : "Client"}
                      </Badge>
                    </TableCell>

                    <TableCell>{getTypeBadge(req.requestedType)}</TableCell>

                    <TableCell>{req.requestDate}</TableCell>

                    <TableCell>{req.desiredDuration}</TableCell>

                    <TableCell className="font-semibold text-orange-700">
                      {req.price} €
                    </TableCell>

                    <TableCell>{getStatusBadge(req.status)}</TableCell>

                    <TableCell className="text-right">
                      {req.status === "En attente" ? (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(req.id)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(req.id)}
                          >
                            Refuser
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {paginatedRequests.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                Aucune demande trouvée pour ce filtre.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-2">
              <p className="text-sm text-gray-600">
                Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
                {Math.min(currentPage * itemsPerPage, filteredRequests.length)} sur{" "}
                {filteredRequests.length} demandes
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <div className="px-4 py-2 bg-orange-50 rounded-lg text-orange-900 font-medium">
                  Page {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}