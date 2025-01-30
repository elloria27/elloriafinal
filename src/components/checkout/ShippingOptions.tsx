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
  return (
    <div className="space-y-2">
      <Label className="text-lg font-medium">Shipping Method</Label>
      <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
        <div className="space-y-3">
          {shippingOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-gray-500">
                      {option.estimatedDays}
                    </div>
                  </div>
                  <span className="font-medium">{currencySymbol}{option.price.toFixed(2)}</span>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};