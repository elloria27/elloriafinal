import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { FileObject } from "@supabase/storage-js";
import { FileList } from "./file/FileList";
import { BulkShareDialog } from "./file/BulkShareDialog";

export const FileManagement = () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

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

      console.log('Files fetched successfully:', data);
      setFiles(data);
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
      link.download = fileName.split('-').slice(1).join('-');
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

  const handleFileSelect = (fileName: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileName)
        ? prev.filter(f => f !== fileName)
        : [...prev, fileName]
    );
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
        <div className="flex gap-4">
          {selectedFiles.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setSelectedFiles([])}
            >
              Clear Selection ({selectedFiles.length})
            </Button>
          )}
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
      </div>

      <FileList
        files={files}
        selectedFiles={selectedFiles}
        onFileSelect={handleFileSelect}
        onFileDownload={handleFileDownload}
        onFileDelete={handleFileDelete}
        onShare={() => {}}
      />

      <BulkShareDialog
        fileNames={selectedFiles}
        onClose={() => setSelectedFiles([])}
      />
    </div>
  );
};