
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order_index: number;
}

interface TaskSubtasksProps {
  taskId: string;
  subtasks: Subtask[];
  onSubtasksChange: (subtasks: Subtask[]) => void;
}

const TaskSubtasks = ({ taskId, subtasks, onSubtasksChange }: TaskSubtasksProps) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const createSubtask = async () => {
    try {
      setLoading(true);
      const { data: subtask, error } = await supabase
        .from("hrm_subtasks")
        .insert({
          task_id: taskId,
          title: newSubtaskTitle,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          order_index: subtasks.length,
        })
        .select()
        .single();

      if (error) throw error;

      if (subtask) {
        onSubtasksChange([...subtasks, subtask]);
        setNewSubtaskTitle("");
        toast.success("Subtask created successfully");
      }
    } catch (error: any) {
      toast.error("Error creating subtask: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubtask = async (subtaskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("hrm_subtasks")
        .update({ completed })
        .match({ id: subtaskId });

      if (error) throw error;

      const updatedSubtasks = subtasks.map(subtask =>
        subtask.id === subtaskId ? { ...subtask, completed } : subtask
      );
      onSubtasksChange(updatedSubtasks);
    } catch (error: any) {
      toast.error("Error updating subtask: " + error.message);
    }
  };

  const deleteSubtask = async (subtaskId: string) => {
    try {
      const { error } = await supabase
        .from("hrm_subtasks")
        .delete()
        .match({ id: subtaskId });

      if (error) throw error;

      onSubtasksChange(subtasks.filter(subtask => subtask.id !== subtaskId));
      toast.success("Subtask deleted successfully");
    } catch (error: any) {
      toast.error("Error deleting subtask: " + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-2">
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={(checked) => 
                toggleSubtask(subtask.id, checked as boolean)
              }
            />
            <span className={subtask.completed ? "line-through text-gray-500" : ""}>
              {subtask.title}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteSubtask(subtask.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="New subtask"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
        />
        <Button
          onClick={createSubtask}
          disabled={!newSubtaskTitle || loading}
        >
          <Plus className="h-4 w-4" />
          Add Subtask
        </Button>
      </div>
    </div>
  );
};

export default TaskSubtasks;
