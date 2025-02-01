import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  companyName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  orderQuantity: z.string().min(1, "Please select or enter order quantity"),
  message: z.string().min(10, "Please provide more details about your inquiry"),
  contactConsent: z.boolean().refine((val) => val === true, {
    message: "You must agree to be contacted by Elloria",
  }),
});

interface BulkConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BulkConsultationDialog = ({
  open,
  onOpenChange,
}: BulkConsultationDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      orderQuantity: "",
      message: "",
      contactConsent: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting bulk consultation request:", data);
      
      const { error: emailError } = await supabase.functions.invoke('send-bulk-consultation', {
        body: data
      });

      if (emailError) throw emailError;

      toast.success("Thank you! Our team will contact you shortly.");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-4 sm:p-6 bg-white rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6 text-gray-800">
            Request Bulk Order Consultation
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Full Name *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="h-11 rounded-lg border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Enter your full name"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Company Name (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="h-11 rounded-lg border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Enter company name"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Email Address *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      {...field} 
                      className="h-11 rounded-lg border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      {...field} 
                      className="h-11 rounded-lg border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Enter phone number"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Order Quantity *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-lg border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
                        <SelectValue placeholder="Select quantity range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="100-500">100-500 units</SelectItem>
                      <SelectItem value="501-1000">501-1,000 units</SelectItem>
                      <SelectItem value="1001-5000">1,001-5,000 units</SelectItem>
                      <SelectItem value="5000+">5,000+ units</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Message/Inquiry *</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      className="min-h-[100px] rounded-lg border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                      placeholder="Please provide details about your bulk order requirements..."
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-gray-700">
                      I agree to be contacted by Elloria *
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-1/2 h-11 rounded-lg border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-1/2 h-11 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};