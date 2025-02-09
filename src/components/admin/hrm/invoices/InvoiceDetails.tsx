
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
import { Printer, Download, Mail, Edit, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReactToPrint } from "react-to-print";

interface InvoiceDetailsProps {
  invoiceId: string;
  onUpdate?: () => void;
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
}

const InvoiceDetails = ({ invoiceId, onUpdate }: InvoiceDetailsProps) => {
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    fetchInvoiceDetails();
  }, [invoiceId]);

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
      };

      setInvoice(transformedData);
      setEditedNotes(transformedData.notes);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      toast.error("Failed to load invoice details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: "pending" | "paid" | "overdue" | "cancelled") => {
    try {
      const { error } = await supabase
        .from("hrm_invoices")
        .update({ status: newStatus })
        .eq("id", invoiceId);

      if (error) throw error;

      setInvoice(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Invoice marked as ${newStatus}`);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast.error("Failed to update invoice status");
    }
  };

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { invoiceId }
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
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice");
    }
  };

  const handleSendEmail = async () => {
    try {
      setSending(true);
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: { invoiceId }
      });

      if (error) throw error;
      toast.success("Invoice sent successfully");
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("Failed to send invoice");
    } finally {
      setSending(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      const { error } = await supabase
        .from("hrm_invoices")
        .update({ notes: editedNotes })
        .eq("id", invoiceId);

      if (error) throw error;

      setInvoice(prev => prev ? { ...prev, notes: editedNotes } : null);
      setEditing(false);
      toast.success("Notes updated successfully");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating notes:", error);
      toast.error("Failed to update notes");
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Invoice #{invoice.invoice_number}</h2>
          <p className="text-muted-foreground">
            Created on {format(new Date(invoice.created_at), "PPP")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendEmail}
            disabled={sending}
          >
            <Mail className="h-4 w-4 mr-2" />
            {sending ? "Sending..." : "Email"}
          </Button>
        </div>
      </div>

      <div ref={printRef} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {invoice.total_amount.toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <Card>
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
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {item.unit_price.toLocaleString("en-CA", {
                        style: "currency",
                        currency: "CAD",
                      })}
                    </TableCell>
                    <TableCell className="text-right">{item.tax_percentage}%</TableCell>
                    <TableCell className="text-right">
                      {item.total_price.toLocaleString("en-CA", {
                        style: "currency",
                        currency: "CAD",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Notes</CardTitle>
              {!editing && (
                <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Add notes about this invoice..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(false);
                      setEditedNotes(invoice.notes);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSaveNotes}>
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm">{invoice.notes || "No notes added."}</p>
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
            >
              Mark as Paid
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate("overdue")}
              disabled={invoice.status === "overdue"}
            >
              Mark as Overdue
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate("cancelled")}
              disabled={invoice.status === "cancelled"}
            >
              Cancel Invoice
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceDetails;
