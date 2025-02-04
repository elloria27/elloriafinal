import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, Grid, List } from "lucide-react";
import { FileObject } from "@supabase/storage-js";
import { MediaGrid } from "./MediaGrid";
import { MediaList } from "./MediaList";
import { MediaUpload } from "./MediaUpload";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const MediaLibrary = () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      console.log('Fetching media files...');
      const { data, error } = await supabase.storage.from('media').list();
      
      if (error) {
        console.error('Error fetching media:', error);
        toast.error("Failed to fetch media files");
        return;
      }

      console.log('Media files fetched successfully:', data);
      setFiles(data || []);
    } catch (error) {
      console.error('Error in fetchFiles:', error);
      toast.error("Failed to fetch media files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      console.log('Uploading media file:', file.name);

      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error("Failed to upload file");
        return;
      }

      console.log('File uploaded successfully');
      toast.success("File uploaded successfully");
      await fetchFiles();
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (fileName: string) => {
    try {
      console.log('Attempting to delete file:', fileName);
      const { error } = await supabase.storage
        .from('media')
        .remove([fileName]);

      if (error) {
        console.error('Error deleting file:', error);
        toast.error("Failed to delete file");
        return;
      }

      console.log('File deleted successfully');
      toast.success("File deleted successfully");
      // Update the files list after successful deletion
      setFiles(files.filter(file => file.name !== fileName));
    } catch (error) {
      console.error('Error in handleFileDelete:', error);
      toast.error("Failed to delete file");
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex gap-4">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent>
              <MediaUpload onUpload={handleFileUpload} uploading={uploading} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <Input
          placeholder="Search media files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {viewMode === 'grid' ? (
        <MediaGrid files={filteredFiles} onDelete={handleFileDelete} />
      ) : (
        <MediaList files={filteredFiles} onDelete={handleFileDelete} />
      )}
    </div>
  );
};