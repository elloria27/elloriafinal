import { useState } from "react";
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
}

export const ExpenseForm = ({ open, onOpenChange }: ExpenseFormProps) => {
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

  const { mutate: createExpense, isPending } = useMutation({
    mutationFn: async () => {
      let receiptPath = null;

      if (receipt) {
        const fileExt = receipt.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("expense-receipts")
          .upload(fileName, receipt);

        if (uploadError) throw uploadError;
        
        receiptPath = fileName;
      }

      const { error } = await supabase.from("shop_company_expenses").insert({
        ...formData,
        amount: parseFloat(formData.amount),
        receipt_path: receiptPath,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-stats"] });
      toast.success("Expense created successfully");
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
      console.error("Error creating expense:", error);
      toast.error("Failed to create expense");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createExpense();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto space-y-4 pr-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, vendor_name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt">Receipt (Optional)</Label>
              <Input
                id="receipt"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                  setReceipt(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
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

          <div className="flex justify-end gap-2 pt-4 mt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};