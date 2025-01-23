import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request to send order email');
    const orderDetails: OrderEmailDetails = await req.json();
    console.log('Order details:', orderDetails);

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }

    // Create email HTML content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Order Confirmation</h1>
        <p>Dear ${orderDetails.customerName},</p>
        <p>Thank you for your order! Your order number is: <strong>#${orderDetails.orderId}</strong></p>
        
        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h2 style="color: #333; margin-bottom: 15px;">Order Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #ddd;">
                <th style="text-align: left; padding: 8px;">Item</th>
                <th style="text-align: center; padding: 8px;">Quantity</th>
                <th style="text-align: right; padding: 8px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails.items.map(item => `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 8px;">${item.name}</td>
                  <td style="text-align: center; padding: 8px;">${item.quantity}</td>
                  <td style="text-align: right; padding: 8px;">${formatCurrency(item.price * item.quantity)}</td>
                </tr>
              `).join('')}
              <tr style="border-top: 2px solid #ddd;">
                <td colspan="2" style="padding: 8px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 8px; text-align: right;"><strong>${formatCurrency(orderDetails.total)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h2 style="color: #333; margin-bottom: 15px;">Shipping Address</h2>
          <p style="margin: 5px 0;">${orderDetails.shippingAddress.address}</p>
          <p style="margin: 5px 0;">${orderDetails.shippingAddress.region}</p>
          <p style="margin: 5px 0;">${orderDetails.shippingAddress.country}</p>
        </div>

        <p style="margin-top: 20px;">We'll notify you when your order ships.</p>
        <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
          If you have any questions, please contact our customer support.
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
        to: [orderDetails.customerEmail],
        subject: `Order Confirmation #${orderDetails.orderId}`,
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