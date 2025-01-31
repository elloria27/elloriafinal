import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface StripeCheckoutProps {
  total: number;
  subtotal: number;
  taxes: {
    gst: number;
    pst: number;
    hst: number;
  };
  shippingAddress: {
    country: string;
    region: string;
  };
  shippingCost: number;
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

export const StripeCheckout = ({
  total,
  subtotal,
  taxes,
  shippingAddress,
  shippingCost,
}: StripeCheckoutProps) => {
  const { items, activePromoCode, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [stripeEnabled, setStripeEnabled] = useState(false);

  useEffect(() => {
    fetchStripeSettings();
  }, []);

  const fetchStripeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('payment_methods, stripe_settings')
        .single();

      if (error) throw error;

      if (data) {
        const settings = data as ShopSettings;
        setStripeEnabled(
          settings.payment_methods?.stripe && 
          Boolean(settings.stripe_settings?.publishable_key)
        );
      }
    } catch (error) {
      console.error('Error fetching Stripe settings:', error);
      toast.error('Failed to load payment settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      console.log('Starting Stripe checkout process');
      
      const { data: { url }, error } = await supabase.functions.invoke(
        'create-checkout',
        {
          body: {
            data: {
              items,
              total,
              subtotal,
              taxes,
              activePromoCode,
              shippingAddress,
              shippingCost,
            },
          },
        }
      );

      if (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Failed to initiate checkout');
        return;
      }

      if (url) {
        console.log('Redirecting to Stripe checkout:', url);
        localStorage.setItem('pending_cart_clear', 'true');
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error in handleCheckout:', error);
      toast.error('An unexpected error occurred');
    }
  };

  if (isLoading) {
    return (
      <Button disabled className="w-full bg-primary/50">
        Loading...
      </Button>
    );
  }

  if (!stripeEnabled) {
    return null;
  }

  return (
    <Button 
      onClick={handleCheckout}
      className="w-full bg-primary hover:bg-primary/90"
    >
      Pay with Stripe
    </Button>
  );
};