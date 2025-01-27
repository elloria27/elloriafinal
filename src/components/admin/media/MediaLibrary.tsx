import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { FileObject } from "@supabase/storage-js";
import { Upload, Download, Trash2, Search, Image, File } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const MediaLibrary = () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileObject | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

      // Generate a unique filename with sanitization
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^\x00-\x7F]/g, '').replace(/\s+/g, '-');
      const fileName = `${timestamp}-${sanitizedName}`;

      console.log('Generated filename:', fileName);

      // Check user authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to upload files");
        return;
      }

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

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
      if (selectedFile?.name === fileName) {
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Error in handleFileDelete:', error);
      toast.error("Failed to delete file");
    }
  };

  const handleFileSelect = async (file: FileObject) => {
    setSelectedFile(file);
    if (file.metadata?.mimetype?.startsWith('image/')) {
      const { data } = await supabase.storage
        .from('files')
        .getPublicUrl(file.name);
      setPreviewUrl(data.publicUrl);
    } else {
      setPreviewUrl(null);
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

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (file: FileObject) => {
    const type = file.metadata?.mimetype;
    if (type?.startsWith('image/')) return <Image className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
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
        <h2 className="text-2xl font-bold">Media Library</h2>
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
              Upload Media
            </label>
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search media files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredFiles.map((file) => (
          <Card
            key={file.id}
            className={`p-4 cursor-pointer hover:shadow-lg transition-shadow ${
              selectedFile?.id === file.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleFileSelect(file)}
          >
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                {file.metadata?.mimetype?.startsWith('image/') ? (
                  <img
                    src={`${supabase.storage.from('files').getPublicUrl(file.name).data.publicUrl}`}
                    alt={file.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  getFileIcon(file)
                )}
              </div>
              <div>
                <p className="font-medium truncate text-sm">
                  {file.name.split('-').slice(1).join('-')}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.metadata?.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileDownload(file.name);
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileDelete(file.name);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              {previewUrl ? (
                <div className="aspect-video">
                  <img
                    src={previewUrl}
                    alt={selectedFile.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  {getFileIcon(selectedFile)}
                </div>
              )}
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedFile.name.split('-').slice(1).join('-')}</p>
                <p><strong>Size:</strong> {(selectedFile.metadata?.size / 1024).toFixed(2)} KB</p>
                <p><strong>Type:</strong> {selectedFile.metadata?.mimetype}</p>
                <p><strong>Created:</strong> {new Date(selectedFile.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};