import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface FilePreviewProps {
  fileName: string | null;
  onClose: () => void;
}

export const FilePreview = ({ fileName, onClose }: FilePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    const loadPreview = async () => {
      if (!fileName) return;

      try {
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('files')
          .download(fileName);

        if (downloadError) {
          console.error('Error downloading file:', downloadError);
          return;
        }

        const url = URL.createObjectURL(fileData);
        setPreviewUrl(url);
        setFileType(fileData.type);

        return () => {
          if (url) URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('Error in loadPreview:', error);
      }
    };

    loadPreview();
  }, [fileName]);

  const renderPreview = () => {
    if (!previewUrl) return null;

    if (fileType?.startsWith('image/')) {
      return (
        <img
          src={previewUrl}
          alt="File preview"
          className="max-w-full max-h-[70vh] object-contain"
        />
      );
    }

    if (fileType?.startsWith('video/')) {
      return (
        <video controls className="max-w-full max-h-[70vh]">
          <source src={previewUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (fileType?.startsWith('audio/')) {
      return (
        <audio controls className="w-full">
          <source src={previewUrl} type={fileType} />
          Your browser does not support the audio tag.
        </audio>
      );
    }

    return (
      <div className="text-center py-8">
        Preview not available for this file type
      </div>
    );
  };

  return (
    <Dialog open={!!fileName} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>File Preview</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
};