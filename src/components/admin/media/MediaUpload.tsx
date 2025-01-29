import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface MediaUploadProps {
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}

export const MediaUpload = ({ onUpload, uploading }: MediaUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  const allowedMediaTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/ogg'
  ];

  const handleFile = (file: File) => {
    if (!allowedMediaTypes.includes(file.type)) {
      toast.error("Invalid file type. Only images and videos are allowed in the Media Library.");
      return;
    }
    onUpload(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [onUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [onUpload]
  );

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? "border-primary bg-primary/5" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          disabled={uploading}
          accept="image/*,video/*"
        />
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {uploading ? "Uploading..." : "Drop media files here or click to upload"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports images (JPG, PNG, GIF, WebP, SVG) and videos (MP4, WebM, OGG)
            </p>
          </div>
          <Button variant="outline" disabled={uploading}>
            {uploading ? "Uploading..." : "Select Media"}
          </Button>
        </div>
      </div>
    </div>
  );
};