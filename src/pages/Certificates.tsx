
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Award, Calendar, ExternalLink, Building2, FileText, Heart, Sparkles, Leaf } from "lucide-react";
import { toast } from "sonner";
import { CertificatesContent } from "@/types/content-blocks";
import { motion, AnimatePresence } from "framer-motion";

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

const floatingIcons = [
  { Icon: Heart, delay: 0, position: { top: "10%", left: "5%" }, color: "text-secondary" },
  { Icon: Sparkles, delay: 0.2, position: { top: "30%", right: "8%" }, color: "text-primary" },
  { Icon: Leaf, delay: 0.4, position: { bottom: "20%", left: "8%" }, color: "text-primary" },
  { Icon: Award, delay: 0.6, position: { bottom: "15%", right: "5%" }, color: "text-secondary" }
];

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-accent-purple/5 to-accent-peach/5">
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
          className="relative"
        >
          <Award className="w-16 h-16 text-primary" />
          <motion.div
            className="absolute -inset-4 rounded-full border-2 border-primary/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-purple/10 via-white to-accent-peach/10 relative overflow-hidden">
      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, position, color }, index) => (
        <motion.div
          key={index}
          className={`absolute hidden lg:block ${color}`}
          style={position}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4,
            delay: delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon className="w-8 h-8" />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 py-8 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent-purple bg-clip-text text-transparent">
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
              whileHover={{ scale: 1.02 }}
            >
              <Card 
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm border-2 hover:border-primary relative overflow-hidden"
                onClick={() => setSelectedCertificate(certificate)}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                />
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Award className="h-5 w-5 text-primary" />
                      </motion.div>
                      {certificate.name}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {certificate.image_url && (
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <motion.img
                        src={certificate.image_url}
                        alt={certificate.name}
                        className="w-full h-48 object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        loading="lazy"
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Building2 className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Issuing Authority</p>
                        <p className="text-sm text-muted-foreground">{certificate.issuing_authority}</p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Certificate Number</p>
                        <p className="text-sm text-muted-foreground">{certificate.certificate_number}</p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Calendar className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Issue Date</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(certificate.issue_date).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
            <DialogContent className="max-w-4xl bg-gradient-to-b from-white to-accent-purple/5">
              {selectedCertificate && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {selectedCertificate.name}
                  </h2>
                  {selectedCertificate.image_url && (
                    <motion.div
                      className="relative overflow-hidden rounded-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <img
                        src={selectedCertificate.image_url}
                        alt={selectedCertificate.name}
                        className="w-full h-auto rounded-lg shadow-lg"
                        loading="lazy"
                      />
                    </motion.div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <motion.div whileHover={{ x: 5 }} className="p-4 bg-white/50 rounded-lg">
                        <p className="font-medium text-lg">Issuing Authority</p>
                        <p className="text-muted-foreground">{selectedCertificate.issuing_authority}</p>
                      </motion.div>
                      <motion.div whileHover={{ x: 5 }} className="p-4 bg-white/50 rounded-lg">
                        <p className="font-medium text-lg">Certificate Number</p>
                        <p className="text-muted-foreground">{selectedCertificate.certificate_number}</p>
                      </motion.div>
                    </div>
                    <div className="space-y-4">
                      <motion.div whileHover={{ x: 5 }} className="p-4 bg-white/50 rounded-lg">
                        <p className="font-medium text-lg">Issue Date</p>
                        <p className="text-muted-foreground">
                          {new Date(selectedCertificate.issue_date).toLocaleDateString()}
                        </p>
                      </motion.div>
                      {selectedCertificate.expiry_date && (
                        <motion.div whileHover={{ x: 5 }} className="p-4 bg-white/50 rounded-lg">
                          <p className="font-medium text-lg">Expiry Date</p>
                          <p className="text-muted-foreground">
                            {new Date(selectedCertificate.expiry_date).toLocaleDateString()}
                          </p>
                        </motion.div>
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
        </AnimatePresence>
      </div>
    </div>
  );
}
