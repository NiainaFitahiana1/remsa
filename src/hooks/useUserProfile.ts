'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type UserProfile = {
  id: string;
  nom: string;
  prenom: string;
  role: string;
};

export function useUserProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push("/login");
            return;
          }
          throw new Error("Impossible de charger le profil");
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  return { profile, loading, error };
}