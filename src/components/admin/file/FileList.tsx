import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileIcon, Download, Share2, Trash2, Eye } from "lucide-react";
import { FileObject } from "@supabase/storage-js";
import { FilePreview } from "./FilePreview";
import { ShareDialog } from "./ShareDialog";

interface FileListProps {
  files: FileObject[];
  selectedFiles: string[];
  onFileSelect: (fileName: string) => void;
  onFileDownload: (fileName: string) => void;
  onFileDelete: (fileName: string) => void;
  onShare: (fileName: string) => void;
}

export const FileList = ({
  files,
  selectedFiles,
  onFileSelect,
  onFileDownload,
  onFileDelete,
  onShare,
}: FileListProps) => {
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [shareFile, setShareFile] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <Card key={file.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedFiles.includes(file.name)}
                onCheckedChange={() => onFileSelect(file.name)}
              />
              <FileIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{file.name.split('-').slice(1).join('-')}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.metadata?.size || 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPreviewFile(file.name)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onFileDownload(file.name)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShareFile(file.name)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onFileDelete(file.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <FilePreview
        fileName={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <ShareDialog
        fileName={shareFile}
        onClose={() => setShareFile(null)}
      />
    </div>
  );
};