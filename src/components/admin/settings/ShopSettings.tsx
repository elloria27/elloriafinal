import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import type { PaymentMethods, StripeSettings, ShippingMethod } from "@/integrations/supabase/types";

type ShopSettings = Database['public']['Tables']['shop_settings']['Row'];

export const ShopSettings = () => {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<Record<string, ShippingMethod[]>>({
    CA: [],
    US: []
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>({
    stripe: false,
    cash_on_delivery: false
  });
  const [stripeSettings, setStripeSettings] = useState<StripeSettings>({
    secret_key: '',
    publishable_key: ''
  });

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
      
      // Initialize shipping methods from settings if they exist
      if (data.shipping_methods) {
        setShippingMethods(data.shipping_methods as Record<string, ShippingMethod[]>);
      }

      // Initialize payment methods
      if (data.payment_methods) {
        setPaymentMethods(data.payment_methods as PaymentMethods);
      }

      // Initialize stripe settings
      if (data.stripe_settings) {
        setStripeSettings(data.stripe_settings as StripeSettings);
      }
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
          stripe_settings: settings.stripe_settings,
          shipping_methods: shippingMethods
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

  const addShippingMethod = (country: string) => {
    const newMethod: ShippingMethod = {
      id: crypto.randomUUID(),
      name: "New Shipping Method",
      price: 0,
      currency: country === "US" ? "USD" : "CAD",
      estimatedDays: "3-5 business days"
    };

    setShippingMethods(prev => ({
      ...prev,
      [country]: [...(prev[country] || []), newMethod]
    }));
  };

  const updateShippingMethod = (country: string, methodId: string, field: keyof ShippingMethod, value: string | number) => {
    setShippingMethods(prev => ({
      ...prev,
      [country]: prev[country].map(method => 
        method.id === methodId 
          ? { ...method, [field]: value }
          : method
      )
    }));
  };

  const removeShippingMethod = (country: string, methodId: string) => {
    setShippingMethods(prev => ({
      ...prev,
      [country]: prev[country].filter(method => method.id !== methodId)
    }));
  };

  const handlePaymentMethodToggle = (method: keyof PaymentMethods, enabled: boolean) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: enabled
    }));
  };

  const handleStripeSettingsChange = (key: keyof StripeSettings, value: string) => {
    setStripeSettings(prev => ({
      ...prev,
      [key]: value
    }));
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

      {/* General Settings Card */}
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
        </CardContent>
      </Card>

      {/* Shipping Methods Card */}
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

      {/* Payment Methods Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Configure available payment methods</CardDescription>
        </CardHeader>
        <CardContent>
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

            {paymentMethods.stripe && (
              <div className="ml-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stripe_secret_key">Stripe Secret Key</Label>
                  <Input
                    id="stripe_secret_key"
                    type="password"
                    value={stripeSettings.secret_key}
                    onChange={(e) => handleStripeSettingsChange('secret_key', e.target.value)}
                    placeholder="sk_test_..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe_publishable_key">Stripe Publishable Key</Label>
                  <Input
                    id="stripe_publishable_key"
                    type="password"
                    value={stripeSettings.publishable_key}
                    onChange={(e) => handleStripeSettingsChange('publishable_key', e.target.value)}
                    placeholder="pk_test_..."
                  />
                </div>
              </div>
            )}

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
