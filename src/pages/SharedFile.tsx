import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { FilePreview } from "@/components/admin/file/FilePreview";
import { toast } from "sonner";

export default function SharedFile() {
  const { token } = useParams();
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('file_shares')
          .select('*')
          .eq('share_token', token)
          .single();

        if (error) throw error;

        if (data) {
          console.log('File share data:', data);
          setFileInfo(data);
        }
      } catch (error) {
        console.error('Error fetching file info:', error);
        toast.error("Failed to load shared file");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFileInfo();
    }
  }, [token]);

  const handleDownload = async () => {
    if (!fileInfo) return;

    try {
      const { data, error } = await supabase.storage
        .from('files')
        .download(fileInfo.file_path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileInfo.file_path.split('-').slice(1).join('-');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("File downloaded successfully");
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error("Failed to download file");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!fileInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Shared File Not Found
        </h1>
        <p className="text-gray-600">
          This file may have been removed or the link has expired.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Shared File</h1>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">
                {fileInfo.file_path.split('-').slice(1).join('-')}
              </p>
              <div className="flex gap-2">
                {fileInfo.access_level !== 'none' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewFile(fileInfo.file_path)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    {fileInfo.access_level === 'download' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FilePreview
        fileName={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}