'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/homecomponents/ui/Input';
import { PasswordInput } from '@/components/homecomponents/ui/PasswordInput';
import { Button } from '@/components/homecomponents/ui/Button';
import { Select } from '../ui/Select';
import Image from 'next/image';
import logo from '@/../public/logos/logo-text.png';
import { useRegister } from '@/hooks/useRegister'; 
import type { RegisterFormData } from '@/types';

export const RegisterForm = () => {
  const router = useRouter();
  const { register, isLoading, error } = useRegister();

  const [step, setStep] = useState<1 | 2>(1);
  const [errorTemp, setErrorTemp] = useState<string | null>(null);

  const [formData, setFormData] = useState<RegisterFormData>({
    nom: '',
    prenom: '',
    identifiant: '', 
    email: '',
    telephone: '',
    password: '',
    genre: undefined,
    roleId: 1,
    vehicleType: undefined,
    zone: undefined,
  });

  // Aperçu dynamique pour l'utilisateur
  const visualIdentifier = formData.nom 
    ? `@${formData.roleId === 2 ? 'liv' : 'client'}#..._${formData.nom.trim().toLowerCase().replace(/\s+/g, '_')}`
    : "En attente du nom...";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setErrorTemp(null);
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prenom.trim()) return setErrorTemp('Le prénom est requis');
    if (!formData.nom.trim()) return setErrorTemp('Le nom est requis');
    if (!formData.email?.trim()) return setErrorTemp('L’email est requis');
    if (!formData.telephone.trim()) return setErrorTemp('Le téléphone est requis');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.password) return setErrorTemp('Le mot de passe est requis');
    
    if (formData.roleId === 2) {
      if (!formData.vehicleType) return setErrorTemp('Le type de véhicule est requis');
      if (!formData.zone?.trim()) return setErrorTemp('La zone est requise');
    }

    // On envoie une valeur provisoire pour satisfaire le DTO côté NestJS
    await register({
      ...formData,
      identifiant: "TEMP_AUTO_GEN", 
    });
  };

  const isChauffeur = formData.roleId === 2;

  return (
    <div className="w-full max-w-[440px] rounded border border-slate-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-8 flex items-center justify-center gap-5">
        <Image
          src={logo}
          alt="e-kalité.mg"
          width={200}
          height={90}
          className="object-cover h-20 -ml-1"
          priority
        />
      </div>

      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prénom"
              id="prenom"
              name="prenom"
              placeholder="Votre prénom"
              value={formData.prenom}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <Input
              label="Nom"
              id="nom"
              name="nom"
              placeholder="Votre nom"
              value={formData.nom}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <Input
            label="Email"
            type="email"
            id="email"
            name="email"
            placeholder="exemple@domaine.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          <Input
            label="Téléphone"
            id="telephone"
            name="telephone"
            placeholder="+261 34 12 345 67"
            value={formData.telephone}
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          {errorTemp && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800/50">
              {errorTemp}
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-3.5 text-base shadow-sm transition-opacity"
            disabled={isLoading}
          >
            Continuer
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <Input
            label="Identifiant unique (Attribué)"
            id="identifiant"
            name="identifiant"
            value={visualIdentifier}
            disabled={true} 
            readOnly
            className="bg-slate-50 font-mono text-xs opacity-80 cursor-not-allowed"
          />

          <PasswordInput
            label="Mot de passe"
            id="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          <Select
            label="Genre"
            id="genre"
            name="genre"
            value={formData.genre || ''}
            onChange={handleChange}
            options={[
              { value: '', label: 'Non précisé' },
              { value: 'HOMME', label: 'Homme' },
              { value: 'FEMME', label: 'Femme' },
              { value: 'AUTRE', label: 'Autre' },
            ]}
            disabled={isLoading}
          />

          <Select
            label="Je m'inscris en tant que"
            id="roleId"
            name="roleId"
            value={formData.roleId.toString()}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                roleId: Number(e.target.value) as 1 | 2,
                vehicleType: Number(e.target.value) === 1 ? undefined : prev.vehicleType,
                zone: Number(e.target.value) === 1 ? undefined : prev.zone,
              }))
            }
            options={[
              { value: '1', label: 'Client' },
              { value: '2', label: 'Chauffeur' },
            ]}
            disabled={isLoading}
          />

          {isChauffeur && (
            <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
              <Select
                label="Type de véhicule"
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType || ''}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Choisir...' },
                  { value: 'MOTO', label: 'Moto' },
                  { value: 'VELO', label: 'Vélo' },
                  { value: 'VOITURE', label: 'Voiture' },
                ]}
                required
                disabled={isLoading}
              />

              <Input
                label="Zone d'opération"
                id="zone"
                name="zone"
                placeholder="ex: Antananarivo Centre..."
                value={formData.zone || ''}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          )}

          {(error || errorTemp) && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800/50">
              {error || errorTemp}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 py-3.5 text-base"
              onClick={() => {
                setStep(1);
                setErrorTemp(null);
              }}
              disabled={isLoading}
            >
              Retour
            </Button>

            <Button
              type="submit"
              className="flex-1 py-3.5 text-base shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Inscription...' : 'Créer mon compte'}
            </Button>
          </div>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Déjà un compte ?{' '}
        <a
          href="/login"
          className="font-semibold text-navy hover:underline dark:text-primary"
        >
          Se connecter
        </a>
      </p>
    </div>
  );
};