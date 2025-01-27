import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Download, Trash2, FileIcon } from "lucide-react";
import { FileObject as SupabaseFileObject } from "@supabase/storage-js";

interface FileObject extends SupabaseFileObject {
  size: number;
}

export const FileManagement = () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      console.log('Fetching files from storage...');
      const { data, error } = await supabase.storage.from('files').list();
      
      if (error) {
        console.error('Error fetching files:', error);
        toast.error("Failed to fetch files");
        return;
      }

      // Transform the data to include required properties
      const transformedData = data.map(file => ({
        ...file,
        size: file.metadata?.size || 0
      }));

      console.log('Files fetched successfully:', transformedData);
      setFiles(transformedData);
    } catch (error) {
      console.error('Error in fetchFiles:', error);
      toast.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      console.log('Uploading file:', file.name);

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(`${Date.now()}-${file.name}`, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error("Failed to upload file");
        return;
      }

      console.log('File uploaded successfully');
      toast.success("File uploaded successfully");
      fetchFiles();
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleFileDownload = async (fileName: string) => {
    try {
      console.log('Downloading file:', fileName);
      const { data, error } = await supabase.storage
        .from('files')
        .download(fileName);

      if (error) {
        console.error('Error downloading file:', error);
        toast.error("Failed to download file");
        return;
      }

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.split('-').slice(1).join('-'); // Remove timestamp prefix
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log('File downloaded successfully');
      toast.success("File downloaded successfully");
    } catch (error) {
      console.error('Error in handleFileDownload:', error);
      toast.error("Failed to download file");
    }
  };

  const handleFileDelete = async (fileName: string) => {
    try {
      console.log('Deleting file:', fileName);
      const { error } = await supabase.storage
        .from('files')
        .remove([fileName]);

      if (error) {
        console.error('Error deleting file:', error);
        toast.error("Failed to delete file");
        return;
      }

      console.log('File deleted successfully');
      toast.success("File deleted successfully");
      fetchFiles();
    } catch (error) {
      console.error('Error in handleFileDelete:', error);
      toast.error("Failed to delete file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">File Management</h2>
        <div className="relative">
          <Input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2"
            disabled={uploading}
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-4 w-4" />
              Upload File
            </label>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {files.map((file) => (
          <Card key={file.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name.split('-').slice(1).join('-')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleFileDownload(file.name)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleFileDelete(file.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {files.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No files uploaded yet
          </div>
        )}
      </div>
    </div>
  );
};