import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type ShopSettings = Database['public']['Tables']['shop_settings']['Row'];

interface PaymentMethods {
  stripe: boolean;
  cash_on_delivery: boolean;
}

export const ShopSettings = () => {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('Fetching shop settings...');
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .single();

      if (error) throw error;
      
      console.log('Shop settings loaded:', data);
      setSettings(data);
    } catch (error) {
      console.error('Error loading shop settings:', error);
      toast.error("Failed to load shop settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      console.log('Saving shop settings:', settings);

      const { error } = await supabase
        .from('shop_settings')
        .update({
          default_currency: settings.default_currency,
          enable_guest_checkout: settings.enable_guest_checkout,
          min_order_amount: settings.min_order_amount,
          max_order_amount: settings.max_order_amount,
          shipping_countries: settings.shipping_countries,
          tax_rate: settings.tax_rate,
          payment_methods: settings.payment_methods,
          stripe_settings: settings.stripe_settings
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast.success("Shop settings saved successfully");
    } catch (error) {
      console.error('Error saving shop settings:', error);
      toast.error("Failed to save shop settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentMethodToggle = (method: keyof PaymentMethods, enabled: boolean) => {
    if (!settings) return;
    
    // Cast the payment_methods to unknown first, then to PaymentMethods
    const currentMethods = (settings.payment_methods as unknown) as PaymentMethods || {
      stripe: false,
      cash_on_delivery: false
    };
    
    const updatedPaymentMethods = {
      ...currentMethods,
      [method]: enabled
    };
    
    setSettings({
      ...settings,
      payment_methods: updatedPaymentMethods
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error: Could not load shop settings</p>
      </div>
    );
  }

  // Cast payment_methods to PaymentMethods type with a default value
  const paymentMethods = ((settings.payment_methods as unknown) as PaymentMethods) || {
    stripe: false,
    cash_on_delivery: false
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Shop Settings</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Shop Settings</CardTitle>
          <CardDescription>Configure your shop's basic settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="default_currency">Default Currency</Label>
            <Select 
              value={settings.default_currency}
              onValueChange={(value: Database['public']['Enums']['supported_currency']) => 
                setSettings({ ...settings, default_currency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="UAH">UAH (₴)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enable_guest_checkout"
              checked={settings.enable_guest_checkout}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, enable_guest_checkout: checked })
              }
            />
            <Label htmlFor="enable_guest_checkout">Enable Guest Checkout</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_order_amount">Minimum Order Amount</Label>
            <Input
              id="min_order_amount"
              type="number"
              value={settings.min_order_amount || 0}
              onChange={(e) => 
                setSettings({ ...settings, min_order_amount: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_order_amount">Maximum Order Amount</Label>
            <Input
              id="max_order_amount"
              type="number"
              value={settings.max_order_amount || ''}
              onChange={(e) => 
                setSettings({ ...settings, max_order_amount: e.target.value ? Number(e.target.value) : null })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax_rate">Tax Rate (%)</Label>
            <Input
              id="tax_rate"
              type="number"
              step="0.01"
              value={settings.tax_rate || 0}
              onChange={(e) => 
                setSettings({ ...settings, tax_rate: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Payment Methods</h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="enable_stripe"
                checked={paymentMethods.stripe}
                onCheckedChange={(checked) => 
                  handlePaymentMethodToggle('stripe', checked)
                }
              />
              <Label htmlFor="enable_stripe">Enable Stripe Payments</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enable_cash_on_delivery"
                checked={paymentMethods.cash_on_delivery}
                onCheckedChange={(checked) => 
                  handlePaymentMethodToggle('cash_on_delivery', checked)
                }
              />
              <Label htmlFor="enable_cash_on_delivery">Enable Cash on Delivery</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};