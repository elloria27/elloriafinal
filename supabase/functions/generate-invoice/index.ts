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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    // Fetch order details
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        profiles:profiles(*)
      `)
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    // Create PDF
    const doc = new jsPDF();
    
    // Add logo
    // doc.addImage(logoBase64, 'PNG', 10, 10, 50, 50);
    
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
    doc.text('Bill To:', 10, 85);
    doc.text(`${order.shipping_address.first_name} ${order.shipping_address.last_name}`, 10, 90);
    doc.text(order.shipping_address.address, 10, 95);
    doc.text(`${order.shipping_address.region}, ${order.shipping_address.country}`, 10, 100);
    doc.text(order.shipping_address.email, 10, 105);
    
    // Items Table
    let y = 120;
    doc.text('Item', 10, y);
    doc.text('Qty', 100, y);
    doc.text('Price', 130, y);
    doc.text('Total', 160, y);
    
    y += 10;
    order.items.forEach((item: any) => {
      doc.text(item.name, 10, y);
      doc.text(item.quantity.toString(), 100, y);
      doc.text(`$${item.price.toFixed(2)}`, 130, y);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 160, y);
      y += 10;
    });
    
    y += 10;
    // Subtotal
    doc.text('Subtotal:', 130, y);
    doc.text(`$${order.total_amount.toFixed(2)}`, 160, y);
    
    // Promo code if used
    if (order.applied_promo_code) {
      y += 10;
      doc.text(`Discount (${order.applied_promo_code.code}):`, 130, y);
      doc.text(`-$${order.applied_promo_code.discount_amount.toFixed(2)}`, 160, y);
    }
    
    // GST
    const gstAmount = order.total_amount * 0.05; // 5% GST
    y += 10;
    doc.text('GST (5%):', 130, y);
    doc.text(`$${gstAmount.toFixed(2)}`, 160, y);
    
    // Shipping
    y += 10;
    doc.text('Shipping:', 130, y);
    doc.text(`$${order.shipping_cost || '0.00'}`, 160, y);
    
    // Total
    y += 15;
    doc.setFontSize(12);
    doc.text('Total:', 130, y);
    doc.text(`$${order.total_amount.toFixed(2)}`, 160, y);
    
    // Payment Method
    y += 20;
    doc.setFontSize(10);
    doc.text(`Payment Method: ${order.payment_method === 'stripe' ? 'Credit Card (Stripe)' : order.payment_method}`, 10, y);
    
    // Convert to base64
    const pdfOutput = doc.output('datauristring');
    
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