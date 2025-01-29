import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, FolderPlus } from "lucide-react";
import { FileObject } from "@supabase/storage-js";
import { FileList } from "./file/FileList";
import { BulkShareDialog } from "./file/BulkShareDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FileWithUploader extends FileObject {
  uploader?: {
    email: string;
    full_name: string;
  };
}

export const FileManagement = () => {
  const [files, setFiles] = useState<FileWithUploader[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      console.log('Fetching files from storage...');
      const { data: filesData, error: filesError } = await supabase.storage.from('files').list();
      
      if (filesError) {
        console.error('Error fetching files:', filesError);
        toast.error("Failed to fetch files");
        return;
      }

      // Fetch uploader information for each file
      const filesWithUploaders = await Promise.all(
        filesData.map(async (file) => {
          const { data: shareData } = await supabase
            .from('file_shares')
            .select('created_by')
            .eq('file_path', file.name)
            .single();

          if (shareData?.created_by) {
            const { data: userData } = await supabase
              .from('profiles')
              .select('email, full_name')
              .eq('id', shareData.created_by)
              .single();

            return {
              ...file,
              uploader: userData
            };
          }

          return file;
        })
      );

      console.log('Files fetched successfully:', filesWithUploaders);
      setFiles(filesWithUploaders);
    } catch (error) {
      console.error('Error in fetchFiles:', error);
      toast.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      
      // Handle multiple files
      for (const file of files) {
        console.log('Uploading file:', file.name);

        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(`${Date.now()}-${file.name}`, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        console.log('File uploaded successfully');
        toast.success(`${file.name} uploaded successfully`);
      }

      fetchFiles();
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const handleFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      
      // Handle folder upload
      for (const file of files) {
        const relativePath = (file as any).webkitRelativePath || file.name;
        console.log('Uploading file with path:', relativePath);

        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(`${Date.now()}-${relativePath}`, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        console.log('File uploaded successfully');
      }

      toast.success("Folder uploaded successfully");
      fetchFiles();
    } catch (error) {
      console.error('Error in handleFolderUpload:', error);
      toast.error("Failed to upload folder");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    try {
      const { error } = await supabase
        .from('folders')
        .insert({
          name: newFolderName,
          path: `/${newFolderName}`
        });

      if (error) throw error;

      toast.success("Folder created successfully");
      setShowFolderDialog(false);
      setNewFolderName("");
      fetchFiles();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error("Failed to create folder");
    }
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
        <div>
          <h2 className="text-2xl font-bold">File Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Secure storage for company files. Only administrators can access and share these files.
          </p>
        </div>
        <div className="flex gap-4">
          {selectedFiles.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setSelectedFiles([])}
            >
              Clear Selection ({selectedFiles.length})
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowFolderDialog(true)}
            className="flex items-center gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
          <div className="flex gap-2">
            <div className="relative">
              <Input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={uploading}
                multiple
              />
              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2"
                disabled={uploading}
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Upload Files
                </label>
              </Button>
            </div>
            <div className="relative">
              <Input
                type="file"
                onChange={handleFolderUpload}
                className="hidden"
                id="folder-upload"
                disabled={uploading}
                multiple
                {...{ webkitdirectory: "", directory: "" } as any}
              />
              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2"
                disabled={uploading}
              >
                <label htmlFor="folder-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Upload Folder
                </label>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FileList
        files={files}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
        onFileDownload={async (fileName) => {
          try {
            console.log('Downloading file:', fileName);
            const { data, error } = await supabase.storage
              .from('files')
              .download(fileName);

            if (error) throw error;

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
            console.error('Error downloading file:', error);
            toast.error("Failed to download file");
          }
        }}
        onFileDelete={async (fileName) => {
          try {
            console.log('Deleting file:', fileName);
            const { error } = await supabase.storage
              .from('files')
              .remove([fileName]);

            if (error) throw error;

            console.log('File deleted successfully');
            toast.success("File deleted successfully");
            fetchFiles();
          } catch (error) {
            console.error('Error deleting file:', error);
            toast.error("Failed to delete file");
          }
        }}
        onShare={() => {}}
      />

      <BulkShareDialog
        fileNames={selectedFiles}
        onClose={() => setSelectedFiles([])}
      />

      <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Enter folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFolderDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};