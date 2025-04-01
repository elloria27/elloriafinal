
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomerFormProps {
  customerId?: string;
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  tax_id: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const CustomerForm = ({ customerId, onSuccess }: CustomerFormProps) => {
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      tax_id: "",
      street: "",
      city: "",
      province: "",
      postal_code: "",
      country: "",
    },
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (customerId) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("hrm_customers")
            .select("*")
            .eq("id", customerId)
            .single();

          if (error) throw error;

          if (data) {
            form.reset({
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
              tax_id: data.tax_id || "",
              street: data.address?.street || "",
              city: data.address?.city || "",
              province: data.address?.province || "",
              postal_code: data.address?.postal_code || "",
              country: data.address?.country || "",
            });
          }
        } catch (error) {
          console.error("Error fetching customer data:", error);
          toast.error("Failed to load customer data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCustomerData();
  }, [customerId, form]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const customerData = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        tax_id: data.tax_id || null,
        address: {
          street: data.street || null,
          city: data.city || null,
          province: data.province || null,
          postal_code: data.postal_code || null,
          country: data.country || null,
        },
      };

      if (customerId) {
        // Update existing customer
        const { error } = await supabase
          .from("hrm_customers")
          .update(customerData)
          .eq("id", customerId);

        if (error) throw error;
        toast.success("Customer updated successfully");
      } else {
        // Create new customer
        const { error } = await supabase
          .from("hrm_customers")
          .insert(customerData);

        if (error) throw error;
        toast.success("Customer created successfully");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error("Failed to save customer data");
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
                <Input placeholder="Customer name" {...field} className={isMobile ? "text-sm" : ""} />
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
                <Input type="email" placeholder="Email address" {...field} className={isMobile ? "text-sm" : ""} />
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
                <Input placeholder="Phone number" {...field} className={isMobile ? "text-sm" : ""} />
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
                <Input placeholder="Tax ID (optional)" {...field} className={isMobile ? "text-sm" : ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border rounded-md p-4 space-y-4">
          <h3 className="font-medium">Address Information</h3>
          
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="Street address" {...field} className={isMobile ? "text-sm" : ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 gap-6"}`}>
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} className={isMobile ? "text-sm" : ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province/State</FormLabel>
                  <FormControl>
                    <Input placeholder="Province/State" {...field} className={isMobile ? "text-sm" : ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 gap-6"}`}>
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal/ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Postal/ZIP code" {...field} className={isMobile ? "text-sm" : ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} className={isMobile ? "text-sm" : ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading} className={isMobile ? "w-full" : ""}>
            {loading ? "Saving..." : (customerId ? "Update Customer" : "Create Customer")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerForm;
