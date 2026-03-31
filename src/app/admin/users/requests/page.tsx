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
  CheckCircle,
  XCircle,
  MoreHorizontal,
  FileText,
  UserCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VerificationRequest {
  id: string;
  date: string;
  utilisateur: string;
  prenom: string;
  role: "DRIVER" | "COMPANY";
  type: "Chauffeur Individuel" | "Société";
  documents: string[]; // Liste des documents soumis
  statut: "En attente" | "En cours" | "Approuvé" | "Rejeté";
  priorite: "Haute" | "Moyenne";
}

export default function UserVerificationPage() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // 25 demandes de vérification (statiques)
  const [requests] = useState<VerificationRequest[]>([
    {
      id: "VER-001",
      date: "31/03/2026",
      utilisateur: "Karim El Amrani",
      prenom: "Karim",
      role: "DRIVER",
      type: "Chauffeur Individuel",
      documents: ["Permis de conduire", "Carte grise", "Assurance véhicule", "Photo véhicule"],
      statut: "En attente",
      priorite: "Haute"
    },
    {
      id: "VER-002",
      date: "31/03/2026",
      utilisateur: "Transport Express SARL",
      prenom: "",
      role: "COMPANY",
      type: "Société",
      documents: ["Registre de commerce", "Attestation fiscale", "Assurance flotte", "Contrat siège social"],
      statut: "En attente",
      priorite: "Haute"
    },
    {
      id: "VER-003",
      date: "30/03/2026",
      utilisateur: "Youssef Tazi",
      prenom: "Youssef",
      role: "DRIVER",
      type: "Chauffeur Individuel",
      documents: ["Permis de conduire", "Carte grise", "Certificat médical"],
      statut: "En cours",
      priorite: "Moyenne"
    },
    {
      id: "VER-004",
      date: "30/03/2026",
      utilisateur: "Salim Berrada",
      prenom: "Salim",
      role: "DRIVER",
      type: "Chauffeur Individuel",
      documents: ["Permis de conduire", "Carte grise", "Assurance", "Photo véhicule", "Extrait casier judiciaire"],
      statut: "En attente",
      priorite: "Haute"
    },
    {
      id: "VER-005",
      date: "29/03/2026",
      utilisateur: "Logistique Pro SARL",
      prenom: "",
      role: "COMPANY",
      type: "Société",
      documents: ["Registre de commerce", "Attestation CNSS", "Assurance flotte", "Liste des véhicules"],
      statut: "Approuvé",
      priorite: "Moyenne"
    },
    {
      id: "VER-006",
      date: "29/03/2026",
      utilisateur: "Ahmed Benali",
      prenom: "Ahmed",
      role: "DRIVER",
      type: "Chauffeur Individuel",
      documents: ["Permis de conduire", "Carte grise"],
      statut: "Rejeté",
      priorite: "Moyenne"
    },
    ...Array.from({ length: 19 }, (_, i) => ({
      id: `VER-${String(7 + i).padStart(3, '0')}`, // <-- correction ici
      date: `${28 - Math.floor(i/3)}/03/2026`,
      utilisateur: ["Mohamed Kamel", "Fatima Zahra", "Aicha Amrani", "Omar Farid", "Nadia El Alaoui", "Rachid Benkirane", "Sofia Rami", "Meryem Saidi", "Yassin El Fassi", "Imane Tazi"][i % 10],
      prenom: ["Mohamed", "Fatima", "Aicha", "Omar", "Nadia", "Rachid", "Sofia", "Meryem", "Yassin", "Imane"][i % 10],
      role: i % 3 === 0 ? "COMPANY" : "DRIVER" as any,
      type: i % 3 === 0 ? "Société" : "Chauffeur Individuel" as any,
      documents: i % 2 === 0 
        ? ["Permis de conduire", "Carte grise", "Assurance véhicule", "Photo véhicule"]
        : ["Registre de commerce", "Attestation fiscale", "Assurance flotte"],
      statut: ["En attente", "En cours", "Approuvé", "Rejeté"][Math.floor(Math.random() * 4)] as any,
      priorite: Math.random() > 0.6 ? "Haute" : "Moyenne" as any,
    })),
  ].sort((a, b) => b.id.localeCompare(a.id))) // Tri par ID décroissant (plus récent en haut)

  const filteredRequests = useMemo(() => {
    let result = [...requests];

    if (activeTab === "pending") result = result.filter(r => r.statut === "En attente");
    if (activeTab === "approved") result = result.filter(r => r.statut === "Approuvé");
    if (activeTab === "rejected") result = result.filter(r => r.statut === "Rejeté");

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(r =>
        r.id.toLowerCase().includes(term) ||
        r.utilisateur.toLowerCase().includes(term) ||
        r.type.toLowerCase().includes(term) ||
        r.documents.some(doc => doc.toLowerCase().includes(term))
      );
    }

    return result;
  }, [requests, activeTab, searchTerm]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (statut: string) => {
    if (statut === "Approuvé") return <Badge className="bg-emerald-100 text-emerald-700">Approuvé</Badge>;
    if (statut === "Rejeté") return <Badge variant="destructive">Rejeté</Badge>;
    if (statut === "En cours") return <Badge className="bg-blue-100 text-blue-700">En cours</Badge>;
    return <Badge className="bg-amber-100 text-amber-700">En attente</Badge>;
  };

  const handleApprove = (id: string) => {
    alert(`Demande ${id} approuvée avec succès !`);
  };

  const handleReject = (id: string) => {
    if (confirm(`Rejeter la demande ${id} ?`)) {
      alert(`Demande ${id} rejetée.`);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-orange-800">Validation des Utilisateurs</h1>
          <p className="text-gray-500">Vérification des documents des chauffeurs et sociétés</p>
        </div>
        <Button className="bg-orange-700 hover:bg-orange-800">
          <UserCheck className="w-4 h-4 mr-2" />
          Nouvelle vérification manuelle
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as any); setCurrentPage(1); }}>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
          <TabsList>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="all">Toutes les demandes</TabsTrigger>
            <TabsTrigger value="approved">Approuvées</TabsTrigger>
            <TabsTrigger value="rejected">Rejetées</TabsTrigger>
          </TabsList>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, ID ou document..."
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
                  <TableHead>Date</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Documents soumis</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono font-medium">{req.id}</TableCell>
                    <TableCell>{req.date}</TableCell>
                    
                    <TableCell>
                      <div className="font-medium">{req.utilisateur}</div>
                      <div className="text-xs text-gray-500">
                        {req.role === "DRIVER" ? "Chauffeur Individuel" : "Société"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{req.type}</Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {req.documents.slice(0, 3).map((doc, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {doc}
                          </Badge>
                        ))}
                        {req.documents.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{req.documents.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(req.statut)}</TableCell>

                    <TableCell className="text-right">
                      {req.statut === "En attente" || req.statut === "En cours" ? (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(req.id)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(req.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeter
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
                              Voir documents
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Télécharger dossier complet
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
                Aucune demande de vérification trouvée.
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