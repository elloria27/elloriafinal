
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Subtask } from "@/types/hrm";

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
        const newSubtask: Subtask = {
          id: subtask.id,
          title: subtask.title,
          completed: subtask.completed,
          order_index: subtask.order_index,
        };
        onSubtasksChange([...subtasks, newSubtask]);
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
    <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
      <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">Subtasks</h3>
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-2 bg-white/50 p-3 rounded-lg shadow-sm">
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={(checked) => 
                toggleSubtask(subtask.id, checked as boolean)
              }
              className="h-5 w-5"
            />
            <span className={`flex-1 ${subtask.completed ? "line-through text-gray-500" : ""} break-words`}>
              {subtask.title}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteSubtask(subtask.id)}
              className="h-8 w-8 p-0 shrink-0"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 sticky bottom-0 bg-background/95 backdrop-blur-sm py-2">
        <Input
          placeholder="New subtask"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          className="rounded-full bg-white/50"
        />
        <Button
          onClick={createSubtask}
          disabled={!newSubtaskTitle || loading}
          className="rounded-full bg-blue-400 hover:bg-blue-500 text-white px-6 shrink-0"
        >
          <Plus className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Add Subtask</span>
        </Button>
      </div>
    </div>
  );
};

export default TaskSubtasks;
