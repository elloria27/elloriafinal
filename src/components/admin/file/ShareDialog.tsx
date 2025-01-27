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
    if (!fileName) {
      console.error('No file name provided');
      toast.error("No file selected");
      return;
    }

    try {
      setIsGenerating(true);
      console.log('Starting share link generation...');
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        toast.error("Authentication error");
        return;
      }

      const userId = userData.user?.id;
      console.log('Current user ID:', userId);
      
      const shareToken = crypto.randomUUID();
      console.log('Generated share token:', shareToken);
      
      const { error: insertError } = await supabase
        .from('file_shares')
        .insert({
          file_path: fileName,
          access_level: accessLevel,
          share_token: shareToken,
          created_by: userId
        });

      if (insertError) {
        console.error('Error creating share:', insertError);
        toast.error("Failed to generate share link");
        return;
      }

      const link = `${window.location.origin}/shared/${shareToken}`;
      console.log('Generated link:', link);
      setShareLink(link);
      toast.success("Share link generated successfully");
    } catch (error) {
      console.error('Unexpected error generating share link:', error);
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
      <DialogContent className="sm:max-w-md">
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
            <Input 
              value={shareLink} 
              readOnly 
              placeholder="Generate a share link"
              className="flex-1"
            />
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