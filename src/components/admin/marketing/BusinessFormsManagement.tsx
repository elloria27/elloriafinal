
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

interface BusinessFormSubmission {
  id: string;
  created_at: string;
  email: string;
  company_name: string;
  full_name: string;
  phone: string | null;
  business_type: string | null;
  inquiry_type: string | null;
  order_quantity: string | null;
  message: string | null;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  notes: string | null;
  completed_at: string | null;
  assigned_to: string | null;
  form_type: string;
  terms_accepted: boolean;
  attachments: any | null;
}

export const BusinessFormsManagement = () => {
  const [forms, setForms] = useState<BusinessFormSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const { data, error } = await supabase
        .from('business_form_submissions')
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
              <TableHead>Full Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No form submissions yet
                </TableCell>
              </TableRow>
            ) : (
              forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    {new Date(form.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{form.full_name}</TableCell>
                  <TableCell>{form.company_name}</TableCell>
                  <TableCell>{form.email}</TableCell>
                  <TableCell>{form.phone || '-'}</TableCell>
                  <TableCell>{form.form_type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      form.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      form.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      form.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {form.status}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {form.message || '-'}
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
