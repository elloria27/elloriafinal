
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BusinessFormSubmission {
  id: string;
  full_name: string;
  email: string;
  form_type: string;
}

interface DeleteConfirmDialogProps {
  form: BusinessFormSubmission;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmDialog = ({ form, onClose, onConfirm }: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Form Submission</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this form submission from {form.full_name}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
