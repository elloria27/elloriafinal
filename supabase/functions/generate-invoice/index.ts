
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

const generateOrderInvoice = async (orderId: string, doc: any) => {
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

  if (orderError) throw orderError;
  if (!order) throw new Error('Order not found');

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
    
    // Format currency with 2 decimal places
    const formattedPrice = item.price.toFixed(2);
    const formattedTotal = itemTotal.toFixed(2);
    
    // Align numbers to the right
    doc.text(item.quantity.toString(), 140, y - 5);
    doc.text(`$${formattedPrice}`, 160, y - 5);
    doc.text(`$${formattedTotal}`, 180, y - 5);
    
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
};

const generateHRMInvoice = async (invoiceId: string, doc: any) => {
  console.log("Generating HRM invoice for ID:", invoiceId);
  
  // Fetch invoice with related data including settings
  const { data: invoice, error: invoiceError } = await supabaseClient
    .from('hrm_invoices')
    .select(`
      *,
      customer:hrm_customers(*),
      items:hrm_invoice_items(*)
    `)
    .eq('id', invoiceId)
    .single();

  if (invoiceError) throw invoiceError;
  if (!invoice) throw new Error('Invoice not found');

  // Fetch invoice settings
  const { data: settings, error: settingsError } = await supabaseClient
    .from('hrm_invoice_settings')
    .select('*')
    .maybeSingle();

  if (settingsError) throw settingsError;

  console.log("Retrieved invoice data:", invoice);
  console.log("Retrieved settings data:", settings);

  // Use settings data or fallback to defaults
  const companyInfo = settings?.company_info || COMPANY_INFO;
  
  // Add invoice header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 105, 20, { align: 'center' });
  
  // Company Info (from settings)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(companyInfo.name, 10, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(companyInfo.address || '', 10, 45);
  if (settings?.company_phone) {
    doc.text(`Phone: ${settings.company_phone}`, 10, 50);
  }
  if (settings?.company_email) {
    doc.text(`Email: ${settings.company_email}`, 10, 55);
  }
  if (companyInfo.tax_id) {
    doc.text(`Tax ID: ${companyInfo.tax_id}`, 10, 60);
  }

  // Add logo if present
  if (settings?.logo_url) {
    try {
      doc.addImage(settings.logo_url, 'PNG', 150, 20, 40, 40);
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  }
  
  // Invoice Details
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoice.invoice_number}`, 150, 40);
  doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 150, 45);
  doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 150, 50);
  
  // Customer Info
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 10, 75);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Display customer name
  doc.text(invoice.customer.name, 10, 80);
  
  // Improved address display - show complete address with proper formatting
  let currentY = 85;
  
  // Display address street if available
  if (invoice.customer.address?.street) {
    doc.text(invoice.customer.address.street, 10, currentY);
    currentY += 5;
  }
  
  // Display city, province and postal code on one line if available
  let locationLine = '';
  if (invoice.customer.address?.city) locationLine += invoice.customer.address.city;
  if (invoice.customer.address?.province) {
    if (locationLine) locationLine += ', ';
    locationLine += invoice.customer.address.province;
  }
  if (invoice.customer.address?.postal_code) {
    if (locationLine) locationLine += ' ';
    locationLine += invoice.customer.address.postal_code;
  }
  
  if (locationLine) {
    doc.text(locationLine, 10, currentY);
    currentY += 5;
  }
  
  // Display country if available
  if (invoice.customer.address?.country) {
    doc.text(invoice.customer.address.country, 10, currentY);
    currentY += 5;
  }
  
  // Display contact information
  if (invoice.customer.email) {
    doc.text(`Email: ${invoice.customer.email}`, 10, currentY);
    currentY += 5;
  }
  
  if (invoice.customer.phone) {
    doc.text(`Phone: ${invoice.customer.phone}`, 10, currentY);
    currentY += 5;
  }
  
  if (invoice.customer.tax_id) {
    doc.text(`Tax ID: ${invoice.customer.tax_id}`, 10, currentY);
  }
  
  // Items Table Header
  let y = 120;
  doc.setFillColor(240, 240, 240);
  doc.rect(10, y - 5, 190, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Description', 15, y);
  doc.text('Qty', 110, y);
  doc.text('Unit Price', 130, y);
  doc.text('Tax %', 155, y);
  doc.text('Total', 180, y);
  
  // Items with proper number formatting
  doc.setFont('helvetica', 'normal');
  y += 10;
  
  invoice.items.forEach((item: any) => {
    const itemTotal = item.total_price;
    
    // Use wrapText for item description with adjusted maxWidth
    y = wrapText(doc, item.description, 15, y, 90) + 5;
    
    // Format numbers with decimal places
    doc.text(item.quantity.toString(), 110, y - 5);
    doc.text(`$${item.unit_price.toFixed(2)}`, 130, y - 5);
    doc.text(`${item.tax_percentage.toString()}%`, 155, y - 5);
    doc.text(`$${itemTotal.toFixed(2)}`, 180, y - 5);
    
    y += 5;
  });
  
  // Totals section with proper number formatting
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Subtotal:', 150, y);
  doc.text(`$${invoice.subtotal_amount.toFixed(2)}`, 180, y);
  
  y += 10;
  doc.text('Tax Total:', 150, y);
  doc.text(`$${invoice.tax_amount.toFixed(2)}`, 180, y);
  
  // Final Total
  y += 15;
  doc.setFontSize(12);
  doc.text('Total:', 150, y);
  doc.text(`$${invoice.total_amount.toFixed(2)}`, 180, y);
  
  // Fix payment instructions and footer overlap by positioning them properly
  // Payment Instructions from settings
  if (settings?.payment_instructions) {
    y += 25; // Increased spacing
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Instructions:', 10, y);
    doc.setFont('helvetica', 'normal');
    // Use wrapText for payment instructions
    y = wrapText(doc, settings.payment_instructions, 10, y + 5, 180) + 10;
  }
  
  // Add more vertical space before footer
  y += 15;
  
  // Footer Text from settings
  if (settings?.footer_text) {
    doc.setFont('helvetica', 'italic');
    doc.text(settings.footer_text, 105, y, { align: 'center' });
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting invoice generation...");
    const { orderId, invoiceId } = await req.json();
    console.log("Received request with orderId:", orderId, "invoiceId:", invoiceId);

    if (!orderId && !invoiceId) {
      throw new Error('Either Order ID or Invoice ID is required');
    }

    const doc = new jsPDF();

    if (orderId) {
      await generateOrderInvoice(orderId, doc);
    } else if (invoiceId) {
      await generateHRMInvoice(invoiceId, doc);
    }

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
