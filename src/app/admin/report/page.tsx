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
  Eye,
  MessageSquare,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Report {
  id: string;
  date: string;
  heure: string;
  sujet: "Du site" | "D'un livreur" | "D'un client";
  utilisateur: string;
  cible?: string; // Nom du livreur ou client signalé
  motif: string;
  description: string;
  statut: "En attente" | "En cours" | "Résolu" | "Rejeté";
  priorite: "Haute" | "Moyenne" | "Basse";
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "site" | "driver" | "client">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // 30 signalements statiques (les plus récents en haut)
  const [reports] = useState<Report[]>([
    { id: "REP-030", date: "31/03/2026", heure: "16:45", sujet: "D'un livreur", utilisateur: "Fatima Zahra", cible: "Karim El Amrani", motif: "Comportement inapproprié", description: "Le livreur a été agressif et a refusé de prendre le colis.", statut: "En attente", priorite: "Haute" },
    { id: "REP-029", date: "31/03/2026", heure: "15:20", sujet: "Du site", utilisateur: "Ahmed Benali", cible: undefined, motif: "Bug technique", description: "Impossible de suivre ma commande en temps réel.", statut: "En cours", priorite: "Moyenne" },
    { id: "REP-028", date: "31/03/2026", heure: "14:10", sujet: "D'un client", utilisateur: "Mohamed Kamel", cible: "Leila Bouazza", motif: "Annulation abusive", description: "Le client annule systématiquement après que le livreur soit arrivé.", statut: "En attente", priorite: "Haute" },
    { id: "REP-027", date: "30/03/2026", heure: "18:55", sujet: "Du site", utilisateur: "Aicha Amrani", cible: undefined, motif: "Problème de paiement", description: "Paiement débité mais commande non enregistrée.", statut: "Résolu", priorite: "Moyenne" },
    { id: "REP-026", date: "30/03/2026", heure: "17:30", sujet: "D'un livreur", utilisateur: "Youssef Tazi", cible: "Salim Berrada", motif: "Retard important", description: "Plus de 45 minutes de retard sans justification.", statut: "En attente", priorite: "Haute" },
    // ... Je complète jusqu'à 30 pour avoir une bonne quantité
    { id: "REP-025", date: "30/03/2026", heure: "16:05", sujet: "D'un client", utilisateur: "Nadia El Alaoui", cible: "Omar Farid", motif: "Insulte", description: "Le client m'a insulté par message.", statut: "En cours", priorite: "Haute" },
    { id: "REP-024", date: "29/03/2026", heure: "19:40", sujet: "Du site", utilisateur: "Rachid Benkirane", cible: undefined, motif: "Interface lente", description: "L'application est très lente sur mobile.", statut: "En attente", priorite: "Moyenne" },
    { id: "REP-023", date: "29/03/2026", heure: "12:15", sujet: "D'un livreur", utilisateur: "Sofia Rami", cible: "Yassin El Fassi", motif: "Colis endommagé", description: "Le colis est arrivé ouvert et abîmé.", statut: "En attente", priorite: "Haute" },
    { id: "REP-022", date: "28/03/2026", heure: "21:30", sujet: "D'un client", utilisateur: "Khalid Moussaoui", cible: "Meryem Saidi", motif: "Non paiement", description: "Client refuse de payer à la livraison.", statut: "Résolu", priorite: "Moyenne" },
    { id: "REP-021", date: "28/03/2026", heure: "10:50", sujet: "Du site", utilisateur: "Imane Tazi", cible: undefined, motif: "Erreur d'adresse", description: "L'adresse est mal affichée sur la carte.", statut: "En cours", priorite: "Basse" },
    
    // Complément pour arriver à 30
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `REP-${String(20 - i).padStart(3, '0')}`,
      date: `2${Math.floor(Math.random()*3)}/03/2026`,
      heure: `${10 + Math.floor(Math.random()*8)}:${Math.floor(Math.random()*50)}`,
      sujet: ["Du site", "D'un livreur", "D'un client"][Math.floor(Math.random()*3)] as any,
      utilisateur: ["Ahmed Benali", "Fatima Zahra", "Mohamed Kamel", "Aicha Amrani", "Youssef Tazi", "Leila Bouazza", "Omar Farid", "Nadia El Alaoui", "Rachid Benkirane", "Sofia Rami"][Math.floor(Math.random()*10)],
      cible: Math.random() > 0.4 ? ["Karim El Amrani", "Salim Berrada", "Yassin El Fassi", "Meryem Saidi"][Math.floor(Math.random()*4)] : undefined,
      motif: ["Retard", "Comportement", "Bug", "Insulte", "Colis endommagé", "Annulation abusive"][Math.floor(Math.random()*6)],
      description: "Signalement détaillé concernant cette affaire.",
      statut: ["En attente", "En cours", "Résolu", "Rejeté"][Math.floor(Math.random()*4)] as any,
      priorite: ["Haute", "Moyenne", "Basse"][Math.floor(Math.random()*3)] as any,
    })),
  ].sort((a, b) => new Date(b.date + " " + b.heure).getTime() - new Date(a.date + " " + a.heure).getTime()))

  const filteredReports = useMemo(() => {
    let result = [...reports];

    if (activeTab === "site") result = result.filter(r => r.sujet === "Du site");
    if (activeTab === "driver") result = result.filter(r => r.sujet === "D'un livreur");
    if (activeTab === "client") result = result.filter(r => r.sujet === "D'un client");

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(r =>
        r.id.toLowerCase().includes(term) ||
        r.utilisateur.toLowerCase().includes(term) ||
        (r.cible && r.cible.toLowerCase().includes(term)) ||
        r.motif.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term)
      );
    }

    return result;
  }, [reports, activeTab, searchTerm]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPriorityBadge = (priorite: string) => {
    if (priorite === "Haute") return <Badge variant="destructive">Haute</Badge>;
    if (priorite === "Moyenne") return <Badge className="bg-orange-100 text-orange-700">Moyenne</Badge>;
    return <Badge variant="secondary">Basse</Badge>;
  };

  const getStatusBadge = (statut: string) => {
    if (statut === "Résolu") return <Badge className="bg-emerald-100 text-emerald-700">Résolu</Badge>;
    if (statut === "Rejeté") return <Badge variant="destructive">Rejeté</Badge>;
    if (statut === "En cours") return <Badge className="bg-blue-100 text-blue-700">En cours</Badge>;
    return <Badge className="bg-amber-100 text-amber-700">En attente</Badge>;
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-orange-800">Gestion des Signalements</h1>
          <p className="text-gray-500">Retours et plaintes des utilisateurs</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as any); setCurrentPage(1); }}>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
          <TabsList>
            <TabsTrigger value="all">Tous les signalements</TabsTrigger>
            <TabsTrigger value="site">Du site</TabsTrigger>
            <TabsTrigger value="driver">D'un livreur</TabsTrigger>
            <TabsTrigger value="client">D'un client</TabsTrigger>
          </TabsList>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par ID, utilisateur, motif..."
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
                  <TableHead>ID</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Signalé par</TableHead>
                  <TableHead>Cible</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-mono text-sm font-medium">{report.id}</TableCell>
                    <TableCell>
                      <div>{report.date}</div>
                      <div className="text-xs text-gray-500">{report.heure}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {report.sujet}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{report.utilisateur}</TableCell>
                    <TableCell>
                      {report.cible ? report.cible : <span className="text-gray-400">—</span>}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{report.motif}</TableCell>
                    <TableCell>{getPriorityBadge(report.priorite)}</TableCell>
                    <TableCell>{getStatusBadge(report.statut)}</TableCell>
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
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Répondre
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-emerald-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Marquer comme vérifié
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {paginatedReports.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                Aucun signalement trouvé pour ce filtre.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-2">
              <p className="text-sm text-gray-600">
                Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
                {Math.min(currentPage * itemsPerPage, filteredReports.length)} sur{" "}
                {filteredReports.length} signalements
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <div className="px-4 py-2 bg-orange-50 text-orange-900 rounded-lg font-medium">
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