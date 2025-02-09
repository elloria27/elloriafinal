import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Printer, Download, Mail, Edit, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface InvoiceDetailsProps {
  invoiceId: string;
}

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  tax_percentage: number;
}

interface InvoiceDetails {
  id: string;
  invoice_number: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    tax_id: string;
  };
  status: "pending" | "paid" | "overdue" | "cancelled";
  due_date: string;
  created_at: string;
  total_amount: number;
  notes: string;
  items: InvoiceLineItem[];
  last_sent_at?: string;
  last_sent_to?: string;
  subtotal_amount: number;
  tax_amount: number;
}

const InvoiceDetails = ({ invoiceId }: InvoiceDetailsProps) => {
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("hrm_invoices")
          .select(
            `
            *,
            customer:hrm_customers(*),
            items:hrm_invoice_items(*)
          `
          )
          .eq("id", invoiceId)
          .single();

        if (error) throw error;

        const transformedData: InvoiceDetails = {
          id: data.id,
          invoice_number: data.invoice_number,
          customer: {
            name: data.customer.name,
            email: data.customer.email,
            phone: data.customer.phone || '',
            tax_id: data.customer.tax_id || '',
          },
          status: data.status,
          due_date: data.due_date,
          created_at: data.created_at,
          total_amount: data.total_amount,
          notes: data.notes || '',
          items: data.items.map((item: any) => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            tax_percentage: item.tax_percentage,
          })),
          last_sent_at: data.last_sent_at,
          last_sent_to: data.last_sent_to,
          subtotal_amount: data.subtotal_amount,
          tax_amount: data.tax_amount,
        };

        setInvoice(transformedData);
        setNotes(transformedData.notes);
      } catch (error) {
        console.error("Error fetching invoice details:", error);
        toast.error("Failed to load invoice details");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceId]);

  const handleStatusUpdate = async (newStatus: "pending" | "paid" | "overdue" | "cancelled") => {
    try {
      const { error } = await supabase
        .from("hrm_invoices")
        .update({ status: newStatus })
        .eq("id", invoiceId);

      if (error) throw error;

      setInvoice(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Invoice marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast.error("Failed to update invoice status");
    }
  };

  const handleNotesUpdate = async () => {
    try {
      const { error } = await supabase
        .from("hrm_invoices")
        .update({ notes })
        .eq("id", invoiceId);

      if (error) throw error;

      setInvoice(prev => prev ? { ...prev, notes } : null);
      setEditingNotes(false);
      toast.success("Notes updated successfully");
    } catch (error) {
      console.error("Error updating notes:", error);
      toast.error("Failed to update notes");
    }
  };

  const handleEmailInvoice = async () => {
    if (!invoice?.customer.email) {
      toast.error("No customer email address available");
      return;
    }

    try {
      setSending(true);
      const { error } = await supabase.functions.invoke("send-invoice-email", {
        body: { 
          invoiceId: invoice.id,
          recipientEmail: invoice.customer.email
        }
      });

      if (error) throw error;

      toast.success("Invoice sent successfully");
      // Refresh invoice to get updated last_sent info
      window.location.reload();
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("Failed to send invoice");
    } finally {
      setSending(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice #${invoice?.invoice_number}</title>
              <link href="/styles.css" rel="stylesheet">
              <style>
                body { padding: 20px; }
                @media print {
                  body { padding: 0; }
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { invoiceId: invoice?.id }
      });

      if (error) throw error;

      // Convert base64 to blob
      const pdfContent = data.pdf.split(',')[1];
      const blob = new Blob([Uint8Array.from(atob(pdfContent), c => c.charCodeAt(0))], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoice?.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  return (
    <div className="space-y-6">
      <div ref={printRef}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold">Invoice #{invoice.invoice_number}</h2>
            <p className="text-muted-foreground">
              Created on {format(new Date(invoice.created_at), "PPP")}
            </p>
            {invoice.last_sent_at && (
              <p className="text-sm text-muted-foreground">
                Last sent: {format(new Date(invoice.last_sent_at), "PPP")} to {invoice.last_sent_to}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="w-full sm:w-auto"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmailInvoice}
              disabled={sending}
              className="w-full sm:w-auto"
            >
              <Mail className="h-4 w-4 mr-2" />
              {sending ? "Sending..." : "Email"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Name</dt>
                  <dd className="text-sm font-medium">{invoice.customer.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd className="text-sm font-medium">{invoice.customer.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Phone</dt>
                  <dd className="text-sm font-medium">
                    {invoice.customer.phone || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Tax ID</dt>
                  <dd className="text-sm font-medium">
                    {invoice.customer.tax_id || "-"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd>
                    <Badge
                      variant="outline"
                      className={
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "overdue"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Due Date</dt>
                  <dd className="text-sm font-medium">
                    {format(new Date(invoice.due_date), "PPP")}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Total Amount</dt>
                  <dd className="text-sm font-medium">
                    {formatCurrency(invoice.total_amount)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Tax %</TableHead>
                  <TableHead className="text-right">Tax Amount</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => {
                  const subtotal = item.quantity * item.unit_price;
                  const taxAmount = subtotal * (item.tax_percentage / 100);
                  const total = subtotal + taxAmount;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell className="text-right">{item.tax_percentage}%</TableCell>
                      <TableCell className="text-right">{formatCurrency(taxAmount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(total)}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="font-medium">
                  <TableCell colSpan={4}>Subtotal</TableCell>
                  <TableCell colSpan={2} className="text-right">
                    {formatCurrency(invoice.subtotal_amount)}
                  </TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell colSpan={4}>Tax Total</TableCell>
                  <TableCell colSpan={2} className="text-right">
                    {formatCurrency(invoice.tax_amount)}
                  </TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell colSpan={2} className="text-right">
                    {formatCurrency(invoice.total_amount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Notes</CardTitle>
            {!editingNotes ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingNotes(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Notes
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingNotes(false);
                    setNotes(invoice.notes);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNotesUpdate}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editingNotes ? (
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
              placeholder="Add notes about this invoice..."
            />
          ) : (
            <p className="text-sm">{invoice.notes || "No notes added"}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Update invoice status</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => handleStatusUpdate("paid")}
            disabled={invoice.status === "paid"}
            className="w-full sm:w-auto"
          >
            Mark as Paid
          </Button>
          <Button
            variant="outline"
            onClick={() => handleStatusUpdate("overdue")}
            disabled={invoice.status === "overdue"}
            className="w-full sm:w-auto"
          >
            Mark as Overdue
          </Button>
          <Button
            variant="outline"
            onClick={() => handleStatusUpdate("cancelled")}
            disabled={invoice.status === "cancelled"}
            className="w-full sm:w-auto"
          >
            Cancel Invoice
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetails;
