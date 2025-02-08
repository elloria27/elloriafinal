
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TaskList } from "./TaskList";
import { TaskCalendar } from "./TaskCalendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TaskStatus = "new" | "in_progress" | "completed" | "on_hold" | "canceled";
type TaskPriority = "low" | "medium" | "high" | "urgent";

export const TaskManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hrm_tasks")
        .select(`
          *,
          assigned_to:profiles!assigned_to(full_name),
          created_by:profiles!created_by(full_name)
        `)
        .order("due_date", { ascending: true });

      if (error) {
        toast.error("Failed to fetch tasks");
        throw error;
      }

      return data;
    },
  });

  const handleUpdateTask = async (
    taskId: string,
    updates: { status?: TaskStatus; priority?: TaskPriority }
  ) => {
    try {
      const { error } = await supabase
        .from("hrm_tasks")
        .update(updates)
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Task updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("hrm_tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Task deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Management</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </TabsContent>

        <TabsContent value="calendar">
          <TaskCalendar tasks={tasks} onUpdateTask={handleUpdateTask} />
        </TabsContent>
      </Tabs>

      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};
