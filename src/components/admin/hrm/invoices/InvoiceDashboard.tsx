
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
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardStats {
  totalInvoices: number;
  pendingAmount: number;
  overdueAmount: number;
  totalRevenue: number;
  pendingCount: number;
  overdueCount: number;
}

type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

interface DatabaseInvoice {
  id: string;
  status: InvoiceStatus;
  total_amount: number;
  due_date: string;
  created_at: string;
  created_by: string;
  currency: string;
  customer_id: string;
  employee_id: string;
  invoice_number: string;
  notes: string;
  updated_at: string;
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
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: invoices, error } = await supabase
          .from("hrm_invoices")
          .select("*");

        if (error) throw error;

        const currentDate = new Date();
        const initialStats: DashboardStats = {
          totalInvoices: 0,
          pendingAmount: 0,
          overdueAmount: 0,
          totalRevenue: 0,
          pendingCount: 0,
          overdueCount: 0,
        };

        const calculatedStats = (invoices || []).reduce(
          (acc: DashboardStats, invoice: DatabaseInvoice) => {
            acc.totalInvoices++;
            
            if (invoice.status === "paid") {
              acc.totalRevenue += invoice.total_amount;
            } else if (invoice.status === "pending") {
              acc.pendingAmount += invoice.total_amount;
              acc.pendingCount++;
              // Check if pending invoice is overdue
              if (new Date(invoice.due_date) < currentDate) {
                acc.overdueAmount += invoice.total_amount;
                acc.overdueCount++;
              }
            } else if (invoice.status === "overdue") {
              acc.overdueAmount += invoice.total_amount;
              acc.overdueCount++;
            }

            return acc;
          },
          initialStats
        );

        setStats(calculatedStats);
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
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
