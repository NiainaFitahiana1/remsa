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
  // Ajoute d'autres pays ici ou importe une liste complète
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

    // Sépare le code pays du reste du numéro
    const phoneNumberWithoutCode = value.replace(selectedCountry.dialCode, '').trim();

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newCountry = countries.find(c => c.dialCode === e.target.value) || countries[0];
      setSelectedCountry(newCountry);

      // Met à jour le numéro complet avec le nouveau code
      const newFullNumber = newCountry.dialCode + ' ' + phoneNumberWithoutCode;
      onChange?.(newFullNumber);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(selectedCountry.dialCode, '').trim();
      const newFullNumber = selectedCountry.dialCode + ' ' + input;
      onChange?.(newFullNumber);
      register?.onChange(e);
    };

    return (
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 ml-1">
          {label}
        </label>
        
        <div className="flex gap-2">
          {/* Sélecteur de pays */}
          <div className="w-48">
            <select
              value={selectedCountry.dialCode}
              onChange={handleCountryChange}
              disabled={isValidating}
              className="appearance-none rounded-xl block w-full px-4 py-3.5 border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.dialCode}>
                  {country.flag} {country.dialCode} {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Champ numéro de téléphone */}
          <div className="flex-1 relative">
            <input
              type="tel"
              ref={ref}
              value={value}
              onChange={handlePhoneChange}
              placeholder={`${selectedCountry.dialCode} XX XXX XXX`}
              className={cn(
                "appearance-none rounded-xl block w-full px-4 py-3.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all sm:text-sm",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                className
              )}
              disabled={isValidating}
              {...register}
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