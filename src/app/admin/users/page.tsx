"use client";

import { useState, useEffect } from "react";
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
import { MoreHorizontal, Eye, Edit, Trash2, UserCheck, UserX } from "lucide-react";

export default function UserManagementPage() {
  const { user, loading: userLoading, error: userError } = useCurrentUser();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "client" | "driver">("all");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users/all", {
        credentials: "include",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Session expirée. Veuillez vous reconnecter.");
        if (res.status === 403) throw new Error("Vous n'avez pas les droits d'accès à cette page.");
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erreur lors du chargement des utilisateurs");
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.data || []);
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

  const filteredUsers = users.filter((u) => {
    if (activeTab === "client") return u.role?.name === "CLIENT" || u.role === "CLIENT";
    if (activeTab === "driver") return u.role?.name === "DRIVER" || u.role === "DRIVER";
    return true;
  });

  const handleAction = async (action: string, userId: number) => {
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
    } 
    else if (action === "approve") {
      alert(`Approbation du chauffeur ID ${userId} (fonctionnalité à implémenter)`);
      fetchUsers();
    } 
    else if (action === "delete") {
      if (!confirm("Supprimer cet utilisateur ? Cette action est irréversible.")) return;
      alert(`Suppression de l'utilisateur ID ${userId} (fonctionnalité à implémenter)`);
      fetchUsers();
    } 
    else {
      console.log(`Action "${action}" sur l'utilisateur ID: ${userId}`);
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
          <TabsList className="mb-6">
            <TabsTrigger value="all">Tous les utilisateurs</TabsTrigger>
            <TabsTrigger value="client">Clients</TabsTrigger>
            <TabsTrigger value="driver">Chauffeurs</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">Chargement des utilisateurs...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-600">{error}</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Aucun utilisateur trouvé</div>
              ) : (
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
                    {filteredUsers.map((u) => {
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
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}