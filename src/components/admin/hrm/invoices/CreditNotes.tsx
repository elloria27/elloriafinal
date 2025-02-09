
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
import type { CreditNote } from "@/types/hrm";

const CreditNotes = () => {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCreditNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("hrm_credit_notes")
        .select(`
          *,
          customer:hrm_customers(name),
          invoice:hrm_invoices(invoice_number)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our CreditNote type
      const transformedData = data?.map(note => ({
        ...note,
        status: note.status as 'issued' | 'applied' | 'void',
      })) || [];
      
      setCreditNotes(transformedData);
    } catch (error) {
      console.error("Error fetching credit notes:", error);
      toast.error("Failed to load credit notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditNotes();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "applied":
        return "default";
      case "void":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Credit Notes</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Credit Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Credit Note</DialogTitle>
            </DialogHeader>
            {/* CreditNoteForm component will be implemented next */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Credit Note #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : creditNotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No credit notes found
                </TableCell>
              </TableRow>
            ) : (
              creditNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>{note.credit_note_number}</TableCell>
                  <TableCell>{note.customer?.name}</TableCell>
                  <TableCell>{note.invoice?.invoice_number}</TableCell>
                  <TableCell>
                    {note.amount.toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(note.status)}>
                      {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(note.created_at!), "PP")}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
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

export default CreditNotes;
