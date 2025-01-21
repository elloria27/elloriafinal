import { CartItem } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

interface ShippingAddress {
  address: string;
  region: string;
  country: string;
}

interface EmailDetails {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: CartItem[];
  total: number;
  shippingAddress: ShippingAddress;
}

export const sendOrderEmails = async (details: EmailDetails) => {
  console.log('Sending order confirmation email:', details);
  
  try {
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: details
    });

    if (error) {
      console.error('Error sending order email:', error);
      throw new Error('Failed to send order confirmation email');
    }

    console.log('Order confirmation email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in sendOrderEmails:', error);
    throw error;
  }
};