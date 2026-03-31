"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";

interface TrafficItem {
  id: string;
  date: string;
  heure: string;
  client: string;
  livreur: string | null;
  produit: string | null;
  depot: string;
  reception: string;
  statut: "En cours" | "Terminé" | "Annulé" | "En attente";
  prixTotal: number;
  commission: number;
}

export default function TrafficTodayPage() {
  // 15 données statiques (traffic aujourd’hui)
  const [allTraffic] = useState<TrafficItem[]>([
    {
      id: "TRF-240331-001",
      date: "31/03/2026",
      heure: "08:45",
      client: "Ahmed Benali",
      livreur: "Karim El Amrani",
      produit: "Colis médical",
      depot: "Pharmacie Centrale",
      reception: "Hôpital Ibn Sina",
      statut: "Terminé",
      prixTotal: 45,
      commission: 6.75,
    },
    {
      id: "TRF-240331-002",
      date: "31/03/2026",
      heure: "09:10",
      client: "Fatima Zahra",
      livreur: "Youssef Tazi",
      produit: "Documents",
      depot: "Notaire El Fassi",
      reception: "Cabinet Avocat",
      statut: "Terminé",
      prixTotal: 18,
      commission: 2.70,
    },
    {
      id: "TRF-240331-003",
      date: "31/03/2026",
      heure: "09:35",
      client: "Mohamed Kamel",
      livreur: null,
      produit: "Repas chaud",
      depot: "Restaurant Al Boustane",
      reception: "Résidence Al Amal",
      statut: "En cours",
      prixTotal: 32,
      commission: 4.80,
    },
    {
      id: "TRF-240331-004",
      date: "31/03/2026",
      heure: "10:05",
      client: "Aicha Amrani",
      livreur: "Salim Berrada",
      produit: "Colis express",
      depot: "DHL Agence",
      reception: "Bureau Siemens",
      statut: "Terminé",
      prixTotal: 65,
      commission: 9.75,
    },
    {
      id: "TRF-240331-005",
      date: "31/03/2026",
      heure: "10:40",
      client: "Hassan El Idrissi",
      livreur: "Karim El Amrani",
      produit: null,
      depot: "Entrepôt Zone Industrielle",
      reception: "Magasin Carrefour",
      statut: "En cours",
      prixTotal: 120,
      commission: 18.00,
    },
    {
      id: "TRF-240331-006",
      date: "31/03/2026",
      heure: "11:15",
      client: "Leila Bouazza",
      livreur: "Youssef Tazi",
      produit: "Fleurs",
      depot: "Fleuriste Royal",
      reception: "Hôtel Royal",
      statut: "Terminé",
      prixTotal: 28,
      commission: 4.20,
    },
    {
      id: "TRF-240331-007",
      date: "31/03/2026",
      heure: "11:50",
      client: "Omar Farid",
      livreur: null,
      produit: "Pièces détachées",
      depot: "Garage Auto Pro",
      reception: "Atelier Mécanique",
      statut: "En attente",
      prixTotal: 85,
      commission: 12.75,
    },
    {
      id: "TRF-240331-008",
      date: "31/03/2026",
      heure: "12:20",
      client: "Nadia El Alaoui",
      livreur: "Salim Berrada",
      produit: "Colis médical",
      depot: "Laboratoire Pasteur",
      reception: "Clinique Privée",
      statut: "Terminé",
      prixTotal: 52,
      commission: 7.80,
    },
    {
      id: "TRF-240331-009",
      date: "31/03/2026",
      heure: "13:05",
      client: "Rachid Benkirane",
      livreur: "Karim El Amrani",
      produit: "Documents",
      depot: "Banque BMCI",
      reception: "Entreprise Atlas",
      statut: "En cours",
      prixTotal: 22,
      commission: 3.30,
    },
    {
      id: "TRF-240331-010",
      date: "31/03/2026",
      heure: "13:45",
      client: "Sofia Rami",
      livreur: "Youssef Tazi",
      produit: "Repas",
      depot: "McDonald’s",
      reception: "Résidence Oasis",
      statut: "Terminé",
      prixTotal: 35,
      commission: 5.25,
    },
    {
      id: "TRF-240331-011",
      date: "31/03/2026",
      heure: "14:10",
      client: "Khalid Moussaoui",
      livreur: null,
      produit: "Colis express",
      depot: "Amazon Locker",
      reception: "Domicile",
      statut: "En attente",
      prixTotal: 48,
      commission: 7.20,
    },
    {
      id: "TRF-240331-012",
      date: "31/03/2026",
      heure: "14:55",
      client: "Meryem Saidi",
      livreur: "Salim Berrada",
      produit: "Fleurs",
      depot: "Fleuriste Royal",
      reception: "Hôtel Sofitel",
      statut: "Terminé",
      prixTotal: 31,
      commission: 4.65,
    },
    {
      id: "TRF-240331-013",
      date: "31/03/2026",
      heure: "15:30",
      client: "Yassin El Fassi",
      livreur: "Karim El Amrani",
      produit: null,
      depot: "Entrepôt Logistique",
      reception: "Supermarché Marjane",
      statut: "En cours",
      prixTotal: 95,
      commission: 14.25,
    },
    {
      id: "TRF-240331-014",
      date: "31/03/2026",
      heure: "16:05",
      client: "Imane Tazi",
      livreur: "Youssef Tazi",
      produit: "Documents juridiques",
      depot: "Tribunal",
      reception: "Avocat El Hammouti",
      statut: "Terminé",
      prixTotal: 27,
      commission: 4.05,
    },
    {
      id: "TRF-240331-015",
      date: "31/03/2026",
      heure: "16:40",
      client: "Bilal Amrani",
      livreur: null,
      produit: "Colis médical",
      depot: "Pharmacie de Garde",
      reception: "Domicile patient",
      statut: "En attente",
      prixTotal: 40,
      commission: 6.00,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Recherche intelligente (cherche dans tous les champs)
  const filteredTraffic = useMemo(() => {
    if (!searchTerm.trim()) return allTraffic;

    const term = searchTerm.toLowerCase().trim();

    return allTraffic.filter((item) => {
      return (
        item.id.toLowerCase().includes(term) ||
        item.client.toLowerCase().includes(term) ||
        (item.livreur && item.livreur.toLowerCase().includes(term)) ||
        (item.produit && item.produit.toLowerCase().includes(term)) ||
        item.depot.toLowerCase().includes(term) ||
        item.reception.toLowerCase().includes(term) ||
        item.statut.toLowerCase().includes(term) ||
        item.heure.includes(term)
      );
    });
  }, [allTraffic, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredTraffic.length / itemsPerPage);
  const paginatedTraffic = filteredTraffic.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Réinitialiser la page quand on recherche
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "Terminé":
        return <Badge className="bg-green-100 text-green-700">Terminé</Badge>;
      case "En cours":
        return <Badge className="bg-blue-100 text-blue-700">En cours</Badge>;
      case "En attente":
        return <Badge variant="secondary">En attente</Badge>;
      case "Annulé":
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-bleu-fonce">Traffic Aujourd’hui</h1>
          <p className="text-gray-500 text-sm">
            {allTraffic.length} livraisons • 31 mars 2026
          </p>
        </div>
      </div>

      {/* Barre de recherche intelligente */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Rechercher par référence, client, livreur, produit, dépôt, réception..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Heure</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Livreur</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Dépôt</TableHead>
              <TableHead>Réception</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Prix total</TableHead>
              <TableHead className="text-right">Commission</TableHead>
              <TableHead className="text-right w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTraffic.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.heure}</TableCell>
                <TableCell>
                  <span className="text-xs font-mono text-gray-500">{item.id}</span>
                </TableCell>
                <TableCell className="font-medium">{item.client}</TableCell>
                <TableCell>
                  {item.livreur ? (
                    <span>{item.livreur}</span>
                  ) : (
                    <span className="text-gray-400 text-sm">— Non assigné</span>
                  )}
                </TableCell>
                <TableCell>
                  {item.produit ? (
                    <span className="text-sm">{item.produit}</span>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600">{item.depot}</TableCell>
                <TableCell className="text-sm text-gray-600">{item.reception}</TableCell>
                <TableCell>{getStatusBadge(item.statut)}</TableCell>
                <TableCell className="text-right font-semibold">
                  {item.prixTotal} €
                </TableCell>
                <TableCell className="text-right text-emerald-600 font-medium">
                  {item.commission} €
                </TableCell>
                <TableCell className="text-right">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-6 py-4 bg-gray-50">
            <p className="text-sm text-gray-600">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
              {Math.min(currentPage * itemsPerPage, filteredTraffic.length)} sur{" "}
              {filteredTraffic.length} livraisons
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="px-4 py-1 text-sm font-medium">
                Page {currentPage} / {totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {filteredTraffic.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            Aucun trajet trouvé pour cette recherche
          </div>
        )}
      </div>
    </div>
  );
}