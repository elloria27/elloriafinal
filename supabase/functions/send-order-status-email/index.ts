import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderStatusEmailDetails {
  customerEmail: string;
  customerName: string;
  orderId: string;
  orderNumber: string;
  newStatus: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request to send order status update email');
    const details: OrderStatusEmailDetails = await req.json();
    console.log('Order status update details:', details);

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }

    // Create email HTML content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Order Status Update</h1>
        <p>Dear ${details.customerName},</p>
        <p>Your order #${details.orderNumber} has been updated.</p>
        
        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <p>The status of your order has been changed to: <strong>${details.newStatus}</strong></p>
        </div>

        <p>If you have any questions about your order, please don't hesitate to contact our customer support.</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
          Thank you for shopping with us!
        </p>
      </div>
    `;

    console.log('Sending email via Resend');
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Elloria <orders@elloria.ca>',
        to: [details.customerEmail],
        subject: `Order Status Update - #${details.orderNumber}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Error response from Resend:', error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log('Email sent successfully:', data);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-order-status-email function:', error);
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