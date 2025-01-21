import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderEmailDetails {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  shippingAddress: {
    address: string;
    region: string;
    country: string;
  };
}

const generatePDFInvoice = (orderDetails: OrderEmailDetails): string => {
  const doc = new jsPDF();
  
  // Add company logo/header
  doc.setFontSize(20);
  doc.text('Elloria', 20, 20);
  
  // Add invoice details
  doc.setFontSize(12);
  doc.text(`Invoice #${orderDetails.orderId}`, 20, 40);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
  
  // Add customer details
  doc.text('Bill To:', 20, 70);
  doc.text(orderDetails.customerName, 20, 80);
  doc.text(orderDetails.shippingAddress.address, 20, 90);
  doc.text(`${orderDetails.shippingAddress.region}, ${orderDetails.shippingAddress.country}`, 20, 100);
  
  // Add items table
  let yPos = 120;
  doc.text('Item', 20, yPos);
  doc.text('Qty', 100, yPos);
  doc.text('Price', 140, yPos);
  doc.text('Total', 180, yPos);
  
  yPos += 10;
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  orderDetails.items.forEach(item => {
    doc.text(item.name, 20, yPos);
    doc.text(item.quantity.toString(), 100, yPos);
    doc.text(`$${item.price.toFixed(2)}`, 140, yPos);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 180, yPos);
    yPos += 10;
  });
  
  // Add total
  yPos += 10;
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.text('Total:', 140, yPos);
  doc.text(`$${orderDetails.total.toFixed(2)}`, 180, yPos);
  
  // Return base64 encoded PDF
  return doc.output('datauristring');
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderDetails: OrderEmailDetails = await req.json();
    console.log('Received order details:', orderDetails);

    // Generate PDF invoice
    const pdfInvoice = generatePDFInvoice(orderDetails);
    console.log('Generated PDF invoice');

    // Create email HTML content
    const emailHtml = `
      <h1>Thank you for your order!</h1>
      <p>Dear ${orderDetails.customerName},</p>
      <p>We're excited to confirm your order #${orderDetails.orderId}.</p>
      
      <h2>Order Details:</h2>
      <ul>
        ${orderDetails.items.map(item => `
          <li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
        `).join('')}
      </ul>
      
      <p><strong>Total Amount:</strong> $${orderDetails.total.toFixed(2)}</p>
      
      <h2>Shipping Address:</h2>
      <p>
        ${orderDetails.shippingAddress.address}<br>
        ${orderDetails.shippingAddress.region}<br>
        ${orderDetails.shippingAddress.country}
      </p>
      
      <p>Your invoice is attached to this email.</p>
      
      <p>Best regards,<br>The Elloria Team</p>
    `;

    // Send email with Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Elloria <orders@elloria.ca>',
        to: [orderDetails.customerEmail],
        subject: `Order Confirmation #${orderDetails.orderId}`,
        html: emailHtml,
        attachments: [
          {
            filename: `invoice-${orderDetails.orderId}.pdf`,
            content: pdfInvoice.split('base64,')[1],
          },
        ],
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log('Email sent successfully:', data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-order-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);