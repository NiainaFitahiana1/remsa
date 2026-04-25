import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  stock?: number | null;
};

interface ProductItemProps {
  product: Product;
  quantity: number;
  onQuantityChange: (id: number, value: number | string) => void;
}

export function ProductItem({ product, quantity, onQuantityChange }: ProductItemProps) {
  return (
    <div className="flex gap-4 p-4 bg-muted/50 rounded-lg items-center">
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{product.name}</p>
        <p className="text-sm text-muted-foreground">{product.price.toFixed(2)} € / unité</p>
      </div>
      <div className="w-32 flex flex-col items-center gap-2">
        <Label className="text-xs">Quantité</Label>
        <div className="flex items-center border rounded-md">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 px-0"
            onClick={() => onQuantityChange(product.id, quantity - 1)}
          >
            -
          </Button>
          <Input
            type="number"
            className="h-8 w-12 border-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={quantity}
            onChange={(e) => onQuantityChange(product.id, e.target.value)}
            onWheel={(e) => e.currentTarget.blur()}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 px-0"
            onClick={() => onQuantityChange(product.id, quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>
      <div className="text-right w-24">
        <p className="font-semibold text-sm">{(product.price * quantity).toFixed(2)} €</p>
      </div>
    </div>
  );
}