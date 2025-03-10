
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
import { PenLine, Download, Trash2, Search, FileDown, Eye, Calendar } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { toast } from "sonner";
import { ExpenseForm } from "./ExpenseForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [viewingNotes, setViewingNotes] = useState<{expense: any, open: boolean}>({expense: null, open: false});
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const queryClient = useQueryClient();

  // Get the start and end of the selected month for filtering
  const firstDayOfMonth = startOfMonth(selectedMonth);
  const lastDayOfMonth = endOfMonth(selectedMonth);

  // Query to get ALL expenses (for search across all months)
  const { data: allExpenses, isLoading: allExpensesLoading } = useQuery({
    queryKey: ["all-expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shop_company_expenses")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Query to get expenses filtered by search, category, and status
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses", search, categoryFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("shop_company_expenses")
        .select("*")
        .order("date", { ascending: false });

      if (search) {
        // When searching, we want to search across all months
        query = query.or(`title.ilike.%${search}%,vendor_name.ilike.%${search}%`);
      } else {
        // Only apply date filter when not searching
        query = query
          .gte("date", firstDayOfMonth.toISOString())
          .lte("date", lastDayOfMonth.toISOString());
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
      queryClient.invalidateQueries({ queryKey: ["all-expenses"] });
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
      queryClient.invalidateQueries({ queryKey: ["all-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-stats"] });
    }
  };

  // Export to CSV function - now only exports expenses from the selected month
  const exportToCSV = () => {
    if (!expenses || expenses.length === 0) {
      toast.error("No expenses to export for the selected month");
      return;
    }

    // Get expenses for the current month if searching
    const expensesToExport = search 
      ? expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return isWithinInterval(expenseDate, {
            start: firstDayOfMonth,
            end: lastDayOfMonth
          });
        })
      : expenses;

    if (expensesToExport.length === 0) {
      toast.error("No matching expenses found for the selected month");
      return;
    }

    // Format data for CSV
    const headers = ["Date", "Title", "Category", "Vendor", "Amount", "Status", "Payment Method", "Notes"];
    const csvRows = [headers.join(",")];

    expensesToExport.forEach(expense => {
      // Handle fields that may contain commas (for proper CSV formatting)
      const safeTitle = expense.title ? `"${expense.title.replace(/"/g, '""')}"` : "";
      const safeVendor = expense.vendor_name ? `"${expense.vendor_name.replace(/"/g, '""')}"` : "";
      const safeNotes = expense.notes ? `"${expense.notes.replace(/"/g, '""')}"` : "";
      const formattedDate = format(new Date(expense.date), "yyyy-MM-dd");
      const formattedCategory = expense.category.replace("_", " ");
      const formattedAmount = expense.amount.toFixed(2);
      
      const row = [
        formattedDate,
        safeTitle,
        formattedCategory,
        safeVendor,
        formattedAmount,
        expense.status,
        expense.payment_method.replace("_", " "),
        safeNotes
      ];
      
      csvRows.push(row.join(","));
    });

    // Create Blob and download link
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    // Set filename with current date
    const selectedMonthStr = format(selectedMonth, "yyyy-MM");
    link.setAttribute("href", url);
    link.setAttribute("download", `expenses-${selectedMonthStr}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewNotes = (expense: any) => {
    setViewingNotes({ expense, open: true });
  };

  // Format the selected month for display
  const formattedSelectedMonth = format(selectedMonth, "MMMM yyyy");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Input
            placeholder="Search expenses (all months)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
        </div>
        <div className="flex gap-4 flex-col sm:flex-row md:w-auto w-full">
          {/* Month selector */}
          <div className="flex items-center bg-white border rounded-md px-3 py-2 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{formattedSelectedMonth}</span>
            <input
              type="month"
              value={format(selectedMonth, "yyyy-MM")}
              onChange={(e) => {
                if (e.target.value) {
                  const [year, month] = e.target.value.split('-');
                  const newDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                  setSelectedMonth(newDate);
                }
              }}
              className="sr-only"
              id="month-selector"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => document.getElementById('month-selector')?.click()}
              className="ml-2 p-0 h-6 w-6"
            >
              <span className="sr-only">Select month</span>
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          
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
          <Button 
            variant="outline" 
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Export CSV
          </Button>
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
            {expenses?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  {search ? "No expenses match your search criteria" : "No expenses for the selected month"}
                </TableCell>
              </TableRow>
            ) : (
              expenses?.map((expense) => (
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
                      {expense.notes && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewNotes(expense)}
                          className="h-8 w-8 p-0"
                          title="View Notes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ExpenseForm 
        open={expenseToEdit !== null} 
        onOpenChange={(open) => !open && handleFormClose(false)}
        expenseToEdit={expenseToEdit}
        onExpenseUpdated={() => handleFormClose(true)}
      />

      {/* Notes viewing dialog */}
      <Dialog open={viewingNotes.open} onOpenChange={(open) => setViewingNotes(prev => ({...prev, open}))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notes for {viewingNotes.expense?.title}</DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="whitespace-pre-wrap">{viewingNotes.expense?.notes}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
