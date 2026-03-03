export type Role = "ADMIN" | "CLIENT";

export interface User {
  id: number;
  nom: string;
  prenom: string;
  role: Role;
}

export type FormErrors = {
  email?: string;
  password?: string;
};

export type InputState = 'default' | 'error' | 'success';

export type RegisterFormData = {
  nom: string;
  prenom: string;
  identifiant: string;
  email: string;
  telephone: string;
  password: string;
  genre?: 'HOMME' | 'FEMME' | 'AUTRE';
  roleId: 1 | 2;
  vehicleType?: 'MOTO' | 'VELO' | 'VOITURE';
  zone?: string;
};

export type ApiError = {
  message: string;
  status?: number;
};

export type RegisterData = {
  nom: string;
  prenom: string;
  identifiant: string;
  telephone: string;
  email?: string;
  password: string;
  genre?: 'HOMME' | 'FEMME' | 'AUTRE';
  roleId: 1 | 2;
  vehicleType?: 'MOTO' | 'VELO' | 'VOITURE';
  zone?: string;
};

export type UseRegisterReturn = {
  register: (data: RegisterData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};