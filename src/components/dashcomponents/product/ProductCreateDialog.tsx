"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";   // ← Ajouté

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  stock: string;
  isActive: boolean;
};

interface ProductDialogProps {
  mode: "create" | "edit";
  product?: {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    stock?: number | null;
    isActive: boolean;
  };
  onSuccess?: () => void;
}

export default function ProductDialog({
  mode,
  product,
  onSuccess,
}: ProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = mode === "edit";

  const initialForm: ProductFormData = {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    imageUrl: product?.imageUrl || "",
    stock: product?.stock?.toString() || "0",
    isActive: product?.isActive ?? true,
  };

  const [form, setForm] = useState<ProductFormData>(initialForm);

  // Réinitialiser le formulaire quand le produit change ou quand on ouvre/ferme
  useEffect(() => {
    if (open && isEdit && product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        imageUrl: product.imageUrl || "",
        stock: product.stock?.toString() || "0",
        isActive: product.isActive ?? true,
      });
    } else if (!open) {
      setForm(initialForm);
      setError(null);
    }
  }, [open, product, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = (checked: boolean) => {
    setForm((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.name.trim()) {
      setError("Le nom du produit est obligatoire");
      setLoading(false);
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Le prix doit être un nombre positif");
      setLoading(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price: Number(form.price),
      imageUrl: form.imageUrl.trim() || undefined,
      stock: form.stock ? Number(form.stock) : 0,
      isActive: form.isActive,
    };

    try {
      const url = isEdit ? `/api/products/${product?.id}` : "/api/products";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Session expirée. Veuillez vous reconnecter.");
        } else if (res.status === 403) {
          setError("Vous n'avez pas la permission d'effectuer cette action.");
        } else {
          const err = await res.json().catch(() => ({}));
          setError(err.message || "Une erreur est survenue");
        }
        return;
      }

      // Succès
      const action = isEdit ? "modifié" : "créé";
      toast.success(`Produit ${action} avec succès !`);

      setOpen(false);
      onSuccess?.();

    } catch (err: any) {
      setError(err.message || "Erreur réseau ou serveur");
      console.error("Erreur produit:", err);
    } finally {
      setLoading(false);
    }
  };

  const title = isEdit ? "Modifier le produit" : "Nouveau produit";
  const description = isEdit
    ? "Modifiez les informations du produit."
    : "Ajoutez un nouveau produit dans le catalogue.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon" title="Modifier">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau produit
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Nom */}
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du produit *</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="ex : Pizza Margherita"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ingrédients, caractéristiques, etc."
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Prix + Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Prix (€) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="ex : 12.90"
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock disponible</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="ex : 45"
                disabled={loading}
              />
            </div>
          </div>

          {/* URL Image */}
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">URL de l'image</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://exemple.com/image.jpg"
              disabled={loading}
            />
            {form.imageUrl && (
              <p className="text-xs text-muted-foreground mt-1">
                Aperçu :{" "}
                <a
                  href={form.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  ouvrir l'image
                </a>
              </p>
            )}
          </div>

          {/* Statut actif */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Produit visible</Label>
              <p className="text-sm text-muted-foreground">
                {form.isActive
                  ? "Le produit est visible par les clients"
                  : "Le produit est masqué (inactif)"}
              </p>
            </div>
            <Switch
              id="isActive"
              checked={form.isActive}
              onCheckedChange={handleToggleActive}
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <DialogFooter className="sm:justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Enregistrement..."
                : isEdit
                ? "Mettre à jour"
                : "Créer le produit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}