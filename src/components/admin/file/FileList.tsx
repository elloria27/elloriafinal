import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileIcon, Download, Share2, Trash2, Eye, User, Folder, FileText, FilePdf, FileImage, FileVideo, FileAudio } from "lucide-react";
import { FileObject } from "@supabase/storage-js";
import { FilePreview } from "./FilePreview";
import { ShareDialog } from "./ShareDialog";

interface FileWithUploader extends FileObject {
  uploader?: {
    email: string;
    full_name: string;
  };
  isFolder?: boolean;
}

interface FileListProps {
  files: FileWithUploader[];
  selectedFiles: string[];
  onFileSelect: (fileName: string, isSelected: boolean) => void;
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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (!extension) return <FileIcon className="h-8 w-8 text-primary flex-shrink-0" />;

    switch (extension) {
      case 'pdf':
        return <FilePdf className="h-8 w-8 text-primary flex-shrink-0" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-primary flex-shrink-0" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <FileImage className="h-8 w-8 text-primary flex-shrink-0" />;
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'webm':
        return <FileVideo className="h-8 w-8 text-primary flex-shrink-0" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <FileAudio className="h-8 w-8 text-primary flex-shrink-0" />;
      default:
        return <FileIcon className="h-8 w-8 text-primary flex-shrink-0" />;
    }
  };

  const canPreview = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const previewableExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'webm', 'mp3', 'wav', 'ogg'];
    return extension && previewableExtensions.includes(extension);
  };

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <Card key={file.id} className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedFiles.includes(file.name)}
                onCheckedChange={(checked) => onFileSelect(file.name, checked === true)}
              />
              {file.isFolder ? (
                <Folder className="h-8 w-8 text-primary flex-shrink-0" />
              ) : (
                getFileIcon(file.name)
              )}
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {file.name.split('-').slice(1).join('-')}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
                  {!file.isFolder && <span>{formatFileSize(file.metadata?.size || 0)}</span>}
                  {file.uploader && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{file.uploader.full_name || file.uploader.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-12 sm:ml-0">
              {!file.isFolder && canPreview(file.name) && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPreviewFile(file.name)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onFileDownload(file.name)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShareFile(file.name)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
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