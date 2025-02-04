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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type ExpenseCategory = "inventory" | "marketing" | "office_supplies" | "utilities" | 
                      "employee_benefits" | "logistics" | "software" | "other";
type ExpenseStatus = "pending" | "paid";
type CategoryFilterValue = ExpenseCategory | "all";
type StatusFilterValue = ExpenseStatus | "all";

export const ExpenseList = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterValue>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm pl-10"
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
        </div>
        <Select 
          value={categoryFilter} 
          onValueChange={(value: CategoryFilterValue) => setCategoryFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses?.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
              <TableCell>{expense.title}</TableCell>
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
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <PenLine className="h-4 w-4" />
                  </Button>
                  {expense.receipt_path && (
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};