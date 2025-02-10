
import { CertificatesContent, ContentBlock } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Image } from "lucide-react";
import { useState } from "react";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";

interface CertificatesEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: CertificatesContent) => void;
}

export const CertificatesEditor = ({ block, onUpdate }: CertificatesEditorProps) => {
  const content = block.content as CertificatesContent;
  const [certificates, setCertificates] = useState(content.certificates || []);
  const [selectedCertificateIndex, setSelectedCertificateIndex] = useState<number | null>(null);
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);

  const handleAddCertificate = () => {
    const newCertificates = [...certificates, {
      name: "New Certificate",
      issuing_authority: "",
      certificate_number: "",
      issue_date: "",
      category: "",
    }];
    
    setCertificates(newCertificates);
    onUpdate(block.id, { ...content, certificates: newCertificates });
  };

  const handleUpdateCertificate = (index: number, field: string, value: string) => {
    const newCertificates = [...certificates];
    newCertificates[index] = {
      ...newCertificates[index],
      [field]: value
    };
    
    setCertificates(newCertificates);
    onUpdate(block.id, { ...content, certificates: newCertificates });
  };

  const handleRemoveCertificate = (index: number) => {
    const newCertificates = certificates.filter((_, i) => i !== index);
    setCertificates(newCertificates);
    onUpdate(block.id, { ...content, certificates: newCertificates });
  };

  const handleImageSelect = (url: string) => {
    if (selectedCertificateIndex !== null) {
      handleUpdateCertificate(selectedCertificateIndex, 'image_url', url);
    }
    setMediaLibraryOpen(false);
    setSelectedCertificateIndex(null);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleAddCertificate} className="w-full">
        Add Certificate
      </Button>

      <div className="space-y-4">
        {certificates.map((certificate, index) => (
          <Card key={index}>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="font-medium">Certificate {index + 1}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCertificate(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input
                    value={certificate.name}
                    onChange={(e) => handleUpdateCertificate(index, "name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Issuing Authority</label>
                  <Input
                    value={certificate.issuing_authority}
                    onChange={(e) => handleUpdateCertificate(index, "issuing_authority", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Certificate Number</label>
                  <Input
                    value={certificate.certificate_number}
                    onChange={(e) => handleUpdateCertificate(index, "certificate_number", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Issue Date</label>
                  <Input
                    type="date"
                    value={certificate.issue_date}
                    onChange={(e) => handleUpdateCertificate(index, "issue_date", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Expiry Date (Optional)</label>
                  <Input
                    type="date"
                    value={certificate.expiry_date}
                    onChange={(e) => handleUpdateCertificate(index, "expiry_date", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Input
                    value={certificate.category}
                    onChange={(e) => handleUpdateCertificate(index, "category", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Certificate Image</label>
                  <div className="flex items-center gap-2">
                    {certificate.image_url && (
                      <img
                        src={certificate.image_url}
                        alt={certificate.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCertificateIndex(index);
                        setMediaLibraryOpen(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Image className="h-4 w-4" />
                      {certificate.image_url ? 'Change Image' : 'Add Image'}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">QR Code URL (Optional)</label>
                  <Input
                    value={certificate.qr_code_url}
                    onChange={(e) => handleUpdateCertificate(index, "qr_code_url", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <MediaLibraryModal
        open={mediaLibraryOpen}
        onClose={() => {
          setMediaLibraryOpen(false);
          setSelectedCertificateIndex(null);
        }}
        onSelect={handleImageSelect}
        type="image"
      />
    </div>
  );
};
