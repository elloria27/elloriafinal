
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { RecurringInvoice } from "@/types/hrm";

const RecurringInvoices = () => {
  const [invoices, setInvoices] = useState<RecurringInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecurringInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from("hrm_recurring_invoices")
        .select(`
          *,
          customer:hrm_customers(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our RecurringInvoice type
      const transformedData = data?.map(invoice => ({
        ...invoice,
        frequency: invoice.frequency as 'weekly' | 'monthly' | 'quarterly' | 'yearly',
      })) || [];
      
      setInvoices(transformedData);
    } catch (error) {
      console.error("Error fetching recurring invoices:", error);
      toast.error("Failed to load recurring invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringInvoices();
  }, []);

  const getNextGenerationLabel = (invoice: RecurringInvoice) => {
    if (!invoice.next_generation) return "Not scheduled";
    return format(new Date(invoice.next_generation), "PPP");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recurring Invoices</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Recurring Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Recurring Invoice</DialogTitle>
            </DialogHeader>
            {/* RecurringInvoiceForm component will be implemented next */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Next Generation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No recurring invoices found
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.customer?.name}</TableCell>
                  <TableCell className="capitalize">{invoice.frequency}</TableCell>
                  <TableCell>{getNextGenerationLabel(invoice)}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.is_active ? "default" : "secondary"}>
                      {invoice.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecurringInvoices;
