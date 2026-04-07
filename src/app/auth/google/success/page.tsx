'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUser } from '@/lib/auth/use-current-user';
import { toast } from '@/components/ui/sonner';

// 1. On crée un composant interne pour utiliser useSearchParams()
function GoogleSuccessHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, error } = useCurrentUser();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');

    // Gestion de l'erreur via URL
    if (errorParam) {
      toast.error("Échec de la connexion avec Google");
      router.replace('/login');
      return;
    }

    // Gestion de l'erreur via le hook d'auth
    if (error) {
      console.error("Erreur useCurrentUser:", error);
      toast.error("Impossible de récupérer vos informations");
      router.replace('/login');
      return;
    }

    // Logique de redirection basée sur l'utilisateur chargé
    if (!loading && user && !hasRedirected) {
      setHasRedirected(true);

      const firstName = user.prenom || "";
      toast.success(`Bienvenue ${firstName} !`);

      // Correction du type Role (objet vs string)
      const roleName = typeof user.role === 'object' 
        ? (user.role as any).name 
        : user.role;

      const redirectPath = 
        roleName === 'DRIVER' ? '/livreur' :
        (roleName === 'ADMIN' || roleName === 'SUPER_ADMIN') ? '/admin' :
        '/dashboard';

      console.log(`🔄 Redirection vers : ${redirectPath} (rôle détecté: ${roleName})`);
      router.replace(redirectPath);
    }
  }, [user, loading, error, router, searchParams, hasRedirected]);

  // Timeout de sécurité
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasRedirected && !loading && !user) {
        console.warn("Timeout - redirection forcée");
        router.replace('/login');
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [hasRedirected, loading, user, router]);

  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
      <p className="text-lg font-medium text-slate-900 dark:text-white">Connexion réussie !</p>
      <p className="text-sm text-slate-500 mt-2">Finalisation de votre session en cours...</p>
    </div>
  );
}

export default function GoogleSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <Suspense fallback={
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary mx-auto" />
          <p className="mt-4 text-slate-500">Chargement...</p>
        </div>
      }>
        <GoogleSuccessHandler />
      </Suspense>
    </div>
  );
}