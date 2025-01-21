import { CartItem } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

interface OrderEmailDetails {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: CartItem[];
  total: number;
  shippingAddress: {
    address: string;
    region: string;
    country: string;
  };
}

export const sendOrderEmails = async (orderDetails: OrderEmailDetails) => {
  console.log('Starting to send order emails...');
  
  try {
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: orderDetails
    });

    if (error) {
      console.error('Error sending order email:', error);
      throw error;
    }

    console.log('Order email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending order emails:', error);
    throw new Error('Failed to send order confirmation emails');
  }
};