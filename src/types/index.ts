export type UserProfile = {
  id: string;
  nom: string;
  prenom: string;
  role: string;
  verified: boolean;
};

export type MenuLink = {
  href: string;
  icon: string;
  label: string;
};

export type Role = 'CLIENT' | 'ADMIN' | 'SUPER_ADMIN' | 'DRIVER';

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

export type DeliveryStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PICKED_UP"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "CANCELLED";

export interface DeliveryItem {
  id: number;
  quantity: number;
  subtotal: number;
  customName?: string;
  product?: {
    name: string;
  };
}
export interface Delivery {
  id: number;
  pickupAddress: string;
  dropAddress: string;
  distanceKm?: number | null;
  price: number;
  status: DeliveryStatus;
  items?: DeliveryItem[];
  scheduledAt?: string | null;
  createdAt?: string | null;
  commission?: number | null;
  client?: { nom: string; prenom: string ;telephone:string,email:string;};
  driver?: {
    nom: string;
    prenom: string;
  };
}

export interface DeliveryFormData {
  pickupAddress: string;
  dropAddress: string;
  distanceKm: string;
  price: string;
  scheduledAt: string;
}

export type StatusConfig = {
  label: string;
  icon: string;
  allowedNext: DeliveryStatus[];
};


export type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  stock?: number | null;
};


export interface DeliveryOffer {
  id: number;
  pickupAddress: string;
  dropAddress: string;
  price: number | string;
  distanceKm?: number | string;
  status: string;
  scheduledAt?: string | null;     // ← null autorisé (ce qui pose problème actuellement)
  createdAt: string;
  client?: {
    nom: string;
    prenom: string;
  };
  items?: Array<{
    product?: { name: string };
    quantity: number;
  }>;
}