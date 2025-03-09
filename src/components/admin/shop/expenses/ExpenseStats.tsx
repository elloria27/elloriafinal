
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const ExpenseStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["expense-stats"],
    queryFn: async () => {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      // Get all expenses for the current month regardless of status
      const { data: monthlyExpenses } = await supabase
        .from("shop_company_expenses")
        .select("amount, status")
        .gte("date", firstDayOfMonth.toISOString())
        .lt("date", today.toISOString());

      // Get pending payments
      const { data: pendingPayments } = await supabase
        .from("shop_company_expenses")
        .select("amount")
        .eq("status", "pending");

      // Get category breakdown
      const { data: categoryBreakdown } = await supabase
        .from("shop_company_expenses")
        .select("category, amount, status")
        .gte("date", firstDayOfMonth.toISOString())
        .lt("date", today.toISOString());

      // Calculate totals including both pending and paid expenses for this month
      const totalPaid = monthlyExpenses?.filter(exp => exp.status === 'paid')
        .reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
      
      const totalPending = pendingPayments?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
      
      // Calculate the total for this month (both paid and pending)
      const totalThisMonth = totalPaid;

      // Calculate category totals for the chart (include only paid expenses)
      const categoryTotals = categoryBreakdown?.filter(exp => exp.status === 'paid')
        .reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
          return acc;
        }, {} as Record<string, number>);

      const chartData = Object.entries(categoryTotals || {}).map(([category, amount]) => ({
        category: category.replace("_", " "),
        amount,
      }));

      return {
        totalThisMonth,
        totalPending,
        chartData,
      };
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total This Month</h3>
          <div className="mt-2 h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
          <div className="mt-2 h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
        </Card>
        <Card className="md:col-span-2 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Expenses by Category</h3>
          <div className="h-[200px] bg-gray-100 animate-pulse rounded"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Total This Month</h3>
        <p className="mt-2 text-3xl font-bold">
          {formatCurrency(stats?.totalThisMonth || 0)}
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
        <p className="mt-2 text-3xl font-bold">
          {formatCurrency(stats?.totalPending || 0)}
        </p>
      </Card>

      <Card className="md:col-span-2 p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Expenses by Category
        </h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.chartData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
