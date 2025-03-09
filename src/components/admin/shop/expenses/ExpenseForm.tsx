
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ExpenseFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseToEdit?: any;
  onExpenseUpdated?: () => void;
};

export const ExpenseForm = ({
  open,
  onOpenChange,
  expenseToEdit,
  onExpenseUpdated
}: ExpenseFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<"pending" | "paid">("pending");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer" | "credit_card" | "other">("bank_transfer");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [existingReceiptPath, setExistingReceiptPath] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title || "");
      setCategory(expenseToEdit.category || "");
      setAmount(expenseToEdit.amount?.toString() || "");
      setVendorName(expenseToEdit.vendor_name || "");
      // Ensure we create a new Date object from the date string
      setDate(expenseToEdit.date ? new Date(expenseToEdit.date) : new Date());
      setStatus(expenseToEdit.status || "pending");
      setNotes(expenseToEdit.notes || "");
      setPaymentMethod(expenseToEdit.payment_method || "bank_transfer");
      setExistingReceiptPath(expenseToEdit.receipt_path || null);
    } else {
      resetForm();
    }
  }, [expenseToEdit]);

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setAmount("");
    setVendorName("");
    setDate(new Date());
    setStatus("pending");
    setNotes("");
    setPaymentMethod("bank_transfer");
    setReceiptFile(null);
    setExistingReceiptPath(null);
  };

  const saveExpenseMutation = useMutation({
    mutationFn: async (formData: any) => {
      let receiptPath = existingReceiptPath;

      // If there's a new receipt file, upload it
      if (receiptFile) {
        const fileExt = receiptFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${expenseToEdit ? expenseToEdit.id : 'new'}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('expense-receipts')
          .upload(filePath, receiptFile);
          
        if (uploadError) throw uploadError;
        receiptPath = filePath;
      }

      // Prepare expense data
      const expenseData = {
        title: formData.title,
        category: formData.category,
        amount: parseFloat(formData.amount),
        vendor_name: formData.vendorName,
        date: formData.date.toISOString().split('T')[0],
        status: formData.status,
        payment_method: formData.paymentMethod,
        notes: formData.notes,
        receipt_path: receiptPath,
      };

      if (expenseToEdit) {
        // Update existing expense
        const { error } = await supabase
          .from('shop_company_expenses')
          .update(expenseData)
          .eq('id', expenseToEdit.id);
          
        if (error) throw error;
        return { ...expenseData, id: expenseToEdit.id };
      } else {
        // Create new expense
        const { data, error } = await supabase
          .from('shop_company_expenses')
          .insert(expenseData)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-stats"] });
      toast.success(expenseToEdit ? "Expense updated successfully" : "Expense added successfully");
      resetForm();
      onOpenChange(false);
      if (onExpenseUpdated) {
        onExpenseUpdated();
      }
    },
    onError: (error) => {
      console.error("Error saving expense:", error);
      toast.error("Failed to save expense");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !amount || !vendorName || !date) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await saveExpenseMutation.mutateAsync({
        title,
        category,
        amount,
        vendorName,
        date,
        status,
        paymentMethod,
        notes,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{expenseToEdit ? "Edit Expense" : "Add New Expense"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter expense title"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => setDate(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="vendor">Vendor Name</Label>
              <Input
                id="vendor"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Enter vendor name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: "pending" | "paid") => setStatus(value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select 
                  value={paymentMethod} 
                  onValueChange={(value: "cash" | "bank_transfer" | "credit_card" | "other") => setPaymentMethod(value)}
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="receipt">Receipt (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setReceiptFile(e.target.files[0]);
                    }
                  }}
                />
                <Label
                  htmlFor="receipt"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {receiptFile ? receiptFile.name : "Upload Receipt"}
                </Label>
                {(existingReceiptPath && !receiptFile) && (
                  <span className="text-sm text-gray-500">
                    Receipt already uploaded
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional information here"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : expenseToEdit ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
