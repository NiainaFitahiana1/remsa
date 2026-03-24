"use client";

import { useState } from "react";
import Greeting from "@/components/dashcomponents/Greeting";
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
import { MoreHorizontal, Eye, Edit, Trash2, UserCheck, UserX } from "lucide-react";

export default function UserManagementPage() {
  const { user, loading, error } = useCurrentUser();

  // Données simulées (à remplacer par un fetch réel avec TanStack Query ou SWR)
  const [users] = useState([
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      identifiant: "JDUPONT",
      email: "jean.dupont@email.com",
      telephone: "+225 07 01 23 45 67",
      genre: "Homme",
      role: "DRIVER",
      isActive: true,
      isVerified: true,
      rating: 4.8,
      driverProfile: {
        vehicleType: "MOTO",
        zone: "Abidjan Plateau",
        isApproved: true,
        isPremium: true,
      },
    },
    {
      id: 2,
      nom: "Konaté",
      prenom: "Aïcha",
      identifiant: "AKONATE",
      email: "aicha.konate@email.com",
      telephone: "+225 05 08 99 88 77",
      genre: "Femme",
      role: "CLIENT",
      isActive: true,
      isVerified: true,
      rating: 4.9,
      driverProfile: null,
    },
    {
      id: 3,
      nom: "Traoré",
      prenom: "Mohamed",
      identifiant: "MTRAORE",
      email: null,
      telephone: "+225 01 02 34 56 78",
      genre: "Homme",
      role: "DRIVER",
      isActive: false,
      isVerified: false,
      rating: 3.2,
      driverProfile: {
        vehicleType: "VOITURE",
        zone: "Yopougon",
        isApproved: false,
        isPremium: false,
      },
    },
    // Ajoute d'autres utilisateurs ici...
  ]);

  const handleAction = (action: string, userId: number) => {
    console.log(`Action "${action}" sur l'utilisateur ID: ${userId}`);
    // Ici tu mettras tes mutations (suspendre, supprimer, approuver, etc.)
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error || !user) return <div className="p-6">Vous devez être connecté</div>;

  return (
    <>
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-bleu-fonce">Gestion des Utilisateurs</h1>
          <Button>Ajouter un utilisateur</Button>
        </div>

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Rating</TableHead>
                {users.some(u => u.role === "DRIVER") && <TableHead>Profil Driver</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
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
                    <Badge variant={u.role === "DRIVER" ? "default" : "secondary"}>
                      {u.role === "DRIVER" ? "Chauffeur" : "Client"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {u.isActive ? (
                        <Badge className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> Actif
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <UserX className="w-3 h-3" /> Inactif
                        </Badge>
                      )}
                      {u.isVerified && (
                        <Badge variant="outline">Vérifié</Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-medium">{u.rating.toFixed(1)} ★</div>
                  </TableCell>

                  {u.driverProfile && (
                    <TableCell>
                      <div className="text-sm">
                        <div>{u.driverProfile.vehicleType}</div>
                        <div className="text-gray-500">{u.driverProfile.zone}</div>
                        {u.driverProfile.isPremium && (
                          <Badge className="mt-1">Premium</Badge>
                        )}
                      </div>
                    </TableCell>
                  )}

                  {!u.driverProfile && <TableCell className="text-gray-400">—</TableCell>}

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

                        {u.role === "DRIVER" && !u.driverProfile?.isApproved && (
                          <DropdownMenuItem
                            onClick={() => handleAction("approve", u.id)}
                            className="text-emerald-600"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Approuver le chauffeur
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                          onClick={() => handleAction("toggleActive", u.id)}
                        >
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}