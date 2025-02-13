
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/admin/file/FileUpload";
import { FilePreview } from "@/components/admin/file/FilePreview";
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

interface FormDetailsDialogProps {
  form: BusinessFormSubmission;
  onClose: () => void;
  onUpdate: (form: BusinessFormSubmission) => void;
}

export const FormDetailsDialog = ({ form, onClose, onUpdate }: FormDetailsDialogProps) => {
  const [adminNotes, setAdminNotes] = useState(form.admin_notes || '');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleUpdateNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('business_form_submissions')
        .update({ admin_notes: adminNotes })
        .eq('id', form.id)
        .select()
        .single();

      if (error) throw error;

      // Cast the data to ensure it matches our interface
      const updatedForm = data as unknown as BusinessFormSubmission;
      onUpdate(updatedForm);
      toast.success('Notes updated successfully');
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Failed to update notes');
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const fileName = `${form.id}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('form-attachments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const attachments = form.attachments ? [...form.attachments, fileName] : [fileName];

      const { data, error: updateError } = await supabase
        .from('business_form_submissions')
        .update({ attachments })
        .eq('id', form.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Cast the data to ensure it matches our interface
      const updatedForm = data as unknown as BusinessFormSubmission;
      onUpdate(updatedForm);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };

  const getDisplayFileName = (fileName: string) => {
    try {
      return fileName.split('-').slice(1).join('-');
    } catch (error) {
      console.error('Error processing filename:', fileName, error);
      return 'Unnamed file';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Form Submission Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Submission Date</Label>
              <p className="mt-1">{new Date(form.created_at).toLocaleString()}</p>
            </div>
            <div>
              <Label>Status</Label>
              <p className="mt-1 capitalize">{form.status.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <Label>Full Name</Label>
              <p className="mt-1">{form.full_name}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="mt-1">{form.email}</p>
            </div>
            <div>
              <Label>Company</Label>
              <p className="mt-1">{form.company_name || '-'}</p>
            </div>
            <div>
              <Label>Phone</Label>
              <p className="mt-1">{form.phone || '-'}</p>
            </div>
            {form.business_type && (
              <div>
                <Label>Business Type</Label>
                <p className="mt-1">{form.business_type}</p>
              </div>
            )}
            {form.inquiry_type && (
              <div>
                <Label>Inquiry Type</Label>
                <p className="mt-1">{form.inquiry_type}</p>
              </div>
            )}
            {form.order_quantity && (
              <div>
                <Label>Order Quantity</Label>
                <p className="mt-1">{form.order_quantity}</p>
              </div>
            )}
          </div>

          <div>
            <Label>Message</Label>
            <p className="mt-1 whitespace-pre-wrap">{form.message || '-'}</p>
          </div>

          <div>
            <Label>Admin Notes</Label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="mt-1"
              rows={4}
            />
            <Button 
              onClick={handleUpdateNotes}
              className="mt-2"
            >
              Save Notes
            </Button>
          </div>

          <div>
            <Label>Attachments</Label>
            {Array.isArray(form.attachments) && form.attachments.length > 0 ? (
              <div className="mt-2 space-y-2">
                {form.attachments.map((fileName, index) => (
                  typeof fileName === 'string' && (
                    <div key={index} className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFile(fileName)}
                      >
                        View {getDisplayFileName(fileName)}
                      </Button>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mt-1">No attachments</p>
            )}

            <div className="mt-4">
              <FileUpload onUpload={handleFileUpload} />
            </div>
          </div>
        </div>

        {selectedFile && (
          <FilePreview
            fileName={selectedFile}
            onClose={() => setSelectedFile(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
