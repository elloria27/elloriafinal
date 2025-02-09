
import { useState, useEffect } from 'react';
import { ContentBlock } from '@/types/content-blocks';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Certificate {
  id: string;
  name: string;
  issuing_authority: string;
  certificate_number: string;
  issue_date: string;
  expiry_date: string;
  category: string;
  image_url?: string;
  qr_code_url?: string;
}

interface CertificatesEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const CertificatesEditor = ({ block, onUpdate }: CertificatesEditorProps) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCertificate, setNewCertificate] = useState<Partial<Certificate>>({});

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('category');

      if (error) throw error;

      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCertificate = async () => {
    try {
      if (!newCertificate.name || !newCertificate.issuing_authority || !newCertificate.certificate_number || 
          !newCertificate.issue_date || !newCertificate.expiry_date || !newCertificate.category) {
        toast.error("Please fill in all required fields");
        return;
      }

      const { error } = await supabase
        .from('certificates')
        .insert([newCertificate]);

      if (error) throw error;

      toast.success("Certificate added successfully");
      setNewCertificate({});
      await fetchCertificates();
    } catch (error) {
      console.error('Error adding certificate:', error);
      toast.error("Failed to add certificate");
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;

    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Certificate deleted successfully");
      await fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast.error("Failed to delete certificate");
    }
  };

  if (loading) {
    return <div>Loading certificates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-medium">Add New Certificate</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newCertificate.name || ''}
              onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
              placeholder="Certificate name"
            />
          </div>
          <div>
            <Label htmlFor="issuing_authority">Issuing Authority</Label>
            <Input
              id="issuing_authority"
              value={newCertificate.issuing_authority || ''}
              onChange={(e) => setNewCertificate({ ...newCertificate, issuing_authority: e.target.value })}
              placeholder="Issuing authority"
            />
          </div>
          <div>
            <Label htmlFor="certificate_number">Certificate Number</Label>
            <Input
              id="certificate_number"
              value={newCertificate.certificate_number || ''}
              onChange={(e) => setNewCertificate({ ...newCertificate, certificate_number: e.target.value })}
              placeholder="Certificate number"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={newCertificate.category || ''}
              onChange={(e) => setNewCertificate({ ...newCertificate, category: e.target.value })}
              placeholder="Category"
            />
          </div>
          <div>
            <Label htmlFor="issue_date">Issue Date</Label>
            <Input
              id="issue_date"
              type="date"
              value={newCertificate.issue_date || ''}
              onChange={(e) => setNewCertificate({ ...newCertificate, issue_date: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Input
              id="expiry_date"
              type="date"
              value={newCertificate.expiry_date || ''}
              onChange={(e) => setNewCertificate({ ...newCertificate, expiry_date: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={newCertificate.image_url || ''}
              onChange={(e) => setNewCertificate({ ...newCertificate, image_url: e.target.value })}
              placeholder="Image URL (optional)"
            />
          </div>
          <div>
            <Label htmlFor="qr_code_url">QR Code URL</Label>
            <Input
              id="qr_code_url"
              value={newCertificate.qr_code_url || ''}
              onChange={(e) => setNewCertificate({ ...newCertificate, qr_code_url: e.target.value })}
              placeholder="QR code URL (optional)"
            />
          </div>
          <Button onClick={handleAddCertificate}>Add Certificate</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Existing Certificates</h3>
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-white p-4 rounded-lg border space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{cert.name}</h4>
                <p className="text-sm text-gray-600">{cert.issuing_authority}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteCertificate(cert.id)}
              >
                Delete
              </Button>
            </div>
            <div className="text-sm">
              <p><span className="font-medium">Certificate Number:</span> {cert.certificate_number}</p>
              <p><span className="font-medium">Category:</span> {cert.category}</p>
              <p><span className="font-medium">Issue Date:</span> {format(new Date(cert.issue_date), 'PP')}</p>
              <p><span className="font-medium">Expiry Date:</span> {format(new Date(cert.expiry_date), 'PP')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
