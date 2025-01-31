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

const COMPANY_INFO = {
  name: 'Elloria Eco Products LTD.',
  address: '229 Dowling Ave W, Winnipeg, MB R3B 2B9',
  phone: '(204) 930-2019',
  email: 'sales@elloria.ca',
  gst: '742031420RT0001',
  logo: '/lovable-uploads/08d815c8-551d-4278-813a-fe884abd443d.png'
};

serve(async (req) => {
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

    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY_INFO.name, 10, 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(COMPANY_INFO.address, 10, 45);
    doc.text(`Phone: ${COMPANY_INFO.phone}`, 10, 50);
    doc.text(`Email: ${COMPANY_INFO.email}`, 10, 55);
    doc.text(`GST Number: ${COMPANY_INFO.gst}`, 10, 60);
    
    doc.setFontSize(10);
    doc.text(`Invoice #: ${order.order_number}`, 150, 40);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 150, 45);
    
    const shippingAddress = order.shipping_address;
    const customerName = order.profiles?.full_name || 
      (shippingAddress.first_name && shippingAddress.last_name 
        ? `${shippingAddress.first_name} ${shippingAddress.last_name}`.trim() 
        : shippingAddress.first_name || shippingAddress.last_name || 'Valued Customer');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 10, 75);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(customerName, 10, 80);
    doc.text(shippingAddress.address, 10, 85);
    doc.text(`${shippingAddress.region}, ${shippingAddress.country}`, 10, 90);
    doc.text(order.profiles?.email || shippingAddress.email || order.email_address || 'N/A', 10, 95);
    doc.text(shippingAddress.phone || 'N/A', 10, 100);
    
    let y = 120;
    doc.setFillColor(240, 240, 240);
    doc.rect(10, y - 5, 190, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 15, y);
    doc.text('Qty', 100, y);
    doc.text('Price', 130, y);
    doc.text('Total', 160, y);
    
    doc.setFont('helvetica', 'normal');
    y += 10;
    let subtotal = 0;
    order.items.forEach((item: any) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      doc.text(item.name, 15, y);
      doc.text(item.quantity.toString(), 100, y);
      doc.text(`$${item.price.toFixed(2)}`, 130, y);
      doc.text(`$${itemTotal.toFixed(2)}`, 160, y);
      y += 10;
    });
    
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', 130, y);
    doc.text(`$${subtotal.toFixed(2)}`, 160, y);
    
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

    // Add shipping cost
    if (order.shipping_cost) {
      y += 10;
      doc.text('Shipping:', 130, y);
      doc.text(`$${order.shipping_cost.toFixed(2)}`, 160, y);
    }

    // Add GST
    if (order.gst) {
      y += 10;
      doc.text('GST (5%):', 130, y);
      doc.text(`$${order.gst.toFixed(2)}`, 160, y);
    }
    
    y += 15;
    doc.setFontSize(12);
    doc.text('Total:', 130, y);
    doc.text(`$${order.total_amount.toFixed(2)}`, 160, y);
    
    y += 20;
    doc.setFontSize(10);
    doc.text(`Payment Method: ${order.payment_method === 'stripe' ? 'Credit Card (Stripe)' : order.payment_method || 'Standard'}`, 10, y);
    
    y += 30;
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for choosing Elloria Eco Products!', 105, y, { align: 'center' });
    
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