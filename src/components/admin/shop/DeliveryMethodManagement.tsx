import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface DeliveryMethod {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  base_price: number;
  estimated_days: string | null;
}

interface ShopSettings {
  id: string;
  shipping_methods: {
    CA: Array<{
      id: string;
      name: string;
      price: number;
      estimatedDays: string | null;
    }>;
    US: Array<{
      id: string;
      name: string;
      price: number;
      estimatedDays: string | null;
    }>;
  };
}

export const DeliveryMethodManagement = () => {
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMethod, setNewMethod] = useState<Partial<DeliveryMethod>>({
    name: '',
    description: '',
    is_active: true,
    base_price: 0,
    estimated_days: ''
  });

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

  const addDeliveryMethod = async () => {
    try {
      setSaving(true);
      console.log('Adding new delivery method:', newMethod);

      const { data, error } = await supabase
        .from('delivery_methods')
        .insert([newMethod])
        .select()
        .single();

      if (error) throw error;

      setDeliveryMethods(prev => [data, ...prev]);
      setIsDialogOpen(false);
      setNewMethod({
        name: '',
        description: '',
        is_active: true,
        base_price: 0,
        estimated_days: ''
      });

      // Update shop settings
      await updateShopSettings([data, ...deliveryMethods]);
      
      toast.success('Delivery method added successfully');
    } catch (error) {
      console.error('Error adding delivery method:', error);
      toast.error('Failed to add delivery method');
    } finally {
      setSaving(false);
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

      const updatedMethods = deliveryMethods.map(method =>
        method.id === id ? { ...method, ...updates } : method
      );
      setDeliveryMethods(updatedMethods);

      // Update shop settings
      await updateShopSettings(updatedMethods);

      toast.success('Delivery method updated successfully');
    } catch (error) {
      console.error('Error updating delivery method:', error);
      toast.error('Failed to update delivery method');
    } finally {
      setSaving(false);
    }
  };

  const updateShopSettings = async (methods: DeliveryMethod[]) => {
    try {
      const { data: shopSettings } = await supabase
        .from('shop_settings')
        .select('*')
        .single();

      if (shopSettings) {
        const updatedShopSettings: ShopSettings = {
          ...shopSettings,
          shipping_methods: {
            CA: methods
              .filter(m => m.is_active)
              .map(m => ({
                id: m.id,
                name: m.name,
                price: m.base_price,
                estimatedDays: m.estimated_days
              })),
            US: [] // Keep US methods unchanged
          }
        };

        const { error: updateError } = await supabase
          .from('shop_settings')
          .update({
            updated_at: new Date().toISOString(),
            shipping_methods: updatedShopSettings.shipping_methods
          })
          .eq('id', shopSettings.id);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error updating shop settings:', error);
      toast.error('Failed to update shop settings');
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Method</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Delivery Method</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={newMethod.name}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Standard Shipping"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newMethod.description || ''}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                />
              </div>
              <div className="space-y-2">
                <Label>Base Price ($)</Label>
                <Input
                  type="number"
                  value={newMethod.base_price}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, base_price: parseFloat(e.target.value) }))}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label>Estimated Days</Label>
                <Input
                  value={newMethod.estimated_days || ''}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, estimated_days: e.target.value }))}
                  placeholder="e.g. 2-3 business days"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newMethod.is_active}
                  onCheckedChange={(checked) => setNewMethod(prev => ({ ...prev, is_active: checked }))}
                />
                <Label>Active</Label>
              </div>
              <Button 
                className="w-full" 
                onClick={addDeliveryMethod}
                disabled={saving || !newMethod.name}
              >
                {saving ? 'Adding...' : 'Add Delivery Method'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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