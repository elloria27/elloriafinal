
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
        const newChecklist: Checklist = {
          id: checklist.id,
          title: checklist.title,
          items: [],
          order_index: checklist.order_index,
        };
        onChecklistsChange([...checklists, newChecklist]);
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
            const newItem: ChecklistItem = {
              id: item.id,
              content: item.content,
              completed: item.completed,
              order_index: item.order_index,
            };
            return {
              ...checklist,
              items: [...checklist.items, newItem],
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
    <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
      <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">Checklists</h3>
      {checklists.map((checklist) => (
        <div key={checklist.id} className="space-y-2 bg-white/50 p-4 rounded-lg shadow-sm">
          <h4 className="font-medium">{checklist.title}</h4>
          <div className="space-y-2">
            {checklist.items.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={(checked) => 
                    toggleItem(checklist.id, item.id, checked as boolean)
                  }
                  className="h-5 w-5"
                />
                <span className={`flex-1 break-words ${item.completed ? "line-through text-gray-500" : ""}`}>
                  {item.content}
                </span>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add new item"
                value={newItemContent}
                onChange={(e) => setNewItemContent(e.target.value)}
                className="rounded-full bg-white/50"
              />
              <Button
                onClick={() => addChecklistItem(checklist.id)}
                disabled={!newItemContent || loading}
                className="rounded-full bg-blue-400 hover:bg-blue-500 text-white shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <div className="flex gap-2 sticky bottom-0 bg-background/95 backdrop-blur-sm py-2">
        <Input
          placeholder="New checklist title"
          value={newChecklistTitle}
          onChange={(e) => setNewChecklistTitle(e.target.value)}
          className="rounded-full bg-white/50"
        />
        <Button
          onClick={createChecklist}
          disabled={!newChecklistTitle || loading}
          className="rounded-full bg-blue-400 hover:bg-blue-500 text-white px-6 shrink-0"
        >
          <Plus className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Add Checklist</span>
        </Button>
      </div>
    </div>
  );
};

export default TaskChecklist;
