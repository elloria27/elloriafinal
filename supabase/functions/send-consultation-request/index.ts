import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConsultationRequest {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  inquiryType: "Private Label" | "Bulk Purchase" | "Custom Packaging" | "Other";
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received consultation request");
    const data: ConsultationRequest = await req.json();
    console.log("Request data:", data);

    const recipients = [
      "sales@elloria.ca",
      "mariia_r@elloria.ca",
      "bogdana_v@elloria.ca"
    ];

    // Send notification to Elloria team
    const teamEmailResponse = await resend.emails.send({
      from: "Elloria Custom Solutions <solutions@elloria.ca>",
      to: recipients,
      subject: `New Consultation Request: ${data.inquiryType}`,
      html: `
        <h1>New Consultation Request</h1>
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Company:</strong> ${data.companyName || "Not provided"}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <h2>Request Details</h2>
        <p><strong>Type:</strong> ${data.inquiryType}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });

    // Send confirmation to user
    const userEmailResponse = await resend.emails.send({
      from: "Elloria Custom Solutions <solutions@elloria.ca>",
      to: [data.email],
      subject: "Thank You for Your Interest in Elloria Custom Solutions",
      html: `
        <h1>Thank You for Your Interest!</h1>
        <p>Dear ${data.fullName},</p>
        <p>Thank you for your interest in Elloria Custom Solutions. We have received your consultation request and our team will review it shortly.</p>
        <p>We will contact you soon to discuss how we can help with your ${data.inquiryType.toLowerCase()} needs.</p>
        <p>Best regards,<br>The Elloria Team</p>
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