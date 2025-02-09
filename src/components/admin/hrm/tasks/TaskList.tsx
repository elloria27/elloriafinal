
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import TaskForm from "./TaskForm";

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  due_date: string | null;
  completion_date: string | null;
  priority: "low" | "medium" | "high";
  category: "hr" | "finance" | "operations" | "other";
  status: "todo" | "in_progress" | "completed" | "on_hold";
  profiles?: {
    full_name: string | null;
  } | null;
}

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
}

const TaskDetails = ({ task, onClose, onEdit }: TaskDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium">Assigned To</h4>
          <p>{task.profiles?.full_name || "Unassigned"}</p>
        </div>
        <div>
          <h4 className="font-medium">Status</h4>
          <Badge className={getStatusColor(task.status)}>
            {task.status.replace("_", " ")}
          </Badge>
        </div>
        <div>
          <h4 className="font-medium">Due Date</h4>
          <p>{task.due_date ? format(new Date(task.due_date), "PP") : "Not set"}</p>
        </div>
        <div>
          <h4 className="font-medium">Completion Date</h4>
          <p>{task.completion_date ? format(new Date(task.completion_date), "PP") : "Not set"}</p>
        </div>
        <div>
          <h4 className="font-medium">Priority</h4>
          <Badge variant="secondary" className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
        </div>
        <div>
          <h4 className="font-medium">Category</h4>
          <Badge variant="outline">{task.category}</Badge>
        </div>
      </div>
      <div>
        <h4 className="font-medium">Description</h4>
        <p className="whitespace-pre-wrap">{task.description || "No description provided"}</p>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEdit}>
          Edit Task
        </Button>
      </div>
    </div>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data: tasksData, error } = await supabase
        .from("hrm_tasks")
        .select(`
          *,
          profiles:assigned_to (
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (tasksData) {
        setTasks(tasksData as unknown as Task[]);
      }
    } catch (error: any) {
      toast.error("Error fetching tasks: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "on_hold":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    fetchTasks();
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.profiles?.full_name || "Unassigned"}</TableCell>
                <TableCell>
                  {task.due_date && format(new Date(task.due_date), "PP")}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{task.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedTask(task);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedTask(task);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <TaskDetails
              task={selectedTask}
              onClose={() => setIsViewModalOpen(false)}
              onEdit={handleEdit}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <TaskForm
              initialData={{
                ...selectedTask,
                due_date: selectedTask.due_date ? new Date(selectedTask.due_date) : undefined,
                completion_date: selectedTask.completion_date ? new Date(selectedTask.completion_date) : undefined,
              }}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
