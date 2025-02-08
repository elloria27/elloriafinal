
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TaskManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const { data: tasks, isLoading, refetch } = useQuery({
    queryKey: ['hrm-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hrm_tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedTask(null);
    setIsFormOpen(false);
    refetch();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <TaskList 
        tasks={tasks || []} 
        onEdit={handleEditTask}
        onUpdate={refetch}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          <TaskForm 
            task={selectedTask}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManagement;
