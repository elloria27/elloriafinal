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
import { toast } from "sonner";
import { Download, Eye, File } from "lucide-react";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const winnipegOffset = -6; // Winnipeg is UTC-6
      const utcHours = date.getUTCHours();
      date.setUTCHours(utcHours + winnipegOffset);
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const handleUpdateNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('business_form_submissions')
        .update({ admin_notes: adminNotes })
        .eq('id', form.id)
        .select()
        .single();

      if (error) throw error;

      onUpdate(data as BusinessFormSubmission);
      toast.success('Notes updated successfully');
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Failed to update notes');
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const timestamp = Date.now();
      const fileName = `${form.id}-${timestamp}-${file.name}`;
      console.log('Uploading file:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('form-attachments')
        .upload(fileName, file, {
          cacheControl: 'no-cache',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: currentForm, error: fetchError } = await supabase
        .from('business_form_submissions')
        .select('*')
        .eq('id', form.id)
        .single();

      if (fetchError) throw fetchError;

      const currentAttachments = Array.isArray(currentForm.attachments) 
        ? currentForm.attachments.filter((attachment): attachment is string => typeof attachment === 'string')
        : [];

      const updatedAttachments = [...currentAttachments, fileName];

      const { data: formData, error: updateError } = await supabase
        .from('business_form_submissions')
        .update({ attachments: updatedAttachments })
        .eq('id', form.id)
        .select()
        .single();

      if (updateError) throw updateError;

      console.log('Form updated with new attachment:', formData);
      onUpdate(formData as BusinessFormSubmission);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };

  const handlePreview = async (fileName: string) => {
    try {
      console.log('Attempting to preview file:', fileName);

      const { data: urlData } = supabase.storage
        .from('form-attachments')
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      const refreshedUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      console.log('Preview URL:', refreshedUrl);
      
      setPreviewUrl(refreshedUrl);
      setSelectedFile(fileName);
    } catch (error) {
      console.error('Error getting file preview:', error);
      toast.error('Failed to preview file');
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('form-attachments')
        .download(fileName);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.split('-').slice(1).join('-');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const getDisplayFileName = (fileName: string) => {
    if (!fileName || typeof fileName !== 'string') {
      return 'Unnamed file';
    }
    const parts = fileName.split('-');
    return parts.length >= 3 ? parts.slice(2).join('-') : fileName;
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
              <p className="mt-1">{formatDate(form.created_at)}</p>
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
            <div className="mt-2">
              {Array.isArray(form.attachments) && form.attachments.length > 0 ? (
                <div className="space-y-2">
                  {form.attachments
                    .filter((fileName): fileName is string => typeof fileName === 'string')
                    .map((fileName, index) => {
                      if (!fileName || typeof fileName !== 'string') {
                        console.error('Invalid attachment:', fileName);
                        return null;
                      }
                      return (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                          <File className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1">{getDisplayFileName(fileName)}</span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(fileName)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(fileName)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-muted-foreground">No attachments</p>
              )}
            </div>

            <div className="mt-4">
              <FileUpload onUpload={handleFileUpload} />
            </div>
          </div>
        </div>

        {selectedFile && previewUrl && (
          <Dialog open={true} onOpenChange={() => {
            setSelectedFile(null);
            setPreviewUrl(null);
          }}>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>{getDisplayFileName(selectedFile)}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 overflow-auto">
                {selectedFile.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={previewUrl}
                    className="w-full h-[60vh]"
                    title="PDF Preview"
                    key={previewUrl}
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="File Preview"
                    className="max-w-full h-auto"
                    key={previewUrl}
                  />
                )}
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedFile)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};
