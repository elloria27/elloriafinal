
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { InvoiceEmail } from "./_templates/invoice-email.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invoiceId } = await req.json();

    // Fetch invoice details
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from('hrm_invoices')
      .select(`
        *,
        customer:hrm_customers(*)
      `)
      .eq('id', invoiceId)
      .single();

    if (invoiceError) throw invoiceError;

    // Render email template
    const html = await renderAsync(
      React.createElement(InvoiceEmail, {
        customerName: invoice.customer.name,
        invoiceNumber: invoice.invoice_number,
        amount: invoice.total_amount,
        dueDate: new Date(invoice.due_date).toLocaleDateString(),
        pdfUrl: invoice.pdf_url,
      })
    );

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Elloria Eco Products <onboarding@resend.dev>",
      to: [invoice.customer.email],
      subject: `Invoice #${invoice.invoice_number} from Elloria Eco Products`,
      html,
    });

    // Log email sending
    const { error: logError } = await supabaseClient
      .from('hrm_invoice_emails')
      .insert({
        invoice_id: invoiceId,
        sent_to: invoice.customer.email,
        status: 'sent',
        email_type: 'invoice',
        template_version: '1.0',
        sent_by: req.headers.get('x-user-id'),
      });

    if (logError) throw logError;

    // Update invoice last sent info
    const { error: updateError } = await supabaseClient
      .from('hrm_invoices')
      .update({
        last_sent_at: new Date().toISOString(),
        last_sent_to: invoice.customer.email,
      })
      .eq('id', invoiceId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify(emailResponse),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      }
    );
  }
});
