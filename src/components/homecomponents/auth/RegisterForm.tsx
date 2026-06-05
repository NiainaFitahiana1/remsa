'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '@/../public/logos/logo-text.png';
import { Eye, EyeOff } from 'lucide-react';
import { useRegister } from '@/hooks/useRegister';
import type { RegisterFormData } from '@/types';
import ZoneAutocomplete from '../../ZoneAutocomplete';
import { usePhoneValidation } from '@/hooks/useZapierverify'; // ← Correction importante
import PhoneInput from './PhoneInput';

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

  const [showPassword, setShowPassword] = useState(false);

  // Regex pour validation en temps réel
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Validation live
  const emailError = useMemo(() => {
    if (!formData.email) return '';
    return emailRegex.test(formData.email) ? '' : 'Veuillez entrer une adresse email valide';
  }, [formData.email]);

  const passwordError = useMemo(() => {
    if (!formData.password) return '';
    return passwordRegex.test(formData.password)
      ? ''
      : 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre';
  }, [formData.password]);

  // Aperçu identifiant
  const visualIdentifier = formData.nom
    ? `@${formData.roleId === 2 ? 'liv' : 'client'}#..._${formData.nom.trim().toLowerCase().replace(/\s+/g, '_')}`
    : 'En attente du nom...';

  // Hook de validation téléphone
  const { validatePhone, isValidating, validationError, clearError } = usePhoneValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setErrorTemp(null);
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const onPhoneChange = async (value: string) => {
    setErrorTemp(null);
    clearError();

    setFormData((prev) => ({ ...prev, telephone: value }));

    // Validation API (après un minimum de caractères)
    if (value.length > 12) {
      await validatePhone(value);
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.prenom.trim()) return setErrorTemp('Le prénom est requis');
    if (!formData.nom.trim()) return setErrorTemp('Le nom est requis');
    if (!formData.email?.trim()) return setErrorTemp('L’email est requis');
    if (emailError) return setErrorTemp('Veuillez corriger l’email');
    if (!formData.telephone.trim()) return setErrorTemp('Le téléphone est requis');

    // Validation finale du téléphone avec NumVerify avant de passer à l'étape 2
    const phoneResult = await validatePhone(formData.telephone);
    if (!phoneResult.success) {
      return setErrorTemp(phoneResult.error || 'Numéro de téléphone invalide');
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordError) return setErrorTemp('Veuillez corriger le mot de passe');

    if (formData.roleId === 2) {
      if (!formData.vehicleType) return setErrorTemp('Le type de véhicule est requis');
      if (!formData.zone?.trim()) return setErrorTemp('La zone est requise');
    }

    await register({
      ...formData,
      identifiant: 'TEMP_AUTO_GEN',
    });
  };

  const isChauffeur = formData.roleId === 2;

  return (
    <div className="max-w-4xl w-full space-y-8 glass-card p-6 sm:p-10 rounded-3xl shadow-2xl border border-white transition-all duration-500">
      <div className="flex items-center gap-3 -mb-10 -mt-5 -ms-5">
        <Image
          src={logo}
          alt="Atero Logo"
          width={128}
          height={128}
          className="h-32 w-auto transition-transform duration-300 hover:scale-105"
          priority
        />
      </div>

      <div className="relative mb-8">
        <hr className="border-gray-100 w-full" />
        <p className="text-sm text-gray-500 mt-4 ml-1">
          {step === 1 ? "Créons votre compte" : "Finalisez votre inscription"}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 ml-1">
                Prénom
              </label>
              <input
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Votre prénom"
                required
                disabled={isLoading}
                className="appearance-none rounded-xl block w-full px-4 py-3.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 ml-1">
                Nom
              </label>
              <input
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom"
                required
                disabled={isLoading}
                className="appearance-none rounded-xl block w-full px-4 py-3.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 ml-1">
              Adresse Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nom@exemple.com"
              required
              disabled={isLoading}
              className={`appearance-none rounded-xl block w-full px-4 py-3.5 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all sm:text-sm ${
                emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-red-500'
              }`}
            />
            {emailError && <p className="mt-1 ml-1 text-xs text-red-600">{emailError}</p>}
          </div>

          {/* Téléphone avec validation API */}
          <PhoneInput
            value={formData.telephone}
            onChange={onPhoneChange}
            error={validationError || undefined}
            isValidating={isValidating}
          />

          {errorTemp && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {errorTemp}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/30 transition-all shadow-lg shadow-red-500/20 active:scale-[0.98]"
          >
            Continuer
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Identifiant */}
          <div className="hidden">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 ml-1">
              Identifiant unique (Attribué)
            </label>
            <input
              value={visualIdentifier}
              readOnly
              disabled
              className="appearance-none rounded-xl block w-full px-4 py-3.5 border border-gray-200 bg-gray-50 text-gray-500 font-mono text-sm cursor-not-allowed"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 ml-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password ?? ''}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className={`appearance-none rounded-xl block w-full px-4 py-3.5 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all sm:text-sm pr-12 ${
                  passwordError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-red-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {passwordError && <p className="mt-1 ml-1 text-xs text-red-600">{passwordError}</p>}
          </div>

          {/* Genre */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 ml-1">
              Genre
            </label>
            <select
              name="genre"
              value={formData.genre || ''}
              onChange={handleChange}
              disabled={isLoading}
              className="appearance-none rounded-xl block w-full px-4 py-3.5 border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm"
            >
              <option value="">Non précisé</option>
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 ml-1">
              Je m'inscris en tant que
            </label>
            <select
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
              disabled={isLoading}
              className="appearance-none rounded-xl block w-full px-4 py-3.5 border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm"
            >
              <option value="1">Client</option>
              <option value="2">Chauffeur</option>
            </select>
          </div>

          {/* Champs chauffeur */}
          {isChauffeur && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 ml-1">
                  Type de véhicule
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType || ''}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="appearance-none rounded-xl block w-full px-4 py-3.5 border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm"
                >
                  <option value="">Choisir...</option>
                  <option value="MOTO">Moto</option>
                  <option value="VELO">Vélo</option>
                  <option value="VOITURE">Voiture</option>
                </select>
              </div>

              <ZoneAutocomplete<RegisterFormData>
                formData={formData}
                setFormData={setFormData}
                isLoading={isLoading}
              />
            </div>
          )}

          {(error || errorTemp) && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error || errorTemp}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setErrorTemp(null);
              }}
              disabled={isLoading}
              className="flex-1 py-3.5 px-4 text-sm font-medium rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Retour
            </button>

            <button
              type="submit"
              disabled={isLoading || !!passwordError}
              className="flex-1 py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/30 transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? 'Inscription en cours...' : 'Créer mon compte'}
            </button>
          </div>
        </form>
      )}

      <div className="text-center pt-4">
        <p className="text-sm text-gray-500">
          Déjà un compte ?{' '}
          <a
            href="/login"
            className="font-semibold text-gray-800 hover:text-red-600 transition-colors border-b border-gray-800 hover:border-red-600 pb-0.5"
          >
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
};