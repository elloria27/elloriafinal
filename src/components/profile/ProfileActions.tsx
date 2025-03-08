
import { Button } from "@/components/ui/button";

interface ProfileActionsProps {
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  user?: any;
}

export const ProfileActions = ({
  hasChanges,
  isSaving,
  onSave,
  user
}: ProfileActionsProps) => {
  return (
    <div className="flex justify-end mt-6">
      <Button
        type="button"
        onClick={onSave}
        disabled={!hasChanges || isSaving}
        className="w-full sm:w-auto"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

