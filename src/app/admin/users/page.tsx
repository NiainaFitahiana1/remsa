"use client";

import { useState, useEffect, useMemo } from "react";
import { useCurrentUser } from "@/lib/auth/use-current-user";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Eye, Edit, Trash2, UserCheck, UserX, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function UserManagementPage() {
  const { user, loading: userLoading, error: userError } = useCurrentUser();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "client" | "driver">("all");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users/all", {
        credentials: "include",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Session expirée. Veuillez vous reconnecter.");
        if (res.status === 403) throw new Error("Vous n'avez pas les droits d'accès à cette page.");
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erreur lors du chargement des utilisateurs");
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.data || []);
      setCurrentPage(1); // Réinitialiser à la première page après chargement
    } catch (err: any) {
      setError(err.message || "Erreur inattendue");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  // Filtrage intelligent + pagination
  const processedUsers = useMemo(() => {
    let result = [...users];

    // Filtre par onglet
    if (activeTab === "client") {
      result = result.filter((u) => u.role?.name === "CLIENT" || u.role === "CLIENT");
    } else if (activeTab === "driver") {
      result = result.filter((u) => u.role?.name === "DRIVER" || u.role === "DRIVER");
    }

    // Recherche intelligente (multi-champs)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((u) => {
        const fullName = `${u.prenom || ""} ${u.nom || ""}`.toLowerCase();
        return (
          fullName.includes(term) ||
          (u.email && u.email.toLowerCase().includes(term)) ||
          (u.telephone && u.telephone.includes(term)) ||
          (u.identifiant && u.identifiant.toLowerCase().includes(term)) ||
          (u.role?.name && u.role.name.toLowerCase().includes(term)) ||
          (typeof u.role === "string" && u.role.toLowerCase().includes(term))
        );
      });
    }

    return result;
  }, [users, activeTab, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(processedUsers.length / itemsPerPage);
  const paginatedUsers = processedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Réinitialiser la page quand on change d'onglet ou de recherche
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const handleAction = async (action: string, userId: number) => {
    // ... ton code existant (inchangé)
    if (action === "toggleActive") {
      const currentUser = users.find(u => u.id === userId);
      if (!currentUser) return;

      if (!confirm(`Voulez-vous vraiment ${currentUser.isActive ? "désactiver" : "activer"} cet utilisateur ?`)) return;

      try {
        const res = await fetch(`/api/users/${userId}/status`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !currentUser.isActive }),
        });

        if (res.ok) {
          alert("Statut mis à jour avec succès");
          fetchUsers();
        } else {
          const err = await res.json();
          alert(err.message || "Erreur lors du changement de statut");
        }
      } catch (err) {
        alert("Erreur de connexion");
      }
    } else if (action === "approve") {
      alert(`Approbation du chauffeur ID ${userId} (fonctionnalité à implémenter)`);
      fetchUsers();
    } else if (action === "delete") {
      if (!confirm("Supprimer cet utilisateur ? Cette action est irréversible.")) return;
      alert(`Suppression de l'utilisateur ID ${userId} (fonctionnalité à implémenter)`);
      fetchUsers();
    }
  };

  if (userLoading) return <div className="p-6">Chargement de l'utilisateur...</div>;
  if (userError || !user) return <div className="p-6 text-red-600">Vous devez être connecté en tant qu'administrateur.</div>;

  return (
    <>
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-bleu-fonce">Gestion des Utilisateurs</h1>
          <Button>Ajouter un utilisateur</Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "client" | "driver")}>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
            <TabsList>
              <TabsTrigger value="all">Tous les utilisateurs</TabsTrigger>
              <TabsTrigger value="client">Clients</TabsTrigger>
              <TabsTrigger value="driver">Chauffeurs</TabsTrigger>
            </TabsList>

            {/* Champ de recherche intelligent */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher par nom, email, téléphone, identifiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">Chargement des utilisateurs...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-600">{error}</div>
              ) : processedUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Aucun utilisateur trouvé pour cette recherche
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Profil Driver</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.map((u) => {
                        const roleName = u.role?.name || u.role;
                        const driverProfile = u.driverProfile;

                        return (
                          <TableRow key={u.id}>
                            <TableCell>
                              <div className="font-medium">
                                {u.prenom} {u.nom}
                              </div>
                              <div className="text-sm text-gray-500">#{u.identifiant}</div>
                            </TableCell>

                            <TableCell>
                              <div>{u.email || "—"}</div>
                              <div className="text-sm text-gray-500">{u.telephone}</div>
                            </TableCell>

                            <TableCell>
                              <Badge variant={roleName === "DRIVER" ? "default" : "secondary"}>
                                {roleName === "DRIVER" ? "Chauffeur" : "Client"}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2">
                                {u.isActive ? (
                                  <Badge className="flex items-center gap-1 bg-green-100 text-green-700">
                                    <UserCheck className="w-3 h-3" /> Actif
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive" className="flex items-center gap-1">
                                    <UserX className="w-3 h-3" /> Inactif
                                  </Badge>
                                )}
                                {u.isVerified && <Badge variant="outline">Vérifié</Badge>}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="font-medium">{u.rating?.toFixed(1) || "—"} ★</div>
                            </TableCell>

                            <TableCell>
                              {driverProfile ? (
                                <div className="text-sm">
                                  <div className="font-medium">{driverProfile.vehicleType}</div>
                                  <div className="text-gray-500">{driverProfile.zone}</div>
                                  {driverProfile.isApproved && (
                                    <Badge variant="outline" className="mt-1 text-emerald-600">Approuvé</Badge>
                                  )}
                                  {driverProfile.isPremium && (
                                    <Badge className="mt-1">Premium</Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </TableCell>

                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem onClick={() => handleAction("view", u.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Voir le profil
                                  </DropdownMenuItem>

                                  <DropdownMenuItem onClick={() => handleAction("edit", u.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier
                                  </DropdownMenuItem>

                                  {roleName === "DRIVER" && driverProfile && !driverProfile.isApproved && (
                                    <DropdownMenuItem
                                      onClick={() => handleAction("approve", u.id)}
                                      className="text-emerald-600"
                                    >
                                      <UserCheck className="mr-2 h-4 w-4" />
                                      Approuver le chauffeur
                                    </DropdownMenuItem>
                                  )}

                                  <DropdownMenuItem onClick={() => handleAction("toggleActive", u.id)}>
                                    {u.isActive ? "Désactiver" : "Activer"} le compte
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem
                                    onClick={() => handleAction("delete", u.id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t px-6 py-4 bg-gray-50">
                      <p className="text-sm text-gray-600">
                        Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
                        {Math.min(currentPage * itemsPerPage, processedUsers.length)} sur{" "}
                        {processedUsers.length} utilisateurs
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="px-4 py-1 text-sm font-medium">
                          Page {currentPage} sur {totalPages}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}