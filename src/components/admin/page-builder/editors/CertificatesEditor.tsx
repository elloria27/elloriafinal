
import { useState, useEffect } from 'react';
import { ContentBlock } from '@/types/content-blocks';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [isEditing, setIsEditing] = useState(false);

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

      const certificateToInsert = {
        name: newCertificate.name,
        issuing_authority: newCertificate.issuing_authority,
        certificate_number: newCertificate.certificate_number,
        issue_date: newCertificate.issue_date,
        expiry_date: newCertificate.expiry_date,
        category: newCertificate.category,
        image_url: newCertificate.image_url,
        qr_code_url: newCertificate.qr_code_url
      };

      const { error } = await supabase
        .from('certificates')
        .insert([certificateToInsert]);

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

  const renderCertificatesList = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <Card key={cert.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-xl">{cert.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Issuing Authority</span>
                  <p className="text-gray-600">{cert.issuing_authority}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Certificate Number</span>
                  <p className="text-gray-600">{cert.certificate_number}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Category</span>
                  <p className="text-gray-600">{cert.category}</p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="font-medium text-gray-700">Valid Until</span>
                    <p className="text-gray-600">{format(new Date(cert.expiry_date), 'PP')}</p>
                  </div>
                  {isEditing && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCertificate(cert.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div>Loading certificates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Certificates</h3>
        <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
          {isEditing ? 'Done' : 'Edit Certificates'}
        </Button>
      </div>

      {isEditing && (
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
            <Button onClick={handleAddCertificate}>Add Certificate</Button>
          </div>
        </div>
      )}

      {renderCertificatesList()}
    </div>
  );
};
