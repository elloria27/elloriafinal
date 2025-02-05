import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileUpload } from "@/components/admin/file/FileUpload";

interface MediaLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  type?: "image" | "video";
}

export const MediaLibraryModal = ({ open, onClose, onSelect, type = "image" }: MediaLibraryModalProps) => {
  const [files, setFiles] = useState<Array<{ name: string; url: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchMedia();
    }
  }, [open]);

  const fetchMedia = async () => {
    try {
      const { data: filesData, error } = await supabase.storage
        .from('media')
        .list();

      if (error) {
        throw error;
      }

      const mediaFiles = await Promise.all(
        filesData
          .filter(file => {
            if (type === "image") {
              return file.metadata?.mimetype?.startsWith("image/");
            } else if (type === "video") {
              return file.metadata?.mimetype?.startsWith("video/");
            }
            return true;
          })
          .map(async (file) => {
            const { data: { publicUrl } } = supabase.storage
              .from('media')
              .getPublicUrl(file.name);

            return {
              name: file.name,
              url: publicUrl
            };
          })
      );

      setFiles(mediaFiles);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error("Failed to load media library");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      toast.success("File uploaded successfully");
      await fetchMedia();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Failed to upload file");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="library">
          <TabsList>
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>
          <TabsContent value="library" className="min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4 p-4">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="relative group cursor-pointer border rounded-lg overflow-hidden"
                    onClick={() => onSelect(file.url)}
                  >
                    {type === "image" ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <video
                        src={file.url}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm">
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="upload" className="min-h-[400px]">
            <div className="p-4">
              <FileUpload onUpload={handleUpload} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};