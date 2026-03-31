'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/sonner';
import { RegisterData,UseRegisterReturn } from '@/types';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';



export function useRegister(): UseRegisterReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (formData: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Préparation du payload (même logique que ton service NestJS)
      const payload: any = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        identifiant: formData.identifiant.trim().toLowerCase(),
        telephone: formData.telephone.trim(),
        password: formData.password,
        roleId: formData.roleId,
      };

      if (formData.email?.trim()) {
        payload.email = formData.email.trim().toLowerCase();
      }

      if (formData.genre) {
        payload.genre = formData.genre;
      }

      // Champs obligatoires chauffeur
      if (formData.roleId === 2) {
        if (!formData.vehicleType || !formData.zone?.trim()) {
          throw new Error('Pour un chauffeur : type de véhicule et zone sont obligatoires');
        }
        payload.vehicleType = formData.vehicleType;
        payload.zone = formData.zone.trim();
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // important pour recevoir refresh_token si ton backend le pose
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        // Gestion fine des erreurs courantes du backend
        if (response.status === 409) {
          throw new Error(data.message || 'Identifiant, email ou téléphone déjà utilisé');
        }
        if (response.status === 400) {
          throw new Error(data.message || 'Données invalides – vérifiez les champs');
        }

        throw new Error(data.message || 'Échec de l’inscription');
      }

      // Succès
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      router.push('/login?registered=true');
      router.refresh(); // force re-validation des server components / middleware

    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue lors de l’inscription.';
      setError(errorMessage);
      toast.error(errorMessage);
      // console.error('[Register error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}