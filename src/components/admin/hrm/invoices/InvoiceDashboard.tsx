
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DashboardStats {
  totalInvoices: number;
  pendingAmount: number;
  overdueAmount: number;
  totalRevenue: number;
  pendingCount: number;
  overdueCount: number;
}

const InvoiceDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    totalRevenue: 0,
    pendingCount: 0,
    overdueCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all invoices for statistics
        const { data: invoices, error } = await supabase
          .from("hrm_invoices")
          .select("*");

        if (error) throw error;

        const currentDate = new Date();
        const stats = (invoices || []).reduce(
          (acc, invoice) => {
            acc.totalInvoices++;
            
            if (invoice.status === "paid") {
              acc.totalRevenue += invoice.total_amount;
            } else if (invoice.status === "pending") {
              acc.pendingAmount += invoice.total_amount;
              acc.pendingCount++;
            } else if (
              invoice.status === "overdue" || 
              (invoice.status === "pending" && new Date(invoice.due_date) < currentDate)
            ) {
              acc.overdueAmount += invoice.total_amount;
              acc.overdueCount++;
            }

            return acc;
          },
          {
            totalInvoices: 0,
            pendingAmount: 0,
            overdueAmount: 0,
            totalRevenue: 0,
            pendingCount: 0,
            overdueCount: 0,
          }
        );

        setStats(stats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
            ) : (
              stats.totalInvoices
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            All time invoices generated
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
            ) : (
              formatCurrency(stats.pendingAmount)
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingCount} pending invoices
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
            ) : (
              formatCurrency(stats.overdueAmount)
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.overdueCount} overdue invoices
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
            ) : (
              formatCurrency(stats.totalRevenue)
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            From paid invoices
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDashboard;
