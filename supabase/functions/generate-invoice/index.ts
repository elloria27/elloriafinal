import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { jsPDF } from "npm:jspdf";

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting invoice generation...");
    const { orderId } = await req.json();
    console.log("Order ID received:", orderId);

    if (!orderId) {
      throw new Error('Order ID is required');
    }

    // Fetch order details
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        profiles:profiles(
          full_name,
          email,
          phone_number,
          address
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error("Error fetching order:", orderError);
      throw orderError;
    }

    if (!order) {
      console.error("Order not found");
      throw new Error('Order not found');
    }

    console.log("Order data retrieved:", order);

    // Create PDF
    const doc = new jsPDF();
    
    // Company Info
    doc.setFontSize(10);
    doc.text('Elloria Inc.', 10, 30);
    doc.text('123 Business Street', 10, 35);
    doc.text('Toronto, ON M5V 2T6', 10, 40);
    doc.text('support@elloria.ca', 10, 45);
    
    // Order Info
    doc.setFontSize(14);
    doc.text(`Invoice #${order.order_number}`, 10, 60);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 10, 70);
    
    // Customer Info
    const shippingAddress = order.shipping_address;
    const customerName = order.profiles?.full_name || 
      (shippingAddress.first_name && shippingAddress.last_name 
        ? `${shippingAddress.first_name} ${shippingAddress.last_name}`.trim() 
        : shippingAddress.first_name || shippingAddress.last_name || 'Valued Customer');

    doc.text('Bill To:', 10, 85);
    doc.text(customerName, 10, 90);
    doc.text(shippingAddress.address, 10, 95);
    doc.text(`${shippingAddress.region}, ${shippingAddress.country}`, 10, 100);
    doc.text(order.profiles?.email || shippingAddress.email || order.email_address || 'N/A', 10, 105);
    
    // Items Table
    let y = 120;
    doc.text('Item', 10, y);
    doc.text('Qty', 100, y);
    doc.text('Price', 130, y);
    doc.text('Total', 160, y);
    
    y += 10;
    let subtotal = 0;
    order.items.forEach((item: any) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      doc.text(item.name, 10, y);
      doc.text(item.quantity.toString(), 100, y);
      doc.text(`$${item.price.toFixed(2)}`, 130, y);
      doc.text(`$${itemTotal.toFixed(2)}`, 160, y);
      y += 10;
    });
    
    y += 10;
    // Subtotal
    doc.text('Subtotal:', 130, y);
    doc.text(`$${subtotal.toFixed(2)}`, 160, y);
    
    // Promo code if used
    let discount = 0;
    if (order.applied_promo_code) {
      y += 10;
      if (order.applied_promo_code.type === 'percentage') {
        discount = subtotal * (order.applied_promo_code.value / 100);
      } else {
        discount = order.applied_promo_code.value;
      }
      doc.text(`Discount (${order.applied_promo_code.code}):`, 130, y);
      doc.text(`-$${discount.toFixed(2)}`, 160, y);
    }
    
    // Total
    y += 15;
    doc.setFontSize(12);
    doc.text('Total:', 130, y);
    doc.text(`$${order.total_amount.toFixed(2)}`, 160, y);
    
    // Payment Method
    y += 20;
    doc.setFontSize(10);
    doc.text(`Payment Method: ${order.payment_method === 'stripe' ? 'Credit Card (Stripe)' : order.payment_method || 'Standard'}`, 10, y);
    
    // Convert to base64
    console.log("Generating PDF output...");
    const pdfOutput = doc.output('datauristring');
    console.log("PDF generated successfully");
    
    return new Response(
      JSON.stringify({ pdf: pdfOutput }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Error generating invoice:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        status: 400
      }
    );
  }
});