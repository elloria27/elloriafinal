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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Search,
  Trash2,
  FileText,
  Calendar,
  Filter,
  Paperclip
} from "lucide-react";
import { FormDetailsDialog } from "./forms/FormDetailsDialog";
import { DeleteConfirmDialog } from "./forms/DeleteConfirmDialog";

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
  status: 'new' | 'in_progress' | 'completed' | 'archived';
  notes: string | null;
  completed_at: string | null;
  assigned_to: string | null;
  assigned_at: string | null;
  last_updated_at: string | null;
  form_type: 'business_contact' | 'custom_solutions' | 'bulk_order' | 'sustainability';
  terms_accepted: boolean;
  attachments: string[] | null;
  admin_notes: string | null;
}

export const BusinessFormsManagement = () => {
  const [forms, setForms] = useState<BusinessFormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedForm, setSelectedForm] = useState<BusinessFormSubmission | null>(null);
  const [formToDelete, setFormToDelete] = useState<BusinessFormSubmission | null>(null);

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

      // Cast the data to ensure it matches our interface
      const typedData = (data || []).map(form => ({
        ...form,
        attachments: Array.isArray(form.attachments) ? form.attachments : null
      })) as BusinessFormSubmission[];

      setForms(typedData);
    } catch (error) {
      console.error('Error fetching business forms:', error);
      toast.error('Failed to load business forms');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (formId: string, newStatus: BusinessFormSubmission['status']) => {
    try {
      const { error } = await supabase
        .from('business_form_submissions')
        .update({ 
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null 
        })
        .eq('id', formId);

      if (error) throw error;

      setForms(forms.map(form => 
        form.id === formId 
          ? { ...form, status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null }
          : form
      ));
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (formId: string) => {
    try {
      const { error } = await supabase
        .from('business_form_submissions')
        .delete()
        .eq('id', formId);

      if (error) throw error;

      setForms(forms.filter(form => form.id !== formId));
      setFormToDelete(null);
      toast.success('Form deleted successfully');
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Failed to delete form');
    }
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = 
      form.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    const matchesType = typeFilter === 'all' || form.form_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getAttachmentCount = (form: BusinessFormSubmission) => {
    return form.attachments?.length || 0;
  };

  const formatDate = (dateString: string) => {
    // Convert UTC date to local timezone
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
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

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or company..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={typeFilter}
          onValueChange={setTypeFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="business_contact">Business Contact</SelectItem>
            <SelectItem value="custom_solutions">Custom Solutions</SelectItem>
            <SelectItem value="bulk_order">Bulk Order</SelectItem>
            <SelectItem value="sustainability">Sustainability</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredForms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No form submissions found
                </TableCell>
              </TableRow>
            ) : (
              filteredForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    {formatDate(form.created_at)}
                  </TableCell>
                  <TableCell>{form.full_name}</TableCell>
                  <TableCell>{form.company_name || '-'}</TableCell>
                  <TableCell>{form.email}</TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {form.form_type.replace(/_/g, ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={form.status}
                      onValueChange={(value: BusinessFormSubmission['status']) => 
                        handleStatusChange(form.id, value)
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {getAttachmentCount(form) > 0 ? (
                      <div className="flex items-center gap-1">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span>{getAttachmentCount(form)}</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedForm(form)}
                        title="View Details"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setFormToDelete(form)}
                        className="text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {selectedForm && (
        <FormDetailsDialog
          form={selectedForm}
          onClose={() => setSelectedForm(null)}
          onUpdate={(updatedForm) => {
            setForms(forms.map(f => f.id === updatedForm.id ? updatedForm : f));
            setSelectedForm(null);
          }}
        />
      )}

      {formToDelete && (
        <DeleteConfirmDialog
          form={formToDelete}
          onClose={() => setFormToDelete(null)}
          onConfirm={() => handleDelete(formToDelete.id)}
        />
      )}
    </div>
  );
};
