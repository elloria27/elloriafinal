import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { ShippingMethod } from "@/integrations/supabase/types";

type Props = {
  shippingMethods: Record<string, ShippingMethod[]>;
  onShippingMethodsChange: (methods: Record<string, ShippingMethod[]>) => void;
};

export const ShippingSettings = ({ shippingMethods, onShippingMethodsChange }: Props) => {
  const addShippingMethod = (country: string) => {
    const newMethod: ShippingMethod = {
      id: crypto.randomUUID(),
      name: "New Shipping Method",
      price: 0,
      currency: country === "US" ? "USD" : "CAD",
      estimatedDays: "3-5 business days"
    };

    onShippingMethodsChange({
      ...shippingMethods,
      [country]: [...(shippingMethods[country] || []), newMethod]
    });
  };

  const updateShippingMethod = (country: string, methodId: string, field: keyof ShippingMethod, value: string | number) => {
    onShippingMethodsChange({
      ...shippingMethods,
      [country]: shippingMethods[country].map(method => 
        method.id === methodId 
          ? { ...method, [field]: value }
          : method
      )
    });
  };

  const removeShippingMethod = (country: string, methodId: string) => {
    onShippingMethodsChange({
      ...shippingMethods,
      [country]: shippingMethods[country].filter(method => method.id !== methodId)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Methods</CardTitle>
        <CardDescription>Configure shipping methods for each country</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* US Shipping Methods */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">United States (USD)</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addShippingMethod('US')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </div>
          
          {shippingMethods.US?.map(method => (
            <div key={method.id} className="grid grid-cols-12 gap-4 items-center border p-4 rounded-lg">
              <div className="col-span-3">
                <Label>Name</Label>
                <Input
                  value={method.name}
                  onChange={(e) => updateShippingMethod('US', method.id, 'name', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  value={method.price}
                  onChange={(e) => updateShippingMethod('US', method.id, 'price', Number(e.target.value))}
                />
              </div>
              <div className="col-span-3">
                <Label>Estimated Days</Label>
                <Input
                  value={method.estimatedDays}
                  onChange={(e) => updateShippingMethod('US', method.id, 'estimatedDays', e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeShippingMethod('US', method.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Canadian Shipping Methods */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Canada (CAD)</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addShippingMethod('CA')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </div>
          
          {shippingMethods.CA?.map(method => (
            <div key={method.id} className="grid grid-cols-12 gap-4 items-center border p-4 rounded-lg">
              <div className="col-span-3">
                <Label>Name</Label>
                <Input
                  value={method.name}
                  onChange={(e) => updateShippingMethod('CA', method.id, 'name', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  value={method.price}
                  onChange={(e) => updateShippingMethod('CA', method.id, 'price', Number(e.target.value))}
                />
              </div>
              <div className="col-span-3">
                <Label>Estimated Days</Label>
                <Input
                  value={method.estimatedDays}
                  onChange={(e) => updateShippingMethod('CA', method.id, 'estimatedDays', e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeShippingMethod('CA', method.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};