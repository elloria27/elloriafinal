
import { FileObject } from "@supabase/storage-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileIcon, Trash2, Copy, ExternalLink, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MediaListProps {
  files: FileObject[];
  onDelete: (fileName: string) => void;
}

export const MediaList = ({ files, onDelete }: MediaListProps) => {
  const getFileUrl = (fileName: string) => {
    const { data } = supabase.storage.from('media').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['mp4', 'webm', 'ogg'].includes(ext || '')) {
      return <Video className="h-8 w-8 text-primary" />;
    }
    return <FileIcon className="h-8 w-8 text-primary" />;
  };

  return (
    <div className="space-y-4">
      {files.map((file) => {
        const url = getFileUrl(file.name);
        const isVideo = ['mp4', 'webm', 'ogg'].includes(file.name.split('.').pop()?.toLowerCase() || '');
        
        return (
          <Card key={file.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getFileIcon(file.name)}
                <div>
                  <p className="font-medium">
                    {file.name.split('-').slice(1).join('-')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.metadata?.size || 0)}
                    {isVideo && ' • Video'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(url)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => window.open(url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDelete(file.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {isVideo && (
              <div className="mt-4">
                <video 
                  controls
                  className="w-full max-h-48 object-contain bg-black rounded-lg"
                >
                  <source src={url} type={`video/${file.name.split('.').pop()}`} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
