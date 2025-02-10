
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Award, Calendar, ExternalLink, Building2, FileText } from "lucide-react";
import { toast } from "sonner";
import { CertificatesContent } from "@/types/content-blocks";
import { motion } from "framer-motion";

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
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', 'certificates')
        .single();

      if (pageError) throw pageError;

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Award className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-purple/10 to-accent-peach/10">
      <div className="container mx-auto px-4 py-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Our Certifications
          </h1>
          <p className="text-xl text-muted-foreground">
            Ensuring the highest standards in quality, safety, and compliance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((certificate, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur-sm border-2 hover:border-primary"
                onClick={() => setSelectedCertificate(certificate)}
              >
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                      {certificate.name}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {certificate.image_url && (
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={certificate.image_url}
                        alt={certificate.name}
                        className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Issuing Authority</p>
                        <p className="text-sm text-muted-foreground">{certificate.issuing_authority}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Certificate Number</p>
                        <p className="text-sm text-muted-foreground">{certificate.certificate_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Issue Date</p>
                        <p className="text-sm text-muted-foreground">{new Date(certificate.issue_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
          <DialogContent className="max-w-4xl">
            {selectedCertificate && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {selectedCertificate.name}
                </h2>
                {selectedCertificate.image_url && (
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={selectedCertificate.image_url}
                      alt={selectedCertificate.name}
                      className="w-full h-auto rounded-lg shadow-lg"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-lg">Issuing Authority</p>
                      <p className="text-muted-foreground">{selectedCertificate.issuing_authority}</p>
                    </div>
                    <div>
                      <p className="font-medium text-lg">Certificate Number</p>
                      <p className="text-muted-foreground">{selectedCertificate.certificate_number}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-lg">Issue Date</p>
                      <p className="text-muted-foreground">
                        {new Date(selectedCertificate.issue_date).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedCertificate.expiry_date && (
                      <div>
                        <p className="font-medium text-lg">Expiry Date</p>
                        <p className="text-muted-foreground">
                          {new Date(selectedCertificate.expiry_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {selectedCertificate.qr_code_url && (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-primary/10 p-4 rounded-lg"
                  >
                    <ExternalLink className="h-5 w-5 text-primary" />
                    <a
                      href={selectedCertificate.qr_code_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Verify Certificate
                    </a>
                  </motion.div>
                )}
              </motion.div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
