
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { jsPDF } from "npm:jspdf";

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const COMPANY_INFO = {
  name: 'Elloria Eco Products LTD.',
  address: '229 Dowling Ave W, Winnipeg, MB R3B 2B9',
  phone: '(204) 930-2019',
  email: 'sales@elloria.ca',
  gst: '742031420RT0001',
};

// Helper function to wrap text
const wrapText = (doc: any, text: string, x: number, y: number, maxWidth: number) => {
  const words = text.split(' ');
  let line = '';
  let posY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = doc.getStringUnitWidth(testLine) * doc.getFontSize();
    
    if (testWidth > maxWidth && i > 0) {
      doc.text(line.trim(), x, posY);
      line = words[i] + ' ';
      posY += 5; // Line height
    } else {
      line = testLine;
    }
  }
  
  doc.text(line.trim(), x, posY);
  return posY; // Return the final y position
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting invoice generation...");
    const { invoiceId } = await req.json();
    console.log("Invoice ID received:", invoiceId);

    if (!invoiceId) {
      throw new Error('Invoice ID is required');
    }

    // Fetch the invoice details
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from('hrm_invoices')
      .select(`
        *,
        hrm_customers:customer_id(*),
        hrm_invoice_items(*)
      `)
      .eq('id', invoiceId)
      .single();

    if (invoiceError) {
      console.error("Error fetching invoice:", invoiceError);
      throw invoiceError;
    }

    if (!invoice) {
      console.error("Invoice not found");
      throw new Error('Invoice not found');
    }

    console.log("Invoice data retrieved:", invoice);

    const doc = new jsPDF();
    
    // Add company logo
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    // Company Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY_INFO.name, 10, 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(COMPANY_INFO.address, 10, 45);
    doc.text(`Phone: ${COMPANY_INFO.phone}`, 10, 50);
    doc.text(`Email: ${COMPANY_INFO.email}`, 10, 55);
    doc.text(`GST Number: ${COMPANY_INFO.gst}`, 10, 60);
    
    // Invoice Details
    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoice.invoice_number}`, 150, 40);
    doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 150, 45);
    doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 150, 50);
    
    // Customer Info
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 10, 75);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(invoice.hrm_customers.name, 10, 80);
    doc.text(invoice.hrm_customers.address || 'N/A', 10, 85);
    doc.text(invoice.hrm_customers.email || 'N/A', 10, 90);
    doc.text(invoice.hrm_customers.phone || 'N/A', 10, 95);
    
    // Items Table Header
    let y = 120;
    doc.setFillColor(240, 240, 240);
    doc.rect(10, y - 5, 190, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 15, y);
    doc.text('Qty', 140, y);
    doc.text('Price', 160, y);
    doc.text('Total', 180, y);
    
    // Items
    doc.setFont('helvetica', 'normal');
    y += 10;
    let subtotal = 0;
    
    invoice.hrm_invoice_items.forEach((item: any) => {
      const itemTotal = item.unit_price * item.quantity;
      subtotal += itemTotal;
      
      // Use wrapText for item description
      y = wrapText(doc, item.description, 15, y, 120) + 5;
      
      // Align numbers to the right
      doc.text(item.quantity.toString(), 140, y - 5);
      doc.text(`$${item.unit_price.toFixed(2)}`, 160, y - 5);
      doc.text(`$${itemTotal.toFixed(2)}`, 180, y - 5);
      
      y += 5; // Space between items
    });
    
    // Totals section
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', 150, y);
    doc.text(`$${subtotal.toFixed(2)}`, 180, y);
    
    // Add Tax if applicable
    y += 10;
    const tax = invoice.tax_amount || 0;
    doc.text('Tax:', 150, y);
    doc.text(`$${tax.toFixed(2)}`, 180, y);
    
    // Final Total
    y += 15;
    doc.setFontSize(12);
    const finalTotal = subtotal + tax;
    doc.text('Total:', 150, y);
    doc.text(`$${finalTotal.toFixed(2)}`, 180, y);
    
    // Notes
    if (invoice.notes) {
      y += 20;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Notes:', 10, y);
      doc.setFont('helvetica', 'normal');
      y = wrapText(doc, invoice.notes, 10, y + 5, 180);
    }
    
    // Thank you note
    y += 30;
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your business!', 105, y, { align: 'center' });
    
    console.log("Generating PDF output...");
    const pdfOutput = doc.output('datauristring');
    console.log("PDF generated successfully");
    
    return new Response(
      JSON.stringify({ pdf: pdfOutput }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Error generating invoice:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        status: 400
      }
    );
  }
});
