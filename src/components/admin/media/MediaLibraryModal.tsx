import { Dialog } from "@/components/ui/dialog";
import { MediaLibrary } from "./MediaLibrary";

export interface MediaLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  type?: 'image' | 'video';
}

export const MediaLibraryModal = ({ open, onClose, onSelect, type = 'image' }: MediaLibraryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
        <div className="fixed z-50 grid w-full gap-4 rounded-b-lg border bg-background p-6 shadow-lg sm:max-w-lg">
          <div className="flex flex-col space-y-2">
            <MediaLibrary onSelect={onSelect} type={type} />
          </div>
        </div>
      </div>
    </Dialog>
  );
};