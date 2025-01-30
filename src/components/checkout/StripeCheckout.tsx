import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export const StripeCheckout = ({
  total,
  subtotal,
  taxes,
  shippingAddress,
  shippingCost,
}: StripeCheckoutProps) => {
  const { items, activePromoCode, clearCart } = useCart();

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
        // Store cart data in localStorage before redirect
        localStorage.setItem('pending_cart_clear', 'true');
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error in handleCheckout:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <Button 
      onClick={handleCheckout}
      className="w-full bg-primary hover:bg-primary/90"
    >
      Pay with Stripe
    </Button>
  );
};