
import { ContentBlock } from "@/types/content-blocks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface CertificatesEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const CertificatesEditor = ({ block, onUpdate }: CertificatesEditorProps) => {
  const handleUpdate = (field: string, value: string) => {
    onUpdate(block.id, {
      ...block.content,
      [field]: value,
    });
  };

  const handleAddCertificate = () => {
    const certificates = [...(block.content.certificates || [])];
    certificates.push({
      name: "",
      issuing_authority: "",
      certificate_number: "",
      issue_date: "",
      category: "",
    });
    onUpdate(block.id, {
      ...block.content,
      certificates,
    });
  };

  const handleRemoveCertificate = (index: number) => {
    const certificates = [...(block.content.certificates || [])];
    certificates.splice(index, 1);
    onUpdate(block.id, {
      ...block.content,
      certificates,
    });
  };

  const handleCertificateUpdate = (index: number, field: string, value: string) => {
    const certificates = [...(block.content.certificates || [])];
    certificates[index] = {
      ...certificates[index],
      [field]: value,
    };
    onUpdate(block.id, {
      ...block.content,
      certificates,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={block.content.title || ""}
            onChange={(e) => handleUpdate("title", e.target.value)}
            placeholder="Enter section title"
          />
        </div>
        <div>
          <Label>Subtitle</Label>
          <Textarea
            value={block.content.subtitle || ""}
            onChange={(e) => handleUpdate("subtitle", e.target.value)}
            placeholder="Enter section subtitle"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Certificates</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCertificate}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Certificate
          </Button>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {(block.content.certificates || []).map((cert, index) => (
              <Card key={index}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCertificate(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={cert.name || ""}
                        onChange={(e) =>
                          handleCertificateUpdate(index, "name", e.target.value)
                        }
                        placeholder="Certificate name"
                      />
                    </div>

                    <div>
                      <Label>Issuing Authority</Label>
                      <Input
                        value={cert.issuing_authority || ""}
                        onChange={(e) =>
                          handleCertificateUpdate(
                            index,
                            "issuing_authority",
                            e.target.value
                          )
                        }
                        placeholder="Issuing authority"
                      />
                    </div>

                    <div>
                      <Label>Certificate Number</Label>
                      <Input
                        value={cert.certificate_number || ""}
                        onChange={(e) =>
                          handleCertificateUpdate(
                            index,
                            "certificate_number",
                            e.target.value
                          )
                        }
                        placeholder="Certificate number"
                      />
                    </div>

                    <div>
                      <Label>Category</Label>
                      <Input
                        value={cert.category || ""}
                        onChange={(e) =>
                          handleCertificateUpdate(index, "category", e.target.value)
                        }
                        placeholder="Certificate category"
                      />
                    </div>

                    <div>
                      <Label>Issue Date</Label>
                      <Input
                        type="date"
                        value={cert.issue_date || ""}
                        onChange={(e) =>
                          handleCertificateUpdate(
                            index,
                            "issue_date",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label>Expiry Date (Optional)</Label>
                      <Input
                        type="date"
                        value={cert.expiry_date || ""}
                        onChange={(e) =>
                          handleCertificateUpdate(
                            index,
                            "expiry_date",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label>Image URL (Optional)</Label>
                      <Input
                        value={cert.image_url || ""}
                        onChange={(e) =>
                          handleCertificateUpdate(
                            index,
                            "image_url",
                            e.target.value
                          )
                        }
                        placeholder="Certificate image URL"
                      />
                    </div>

                    <div>
                      <Label>QR Code URL (Optional)</Label>
                      <Input
                        value={cert.qr_code_url || ""}
                        onChange={(e) =>
                          handleCertificateUpdate(
                            index,
                            "qr_code_url",
                            e.target.value
                          )
                        }
                        placeholder="Verification QR code URL"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
