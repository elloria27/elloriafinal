import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function SharedFile() {
  const { token } = useParams();
  const [fileData, setFileData] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSharedFile = async () => {
      try {
        console.log('Loading shared file with token:', token);
        
        // Отримуємо інформацію про shared file
        const { data: shareData, error: shareError } = await supabase
          .from('file_shares')
          .select('*')
          .eq('share_token', token)
          .single();

        if (shareError) {
          console.error('Error fetching share data:', shareError);
          toast.error("Failed to load shared file");
          return;
        }

        if (!shareData) {
          toast.error("Share link not found or expired");
          return;
        }

        setFileData(shareData);
        
        // Завантажуємо файл
        const { data: file, error: downloadError } = await supabase.storage
          .from('files')
          .download(shareData.file_path);

        if (downloadError) {
          console.error('Error downloading file:', downloadError);
          toast.error("Failed to load file");
          return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setFileType(file.type);
        console.log('File loaded successfully:', file.type);

      } catch (error) {
        console.error('Error in loadSharedFile:', error);
        toast.error("An error occurred while loading the file");
      } finally {
        setLoading(false);
      }
    };

    loadSharedFile();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [token]);

  const handleDownload = async () => {
    if (!fileData || !previewUrl) return;
    
    try {
      if (fileData.access_level === 'view') {
        toast.error("Download not allowed for this share");
        return;
      }

      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = fileData.file_path.split('/').pop() || 'downloaded-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("File download started");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download file");
    }
  };

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!previewUrl || !fileType) {
      return (
        <div className="text-center py-8 text-gray-500">
          File preview not available
        </div>
      );
    }

    if (fileType.startsWith('image/')) {
      return (
        <img
          src={previewUrl}
          alt="Shared file preview"
          className="max-w-full max-h-[70vh] object-contain mx-auto"
        />
      );
    }

    if (fileType.startsWith('video/')) {
      return (
        <video controls className="max-w-full max-h-[70vh] w-full">
          <source src={previewUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (fileType.startsWith('audio/')) {
      return (
        <audio controls className="w-full">
          <source src={previewUrl} type={fileType} />
          Your browser does not support the audio tag.
        </audio>
      );
    }

    // For PDFs and other documents, show download button
    return (
      <div className="text-center py-8">
        <p className="mb-4 text-gray-600">Preview not available for this file type</p>
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download to view
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h1 className="text-xl font-semibold mb-6 break-words">
              {fileData?.file_path.split('/').pop()}
            </h1>
            
            <div className="space-y-6">
              {renderPreview()}
              
              {fileData?.access_level !== 'view' && (
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download File
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}