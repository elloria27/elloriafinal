import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaLibrary } from "./MediaLibrary";

interface MediaLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  type?: "image" | "video";
}

export const MediaLibraryModal = ({ open, onClose, onSelect, type = "image" }: MediaLibraryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        <MediaLibrary onSelect={onSelect} />
      </DialogContent>
    </Dialog>
  );
};