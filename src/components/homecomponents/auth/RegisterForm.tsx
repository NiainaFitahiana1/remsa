'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/homecomponents/ui/Input';
import { PasswordInput } from '@/components/homecomponents/ui/PasswordInput';
import { Button } from '@/components/homecomponents/ui/Button';
import { Select } from '../ui/Select';
import Image from 'next/image';
import logo from '@/../public/logos/logo-text.png';
import { useRegister } from '@/hooks/useRegister'; // ← adapte le chemin selon ton projet
import type { RegisterFormData } from '@/types';   // adapte selon ton typage réel

export const RegisterForm = () => {
  const router = useRouter();
  const { register, isLoading, error } = useRegister();

  const [step, setStep] = useState<1 | 2>(1);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.prenom.trim()) return setErrorTemp('Le prénom est requis');
    if (!formData.nom.trim())    return setErrorTemp('Le nom est requis');
    if (!formData.telephone.trim()) return setErrorTemp('Le téléphone est requis');

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation finale étape 2
    if (!formData.identifiant.trim()) {
      setErrorTemp('L’identifiant est requis');
      return;
    }
    if (!formData.password) {
      setErrorTemp('Le mot de passe est requis');
      return;
    }
    if (!formData.email?.trim()) {
      setErrorTemp('L’email est obligatoire');
      return;
    }
    if (formData.roleId === 2) {
      if (!formData.vehicleType) {
        setErrorTemp('Le type de véhicule est requis pour un chauffeur');
        return;
      }
      if (!formData.zone?.trim()) {
        setErrorTemp('La zone d’opération est requise pour un chauffeur');
        return;
      }
    }

    await register(formData);
  };

  // Erreur locale pour l’étape 1 (car useRegister gère surtout l’étape 2)
  const [errorTemp, setErrorTemp] = useState<string | null>(null);

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
          

          {/* <Input
            label="Identifiant"
            id="identifiant"
            name="identifiant"
            placeholder="Votre identifiant unique"
            value={formData.identifiant}
            onChange={handleChange}
            required
            disabled={isLoading}
          /> */}

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
            <>
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
                placeholder="ex: Antananarivo Centre, Toamasina..."
                value={formData.zone || ''}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </>
          )}

          {(error || errorTemp) && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800/50">
              {error || errorTemp}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline" // ← suppose que ton Button supporte variant="outline"
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
              className="flex-1 py-3.5 text-base shadow-sm transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Inscription...
                </div>
              ) : (
                'Créer mon compte'
              )}
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