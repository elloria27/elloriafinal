
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

interface RegistrationData {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  message: string;
  termsAccepted: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received sustainability program registration");
    const data: RegistrationData = await req.json();
    console.log("Registration data:", data);

    // Store in business_form_submissions
    console.log("Storing submission in database...");
    const { data: submissionData, error: submissionError } = await supabase
      .from('business_form_submissions')
      .insert([
        {
          full_name: data.fullName,
          company_name: data.companyName,
          email: data.email,
          phone: data.phone,
          message: data.message,
          form_type: 'sustainability',
          status: 'new',
          terms_accepted: data.termsAccepted
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
      from: "Elloria Sustainability Program <sustainability@elloria.ca>",
      to: recipients,
      subject: "New Sustainability Program Registration",
      html: `
        <h1>New Sustainability Program Registration</h1>
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Company:</strong> ${data.companyName || "Not provided"}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <h2>Message</h2>
        <p>${data.message}</p>
      `,
    });

    // Send confirmation to user
    const userEmailResponse = await resend.emails.send({
      from: "Elloria Sustainability Program <sustainability@elloria.ca>",
      to: [data.email],
      subject: "Thank You for Your Interest in Our Sustainability Program",
      html: `
        <h1>Thank You for Your Interest!</h1>
        <p>Dear ${data.fullName},</p>
        <p>Thank you for your interest in joining the Elloria Sustainability Program. We have received your registration and our team will review it shortly.</p>
        <p>We will contact you soon to discuss the next steps and how we can work together towards a more sustainable future.</p>
        <p>Best regards,<br>The Elloria Sustainability Team</p>
      `,
    });

    console.log("Emails sent successfully:", { teamEmailResponse, userEmailResponse });

    return new Response(JSON.stringify({ teamEmailResponse, userEmailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error processing registration:", error);
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
