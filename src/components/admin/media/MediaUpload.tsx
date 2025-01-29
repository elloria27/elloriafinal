import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface MediaUploadProps {
  onUpload: (file: File) => void;
  uploading: boolean;
}

export const MediaUpload = ({ onUpload, uploading }: MediaUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file">Choose file</Label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          accept="image/*,video/*,application/pdf"
        />
      </div>
      {selectedFile && (
        <Button 
          onClick={handleUpload}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Uploading...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </div>
          )}
        </Button>
      )}
    </div>
  );
};