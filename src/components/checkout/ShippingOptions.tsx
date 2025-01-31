import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShippingOption } from "@/utils/locationData";

interface ShippingOptionsProps {
  shippingOptions: ShippingOption[];
  selectedShipping: string;
  setSelectedShipping: (value: string) => void;
  currencySymbol: string;
}

export const ShippingOptions = ({
  shippingOptions,
  selectedShipping,
  setSelectedShipping,
  currencySymbol
}: ShippingOptionsProps) => {
  if (!shippingOptions || shippingOptions.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No shipping options available for your region
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Shipping Method</Label>
      <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
        <div className="space-y-2">
          {shippingOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="flex-1">
                <div className="flex justify-between">
                  <span>{option.name}</span>
                  <span>{currencySymbol}{option.price.toFixed(2)}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {option.estimatedDays}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};