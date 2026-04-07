import { Product } from "@/types";

type DeliveryProductListProps = {
  items: Product[];
  quantities: Record<number, number>;
  onQuantityChange: (quantities: Record<number, number>) => void;
  isSingleProduct: boolean;
};

export function DeliveryProductList({
  items,
  quantities,
  onQuantityChange,
  isSingleProduct,
}: DeliveryProductListProps) {
  const handleQuantityChange = (productId: number, value: string) => {
    let num = Math.max(1, Number(value) || 1);

    if (isSingleProduct) {
      num = 1;
    } else {
      const product = items.find((p) => p.id === productId);
      const max = product?.stock ?? 999;
      num = Math.min(num, max);
    }

    onQuantityChange((prev) => ({ ...prev, [productId]: num }));
  };

  return (
    <div className="space-y-4">
      {items.map((p) => (
        <div key={p.id} className="flex gap-4 p-4 bg-muted/50 rounded-lg items-center">
          {p.imageUrl && (
            <img
              src={p.imageUrl}
              alt={p.name}
              className="w-16 h-16 object-cover rounded"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{p.name}</p>
            <p className="text-sm text-muted-foreground">
              {p.price.toFixed(2)} € / unité
            </p>
          </div>

          <div className="w-32">
            <label className="text-xs text-muted-foreground">Quantité</label>
            <input
              type="number"
              min={1}
              max={isSingleProduct ? 1 : (p.stock || 999)}
              value={quantities[p.id] || 1}
              onChange={(e) => handleQuantityChange(p.id, e.target.value)}
              disabled={isSingleProduct}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {isSingleProduct && (
              <p className="text-xs text-muted-foreground mt-1">Quantité fixe : 1</p>
            )}
          </div>

          <div className="text-right w-24">
            <p className="font-semibold text-sm">
              {(p.price * (quantities[p.id] || 1)).toFixed(2)} €
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}