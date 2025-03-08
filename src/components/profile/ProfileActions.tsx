import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ProfileActionsProps {
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
}

export const ProfileActions = ({
  hasChanges,
  isSaving,
  onSave
}: ProfileActionsProps) => {
  return (
    <div className="pt-6 border-t">
      <Button 
        onClick={onSave}
        disabled={!hasChanges || isSaving}
        className="w-full"
      >
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? "Saving Changes..." : "Save Changes"}
      </Button>
    </div>
  );
};