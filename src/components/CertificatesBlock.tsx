
import { Award } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CertificatesBlockContent } from '@/types/content-blocks';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

interface CertificatesBlockProps {
  content: CertificatesBlockContent;
}

export const CertificatesBlock = ({ content }: CertificatesBlockProps) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return <div>Loading certificates...</div>;
  }

  return (
    <div className="py-12">
      {content.title && (
        <h2 className="text-3xl font-bold text-center mb-4">{content.title}</h2>
      )}
      {content.description && (
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          {content.description}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4">
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
                <div>
                  <span className="font-medium text-gray-700">Valid Until</span>
                  <p className="text-gray-600">{format(new Date(cert.expiry_date), 'PP')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
