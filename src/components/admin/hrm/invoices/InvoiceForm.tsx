
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InvoiceSettings } from "@/types/hrm";

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface InvoiceFormData {
  customerId: string;
  dueDate: Date;
  items: {
    description: string;
    quantity: number | string;
    unitPrice: number | string;
    taxPercentage: number | string;
  }[];
  notes?: string;
}

interface InvoiceFormProps {
  invoiceId?: string;
  onSuccess?: () => void;
}

const generateInvoiceNumber = () => {
  const timestamp = new Date().getTime();
  return `INV-${timestamp}-${Math.floor(Math.random() * 1000)}`;
};

// Helper function to preserve user's timezone
const formatDateToUTC = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format currency with 2 decimal places
const formatCurrency = (value: number): string => {
  return value.toFixed(2);
};

const InvoiceForm = ({ invoiceId, onSuccess }: InvoiceFormProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<InvoiceSettings | null>(null);

  const form = useForm<InvoiceFormData>({
    defaultValues: {
      items: [{ description: "", quantity: "", unitPrice: "", taxPercentage: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from("hrm_customers")
        .select("id, name, email");

      if (error) {
        toast.error("Failed to load customers");
        return;
      }

      setCustomers(data || []);
    };

    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("hrm_invoice_settings")
        .select("*")
        .maybeSingle();

      if (error) {
        toast.error("Failed to load invoice settings");
        return;
      }

      if (data) {
        const companyInfo = typeof data.company_info === 'string' 
          ? JSON.parse(data.company_info)
          : data.company_info;

        setSettings({
          ...data,
          company_info: companyInfo
        });
      }
    };

    const fetchInvoiceData = async () => {
      if (!invoiceId) return;

      const { data, error } = await supabase
        .from("hrm_invoices")
        .select(`
          *,
          items:hrm_invoice_items(*)
        `)
        .eq("id", invoiceId)
        .single();

      if (error) {
        toast.error("Failed to load invoice");
        return;
      }

      if (data) {
        form.reset({
          customerId: data.customer_id,
          dueDate: new Date(data.due_date),
          notes: data.notes,
          items: data.items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity.toString(),
            unitPrice: formatCurrency(item.unit_price),
            taxPercentage: item.tax_percentage.toString() || "",
          })),
        });
      }
    };

    fetchCustomers();
    fetchSettings();
    fetchInvoiceData();
  }, [invoiceId, form]);

  const calculateLineTotal = (quantity: number, unitPrice: number, taxPercentage: number) => {
    const subtotal = Number((quantity * unitPrice).toFixed(2));
    const taxAmount = Number(((subtotal * taxPercentage) / 100).toFixed(2));
    return {
      subtotal,
      taxAmount,
      total: Number((subtotal + taxAmount).toFixed(2)),
    };
  };

  const calculateTotals = (items: InvoiceFormData["items"]) => {
    return items.reduce(
      (acc, item) => {
        const qty = typeof item.quantity === 'string' ? parseFloat(item.quantity) || 0 : item.quantity;
        const price = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) || 0 : item.unitPrice;
        const tax = typeof item.taxPercentage === 'string' ? parseFloat(item.taxPercentage) || 0 : item.taxPercentage;
        
        const { subtotal, taxAmount, total } = calculateLineTotal(qty, price, tax);
        
        return {
          subtotal: Number((acc.subtotal + subtotal).toFixed(2)),
          taxAmount: Number((acc.taxAmount + taxAmount).toFixed(2)),
          total: Number((acc.total + total).toFixed(2)),
        };
      },
      { subtotal: 0, taxAmount: 0, total: 0 }
    );
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setLoading(true);
      
      // Convert string values to numbers for calculation
      const formattedItems = data.items.map(item => ({
        ...item,
        quantity: typeof item.quantity === 'string' ? parseFloat(item.quantity) || 0 : item.quantity,
        unitPrice: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) || 0 : item.unitPrice,
        taxPercentage: typeof item.taxPercentage === 'string' ? parseFloat(item.taxPercentage) || 0 : item.taxPercentage,
      }));
      
      const totals = calculateTotals(formattedItems);

      const invoiceData = {
        customer_id: data.customerId,
        // Use formatted date string with preserved timezone
        due_date: formatDateToUTC(data.dueDate),
        status: "pending" as const,
        notes: data.notes,
        total_amount: totals.total,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        invoice_number: invoiceId ? undefined : generateInvoiceNumber(),
        currency: "CAD",
        subtotal_amount: totals.subtotal,
        tax_amount: totals.taxAmount,
        payment_instructions: settings?.payment_instructions,
        footer_text: settings?.footer_text,
        company_info: settings?.company_info,
      };

      let result;
      if (invoiceId) {
        // Update existing invoice
        result = await supabase
          .from("hrm_invoices")
          .update(invoiceData)
          .eq("id", invoiceId)
          .select()
          .single();
      } else {
        // Create new invoice
        result = await supabase
          .from("hrm_invoices")
          .insert(invoiceData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      const invoice = result.data;

      // Handle line items
      if (invoiceId) {
        // Delete existing items
        await supabase
          .from("hrm_invoice_items")
          .delete()
          .eq("invoice_id", invoiceId);
      }

      const lineItems = formattedItems.map(item => {
        const qty = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity as string) || 0;
        const price = typeof item.unitPrice === 'number' ? item.unitPrice : parseFloat(item.unitPrice as string) || 0;
        const tax = typeof item.taxPercentage === 'number' ? item.taxPercentage : parseFloat(item.taxPercentage as string) || 0;
        
        const { subtotal, taxAmount, total } = calculateLineTotal(qty, price, tax);
        
        return {
          invoice_id: invoice.id,
          description: item.description,
          quantity: qty,
          unit_price: price,
          tax_percentage: tax,
          total_price: total,
        };
      });

      const { error: itemsError } = await supabase
        .from("hrm_invoice_items")
        .insert(lineItems);

      if (itemsError) throw itemsError;

      toast.success(invoiceId ? "Invoice updated successfully" : "Invoice created successfully");
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating/updating invoice:", error);
      toast.error("Failed to save invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!invoiceId) return;

    try {
      setLoading(true);
      
      // Delete line items first
      await supabase
        .from("hrm_invoice_items")
        .delete()
        .eq("invoice_id", invoiceId);

      // Then delete the invoice
      const { error } = await supabase
        .from("hrm_invoices")
        .delete()
        .eq("id", invoiceId);

      if (error) throw error;

      toast.success("Invoice deleted successfully");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    } finally {
      setLoading(false);
    }
  };

  // Helper to handle empty input field focus
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "1" || e.target.value === "0") {
      e.target.select();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onChange={(date: Date) => field.onChange(date)}
                  minDate={new Date()}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholderText="Select due date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Line Items</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ description: "", quantity: "", unitPrice: "", taxPercentage: "" })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start">
              <FormField
                control={form.control}
                name={`items.${index}.description`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        inputMode="numeric"
                        placeholder=""
                        onFocus={handleInputFocus}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.unitPrice`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormLabel>Price per unit</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        inputMode="decimal"
                        placeholder=""
                        onFocus={handleInputFocus}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.taxPercentage`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel>Tax (%)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        inputMode="decimal"
                        placeholder=""
                        onFocus={handleInputFocus}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-8">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Additional notes..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : (invoiceId ? "Update Invoice" : "Create Invoice")}
          </Button>
          
          {invoiceId && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete Invoice
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
