import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BulkShareDialogProps {
  fileNames: string[];
  onClose: () => void;
}

export const BulkShareDialog = ({ fileNames, onClose }: BulkShareDialogProps) => {
  const [accessLevel, setAccessLevel] = useState<string>("view");
  const [shareLink, setShareLink] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBulkShareLink = async () => {
    if (fileNames.length === 0) return;

    try {
      setIsGenerating(true);
      const shareToken = crypto.randomUUID();

      const { error } = await supabase
        .from('bulk_file_shares')
        .insert({
          id: crypto.randomUUID(),
          file_paths: fileNames,
          access_level: accessLevel,
          share_token: shareToken,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      const link = `${window.location.origin}/shared/bulk/${shareToken}`;
      setShareLink(link);
      toast.success("Bulk share link generated successfully");
    } catch (error) {
      console.error('Error generating bulk share link:', error);
      toast.error("Failed to generate bulk share link");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard");
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={fileNames.length > 0} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Multiple Files</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Selected files: {fileNames.length}
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium">Access Level</label>
            <Select value={accessLevel} onValueChange={setAccessLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View Only</SelectItem>
                <SelectItem value="download">Download</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Input value={shareLink} readOnly placeholder="Generate a bulk share link" />
            {!shareLink ? (
              <Button onClick={generateBulkShareLink} disabled={isGenerating}>
                Generate
              </Button>
            ) : (
              <Button onClick={copyToClipboard}>
                Copy
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};