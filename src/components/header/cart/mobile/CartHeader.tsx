import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface CartHeaderProps {
  onClose: () => void;
  onClear: () => void;
  hasItems: boolean;
}

export const CartHeader = ({ onClose, onClear, hasItems }: CartHeaderProps) => {
  return (
    <SheetHeader className="sticky top-0 z-50 bg-white border-b px-4 py-4">
      <div className="flex items-center justify-between">
        <SheetTitle className="text-xl font-medium flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="p-0 hover:bg-transparent -ml-2"
            onClick={onClose}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          Your Cart
        </SheetTitle>
        {hasItems && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </SheetHeader>
  );
};