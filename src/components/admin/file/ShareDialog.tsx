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
import { Info } from "lucide-react";

interface ShareDialogProps {
  fileName: string | null;
  onClose: () => void;
}

export const ShareDialog = ({ fileName, onClose }: ShareDialogProps) => {
  const [accessLevel, setAccessLevel] = useState<string>("view");
  const [shareLink, setShareLink] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateShareLink = async () => {
    if (!fileName) return;

    try {
      setIsGenerating(true);
      console.log('Generating share link for:', fileName);
      console.log('Access level:', accessLevel);
      
      const shareToken = crypto.randomUUID();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { error } = await supabase
        .from('file_shares')
        .insert({
          file_path: fileName,
          access_level: accessLevel,
          share_token: shareToken,
          created_by: userId,
        });

      if (error) {
        console.error('Error inserting share record:', error);
        throw error;
      }

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
      <DialogContent className="w-full max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Share File
          </DialogTitle>
          <p className="text-sm text-gray-500 break-all mt-1">
            {fileName}
          </p>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              Access Level
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Choose who can access this file
              </span>
            </label>
            <Select value={accessLevel} onValueChange={setAccessLevel}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View Only</SelectItem>
                <SelectItem value="download">Allow Download</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Share Link</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                value={shareLink} 
                readOnly 
                placeholder="Generate a share link"
                className="flex-1 min-w-0 font-mono text-sm"
              />
              {!shareLink ? (
                <Button 
                  onClick={generateShareLink} 
                  disabled={isGenerating}
                  className="whitespace-nowrap"
                >
                  Generate Link
                </Button>
              ) : (
                <Button 
                  onClick={copyToClipboard}
                  className="whitespace-nowrap"
                >
                  Copy Link
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};