'use client';

import { forwardRef, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const countries: Country[] = [
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳' },
  { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮' },
  { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭' },
  { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisie', dialCode: '+216', flag: '🇹🇳' },
];

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  register?: UseFormRegisterReturn;
  isValidating?: boolean;
  defaultCountryCode?: string;
}

// Fonction pour formater le numéro avec espaces
const formatPhoneNumber = (dialCode: string, number: string): string => {
  const cleanNumber = number.replace(/\s+/g, '').replace(/^0+/, ''); // supprime espaces et 0 initial

  // Madagascar : 9 chiffres → 33 61 428 48 (ou 34, 32, etc.)
  if (dialCode === '+261') {
    if (cleanNumber.length <= 2) return cleanNumber;
    if (cleanNumber.length <= 4) return `${cleanNumber.slice(0, 2)} ${cleanNumber.slice(2)}`;
    if (cleanNumber.length <= 7) return `${cleanNumber.slice(0, 2)} ${cleanNumber.slice(2, 4)} ${cleanNumber.slice(4)}`;
    return `${cleanNumber.slice(0, 2)} ${cleanNumber.slice(2, 4)} ${cleanNumber.slice(4, 7)} ${cleanNumber.slice(7)}`;
  }

  // Format par défaut (groupes de 2 ou 3)
  return cleanNumber.replace(/(\d{2,3})(?=\d)/g, '$1 ').trim();
};

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ 
    value = '', 
    onChange, 
    error, 
    label = 'Téléphone', 
    register, 
    isValidating, 
    defaultCountryCode = '+261',
    className, 
    ...props 
  }, ref) => {
    
    const [selectedCountry, setSelectedCountry] = useState<Country>(
      countries.find(c => c.dialCode === defaultCountryCode) || countries[0]
    );

    // Extraire uniquement la partie numéro
    const phoneNumberWithoutCode = value.replace(selectedCountry.dialCode, '').trim();

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newCountry = countries.find(c => c.dialCode === e.target.value) || countries[0];
      setSelectedCountry(newCountry);

      const formatted = formatPhoneNumber(newCountry.dialCode, phoneNumberWithoutCode);
      onChange?.(newCountry.dialCode + (formatted ? ' ' + formatted : ''));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const formatted = formatPhoneNumber(selectedCountry.dialCode, input);
      const newFullNumber = selectedCountry.dialCode + (formatted ? ' ' + formatted : '');
      
      onChange?.(newFullNumber);
      register?.onChange?.(e);
    };

    return (
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 ml-1">
          {label}
        </label>
        
        {/* Un seul cadre visuel */}
        <div className={cn(
          "flex border border-gray-200 rounded-xl overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all",
          error && "border-red-500"
        )}>
          {/* Sélecteur pays (seulement le drapeau) */}
          <div className="flex items-center bg-gray-50 border-r border-gray-200 px-4">
            <select
              value={selectedCountry.dialCode}
              onChange={handleCountryChange}
              disabled={isValidating}
              className="appearance-none bg-transparent text-2xl focus:outline-none cursor-pointer pr-2"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.dialCode}>
                  {country.flag}
                </option>
              ))}
            </select>
            <span className="text-gray-400 text-sm font-medium ml-1">
              {selectedCountry.dialCode}
            </span>
          </div>

          {/* Champ numéro */}
          <div className="flex-1 relative">
            <input
              type="tel"
              ref={ref}
              value={phoneNumberWithoutCode ? formatPhoneNumber(selectedCountry.dialCode, phoneNumberWithoutCode) : ''}
              onChange={handlePhoneChange}
              placeholder="33 61 428 48"
              className={cn(
                "block w-full px-4 py-3.5 bg-transparent text-gray-900 focus:outline-none sm:text-sm",
                className
              )}
              disabled={isValidating}
              {...props}
            />
            
            {isValidating && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        </div>

        {error && <p className="mt-1 text-xs text-red-500 ml-1">{error}</p>}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;