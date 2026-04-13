// components/dashboard/product/DeliveryPriceSummary.tsx

type DeliveryPriceSummaryProps = {
  totalPrice: number;
  suggestedTotalPrice: string;
};

export function DeliveryPriceSummary({ totalPrice, suggestedTotalPrice }: DeliveryPriceSummaryProps) {
  return (
    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <div className="flex justify-between text-lg font-semibold">
        <span>Total produits :</span>
        <span>{totalPrice.toFixed(2)} €</span>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground mt-1">
        <span>Frais de livraison estimés :</span>
        <span>5.00 €</span>
      </div>
      <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
        <span>Total livraison :</span>
        <span>{suggestedTotalPrice} €</span>
      </div>
    </div>
  );
}