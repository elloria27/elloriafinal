import { FileObject } from "@supabase/storage-js";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MediaGridProps {
  files: FileObject[];
  onDelete: (fileName: string) => void;
  onSelect?: (url: string) => void;
}

export const MediaGrid = ({ files, onDelete, onSelect }: MediaGridProps) => {
  const getFileUrl = (fileName: string) => {
    const { data } = supabase.storage.from('media').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const isImageFile = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {files.map((file) => {
        const url = getFileUrl(file.name);
        return (
          <div key={file.id} className="border rounded-lg overflow-hidden">
            <div 
              className="aspect-square relative bg-gray-100 cursor-pointer" 
              onClick={() => onSelect && onSelect(url)}
            >
              {isImageFile(file.name) ? (
                <img
                  src={url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span className="text-sm uppercase">{file.name.split('.').pop()}</span>
                </div>
              )}
            </div>
            <div className="p-2 space-y-2">
              <p className="text-sm truncate" title={file.name}>
                {file.name.split('-').slice(1).join('-')}
              </p>
              <div className="flex gap-2">
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
          </div>
        )
      })}
    </div>
  );
};