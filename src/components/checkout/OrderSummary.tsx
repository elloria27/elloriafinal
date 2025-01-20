import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/contexts/CartContext";
import { ShippingOption } from "@/utils/locationData";

interface OrderSummaryProps {
  items: CartItem[];
  subtotalInCurrentCurrency: number;
  currencySymbol: string;
  taxes: {
    gst: number;
    pst: number;
    hst: number;
  };
  selectedShippingOption: ShippingOption | undefined;
  total: number;
  activePromoCode: { code: string; discount: number } | null;
}

export const OrderSummary = ({
  items,
  subtotalInCurrentCurrency,
  currencySymbol,
  taxes,
  selectedShippingOption,
  total,
  activePromoCode,
}: OrderSummaryProps) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-medium mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-primary">
                {currencySymbol}
                {item.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{currencySymbol}{subtotalInCurrentCurrency.toFixed(2)}</span>
        </div>

        {taxes.gst > 0 && (
          <div className="flex justify-between text-sm">
            <span>GST ({taxes.gst}%)</span>
            <span>{currencySymbol}{(subtotalInCurrentCurrency * taxes.gst / 100).toFixed(2)}</span>
          </div>
        )}

        {taxes.pst > 0 && (
          <div className="flex justify-between text-sm">
            <span>PST ({taxes.pst}%)</span>
            <span>{currencySymbol}{(subtotalInCurrentCurrency * taxes.pst / 100).toFixed(2)}</span>
          </div>
        )}

        {taxes.hst > 0 && (
          <div className="flex justify-between text-sm">
            <span>HST ({taxes.hst}%)</span>
            <span>{currencySymbol}{(subtotalInCurrentCurrency * taxes.hst / 100).toFixed(2)}</span>
          </div>
        )}

        {selectedShippingOption && (
          <div className="flex justify-between text-sm">
            <span>Shipping ({selectedShippingOption.name})</span>
            <span>{currencySymbol}{selectedShippingOption.price.toFixed(2)}</span>
          </div>
        )}
        
        {activePromoCode && (
          <div className="flex justify-between text-sm text-primary">
            <span>Discount ({activePromoCode.discount}%)</span>
            <span>
              -{currencySymbol}
              {((subtotalInCurrentCurrency * activePromoCode.discount) / 100).toFixed(2)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between font-medium pt-2 border-t">
          <span>Total</span>
          <span>{currencySymbol}{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};