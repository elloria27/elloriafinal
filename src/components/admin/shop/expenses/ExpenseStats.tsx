
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
  Cell,
} from "recharts";
import { useState } from "react";
import { startOfMonth, endOfMonth, format, subMonths, addMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Колірна схема для категорій витрат
const CATEGORY_COLORS: Record<string, string> = {
  inventory: "#8B5CF6", // фіолетовий
  marketing: "#F97316", // оранжевий
  office_supplies: "#0EA5E9", // блакитний
  utilities: "#10B981", // зелений
  employee_benefits: "#EC4899", // рожевий
  logistics: "#F59E0B", // жовтий
  software: "#6366F1", // індіго
  other: "#6B7280", // сірий
};

export const ExpenseStats = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  const firstDayOfMonth = startOfMonth(selectedMonth);
  const lastDayOfMonth = endOfMonth(selectedMonth);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["expense-stats", firstDayOfMonth.toISOString()],
    queryFn: async () => {
      // Get all expenses for the selected month regardless of status
      const { data: monthlyExpenses } = await supabase
        .from("shop_company_expenses")
        .select("amount, status")
        .gte("date", firstDayOfMonth.toISOString())
        .lte("date", lastDayOfMonth.toISOString());

      // Get pending payments for all time
      const { data: pendingPayments } = await supabase
        .from("shop_company_expenses")
        .select("amount")
        .eq("status", "pending");

      // Get category breakdown for the selected month
      const { data: categoryBreakdown } = await supabase
        .from("shop_company_expenses")
        .select("category, amount, status")
        .gte("date", firstDayOfMonth.toISOString())
        .lte("date", lastDayOfMonth.toISOString());

      // Calculate totals including both pending and paid expenses for this month
      const totalPaid = monthlyExpenses?.filter(exp => exp.status === 'paid')
        .reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
      
      const totalPending = pendingPayments?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
      
      // Calculate the total for the selected month (both paid and pending)
      const totalThisMonth = monthlyExpenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

      // Calculate category totals for the chart (include only paid expenses)
      const categoryTotals = categoryBreakdown?.filter(exp => exp.status === 'paid')
        .reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
          return acc;
        }, {} as Record<string, number>);

      const chartData = Object.entries(categoryTotals || {}).map(([category, amount]) => ({
        category: category.replace("_", " "),
        amount,
        originalCategory: category, // Зберігаємо оригінальну категорію для кольорів
      }));

      return {
        totalThisMonth,
        totalPaid,
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

  const handlePreviousMonth = () => {
    setSelectedMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const currentMonthDisplay = format(selectedMonth, "MMMM yyyy");

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
        <div className="mt-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousMonth}
            className="p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{currentMonthDisplay}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextMonth}
            className="p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
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
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Bar dataKey="amount">
                {stats?.chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.originalCategory] || "#3b82f6"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
