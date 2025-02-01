import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  newsletter: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received contact form submission");
    const formData: ContactFormData = await req.json();
    console.log("Form data:", formData);

    const recipients = [
      "sales@elloria.ca",
      "mariia_r@elloria.ca",
      "bogdana_v@elloria.ca"
    ];

    const emailResponse = await resend.emails.send({
      from: "Elloria Contact Form <contact@elloria.ca>",
      to: recipients,
      subject: `New Contact Form Submission: ${formData.subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${formData.fullName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <h2>Message</h2>
        <p>${formData.message}</p>
        <p><strong>Newsletter Subscription:</strong> ${formData.newsletter ? "Yes" : "No"}</p>
      `,
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
    console.error("Error sending contact email:", error);
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