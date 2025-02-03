import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface InventoryLog {
  id: string;
  product_id: string;
  quantity_change: number;
  previous_quantity: number;
  new_quantity: number;
  reason_type: string;
  reason_details: string | null;
  retailer_name: string | null;
  created_at: string;
  product: Product;
}

export const InventoryLogs = () => {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from("inventory_logs")
          .select(`
            *,
            product:products(*)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLogs(data);
      } catch (error) {
        console.error("Error fetching inventory logs:", error);
        toast.error("Failed to fetch inventory logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const formatReasonType = (type: string) => {
    return type.split("_").map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(" ");
  };

  if (loading) {
    return <div>Loading logs...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Stock Adjustment History</h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>New Stock</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
              </TableCell>
              <TableCell className="font-medium">{log.product.name}</TableCell>
              <TableCell>
                <Badge variant={log.quantity_change >= 0 ? "success" : "destructive"}>
                  {log.quantity_change >= 0 ? "+" : ""}{log.quantity_change}
                </Badge>
              </TableCell>
              <TableCell>{log.new_quantity}</TableCell>
              <TableCell>
                {formatReasonType(log.reason_type)}
                {log.retailer_name && ` (${log.retailer_name})`}
              </TableCell>
              <TableCell>{log.reason_details || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};