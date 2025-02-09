import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Checklist, ChecklistItem } from "@/types/hrm";

interface TaskChecklistProps {
  taskId: string;
  checklists: Checklist[];
  onChecklistsChange: (checklists: Checklist[]) => void;
}

const TaskChecklist = ({ taskId, checklists, onChecklistsChange }: TaskChecklistProps) => {
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newItemContent, setNewItemContent] = useState("");
  const [loading, setLoading] = useState(false);

  const createChecklist = async () => {
    try {
      setLoading(true);
      const { data: checklist, error } = await supabase
        .from("hrm_task_checklists")
        .insert({
          task_id: taskId,
          title: newChecklistTitle,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          order_index: checklists.length,
        })
        .select()
        .single();

      if (error) throw error;

      if (checklist) {
        onChecklistsChange([...checklists, { ...checklist, items: [] }]);
        setNewChecklistTitle("");
        toast.success("Checklist created successfully");
      }
    } catch (error: any) {
      toast.error("Error creating checklist: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addChecklistItem = async (checklistId: string) => {
    try {
      setLoading(true);
      const { data: item, error } = await supabase
        .from("hrm_checklist_items")
        .insert({
          checklist_id: checklistId,
          content: newItemContent,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          order_index: checklists.find(c => c.id === checklistId)?.items.length || 0,
        })
        .select()
        .single();

      if (error) throw error;

      if (item) {
        const updatedChecklists = checklists.map(checklist => {
          if (checklist.id === checklistId) {
            return {
              ...checklist,
              items: [...checklist.items, item],
            };
          }
          return checklist;
        });
        onChecklistsChange(updatedChecklists);
        setNewItemContent("");
        toast.success("Item added successfully");
      }
    } catch (error: any) {
      toast.error("Error adding item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (checklistId: string, itemId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("hrm_checklist_items")
        .update({ completed })
        .match({ id: itemId });

      if (error) throw error;

      const updatedChecklists = checklists.map(checklist => {
        if (checklist.id === checklistId) {
          return {
            ...checklist,
            items: checklist.items.map(item => 
              item.id === itemId ? { ...item, completed } : item
            ),
          };
        }
        return checklist;
      });
      onChecklistsChange(updatedChecklists);
    } catch (error: any) {
      toast.error("Error updating item: " + error.message);
    }
  };

  return (
    <div className="space-y-4">
      {checklists.map((checklist) => (
        <div key={checklist.id} className="space-y-2">
          <h4 className="font-medium">{checklist.title}</h4>
          <div className="space-y-2">
            {checklist.items.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={(checked) => 
                    toggleItem(checklist.id, item.id, checked as boolean)
                  }
                />
                <span className={item.completed ? "line-through text-gray-500" : ""}>
                  {item.content}
                </span>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add new item"
                value={newItemContent}
                onChange={(e) => setNewItemContent(e.target.value)}
              />
              <Button
                onClick={() => addChecklistItem(checklist.id)}
                disabled={!newItemContent || loading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <Input
          placeholder="New checklist title"
          value={newChecklistTitle}
          onChange={(e) => setNewChecklistTitle(e.target.value)}
        />
        <Button
          onClick={createChecklist}
          disabled={!newChecklistTitle || loading}
        >
          Add Checklist
        </Button>
      </div>
    </div>
  );
};

export default TaskChecklist;
