import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getShortAddress = (address: string | null | undefined): string => {
  if (!address || typeof address !== 'string') return 'Adresse inconnue';
  
  const parts = address.split(',');
  return parts[0].trim();
};