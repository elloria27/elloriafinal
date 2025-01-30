import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { PaymentMethods, StripeSettings } from "@/integrations/supabase/types";

type Props = {
  paymentMethods: PaymentMethods;
  stripeSettings: StripeSettings;
  onPaymentMethodsChange: (methods: PaymentMethods) => void;
  onStripeSettingsChange: (settings: StripeSettings) => void;
};

export const PaymentSettings = ({ 
  paymentMethods, 
  stripeSettings, 
  onPaymentMethodsChange, 
  onStripeSettingsChange 
}: Props) => {
  const handlePaymentMethodToggle = (method: keyof PaymentMethods, enabled: boolean) => {
    onPaymentMethodsChange({
      ...paymentMethods,
      [method]: enabled
    });
  };

  const handleStripeSettingsChange = (key: keyof StripeSettings, value: string) => {
    onStripeSettingsChange({
      ...stripeSettings,
      [key]: value
    });
  };

  return (
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
  );
};