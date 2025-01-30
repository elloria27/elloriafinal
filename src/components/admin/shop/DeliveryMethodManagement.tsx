import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DeliveryMethod {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  base_price: number;
  estimated_days: string | null;
}

export const DeliveryMethodManagement = () => {
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDeliveryMethods();
  }, []);

  const fetchDeliveryMethods = async () => {
    try {
      console.log('Fetching delivery methods...');
      const { data, error } = await supabase
        .from('delivery_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched delivery methods:', data);
      setDeliveryMethods(data || []);
    } catch (error) {
      console.error('Error fetching delivery methods:', error);
      toast.error('Failed to load delivery methods');
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryMethod = async (id: string, updates: Partial<DeliveryMethod>) => {
    try {
      setSaving(true);
      console.log('Updating delivery method:', id, updates);

      const { error } = await supabase
        .from('delivery_methods')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setDeliveryMethods(methods =>
        methods.map(method =>
          method.id === id ? { ...method, ...updates } : method
        )
      );

      // Update shop settings to trigger checkout page refresh
      const { data: shopSettings } = await supabase
        .from('shop_settings')
        .select('shipping_methods')
        .single();

      if (shopSettings) {
        const { error: updateError } = await supabase
          .from('shop_settings')
          .update({
            updated_at: new Date().toISOString(),
            shipping_methods: {
              ...shopSettings.shipping_methods,
              CA: deliveryMethods.filter(m => m.is_active).map(m => ({
                id: m.id,
                name: m.name,
                price: m.base_price,
                estimatedDays: m.estimated_days
              }))
            }
          })
          .eq('id', shopSettings.id);

        if (updateError) throw updateError;
      }

      toast.success('Delivery method updated successfully');
    } catch (error) {
      console.error('Error updating delivery method:', error);
      toast.error('Failed to update delivery method');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Delivery Methods</h2>
        <Button disabled={saving}>
          {saving ? 'Saving...' : 'Add New Method'}
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        {deliveryMethods.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No delivery methods found
          </div>
        ) : (
          <div className="divide-y">
            {deliveryMethods.map((method) => (
              <div key={method.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <Input
                      value={method.name}
                      onChange={(e) => updateDeliveryMethod(method.id, { name: e.target.value })}
                      className="font-medium text-lg"
                    />
                    <Input
                      value={method.description || ''}
                      onChange={(e) => updateDeliveryMethod(method.id, { description: e.target.value })}
                      placeholder="Description"
                      className="text-sm text-gray-600"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={method.is_active}
                      onCheckedChange={(checked) => updateDeliveryMethod(method.id, { is_active: checked })}
                    />
                    <Label>{method.is_active ? 'Active' : 'Inactive'}</Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Base Price ($)</Label>
                    <Input
                      type="number"
                      value={method.base_price}
                      onChange={(e) => updateDeliveryMethod(method.id, { base_price: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Days</Label>
                    <Input
                      value={method.estimated_days || ''}
                      onChange={(e) => updateDeliveryMethod(method.id, { estimated_days: e.target.value })}
                      placeholder="e.g. 2-3 business days"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};