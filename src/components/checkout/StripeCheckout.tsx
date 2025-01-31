import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface StripeCheckoutProps {
  paymentMethodId: string;
  isDisabled?: boolean;
  taxes: {
    gst: number;
    pst: number;
    hst: number;
  };
  shippingCost: number;
}

export const StripeCheckout = ({ 
  paymentMethodId, 
  isDisabled,
  taxes,
  shippingCost
}: StripeCheckoutProps) => {
  const { items, activePromoCode, subtotal } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      console.log('Initiating checkout with:', {
        paymentMethodId,
        items,
        taxes,
        shippingCost,
        activePromoCode,
        subtotal
      });
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Create checkout session
      const response = await supabase.functions.invoke('create-checkout', {
        body: {
          items,
          paymentMethodId,
          shippingCost,
          taxes,
          promoCode: activePromoCode,
          subtotal
        },
        headers: {
          Authorization: `Bearer ${session?.access_token || ''}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create checkout session');
      }
      
      const { data } = response;
      
      if (!data?.url) {
        throw new Error('No checkout URL received');
      }
      
      console.log('Redirecting to Stripe checkout:', data.url);
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Error initiating checkout:', error);
      toast.error(error.message || 'Failed to initiate checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout}
      disabled={isDisabled || isLoading}
      className="w-full"
    >
      {isLoading ? "Processing..." : "Proceed to Payment"}
    </Button>
  );
};