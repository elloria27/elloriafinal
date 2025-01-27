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

interface ShareDialogProps {
  fileName: string | null;
  onClose: () => void;
}

export const ShareDialog = ({ fileName, onClose }: ShareDialogProps) => {
  const [accessLevel, setAccessLevel] = useState<string>("public");
  const [shareLink, setShareLink] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateShareLink = async () => {
    if (!fileName) return;

    try {
      setIsGenerating(true);
      const shareToken = crypto.randomUUID();

      const { error } = await supabase
        .from('file_shares')
        .insert({
          file_path: fileName,
          access_level: accessLevel,
          share_token: shareToken,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (error) throw error;

      const link = `${window.location.origin}/shared/${shareToken}`;
      setShareLink(link);
      toast.success("Share link generated successfully");
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error("Failed to generate share link");
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
    <Dialog open={!!fileName} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Access Level</label>
            <Select value={accessLevel} onValueChange={setAccessLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public Access</SelectItem>
                <SelectItem value="authenticated">Authenticated Users Only</SelectItem>
                <SelectItem value="view">View Only</SelectItem>
                <SelectItem value="download">Download</SelectItem>
                <SelectItem value="edit">Edit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Input value={shareLink} readOnly placeholder="Generate a share link" />
            {!shareLink ? (
              <Button onClick={generateShareLink} disabled={isGenerating}>
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