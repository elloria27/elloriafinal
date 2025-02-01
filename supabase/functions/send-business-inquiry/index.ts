import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    const recipients = [
      "sales@elloria.ca",
      "mariia_r@elloria.ca",
      "bogdana_v@elloria.ca"
    ];

    // Map attachments to include the original file extension
    const formattedAttachments = inquiry.attachments?.map(attachment => ({
      filename: attachment.name, // This will preserve the original filename with extension
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

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending business inquiry:", error);
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