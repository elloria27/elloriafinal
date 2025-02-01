import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    // Send email to customer
    await resend.emails.send({
      from: "Elloria <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Elloria's Exclusive Offers!",
      html: `
        <h1>Thank You for Subscribing!</h1>
        <p>Welcome to Elloria's exclusive offers program! You'll be the first to know about our best deals and new products.</p>
        <p>Use code <strong>THANKYOU10</strong> for 10% off your next purchase!</p>
        <p>Best regards,<br>The Elloria Team</p>
      `,
    });

    // Send notification to admin team
    await resend.emails.send({
      from: "Elloria Notifications <onboarding@resend.dev>",
      to: ["sales@elloria.ca", "mariia_r@elloria.ca", "bogdana_v@elloria.ca"],
      subject: "New Subscription from Thanks Page",
      html: `
        <h1>New Subscription</h1>
        <p>A new user has subscribed to exclusive offers:</p>
        <p>Email: ${email}</p>
        <p>Source: Thanks Page</p>
      `,
    });

    return new Response(
      JSON.stringify({ message: "Subscription successful" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing subscription:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process subscription" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});