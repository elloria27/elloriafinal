
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

// Helper function to wrap text
const wrapText = (doc: any, text: string, x: number, y: number, maxWidth: number) => {
  const words = text.split(' ');
  let line = '';
  let posY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = doc.getStringUnitWidth(testLine) * doc.getFontSize();
    
    if (testWidth > maxWidth && i > 0) {
      doc.text(line.trim(), x, posY);
      line = words[i] + ' ';
      posY += 5; // Line height
    } else {
      line = testLine;
    }
  }
  
  doc.text(line.trim(), x, posY);
  return posY; // Return the final y position
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

    // First fetch the order details
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

    // Fetch current product data for all products in the order
    const productIds = order.items.map((item: any) => item.id);
    const { data: products, error: productsError } = await supabaseClient
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productsError) {
      console.error("Error fetching products:", productsError);
      throw productsError;
    }

    // Create a map of product IDs to their current data
    const productMap = products.reduce((acc: any, product: any) => {
      acc[product.id] = product;
      return acc;
    }, {});

    console.log("Order data retrieved:", order);
    console.log("Products data retrieved:", products);

    const doc = new jsPDF();
    
    // Add company logo
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    // Company Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY_INFO.name, 10, 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(COMPANY_INFO.address, 10, 45);
    doc.text(`Phone: ${COMPANY_INFO.phone}`, 10, 50);
    doc.text(`Email: ${COMPANY_INFO.email}`, 10, 55);
    doc.text(`GST Number: ${COMPANY_INFO.gst}`, 10, 60);
    
    // Invoice Details
    doc.setFontSize(10);
    doc.text(`Invoice #: ${order.order_number}`, 150, 40);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 150, 45);
    
    // Customer Info
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
    
    // Items Table Header
    let y = 120;
    doc.setFillColor(240, 240, 240);
    doc.rect(10, y - 5, 190, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 15, y);
    doc.text('Qty', 140, y);
    doc.text('Price', 160, y);
    doc.text('Total', 180, y);
    
    // Items
    doc.setFont('helvetica', 'normal');
    y += 10;
    let subtotal = 0;
    
    order.items.forEach((item: any) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      // Use current product name if available, fallback to item name
      const currentProduct = productMap[item.id];
      const productName = currentProduct ? currentProduct.name : item.name;
      
      // Use wrapText for item name with adjusted maxWidth
      y = wrapText(doc, productName, 15, y, 120) + 5;
      
      // Align numbers to the right
      doc.text(item.quantity.toString(), 140, y - 5);
      doc.text(`$${item.price.toFixed(2)}`, 160, y - 5);
      doc.text(`$${itemTotal.toFixed(2)}`, 180, y - 5);
      
      y += 5; // Space between items
    });
    
    // Totals section
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', 150, y);
    doc.text(`$${subtotal.toFixed(2)}`, 180, y);
    
    // Promo code if used
    let discount = 0;
    if (order.applied_promo_code) {
      y += 10;
      if (order.applied_promo_code.type === 'percentage') {
        discount = subtotal * (order.applied_promo_code.value / 100);
      } else {
        discount = order.applied_promo_code.value;
      }
      doc.text(`Discount (${order.applied_promo_code.code}):`, 150, y);
      doc.text(`-$${discount.toFixed(2)}`, 180, y);
    }

    // Add Shipping Cost
    y += 10;
    const shippingCost = order.shipping_cost || 0;
    doc.text('Shipping:', 150, y);
    doc.text(`$${shippingCost.toFixed(2)}`, 180, y);

    // Add GST
    y += 10;
    const gst = order.gst || 0;
    doc.text('GST:', 150, y);
    doc.text(`$${gst.toFixed(2)}`, 180, y);
    
    // Final Total
    y += 15;
    doc.setFontSize(12);
    const finalTotal = subtotal - discount + shippingCost + gst;
    doc.text('Total:', 150, y);
    doc.text(`$${finalTotal.toFixed(2)}`, 180, y);
    
    // Payment Method
    y += 20;
    doc.setFontSize(10);
    doc.text(`Payment Method: ${order.payment_method === 'stripe' ? 'Credit Card (Stripe)' : order.payment_method || 'Standard'}`, 10, y);
    
    // Thank you note
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
