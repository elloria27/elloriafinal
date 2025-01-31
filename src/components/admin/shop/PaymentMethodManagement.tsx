import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Json } from "@/integrations/supabase/types";

interface StripeConfig {
  publishable_key: string;
  secret_key: string;
}

export const PaymentMethodManagement = () => {
  const [loading, setLoading] = useState(true);
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [stripeConfig, setStripeConfig] = useState<StripeConfig>({
    publishable_key: "",
    secret_key: "",
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      // Only fetch the Stripe payment method
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('name', 'stripe')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setStripeEnabled(data.is_active || false);
        const config = data.stripe_config as { publishable_key?: string; secret_key?: string } | null;
        setStripeConfig({
          publishable_key: config?.publishable_key || "",
          secret_key: config?.secret_key || "",
        });
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const stripeConfigJson: { [key: string]: string } = {
        publishable_key: stripeConfig.publishable_key,
        secret_key: stripeConfig.secret_key
      };

      // Upsert only the Stripe payment method
      const { error } = await supabase
        .from('payment_methods')
        .upsert({
          name: 'stripe',
          is_active: stripeEnabled,
          stripe_config: stripeConfigJson as Json,
          description: 'Stripe payment gateway'
        });

      if (error) throw error;

      toast.success('Payment settings updated successfully');
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error('Failed to update payment settings');
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
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Stripe Payments</Label>
              <p className="text-sm text-muted-foreground">
                Enable Stripe payment gateway
              </p>
            </div>
            <Switch
              checked={stripeEnabled}
              onCheckedChange={setStripeEnabled}
            />
          </div>

          {stripeEnabled && (
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="publishable_key">Publishable Key</Label>
                <Input
                  id="publishable_key"
                  type="text"
                  value={stripeConfig.publishable_key}
                  onChange={(e) => setStripeConfig(prev => ({
                    ...prev,
                    publishable_key: e.target.value
                  }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="secret_key">Secret Key</Label>
                <Input
                  id="secret_key"
                  type="password"
                  value={stripeConfig.secret_key}
                  onChange={(e) => setStripeConfig(prev => ({
                    ...prev,
                    secret_key: e.target.value
                  }))}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleSave}>
                Save Settings
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};