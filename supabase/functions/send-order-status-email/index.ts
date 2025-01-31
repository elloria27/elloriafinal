import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const companyInfo = {
  name: 'Elloria Eco Products LTD.',
  address: '229 Dowling Ave W, Winnipeg, MB R3B 2B9',
  phone: '(204) 930-2019',
  email: 'sales@elloria.ca',
  gst: '742031420RT0001',
  logo: 'https://euexcsqvsbkxiwdieepu.supabase.co/storage/v1/object/public/media/logo.png'
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

    const resend = new Resend(RESEND_API_KEY);

    // Create email HTML content with improved styling
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${companyInfo.logo}" alt="${companyInfo.name}" style="max-width: 200px; height: auto;" />
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h1 style="color: #333; text-align: center; margin-bottom: 20px;">Order Status Update</h1>
          <p style="font-size: 16px; color: #666; margin-bottom: 10px;">Dear ${details.customerName},</p>
          <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
            Your order #${details.orderNumber} has been updated to: 
            <strong style="color: #0094F4">${details.newStatus}</strong>
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; margin-bottom: 10px;">Company Information</h2>
          <p style="font-size: 14px; color: #666; margin: 5px 0;">
            ${companyInfo.name}<br>
            ${companyInfo.address}<br>
            Phone: ${companyInfo.phone}<br>
            Email: ${companyInfo.email}<br>
            GST Number: ${companyInfo.gst}
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #666;">
            If you have any questions about your order, please don't hesitate to contact our customer support at 
            <a href="mailto:${companyInfo.email}" style="color: #0094F4; text-decoration: none;">${companyInfo.email}</a>
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            Thank you for choosing ${companyInfo.name}!
          </p>
        </div>
      </div>
    `;

    console.log('Sending email via Resend');
    const emailResponse = await resend.emails.send({
      from: `${companyInfo.name} <orders@elloria.ca>`,
      to: [details.customerEmail],
      subject: `Order Status Update - #${details.orderNumber}`,
      html: emailHtml,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
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