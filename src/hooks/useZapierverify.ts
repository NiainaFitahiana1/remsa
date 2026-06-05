import { useState, useCallback } from 'react';
import { z } from 'zod';

const NUMVERIFY_API_KEY = process.env.NEXT_PUBLIC_NUMVERIFY_API_KEY; 

export const phoneSchema = z
  .string()
  .min(8, 'Le numéro de téléphone est trop court')
  .regex(/^\+261/, 'Le numéro doit commencer par +261 (Madagascar)')
  .transform((val) => val.replace(/\s+/g, ' ').trim());

export const usePhoneValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateWithNumVerify = useCallback(async (phone: string): Promise<{
    valid: boolean;
    error?: string;
    data?: any;
  }> => {
    if (!NUMVERIFY_API_KEY) {
      console.warn('NumVerify API key is missing');
      return { valid: true }; // fallback si pas de clé
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const response = await fetch(
        `https://apilayer.net/api/validate?access_key=${NUMVERIFY_API_KEY}&number=${encodeURIComponent(phone)}&country_code=MG`
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la validation');
      }

      const data = await response.json();

      if (!data.valid) {
        const errorMsg = data.error?.info || 'Numéro de téléphone invalide';
        setValidationError(errorMsg);
        return { valid: false, error: errorMsg, data };
      }

      // Optionnel : tu peux vérifier le carrier ou le type de ligne
      if (data.line_type && !['mobile', 'landline'].includes(data.line_type)) {
        return { valid: true, data }; // ou false selon tes règles
      }

      return { valid: true, data };
    } catch (err) {
      const errorMsg = 'Impossible de valider le numéro (erreur serveur)';
      setValidationError(errorMsg);
      return { valid: false, error: errorMsg };
    } finally {
      setIsValidating(false);
    }
  }, []);

  // Validation locale + API
  const validatePhone = async (phone: string) => {
    // 1. Validation Zod locale
    try {
      phoneSchema.parse(phone);
    } catch (err: any) {
      const msg = err.errors?.[0]?.message || 'Format invalide';
      setValidationError(msg);
      return { success: false, error: msg };
    }

    // 2. Validation via NumVerify API
    const result = await validateWithNumVerify(phone);
    return {
      success: result.valid,
      error: result.error,
      data: result.data,
    };
  };

  return {
    validatePhone,
    isValidating,
    validationError,
    clearError: () => setValidationError(null),
    phoneSchema,
  };
};