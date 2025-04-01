
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Download, Send } from "lucide-react";

interface InvoiceDetailsProps {
  invoiceId: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_percentage: number;
  total_price: number;
}

const InvoiceDetails = ({ invoiceId }: InvoiceDetailsProps) => {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [customer, setCustomer] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      setLoading(true);
      
      try {
        // Fetch invoice and items
        const { data: invoiceData, error: invoiceError } = await supabase
          .from("hrm_invoices")
          .select(`
            *,
            items:hrm_invoice_items(*)
          `)
          .eq("id", invoiceId)
          .single();

        if (invoiceError) throw invoiceError;
        
        setInvoice(invoiceData);
        setItems(invoiceData.items || []);

        // Fetch customer data
        if (invoiceData.customer_id) {
          const { data: customerData, error: customerError } = await supabase
            .from("hrm_customers")
            .select("*")
            .eq("id", invoiceData.customer_id)
            .single();

          if (customerError) throw customerError;
          
          setCustomer(customerData);
        }
      } catch (error) {
        console.error("Error fetching invoice details:", error);
        toast.error("Failed to load invoice details");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceId]);

  const handleSendEmail = async () => {
    if (!invoice || !customer) return;
    
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          invoiceId: invoice.id,
          recipientEmail: customer.email
        }
      });

      if (error) throw error;
      
      toast.success(`Invoice sent to ${customer.email}`);
      
      // Record email in the database
      await supabase.from('hrm_invoice_emails').insert({
        invoice_id: invoice.id,
        sent_to: customer.email,
        status: 'sent',
        email_type: 'invoice'
      });
      
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Failed to send invoice');
    } finally {
      setSending(false);
    }
  };

  const handleDownload = async () => {
    if (!invoice) return;
    
    setDownloading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { invoiceId: invoice.id }
      });

      if (error) throw error;
      
      if (data?.pdf) {
        const link = document.createElement('a');
        link.href = data.pdf;
        link.download = `Invoice_${invoice.invoice_number}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Invoice downloaded successfully');
      } else {
        throw new Error('No PDF data returned');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  // Format currency with 2 decimal places
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) {
    return <div className="p-4">Invoice not found</div>;
  }

  return (
    <div className="space-y-6 text-sm">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-semibold">Invoice #{invoice.invoice_number}</h3>
          <p className="text-muted-foreground">
            Created: {format(new Date(invoice.created_at), "MMMM d, yyyy")}
          </p>
          <p className="text-muted-foreground">
            Due: {format(new Date(invoice.due_date), "MMMM d, yyyy")}
          </p>
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                invoice.status === "paid"
                  ? "bg-green-100 text-green-800"
                  : invoice.status === "overdue"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button 
            onClick={handleSendEmail} 
            disabled={sending} 
            className="w-full md:w-auto"
            variant="outline"
          >
            <Send className="h-4 w-4 mr-2" />
            {sending ? "Sending..." : "Send to Client"}
          </Button>
          
          <Button 
            onClick={handleDownload} 
            disabled={downloading} 
            className="w-full md:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From section */}
        <div className="space-y-1">
          <h4 className="font-medium">From:</h4>
          <p className="font-semibold">{invoice.company_info?.name || 'Your Company'}</p>
          <p className="text-sm">{invoice.company_info?.address || 'Company Address'}</p>
          <p className="text-sm">
            {invoice.company_info?.email && `Email: ${invoice.company_info.email}`}
          </p>
          <p className="text-sm">
            {invoice.company_info?.phone && `Phone: ${invoice.company_info.phone}`}
          </p>
          {invoice.company_info?.tax_id && (
            <p className="text-sm">Tax ID: {invoice.company_info.tax_id}</p>
          )}
        </div>

        {/* Customer section */}
        <div className="space-y-1">
          <h4 className="font-medium">To:</h4>
          {customer ? (
            <>
              <p className="font-semibold">{customer.name}</p>
              <p className="text-sm">
                {customer.address?.street && 
                  `${customer.address.street}${customer.address.city ? ', ' : ''}`}
                {customer.address?.city}
              </p>
              {(customer.address?.province || customer.address?.postal_code) && (
                <p className="text-sm">
                  {customer.address.province && `${customer.address.province}${customer.address.postal_code ? ', ' : ''}`}
                  {customer.address.postal_code}
                </p>
              )}
              <p className="text-sm">{customer.address?.country}</p>
              <p className="text-sm">Email: {customer.email}</p>
              {customer.phone && <p className="text-sm">Phone: {customer.phone}</p>}
              {customer.tax_id && <p className="text-sm">Tax ID: {customer.tax_id}</p>}
            </>
          ) : (
            <p>No customer information</p>
          )}
        </div>
      </div>

      {/* Table for desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-1">Description</th>
              <th className="text-right py-2 px-1">Quantity</th>
              <th className="text-right py-2 px-1">Unit Price</th>
              <th className="text-right py-2 px-1">Tax %</th>
              <th className="text-right py-2 px-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2 px-1">{item.description}</td>
                  <td className="text-right py-2 px-1">{item.quantity}</td>
                  <td className="text-right py-2 px-1">${formatAmount(item.unit_price)}</td>
                  <td className="text-right py-2 px-1">{item.tax_percentage}%</td>
                  <td className="text-right py-2 px-1">${formatAmount(item.total_price)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-right py-2 px-1 font-medium">
                Subtotal:
              </td>
              <td className="text-right py-2 px-1">${formatAmount(invoice.subtotal_amount)}</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-right py-2 px-1 font-medium">
                Tax:
              </td>
              <td className="text-right py-2 px-1">${formatAmount(invoice.tax_amount)}</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-right py-2 px-1 font-semibold">
                Total:
              </td>
              <td className="text-right py-2 px-1 font-semibold">
                ${formatAmount(invoice.total_amount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile layout - improved with better spacing and layout */}
      <div className="md:hidden space-y-4">
        <h4 className="font-medium">Invoice Items</h4>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="border rounded-md p-3 space-y-2">
              <p className="font-medium">{item.description}</p>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="text-right">{item.quantity}</span>
                
                <span className="text-muted-foreground">Unit Price:</span>
                <span className="text-right">${formatAmount(item.unit_price)}</span>
                
                <span className="text-muted-foreground">Tax:</span>
                <span className="text-right">{item.tax_percentage}%</span>
                
                <span className="text-muted-foreground font-medium">Amount:</span>
                <span className="text-right font-medium">${formatAmount(item.total_price)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 border rounded-md">
            No items found
          </div>
        )}
        
        {/* Summary for mobile - improved with better spacing */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal:</span>
            <span>${formatAmount(invoice.subtotal_amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Tax:</span>
            <span>${formatAmount(invoice.tax_amount)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">${formatAmount(invoice.total_amount)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="border-t pt-4">
          <h4 className="font-medium">Notes</h4>
          <p className="text-sm mt-1">{invoice.notes}</p>
        </div>
      )}

      {invoice.payment_instructions && (
        <div className="border-t pt-4">
          <h4 className="font-medium">Payment Instructions</h4>
          <p className="text-sm mt-1">{invoice.payment_instructions}</p>
        </div>
      )}

      {invoice.footer_text && (
        <div className="border-t pt-4 text-center text-sm text-muted-foreground">
          {invoice.footer_text}
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;
