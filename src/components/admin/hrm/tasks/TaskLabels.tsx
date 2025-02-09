
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

        onLabelsChange([...selectedLabels, label as Label]);
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
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Labels</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full w-10 h-10 p-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[90%] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Create New Label</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 p-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Label Name</label>
                <Input
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Enter label name"
                  className="rounded-full h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Input
                  type="color"
                  value={newLabelColor}
                  onChange={(e) => setNewLabelColor(e.target.value)}
                  className="h-12 w-full"
                />
              </div>
              <Button
                onClick={createLabel}
                disabled={!newLabelName || loading}
                className="w-full rounded-full h-12 bg-blue-400 hover:bg-blue-500 text-white"
              >
                {loading ? "Creating..." : "Create Label"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedLabels.map((label) => (
          <Badge
            key={label.id}
            style={{ backgroundColor: label.color }}
            className="text-white flex items-center gap-1 px-4 py-2 rounded-full text-sm"
          >
            {label.name}
            <X
              className="h-4 w-4 cursor-pointer ml-1"
              onClick={() => removeLabel(label.id)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TaskLabels;
