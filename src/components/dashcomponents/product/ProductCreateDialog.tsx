"use client";

import { useState, useCallback } from "react";
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
import { Plus, Pencil, X, Upload } from "lucide-react";
import Image from "next/image";

type ProductFormData = {
  name: string;
  description: string;
  price: string;
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
    imageUrl?: string | null; // gardé pour compatibilité edit (image principale existante)
    stock?: number | null;
    isActive: boolean;
    images?: Array<{ id: number; url: string; isMain: boolean }>; // optionnel si tu charges les images existantes
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
    stock: product?.stock?.toString() || "0",
    isActive: product?.isActive ?? true,
  };

  const [form, setForm] = useState<ProductFormData>(initialForm);
  const [images, setImages] = useState<File[]>([]);           // nouvelles images à uploader
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // previews locales
  const [existingImages, setExistingImages] = useState(      // images déjà présentes (edit)
    product?.images || []
  );

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setImages([]);
    setImagePreviews([]);
    setExistingImages(product?.images || []);
    setError(null);
  }, [initialForm, product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = (checked: boolean) => {
    setForm((prev) => ({ ...prev, isActive: checked }));
  };

  // Gestion de l'upload multiple d'images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== files.length) {
      setError("Seules les images sont acceptées");
      return;
    }

    setImages((prev) => [...prev, ...validFiles]);

    // Créer les previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    URL.revokeObjectURL(newPreviews[index]); // libérer la mémoire

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setImagePreviews(newPreviews);
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

    const formData = new FormData();

    formData.append("name", form.name.trim());
    if (form.description.trim()) formData.append("description", form.description.trim());
    formData.append("price", form.price);
    formData.append("stock", form.stock || "0");
    formData.append("isActive", form.isActive.toString());

    // Ajouter les nouvelles images
    images.forEach((file) => {
      formData.append("images", file);   // nom du champ = "images"
    });

    try {
      const url = isEdit 
        ? `/api/products/${product?.id}` 
        : "/api/products";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: formData,                    // ← plus de Content-Type (le navigateur le met)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.message || "Une erreur est survenue");
        return;
      }

      setOpen(false);
      onSuccess?.();
      resetForm();
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
    <Dialog open={open} onOpenChange={(o) => {
      setOpen(o);
      if (!o) resetForm();
    }}>
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

      <DialogContent className="sm:max-w-[425px] md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
                disabled={loading}
              />
            </div>
          </div>

          {/* Upload Images */}
          <div className="grid gap-3">
            <Label>Images du produit</Label>
            
            {/* Zone de drop / bouton upload */}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/50 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">
                Cliquez ou glissez des images ici
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={loading}
              />
            </label>

            {/* Previews des nouvelles images */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={preview}
                      alt={`Preview ${index}`}
                      width={120}
                      height={120}
                      className="w-full aspect-square object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Images existantes en mode édition */}
            {isEdit && existingImages.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Images existantes :</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative">
                      <Image
                        src={img.url}
                        alt="Image existante"
                        width={120}
                        height={120}
                        className="w-full aspect-square object-cover rounded-md border"
                      />
                      {img.isMain && (
                        <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">
                          Principale
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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

          <DialogFooter className="sm:justify-end gap-3 pt-4">
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