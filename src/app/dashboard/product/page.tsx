import ProductListClient from '@/components/dashcomponents/product/ProductListClient';
import { cookies } from 'next/headers';

type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  stock?: number | null;
  isActive: boolean;
  createdAt: string;
  createdBy?: {
    id: number;
    email: string;
    nom?: string;
  };
};

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    // ✅ Correction ici
    const cookieStore = await cookies();           // ← Await obligatoire
    const cookieHeader = cookieStore.toString();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 401) throw new Error('Session expirée');
      if (res.status === 403) throw new Error('Accès non autorisé');
      
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Erreur lors du chargement des produits');
    }

    products = await res.json();
  } catch (err: any) {
    error = err.message || 'Erreur serveur inattendue';
    console.error("Erreur ProductsPage:", err);
  }

  return (
    <div className="min-h-screen text-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductListClient 
          initialProducts={products} 
          initialError={error} 
        />
      </div>
    </div>
  );
}