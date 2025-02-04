import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X } from "lucide-react";

type ExpenseCategory = "inventory" | "marketing" | "office_supplies" | "utilities" | 
                      "employee_benefits" | "logistics" | "software" | "other";
type PaymentMethod = "cash" | "bank_transfer" | "credit_card";
type ExpenseStatus = "pending" | "paid";

interface ExpenseFormData {
  title: string;
  category: ExpenseCategory;
  amount: string;
  date: string;
  payment_method: PaymentMethod;
  vendor_name: string;
  notes: string;
  status: ExpenseStatus;
}

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseToEdit?: {
    id: string;
    title: string;
    category: ExpenseCategory;
    amount: number;
    date: string;
    payment_method: PaymentMethod;
    vendor_name: string;
    notes: string;
    status: ExpenseStatus;
    receipt_path: string | null;
  } | null;
}

export const ExpenseForm = ({ open, onOpenChange, expenseToEdit }: ExpenseFormProps) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: "",
    category: "inventory",
    amount: "",
    date: "",
    payment_method: "cash",
    vendor_name: "",
    notes: "",
    status: "pending",
  });

  const [receipt, setReceipt] = useState<File | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title,
        category: expenseToEdit.category,
        amount: expenseToEdit.amount.toString(),
        date: expenseToEdit.date,
        payment_method: expenseToEdit.payment_method,
        vendor_name: expenseToEdit.vendor_name,
        notes: expenseToEdit.notes || "",
        status: expenseToEdit.status,
      });
    } else {
      setFormData({
        title: "",
        category: "inventory",
        amount: "",
        date: "",
        payment_method: "cash",
        vendor_name: "",
        notes: "",
        status: "pending",
      });
    }
  }, [expenseToEdit]);

  const { mutate: saveExpense, isPending } = useMutation({
    mutationFn: async () => {
      let receiptPath = expenseToEdit?.receipt_path || null;

      if (receipt) {
        const fileExt = receipt.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("expense-receipts")
          .upload(fileName, receipt);

        if (uploadError) throw uploadError;
        
        if (expenseToEdit?.receipt_path) {
          await supabase.storage
            .from("expense-receipts")
            .remove([expenseToEdit.receipt_path]);
        }
        
        receiptPath = fileName;
      }

      if (expenseToEdit) {
        const { error } = await supabase
          .from("shop_company_expenses")
          .update({
            ...formData,
            amount: parseFloat(formData.amount),
            receipt_path: receiptPath,
          })
          .eq('id', expenseToEdit.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("shop_company_expenses")
          .insert({
            ...formData,
            amount: parseFloat(formData.amount),
            receipt_path: receiptPath,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-stats"] });
      toast.success(expenseToEdit ? "Expense updated successfully" : "Expense created successfully");
      onOpenChange(false);
      setFormData({
        title: "",
        category: "inventory",
        amount: "",
        date: "",
        payment_method: "cash",
        vendor_name: "",
        notes: "",
        status: "pending",
      });
      setReceipt(null);
    },
    onError: (error) => {
      console.error("Error saving expense:", error);
      toast.error(expenseToEdit ? "Failed to update expense" : "Failed to create expense");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveExpense();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 bg-white px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            {expenseToEdit ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: ExpenseCategory) =>
                  setFormData({ ...formData, category: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (CAD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value: PaymentMethod) =>
                  setFormData({ ...formData, payment_method: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor_name">Vendor Name</Label>
              <Input
                id="vendor_name"
                value={formData.vendor_name}
                onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="receipt">Receipt (Optional)</Label>
              <Input
                id="receipt"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setReceipt(e.target.files ? e.target.files[0] : null)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ExpenseStatus) =>
                  setFormData({ ...formData, status: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {isPending ? "Saving..." : expenseToEdit ? "Save Changes" : "Create Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
