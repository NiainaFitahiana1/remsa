'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUser } from '@/lib/auth/use-current-user';
import { toast } from '@/components/ui/sonner';

export default function GoogleSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, error } = useCurrentUser();

  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');

    if (errorParam) {
      toast.error("Échec de la connexion avec Google");
      router.replace('/login');
      return;
    }

    // Si on a une erreur dans le hook
    if (error) {
      console.error("Erreur useCurrentUser:", error);
      toast.error("Impossible de récupérer vos informations");
      router.replace('/login');
      return;
    }

    // Redirection quand l'utilisateur est chargé
    if (!loading && user && !hasRedirected) {
      setHasRedirected(true);   // évite les redirections multiples

      toast.success(`Bienvenue ${user.prenom || user.nom || ''} !`);

      const redirectPath = 
        user.role === 'DRIVER' ? '/livreur' :
        (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') ? '/admin' :
        '/dashboard';

      console.log(`🔄 Redirection vers : ${redirectPath} (rôle: ${user.role})`);

      // Utilise replace au lieu de push pour éviter d'ajouter dans l'historique
      router.replace(redirectPath);
    }
  }, [user, loading, error, router, searchParams, hasRedirected]);

  // Option : timeout de sécurité (au cas où le fetch bloque)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasRedirected) {
        console.warn("Timeout - redirection forcée vers /dashboard");
        router.replace('/dashboard');
      }
    }, 4000); // 4 secondes max

    return () => clearTimeout(timeout);
  }, [hasRedirected, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <p className="text-lg font-medium">Connexion avec Google en cours...</p>
        <p className="text-sm text-slate-500 mt-2">Veuillez patienter quelques instants</p>
      </div>
    </div>
  );
}