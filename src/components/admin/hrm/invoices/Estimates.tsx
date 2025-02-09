
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
import type { Estimate } from "@/types/hrm";

const Estimates = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEstimates = async () => {
    try {
      const { data, error } = await supabase
        .from("hrm_estimates")
        .select(`
          *,
          customer:hrm_customers(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEstimates(data || []);
    } catch (error) {
      console.error("Error fetching estimates:", error);
      toast.error("Failed to load estimates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "success";
      case "rejected":
        return "destructive";
      case "expired":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Estimates</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Estimate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Estimate</DialogTitle>
            </DialogHeader>
            {/* EstimateForm component will be implemented next */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estimate #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : estimates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No estimates found
                </TableCell>
              </TableRow>
            ) : (
              estimates.map((estimate) => (
                <TableRow key={estimate.id}>
                  <TableCell>{estimate.estimate_number}</TableCell>
                  <TableCell>{estimate.customer?.name}</TableCell>
                  <TableCell>
                    {format(new Date(estimate.created_at!), "PP")}
                  </TableCell>
                  <TableCell>
                    {estimate.total_amount.toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(estimate.status)}>
                      {estimate.status.charAt(0).toUpperCase() +
                        estimate.status.slice(1)}
                    </Badge>
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

export default Estimates;
