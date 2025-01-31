import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.12';
import { OrderConfirmationEmail } from './_templates/order-confirmation.tsx';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderEmailDetails {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    region: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount?: {
    code: string;
    amount: number;
  };
  taxes: {
    gst: number;
    amount: number;
  };
  shipping: {
    method: string;
    cost: number;
  };
  total: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request to send order confirmation email');
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }

    const resend = new Resend(RESEND_API_KEY);
    const orderDetails: OrderEmailDetails = await req.json();
    console.log('Order details:', orderDetails);

    // Render the React email template
    const html = await renderAsync(
      React.createElement(OrderConfirmationEmail, orderDetails)
    );

    // Send the email
    console.log('Sending email via Resend');
    const emailResponse = await resend.emails.send({
      from: 'Elloria Eco Products <orders@elloria.ca>',
      to: [orderDetails.customerEmail],
      subject: `Order Confirmation #${orderDetails.orderNumber}`,
      html: html,
    });

    if (!emailResponse.data) {
      throw new Error('Failed to send email');
    }

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse.data }), {
      status: 200,
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