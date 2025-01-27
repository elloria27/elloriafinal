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

  const canAccessFile = () => {
    if (!fileInfo) return false;
    if (fileInfo.access_level === 'public') return true;
    
    const user = supabase.auth.getUser();
    if (fileInfo.access_level === 'authenticated') return !!user;
    
    return true; // For other access levels, we'll handle permissions in the specific actions
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!fileInfo || !canAccessFile()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Shared File Not Found or Access Denied
        </h1>
        <p className="text-gray-600 text-center">
          This file may have been removed, the link has expired, or you don't have permission to access it.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Shared File</h1>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-base md:text-lg font-medium break-all">
                {fileInfo.file_path.split('-').slice(1).join('-')}
              </p>
              <div className="flex flex-wrap gap-2">
                {fileInfo.access_level !== 'none' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewFile(fileInfo.file_path)}
                      className="flex items-center gap-2 w-full md:w-auto"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    {(fileInfo.access_level === 'download' || fileInfo.access_level === 'edit') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="flex items-center gap-2 w-full md:w-auto"
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