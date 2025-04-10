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
  isFolder?: boolean;
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
    cleanupBrokenFiles();
  }, []);

  const cleanupBrokenFiles = async () => {
    try {
      console.log('Starting cleanup of broken files...');
      const { data: filesData, error: filesError } = await supabase.storage.from('files').list();
      
      if (filesError) {
        console.error('Error fetching files for cleanup:', filesError);
        return;
      }

      // Find all files that are broken (0 bytes and not folders)
      const brokenFiles = filesData.filter(file => {
        const isBrokenFile = file.metadata?.size === 0 && 
                           !file.name.endsWith('/') &&
                           !file.name.includes('/');
        
        return isBrokenFile;
      });

      console.log('Found broken files:', brokenFiles);

      let deletedFiles = 0;
      let deletedFolders = 0;

      // Delete broken files from storage
      for (const file of brokenFiles) {
        const { error: deleteStorageError } = await supabase.storage
          .from('files')
          .remove([file.name]);

        if (deleteStorageError) {
          console.error(`Error deleting broken file ${file.name} from storage:`, deleteStorageError);
          continue;
        }

        // Also delete any associated file_shares records
        const { error: deleteShareError } = await supabase
          .from('file_shares')
          .delete()
          .eq('file_path', file.name);

        if (deleteShareError) {
          console.error(`Error deleting file share for ${file.name}:`, deleteShareError);
        } else {
          deletedFiles++;
          console.log(`Successfully deleted broken file ${file.name}`);
        }
      }

      // Also cleanup broken folders
      const { data: foldersData, error: foldersError } = await supabase
        .from('folders')
        .select('*');

      if (foldersError) {
        console.error('Error fetching folders:', foldersError);
        return;
      }

      // Find broken folder entries
      const brokenFolders = filesData.filter(file => {
        const isBrokenFolder = file.metadata?.size === 0 && 
                             !file.metadata?.mimetype && 
                             !file.name.includes('/') &&
                             !file.name.endsWith('/');
        
        return isBrokenFolder;
      });

      for (const folder of brokenFolders) {
        const { error: deleteFolderError } = await supabase.storage
          .from('files')
          .remove([folder.name]);

        if (deleteFolderError) {
          console.error(`Error deleting broken folder ${folder.name}:`, deleteFolderError);
          continue;
        }

        const { error: deleteRecordError } = await supabase
          .from('folders')
          .delete()
          .eq('path', folder.name);

        if (deleteRecordError) {
          console.error(`Error deleting folder record for ${folder.name}:`, deleteRecordError);
        } else {
          deletedFolders++;
          console.log(`Successfully deleted broken folder ${folder.name}`);
        }
      }

      if (deletedFiles > 0 || deletedFolders > 0) {
        toast.success(`Cleaned up ${deletedFiles} broken files and ${deletedFolders} broken folders`);
        await fetchFiles(); // Refresh the file list
      }
      
      console.log('Cleanup completed');
    } catch (error) {
      console.error('Error in cleanupBrokenFiles:', error);
      toast.error("Error cleaning up broken files");
    }
  };

  const fetchFiles = async () => {
    try {
      console.log('Fetching files from storage...');
      const { data: filesData, error: filesError } = await supabase.storage.from('files').list();
      
      if (filesError) {
        console.error('Error fetching files:', filesError);
        toast.error("Failed to fetch files");
        return;
      }

      // Fetch folders
      const { data: foldersData, error: foldersError } = await supabase
        .from('folders')
        .select('*');

      if (foldersError) {
        console.error('Error fetching folders:', foldersError);
      }

      // Create a map of folder paths
      const folderPaths = new Set(foldersData?.map(folder => folder.path) || []);

      // Fetch uploader information for each file
      const filesWithUploaders = await Promise.all(
        filesData.map(async (file) => {
          const isFolder = folderPaths.has(file.name);
          
          const { data: shareData } = await supabase
            .from('file_shares')
            .select('created_by')
            .eq('file_path', file.name)
            .maybeSingle();

          if (shareData?.created_by) {
            const { data: userData } = await supabase
              .from('profiles')
              .select('email, full_name')
              .eq('id', shareData.created_by)
              .maybeSingle();

            return {
              ...file,
              isFolder,
              uploader: userData
            };
          }

          return {
            ...file,
            isFolder
          };
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

        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        // Create file share record to track uploader
        const { error: shareError } = await supabase
          .from('file_shares')
          .insert({
            file_path: fileName,
            access_level: 'view',
            share_token: crypto.randomUUID(),
            created_by: (await supabase.auth.getUser()).data.user?.id
          });

        if (shareError) {
          console.error('Error creating file share:', shareError);
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
      const timestamp = Date.now();
      
      // Get the folder name from the first file's path
      const firstFile = files[0] as any;
      const folderPath = firstFile.webkitRelativePath.split('/')[0];
      const fullFolderPath = `${timestamp}-${folderPath}/`;

      // Create folder record first
      const { error: folderError } = await supabase
        .from('folders')
        .insert({
          name: folderPath,
          path: fullFolderPath,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (folderError) {
        console.error('Error creating folder record:', folderError);
        toast.error("Failed to create folder");
        return;
      }

      // Handle folder upload
      for (const file of files) {
        const relativePath = (file as any).webkitRelativePath;
        if (!relativePath) {
          console.error('No relative path found for file:', file.name);
          continue;
        }

        console.log('Uploading file with path:', relativePath);
        const fileName = `${timestamp}-${relativePath}`;

        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        // Create file share record to track uploader
        const { error: shareError } = await supabase
          .from('file_shares')
          .insert({
            file_path: fileName,
            folder_path: fullFolderPath,
            access_level: 'view',
            share_token: crypto.randomUUID(),
            created_by: (await supabase.auth.getUser()).data.user?.id
          });

        if (shareError) {
          console.error('Error creating file share:', shareError);
        }
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
      const timestamp = Date.now();
      const folderPath = `${timestamp}-${newFolderName}/`;

      // Create folder record in the database
      const { error: folderError } = await supabase
        .from('folders')
        .insert({
          name: newFolderName,
          path: folderPath,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (folderError) {
        console.error('Error creating folder record:', folderError);
        toast.error("Failed to create folder");
        return;
      }

      // Create file share record for the folder
      const { error: shareError } = await supabase
        .from('file_shares')
        .insert({
          file_path: folderPath,
          access_level: 'view',
          share_token: crypto.randomUUID(),
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (shareError) {
        console.error('Error creating folder share:', shareError);
      }

      toast.success("Folder created successfully");
      setShowFolderDialog(false);
      setNewFolderName("");
      fetchFiles();
    } catch (error) {
      console.error('Error in handleCreateFolder:', error);
      toast.error("Failed to create folder");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">File Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Secure storage for company files. Only administrators can access and share these files.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {selectedFiles.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setSelectedFiles([])}
              className="w-full sm:w-auto"
            >
              Clear Selection ({selectedFiles.length})
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowFolderDialog(true)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-auto">
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
                className="w-full"
                disabled={uploading}
              >
                <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2 justify-center">
                  <Upload className="h-4 w-4" />
                  Upload Files
                </label>
              </Button>
            </div>
            <div className="relative w-full sm:w-auto">
              <Input
                type="file"
                onChange={handleFolderUpload}
                className="hidden"
                id="folder-upload"
                disabled={uploading}
                {...{ webkitdirectory: "", directory: "" } as any}
              />
              <Button
                asChild
                variant="outline"
                className="w-full"
                disabled={uploading}
              >
                <label htmlFor="folder-upload" className="cursor-pointer flex items-center gap-2 justify-center">
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
        onFileSelect={(fileName, isSelected) => {
          setSelectedFiles(prev => {
            if (isSelected) {
              return [...prev, fileName];
            } else {
              return prev.filter(name => name !== fileName);
            }
          });
        }}
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

            // If it's a folder, delete the folder record
            if (fileName.endsWith('/')) {
              const { error: folderError } = await supabase
                .from('folders')
                .delete()
                .eq('path', fileName);

              if (folderError) {
                console.error('Error deleting folder record:', folderError);
              }
            }

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
        <DialogContent className="sm:max-w-[425px]">
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
