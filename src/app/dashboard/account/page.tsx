"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  id: number;
  nom: string;
  prenom: string;
  identifiant: string;
  email: string | null;
  telephone: string;
  genre: string | null;
  lienFb: string | null;
  role: string;
  rating: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  driverProfile: {
    vehicleType: "MOTO" | "VELO" | "VOITURE";
    zone: string;
    idCardPhoto: string | null;
    selfiePhoto: string | null;
    isApproved: boolean;
    isPremium: boolean;
  } | null;
};

export default function AccountPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [previewImage, setPreviewImage] = useState<string>("/default-avatar.png");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push("/login?redirect=/dashboard/account");
            return;
          }
          throw new Error("Impossible de charger le profil");
        }

        const data = await res.json();
        setProfile(data);

        if (data.driverProfile?.selfiePhoto) {
          setPreviewImage(data.driverProfile.selfiePhoto);
        }
      } catch (err: any) {
        setError(err.message || "Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      if (!prev) return prev;
      if (name.startsWith("driverProfile.")) {
        const field = name.split(".")[1];
        return {
          ...prev,
          driverProfile: prev.driverProfile
            ? { ...prev.driverProfile, [field]: value }
            : null,
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: Partial<Profile> = {
        nom: profile.nom.trim(),
        prenom: profile.prenom.trim(),
        telephone: profile.telephone.trim(),
        genre: profile.genre || undefined,
        lienFb: profile.lienFb || undefined,
      };

      if (profile.driverProfile) {
        payload.driverProfile = {
          vehicleType: profile.driverProfile.vehicleType,
          zone: profile.driverProfile.zone.trim(),
          idCardPhoto: profile.driverProfile.idCardPhoto ?? null,
          selfiePhoto: profile.driverProfile.selfiePhoto ?? null,
          isApproved: profile.driverProfile.isApproved ?? false,
          isPremium: profile.driverProfile.isPremium ?? false,
        };
      }

      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error((await res.json()).message || "Échec mise à jour");

      setSuccess("Profil mis à jour avec succès !");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Chargement du profil...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-red-600">
        Impossible de charger les informations du compte
      </div>
    );
  }

  return (
    <div className="min-h-screen text-secondary pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">
            Gestion du compte
          </h1>
          <p className="mt-2 text-gray-600">
            Modifiez vos informations personnelles, véhicule et préférences
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-8">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl mb-8">
            {success}
          </div>
        )}

        {/* Profil principal */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative shrink-0">
              <div
                className="w-32 h-32 rounded-full bg-center bg-cover border-4 border-primary/20 shadow-md"
                style={{ backgroundImage: `url(${previewImage})` }}
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition shadow-lg"
              >
                <span className="material-symbols-outlined text-xl">photo_camera</span>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setPreviewImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-secondary">
                {profile.prenom} {profile.nom}
              </h2>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full">
                  {profile.role}
                </span>
                {profile.isVerified && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <span className="material-symbols-outlined">check_circle</span>
                    Vérifié
                  </div>
                )}
                {profile.driverProfile?.isApproved && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    Chauffeur approuvé
                  </span>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-gray-500">Note moyenne</p>
                  <p className="font-medium">{profile.rating.toFixed(2)} ★</p>
                </div>
                <div>
                  <p className="text-gray-500">Inscrit le</p>
                  <p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Mis à jour</p>
                  <p className="font-medium">
                    {new Date(profile.updatedAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Informations personnelles */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:p-8">
            <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              Informations personnelles
            </h3>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    name="prenom"
                    value={profile.prenom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    name="nom"
                    value={profile.nom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant</label>
                <input
                  name="identifiant"
                  value={profile.identifiant}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  name="telephone"
                  value={profile.telephone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  value={profile.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                  <select
                    name="genre"
                    value={profile.genre || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                  >
                    <option value="">Non spécifié</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                    <option value="Autre">Autre / Non binaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lien Facebook
                  </label>
                  <input
                    name="lienFb"
                    value={profile.lienFb || ""}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                  />
                </div>
              </div>

              {/* Petit bouton de sauvegarde par section – optionnel */}
              {/* <button className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition">
                Sauvegarder section
              </button> */}
            </div>
          </div>

          {/* Véhicule */}
          {profile.driverProfile && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:p-8">
              <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">directions_car</span>
                Informations chauffeur
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de véhicule
                  </label>
                  <select
                    name="driverProfile.vehicleType"
                    value={profile.driverProfile.vehicleType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                  >
                    <option value="VELO">Vélo / E-bike</option>
                    <option value="MOTO">Moto / Scooter</option>
                    <option value="VOITURE">Voiture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zone principale
                  </label>
                  <input
                    name="driverProfile.zone"
                    value={profile.driverProfile.zone}
                    onChange={handleInputChange}
                    placeholder="ex: Paris Centre, Lyon 69003..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                  <p>Pièces justificatives (non modifiables ici) :</p>
                  <div className="flex flex-wrap gap-6">
                    <div>
                      Carte d'identité :{" "}
                      {profile.driverProfile.idCardPhoto ? (
                        <span className="text-green-600 font-medium">Téléchargée</span>
                      ) : (
                        <span className="text-red-600">Manquante</span>
                      )}
                    </div>
                    <div>
                      Selfie :{" "}
                      {profile.driverProfile.selfiePhoto ? (
                        <span className="text-green-600 font-medium">Téléchargé</span>
                      ) : (
                        <span className="text-red-600">Manquant</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex gap-8 text-sm text-gray-700">
                  <div>Approbation : <span className={profile.driverProfile.isApproved ? "text-green-600 font-medium" : "text-amber-600"}>{profile.driverProfile.isApproved ? "Approuvé" : "En attente"}</span></div>
                  <div>Premium : <span className={profile.driverProfile.isPremium ? "text-purple-600 font-medium" : "text-gray-500"}>{profile.driverProfile.isPremium ? "Actif" : "Non"}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bouton global */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed ${
              saving ? "animate-pulse" : ""
            }`}
          >
            {saving ? "Enregistrement..." : "Enregistrer toutes les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}