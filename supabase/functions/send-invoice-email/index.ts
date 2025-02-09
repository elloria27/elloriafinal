
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.12';
import { InvoiceEmail } from './_templates/invoice-email.tsx';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invoiceId, recipientEmail } = await req.json();

    if (!invoiceId || !recipientEmail) {
      throw new Error('Invoice ID and recipient email are required');
    }

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
    if (!invoice) throw new Error('Invoice not found');

    // Generate the download URL for the invoice
    const downloadUrl = `${Deno.env.get('PUBLIC_SITE_URL')}/admin?tab=invoices&view=${invoiceId}`;

    // Render the email template
    const html = await renderAsync(
      InvoiceEmail({
        invoiceNumber: invoice.invoice_number,
        customerName: invoice.customer.name,
        dueDate: new Date(invoice.due_date).toLocaleDateString(),
        totalAmount: invoice.total_amount,
        currency: invoice.currency,
        downloadUrl,
      })
    );

    // Send the email
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'Elloria Eco Products <sales@elloria.ca>',
      to: [recipientEmail],
      subject: `Invoice ${invoice.invoice_number} from Elloria Eco Products`,
      html,
    });

    if (emailError) throw emailError;

    // Record the email in our tracking table
    const { error: trackingError } = await supabaseClient
      .from('hrm_invoice_emails')
      .insert({
        invoice_id: invoiceId,
        sent_to: recipientEmail,
        sent_by: (await supabaseClient.auth.getUser()).data.user?.id,
        template_version: '1.0',
      });

    if (trackingError) throw trackingError;

    // Update the invoice's last sent info
    const { error: updateError } = await supabaseClient
      .from('hrm_invoices')
      .update({
        last_sent_at: new Date().toISOString(),
        last_sent_to: recipientEmail,
      })
      .eq('id', invoiceId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, data: emailResult }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
