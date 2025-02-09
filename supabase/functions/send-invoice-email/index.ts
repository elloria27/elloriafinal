
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { InvoiceEmail } from './_templates/invoice-email.tsx';

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
    const { invoiceId, recipientEmail } = await req.json();
    console.log('Sending invoice email:', { invoiceId, recipientEmail });

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

    // Generate download URL (you'll need to implement this based on your storage setup)
    const downloadUrl = `${Deno.env.get('PUBLIC_SITE_URL')}/invoices/${invoice.id}`;

    // Render email template
    const html = await renderAsync(
      React.createElement(InvoiceEmail, {
        invoiceNumber: invoice.invoice_number,
        customerName: invoice.customer.name,
        amount: invoice.total_amount.toLocaleString('en-CA', {
          style: 'currency',
          currency: 'CAD'
        }),
        dueDate: new Date(invoice.due_date).toLocaleDateString(),
        downloadUrl
      })
    );

    // Send email
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'Elloria Eco Products <invoicing@elloria.ca>',
      to: recipientEmail,
      subject: `Invoice #${invoice.invoice_number} from Elloria Eco Products`,
      html,
    });

    if (emailError) throw emailError;

    // Log email in database
    const { error: logError } = await supabaseClient
      .from('hrm_invoice_emails')
      .insert({
        invoice_id: invoiceId,
        sent_to: recipientEmail,
        status: 'sent',
        template_version: '1.0'
      });

    if (logError) throw logError;

    // Update invoice last sent info
    const { error: updateError } = await supabaseClient
      .from('hrm_invoices')
      .update({
        last_sent_at: new Date().toISOString(),
        last_sent_to: recipientEmail
      })
      .eq('id', invoiceId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, data: emailResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending invoice email:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
