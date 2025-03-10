
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConsultationRequest {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  orderQuantity: string;
  message: string;
  contactConsent: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received consultation request");
    const data: ConsultationRequest = await req.json();
    console.log("Parsed request data:", data);

    // Store the submission in the database
    console.log("Storing submission in database...");
    const { data: submissionData, error: submissionError } = await supabase
      .from('business_form_submissions')
      .insert([
        {
          full_name: data.fullName,
          company_name: data.companyName,
          email: data.email,
          phone: data.phone,
          business_type: data.orderQuantity,
          message: data.message,
          form_type: 'bulk_order',
          status: 'new',
          terms_accepted: data.contactConsent
        }
      ])
      .select()
      .single();

    if (submissionError) {
      console.error("Error storing submission:", submissionError);
      throw submissionError;
    }

    console.log("Submission stored successfully:", submissionData);

    const recipients = [
      "sales@elloria.ca",
      "mariia_r@elloria.ca",
      "bogdana_v@elloria.ca"
    ];

    // Send notification to Elloria team
    const teamEmailResponse = await resend.emails.send({
      from: "Elloria Custom Solutions <solutions@elloria.ca>",
      to: recipients,
      subject: `New Bulk Order Consultation Request`,
      html: `
        <h1>New Bulk Order Consultation Request</h1>
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Company:</strong> ${data.companyName || "Not provided"}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <h2>Request Details</h2>
        <p><strong>Order Quantity:</strong> ${data.orderQuantity}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });

    // Send confirmation to user
    const userEmailResponse = await resend.emails.send({
      from: "Elloria Custom Solutions <solutions@elloria.ca>",
      to: [data.email],
      subject: "Thank You for Your Interest in Elloria Bulk Orders",
      html: `
        <h1>Thank You for Your Interest!</h1>
        <p>Dear ${data.fullName},</p>
        <p>Thank you for your interest in Elloria's bulk order solutions. We have received your consultation request and our team will review it shortly.</p>
        <p>We will contact you soon to discuss your bulk order requirements and provide you with a customized quote.</p>
        <p>Best regards,<br>The Elloria Team</p>
      `,
    });

    console.log("Emails sent successfully:", { teamEmailResponse, userEmailResponse });

    return new Response(JSON.stringify({ 
      submissionData,
      teamEmailResponse, 
      userEmailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error processing consultation request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
