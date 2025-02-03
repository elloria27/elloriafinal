import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface InventoryLog {
  id: string;
  product_id: string;
  quantity_change: number;
  previous_quantity: number;
  new_quantity: number;
  reason_type: string;
  reason_details: string;
  retailer_name: string | null;
  created_at: string;
  products: {
    name: string;
  };
}

export const InventoryLogs = () => {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      console.log("Fetching inventory logs...");
      const { data, error } = await supabase
        .from('inventory_logs')
        .select(`
          *,
          products (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching logs:", error);
        toast.error("Failed to fetch inventory logs");
        return;
      }

      console.log("Inventory logs fetched:", data);
      setLogs(data);
    } catch (error) {
      console.error("Error in fetchLogs:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Previous</TableHead>
              <TableHead>New</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}
                </TableCell>
                <TableCell>{log.products.name}</TableCell>
                <TableCell className={log.quantity_change >= 0 ? "text-green-600" : "text-red-600"}>
                  {log.quantity_change >= 0 ? `+${log.quantity_change}` : log.quantity_change}
                </TableCell>
                <TableCell>{log.previous_quantity}</TableCell>
                <TableCell>{log.new_quantity}</TableCell>
                <TableCell className="capitalize">
                  {log.reason_type.replace(/_/g, ' ')}
                </TableCell>
                <TableCell>
                  {log.retailer_name ? `Shipped to ${log.retailer_name}` : log.reason_details}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};