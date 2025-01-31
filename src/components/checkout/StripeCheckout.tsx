import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface StripeCheckoutProps {
  paymentMethodId: string;
  isDisabled?: boolean;
}

export const StripeCheckout = ({ paymentMethodId, isDisabled }: StripeCheckoutProps) => {
  const { items } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Create checkout session
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`,
          },
          body: JSON.stringify({
            items,
            paymentMethodId,
          }),
        }
      );

      const { url, error } = await response.json();
      
      if (error) throw new Error(error);
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error initiating checkout:', error);
      toast.error('Failed to initiate checkout. Please try again.');
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