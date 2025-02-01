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
  inquiryType: z.enum(["Private Label", "Bulk Purchase", "Custom Packaging", "Other"]),
  message: z.string().min(10, "Please provide more details about your inquiry"),
  contactConsent: z.boolean().refine((val) => val === true, {
    message: "You must agree to be contacted by Elloria",
  }),
});

interface CustomSolutionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CustomSolutionsDialog = ({
  open,
  onOpenChange,
}: CustomSolutionsDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      inquiryType: undefined,
      message: "",
      contactConsent: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting consultation request:", data);
      
      const { error: emailError } = await supabase.functions.invoke('send-consultation-request', {
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
      <DialogContent className="sm:max-w-[400px] p-4 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-center mb-3 text-gray-800">
            Request a Consultation
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-600">Full Name *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="h-9 rounded-md border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                      placeholder="Enter your full name"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-600">Company Name (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="h-9 rounded-md border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                      placeholder="Enter company name"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-600">Email Address *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      {...field} 
                      className="h-9 rounded-md border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-600">Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      {...field} 
                      className="h-9 rounded-md border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                      placeholder="Enter phone number"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inquiryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-600">What Are You Looking For? *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 rounded-md border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Private Label">Private Label</SelectItem>
                      <SelectItem value="Bulk Purchase">Bulk Purchase</SelectItem>
                      <SelectItem value="Custom Packaging">Custom Packaging</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-600">Message/Inquiry *</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      className="min-h-[80px] rounded-md border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none"
                      placeholder="Please describe your inquiry..."
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md p-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-gray-600">
                      I agree to be contacted by Elloria *
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full h-8 rounded-md border-gray-200 hover:bg-gray-50 text-gray-600 text-sm"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button 
                type="submit" 
                className="w-full h-8 rounded-md bg-primary hover:bg-primary/90 text-white text-sm font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};