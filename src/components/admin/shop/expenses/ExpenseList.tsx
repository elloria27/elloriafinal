
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PenLine, Download, Trash2, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { ExpenseForm } from "./ExpenseForm";

type ExpenseCategory = "inventory" | "marketing" | "office_supplies" | "utilities" | 
                      "employee_benefits" | "logistics" | "software" | "other";
type ExpenseStatus = "pending" | "paid";
type CategoryFilterValue = ExpenseCategory | "all";
type StatusFilterValue = ExpenseStatus | "all";

export const ExpenseList = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterValue>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [expenseToEdit, setExpenseToEdit] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses", search, categoryFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("shop_company_expenses")
        .select("*")
        .order("date", { ascending: false });

      if (search) {
        query = query.or(`title.ilike.%${search}%,vendor_name.ilike.%${search}%`);
      }

      if (categoryFilter && categoryFilter !== "all") {
        query = query.eq("category", categoryFilter as ExpenseCategory);
      }

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter as ExpenseStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Get the expense to check for receipt
      const { data: expense } = await supabase
        .from("shop_company_expenses")
        .select("receipt_path")
        .eq("id", id)
        .single();

      // If there's a receipt, delete it first
      if (expense?.receipt_path) {
        const { error: storageError } = await supabase.storage
          .from("expense-receipts")
          .remove([expense.receipt_path]);
        
        if (storageError) throw storageError;
      }

      // Then delete the expense record
      const { error } = await supabase
        .from("shop_company_expenses")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-stats"] });
      toast.success("Expense deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDownload = async (receiptPath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("expense-receipts")
        .download(receiptPath);
      
      if (error) throw error;

      // Create a download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = receiptPath.split("/").pop() || "receipt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast.error("Failed to download receipt");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  // Handle form close with refresh
  const handleFormClose = (updated: boolean) => {
    setExpenseToEdit(null);
    if (updated) {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-stats"] });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Input
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
        </div>
        <div className="flex gap-4 flex-col sm:flex-row md:w-auto w-full">
          <Select 
            value={categoryFilter} 
            onValueChange={(value: CategoryFilterValue) => setCategoryFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="office_supplies">Office Supplies</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="employee_benefits">Employee Benefits</SelectItem>
              <SelectItem value="logistics">Logistics</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={statusFilter} 
            onValueChange={(value: StatusFilterValue) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium">Date</TableHead>
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">Category</TableHead>
              <TableHead className="font-medium">Vendor</TableHead>
              <TableHead className="font-medium">Amount</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses?.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-gray-50">
                <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                <TableCell className="font-medium">{expense.title}</TableCell>
                <TableCell className="capitalize">
                  {expense.category.replace("_", " ")}
                </TableCell>
                <TableCell>{expense.vendor_name}</TableCell>
                <TableCell>{formatCurrency(expense.amount)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      expense.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {expense.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setExpenseToEdit(expense)}
                      className="h-8 w-8 p-0"
                    >
                      <PenLine className="h-4 w-4" />
                    </Button>
                    {expense.receipt_path && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(expense.receipt_path!)}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ExpenseForm 
        open={expenseToEdit !== null} 
        onOpenChange={(open) => !open && handleFormClose(false)}
        expenseToEdit={expenseToEdit}
        onExpenseUpdated={() => handleFormClose(true)}
      />
    </div>
  );
};
