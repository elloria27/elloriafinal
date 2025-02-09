
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DialogFooter } from "@/components/ui/dialog";

interface CustomerFormData {
  name: string;
  email: string;
  phone?: string;
  tax_id?: string;
}

interface CustomerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CustomerForm = ({ onSuccess, onCancel }: CustomerFormProps) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<CustomerFormData>();

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('hrm_customers')
        .insert([data]);

      if (error) throw error;

      toast.success("Customer added successfully");
      onSuccess();
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error("Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Customer name" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Email address" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} type="tel" placeholder="Phone number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tax_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax ID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Tax ID" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Customer"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CustomerForm;
