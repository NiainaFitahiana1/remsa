"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, User, Lock, Eye, EyeOff, Heart } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function LoginPage() {
  const [identifiant, setIdentifiant] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      identifiant,
      password,
      redirect: false,
    });

    if (res?.ok) {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const roleId = session?.user?.roleId;

        if (roleId === 3) {
          toast.success("Connexion réussie !", {
            description: "Bienvenue dans l'administration",
          });
          router.push("/dashboard");
        } else if (roleId === 2) {
          toast.success("Ravi de vous revoir !", {
            description: "Accès à l'espace professionnel",
          });
          router.push("/manager");
        } else {
          toast.success("Connecté avec succès !", {
            description: "Bienvenue dans votre espace membre",
          });
          router.push("/member");
        }
      } catch (error) {
        toast.error("Erreur interne", {
          description: "Impossible de récupérer vos informations de session.",
        });
      }
    } else if (res?.error) {
      if (res.error === "CredentialsSignin") {
        toast.error("Identifiants incorrects", {
          description: "Vérifiez votre identifiant et mot de passe.",
        });
      } else {
        toast.error("Connexion refusée", {
          description: res.error || "Une erreur est survenue",
        });
      }
    } else {
      toast.error("Erreur de connexion", {
        description: "Impossible de contacter le serveur. Réessayez.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-display bg-background-light">
      {/* Arrière-plan avec la photo du hero (groupe joyeux) */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://media.istockphoto.com/id/1076518194/photo/happy-diverse-people-together-in-the-park.jpg?s=612x612&w=0&k=20&c=scEC4yKcNoXwspkmi22rwHf5Pf352v2pKJIsX42OIkc="
          alt="Groupe diversifié joyeux en extérieur"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background-light/80 to-background-light" />
      </div>

      <div className="min-h-screen flex items-center justify-center px-6">
        {/* Card avec ombre décalée + badge décoratif */}
        <div className="relative w-full max-w-md">
          {/* Ombre décalée noire */}
          <div className="absolute inset-0 bg-neutral-dark translate-x-2 translate-y-2 rounded" />

          {/* Card principale */}
          <div className="relative bg-white border-2 border-neutral-dark rounded overflow-hidden shadow-[8px_8px_0px_0px_rgba(27,24,14,1)]">
            {/* Badge décoratif */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary rounded-full flex items-center justify-center border-2 border-neutral-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
              <Heart className="h-10 w-10 text-neutral-dark" />
            </div>

            <div className="p-8 pt-12 text-center">
              <h1 className="text-4xl font-bold uppercase tracking-tight text-neutral-dark mb-2">
                Connexion
              </h1>
              <p className="text-neutral-dark/70 mb-8">
                Entrez vos identifiants pour accéder à votre espace Mini-Assoc
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Identifiant */}
                <div className="relative">
                  <User className="absolute left-3 top-4 h-6 w-6 text-neutral-dark" />
                  <input
                    type="text"
                    placeholder="Identifiant"
                    value={identifiant}
                    onChange={(e) => setIdentifiant(e.target.value)}
                    disabled={isLoading}
                    required
                    autoFocus
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-2 border-neutral-dark rounded text-neutral-dark placeholder-neutral-dark/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Mot de passe avec toggle eye */}
                <div className="relative">
                  <Lock className="absolute left-3 top-4 h-6 w-6 text-neutral-dark" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-transparent border-2 border-neutral-dark rounded text-neutral-dark placeholder-neutral-dark/50 focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-4 text-neutral-dark hover:text-primary transition-colors"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-6 w-6" />
                    ) : (
                      <Eye className="h-6 w-6" />
                    )}
                  </button>
                </div>

                {/* Bouton submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-primary text-neutral-dark font-bold uppercase tracking-wider rounded hover:bg-neutral-dark hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(27,24,14,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </form>

              <p className="mt-8 text-sm text-neutral-dark/70">
                Mot de passe oublié ?{" "}
                <a href="/recuperer" className="font-bold text-primary hover:underline">
                  Recuperer compte
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}