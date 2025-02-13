
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface BusinessForm {
  id: string;
  created_at: string;
  email: string;
  company_name: string;
  inquiry_type: string;
  message: string;
}

export const BusinessFormsManagement = () => {
  const [forms, setForms] = useState<BusinessForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const { data, error } = await supabase
        .from('business_forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setForms(data || []);
    } catch (error) {
      console.error('Error fetching business forms:', error);
      toast.error('Failed to load business forms');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Business Form Submissions</h2>
        <p className="text-muted-foreground">
          View and manage business form submissions from potential clients.
        </p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Inquiry Type</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No form submissions yet
                </TableCell>
              </TableRow>
            ) : (
              forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    {new Date(form.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{form.company_name}</TableCell>
                  <TableCell>{form.email}</TableCell>
                  <TableCell>{form.inquiry_type}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {form.message}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
