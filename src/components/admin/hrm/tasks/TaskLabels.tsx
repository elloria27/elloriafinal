import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Label } from "@/types/hrm";

interface TaskLabelsProps {
  taskId: string;
  selectedLabels: Label[];
  onLabelsChange: (labels: Label[]) => void;
}

const TaskLabels = ({ taskId, selectedLabels, onLabelsChange }: TaskLabelsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#3B82F6");
  const [loading, setLoading] = useState(false);

  const createLabel = async () => {
    try {
      setLoading(true);
      const { data: label, error } = await supabase
        .from("hrm_task_labels")
        .insert({
          name: newLabelName,
          color: newLabelColor,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (label) {
        const { error: assignError } = await supabase
          .from("hrm_task_label_assignments")
          .insert({
            task_id: taskId,
            label_id: label.id,
          });

        if (assignError) throw assignError;

        onLabelsChange([...selectedLabels, label]);
        setNewLabelName("");
        setIsOpen(false);
        toast.success("Label created and assigned successfully");
      }
    } catch (error: any) {
      toast.error("Error creating label: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeLabel = async (labelId: string) => {
    try {
      const { error } = await supabase
        .from("hrm_task_label_assignments")
        .delete()
        .match({ task_id: taskId, label_id: labelId });

      if (error) throw error;

      onLabelsChange(selectedLabels.filter((label) => label.id !== labelId));
      toast.success("Label removed successfully");
    } catch (error: any) {
      toast.error("Error removing label: " + error.message);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedLabels.map((label) => (
          <Badge
            key={label.id}
            style={{ backgroundColor: label.color, color: "white" }}
            className="flex items-center gap-1"
          >
            {label.name}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeLabel(label.id)}
            />
          </Badge>
        ))}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-6">
              <Plus className="h-4 w-4" />
              Add Label
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Label</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label>Label Name</label>
                <Input
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Enter label name"
                />
              </div>
              <div className="space-y-2">
                <label>Color</label>
                <Input
                  type="color"
                  value={newLabelColor}
                  onChange={(e) => setNewLabelColor(e.target.value)}
                />
              </div>
              <Button
                onClick={createLabel}
                disabled={!newLabelName || loading}
                className="w-full"
              >
                {loading ? "Creating..." : "Create Label"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TaskLabels;
