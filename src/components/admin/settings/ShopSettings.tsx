import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { PaymentMethods, StripeSettings, ShippingMethod } from "@/integrations/supabase/types";
import { GeneralSettings } from "./shop/GeneralSettings";
import { ShippingSettings } from "./shop/ShippingSettings";
import { PaymentSettings } from "./shop/PaymentSettings";

export const ShopSettings = () => {
  const [settings, setSettings] = useState<any>(null);
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
      
      if (data.shipping_methods) {
        setShippingMethods(data.shipping_methods as Record<string, ShippingMethod[]>);
      }

      if (data.payment_methods) {
        setPaymentMethods(data.payment_methods as PaymentMethods);
      }

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
          payment_methods: paymentMethods,
          stripe_settings: stripeSettings,
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <GeneralSettings 
            settings={settings}
            onSettingsChange={setSettings}
          />
          <PaymentSettings 
            paymentMethods={paymentMethods}
            stripeSettings={stripeSettings}
            onPaymentMethodsChange={setPaymentMethods}
            onStripeSettingsChange={setStripeSettings}
          />
        </div>
        <div>
          <ShippingSettings 
            shippingMethods={shippingMethods}
            onShippingMethodsChange={setShippingMethods}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopSettings;