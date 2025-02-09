
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Award, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { CertificatesContent } from "@/types/content-blocks";

interface Certificate {
  name: string;
  issuing_authority: string;
  certificate_number: string;
  issue_date: string;
  expiry_date?: string;
  category: string;
  image_url?: string;
  qr_code_url?: string;
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      // First get the certificates page ID
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', 'certificates')
        .single();

      if (pageError) throw pageError;

      // Then get the content block for certificates
      const { data: blockData, error: blockError } = await supabase
        .from('content_blocks')
        .select('content')
        .eq('page_id', pageData.id)
        .eq('type', 'certificates')
        .single();

      if (blockError) throw blockError;

      const content = blockData.content as CertificatesContent;
      setCertificates(content.certificates || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading certificates...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Certifications</h1>
        <p className="text-xl text-muted-foreground">
          Ensuring the highest standards in quality, safety, and compliance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate, index) => (
          <Card 
            key={index}
            className="cursor-pointer transition-all hover:shadow-lg"
            onClick={() => setSelectedCertificate(certificate)}
          >
            <CardHeader>
              <CardTitle className="flex items-start justify-between gap-4">
                <span className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  {certificate.name}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {certificate.image_url && (
                <img
                  src={certificate.image_url}
                  alt={certificate.name}
                  className="w-full h-auto rounded-lg mb-4"
                  loading="lazy"
                />
              )}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Issuing Authority</p>
                  <p className="text-sm text-muted-foreground">{certificate.issuing_authority}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Certificate Number</p>
                  <p className="text-sm text-muted-foreground">{certificate.certificate_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{certificate.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
        <DialogContent className="max-w-4xl">
          {selectedCertificate && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{selectedCertificate.name}</h2>
              {selectedCertificate.image_url && (
                <img
                  src={selectedCertificate.image_url}
                  alt={selectedCertificate.name}
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Issuing Authority</p>
                  <p className="text-muted-foreground">{selectedCertificate.issuing_authority}</p>
                </div>
                <div>
                  <p className="font-medium">Certificate Number</p>
                  <p className="text-muted-foreground">{selectedCertificate.certificate_number}</p>
                </div>
              </div>
              {selectedCertificate.qr_code_url && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <a
                    href={selectedCertificate.qr_code_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Verify Certificate
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
