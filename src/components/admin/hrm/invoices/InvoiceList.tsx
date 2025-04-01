
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import InvoiceForm from "./InvoiceForm";
import InvoiceDetails from "./InvoiceDetails";
import type { Invoice } from "@/types/hrm";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [showNewInvoiceDialog, setShowNewInvoiceDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from("hrm_invoices")
        .select(`
          id,
          invoice_number,
          created_at,
          due_date,
          total_amount,
          status,
          discount_type,
          subtotal_amount,
          tax_amount,
          currency,
          customer_id,
          customer:hrm_customers(
            name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const transformedInvoices: Invoice[] = (data || []).map(invoice => ({
        ...invoice,
        discount_type: (invoice.discount_type as "fixed" | "percentage" | null) || undefined,
        customer: {
          name: invoice.customer?.name || '',
          email: invoice.customer?.email || '',
        }
      }));

      setInvoices(transformedInvoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      // First delete related emails
      const { error: emailsError } = await supabase
        .from("hrm_invoice_emails")
        .delete()
        .eq("invoice_id", invoiceId);

      if (emailsError) throw emailsError;

      // Then delete related invoice items
      const { error: itemsError } = await supabase
        .from("hrm_invoice_items")
        .delete()
        .eq("invoice_id", invoiceId);

      if (itemsError) throw itemsError;

      // Finally delete the invoice
      const { error: invoiceError } = await supabase
        .from("hrm_invoices")
        .delete()
        .eq("id", invoiceId);

      if (invoiceError) throw invoiceError;

      toast.success("Invoice deleted successfully");
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    }
    setShowDeleteDialog(false);
    setInvoiceToDelete(null);
  };

  // Format currency with 2 decimal places
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    }).format(amount);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const renderMobileInvoiceCard = (invoice: Invoice) => {
    return (
      <div key={invoice.id} className="border rounded-md p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium">Invoice #{invoice.invoice_number}</h3>
            <p className="text-sm text-muted-foreground">
              {invoice.customer?.name || "No customer"}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(invoice.status)}`}
          >
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-muted-foreground">Created:</span>
          <span>{format(new Date(invoice.created_at), "MMM d, yyyy")}</span>
          
          <span className="text-muted-foreground">Due date:</span>
          <span>{format(new Date(invoice.due_date), "MMM d, yyyy")}</span>
          
          <span className="text-muted-foreground">Amount:</span>
          <span className="font-medium">{formatAmount(invoice.total_amount)}</span>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setSelectedInvoiceId(invoice.id);
                setShowDetailsDialog(true);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setSelectedInvoiceId(invoice.id);
                setShowEditDialog(true);
              }}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setInvoiceToDelete(invoice.id);
                setShowDeleteDialog(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-lg font-medium">Invoices</h3>
        <Dialog open={showNewInvoiceDialog} onOpenChange={setShowNewInvoiceDialog}>
          <DialogTrigger asChild>
            <Button size={isMobile ? "sm" : "default"} className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className={isMobile ? "w-[95%] p-4" : "max-w-4xl"}>
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <InvoiceForm
              onSuccess={() => {
                setShowNewInvoiceDialog(false);
                fetchInvoices();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          No invoices found
        </div>
      ) : isMobile ? (
        // Mobile view - cards
        <div className="space-y-4">
          {invoices.map((invoice) => renderMobileInvoiceCard(invoice))}
        </div>
      ) : (
        // Desktop view - table
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>{invoice.customer?.name}</TableCell>
                  <TableCell>
                    {format(new Date(invoice.created_at), "PP")}
                  </TableCell>
                  <TableCell>{format(new Date(invoice.due_date), "PP")}</TableCell>
                  <TableCell>
                    {formatAmount(invoice.total_amount)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "overdue"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedInvoiceId(invoice.id);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedInvoiceId(invoice.id);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setInvoiceToDelete(invoice.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className={isMobile ? "w-[95%] p-4" : "max-w-4xl"}>
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoiceId && (
            <InvoiceDetails invoiceId={selectedInvoiceId} />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className={isMobile ? "w-[95%] p-4" : "max-w-4xl"}>
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          {selectedInvoiceId && (
            <InvoiceForm
              invoiceId={selectedInvoiceId}
              onSuccess={() => {
                setShowEditDialog(false);
                fetchInvoices();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => invoiceToDelete && handleDeleteInvoice(invoiceToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceList;
