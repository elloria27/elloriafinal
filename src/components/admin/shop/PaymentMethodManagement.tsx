import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface PaymentMethod {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean | null;
}

interface ShopSettings {
  payment_methods: {
    stripe: boolean;
    cash_on_delivery: boolean;
  };
  stripe_settings: {
    publishable_key: string;
    secret_key: string;
  };
}

export const PaymentMethodManagement = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [stripePublicKey, setStripePublicKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [cashOnDeliveryEnabled, setCashOnDeliveryEnabled] = useState(true);

  useEffect(() => {
    fetchPaymentMethods();
    fetchShopSettings();
  }, []);

  const fetchShopSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        const paymentMethods = data.payment_methods as ShopSettings['payment_methods'];
        const stripeSettings = data.stripe_settings as ShopSettings['stripe_settings'];
        
        setStripeEnabled(paymentMethods?.stripe ?? false);
        setCashOnDeliveryEnabled(paymentMethods?.cash_on_delivery ?? true);
        setStripePublicKey(stripeSettings?.publishable_key ?? "");
        setStripeSecretKey(stripeSettings?.secret_key ?? "");
      }
    } catch (error) {
      console.error('Error fetching shop settings:', error);
      toast.error('Failed to load shop settings');
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      const { error } = await supabase
        .from('shop_settings')
        .update({
          payment_methods: {
            stripe: stripeEnabled,
            cash_on_delivery: cashOnDeliveryEnabled
          },
          stripe_settings: {
            publishable_key: stripePublicKey,
            secret_key: stripeSecretKey
          }
        })
        .eq('id', 1); // Assuming there's only one settings record

      if (error) throw error;
      toast.success('Payment settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
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
        <h2 className="text-2xl font-bold">Payment Methods</h2>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Cash on Delivery</h3>
              <p className="text-sm text-gray-600">Allow customers to pay when receiving their order</p>
            </div>
            <Switch
              checked={cashOnDeliveryEnabled}
              onCheckedChange={setCashOnDeliveryEnabled}
            />
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Stripe Payments</h3>
                <p className="text-sm text-gray-600">Accept credit card payments through Stripe</p>
              </div>
              <Switch
                checked={stripeEnabled}
                onCheckedChange={setStripeEnabled}
              />
            </div>

            {stripeEnabled && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="publishable-key">Publishable Key</Label>
                  <Input
                    id="publishable-key"
                    value={stripePublicKey}
                    onChange={(e) => setStripePublicKey(e.target.value)}
                    placeholder="pk_test_..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret-key">Secret Key</Label>
                  <Input
                    id="secret-key"
                    type="password"
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                    placeholder="sk_test_..."
                  />
                </div>
              </div>
            )}
          </div>

          <Button onClick={saveSettings} className="mt-4">
            Save Settings
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-4">Available Payment Methods</h3>
        {paymentMethods.length === 0 ? (
          <div className="text-center text-gray-500">
            No payment methods found
          </div>
        ) : (
          <div className="divide-y">
            {paymentMethods.map((method) => (
              <div key={method.id} className="py-4 first:pt-0 last:pb-0">
                <h4 className="font-medium">{method.name}</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${method.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {method.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};