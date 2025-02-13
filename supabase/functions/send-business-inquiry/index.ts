
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

interface BusinessInquiry {
  fullName: string;
  companyName: string;
  email: string;
  phoneNumber?: string;
  businessType: string;
  message: string;
  attachments?: {
    name: string;
    content: string;
  }[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received business inquiry request");
    const inquiry: BusinessInquiry = await req.json();
    console.log("Parsed inquiry data:", { ...inquiry, attachments: inquiry.attachments?.length });

    // Store the submission in the database
    console.log("Storing submission in database...");
    const { data: submissionData, error: submissionError } = await supabase
      .from('business_form_submissions')
      .insert([
        {
          full_name: inquiry.fullName,
          company_name: inquiry.companyName,
          email: inquiry.email,
          phone: inquiry.phoneNumber,
          business_type: inquiry.businessType,
          message: inquiry.message,
          form_type: 'business_contact',
          status: 'new',
          attachments: inquiry.attachments,
          terms_accepted: true
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

    // Map attachments to include the original file extension
    const formattedAttachments = inquiry.attachments?.map(attachment => ({
      filename: attachment.name,
      content: attachment.content,
    }));

    console.log("Sending email with attachments:", formattedAttachments?.length);

    const emailResponse = await resend.emails.send({
      from: "Elloria Business <business@elloria.ca>",
      to: recipients,
      subject: "New Business Inquiry",
      html: `
        <h1>New Business Inquiry</h1>
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${inquiry.fullName}</p>
        <p><strong>Company:</strong> ${inquiry.companyName}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phoneNumber || "Not provided"}</p>
        <p><strong>Business Type:</strong> ${inquiry.businessType}</p>
        <h2>Message</h2>
        <p>${inquiry.message}</p>
      `,
      attachments: formattedAttachments,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ submissionData, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in business inquiry handler:", error);
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
