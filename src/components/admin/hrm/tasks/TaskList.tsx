
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
import { Eye, Pencil, CheckCircle2, Circle } from "lucide-react";
import TaskForm from "./TaskForm";

type TaskStatus = "todo" | "in_progress" | "completed" | "on_hold";
type TaskPriority = "low" | "medium" | "high";
type TaskCategory = "hr" | "finance" | "operations" | "other";

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  due_date: string | null;
  completion_date: string | null;
  start_date: string | null;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  estimated_hours?: number;
  actual_hours?: number;
  created_by: string;
  profiles?: {
    full_name: string | null;
  };
  labels?: Array<{ id: string; name: string; color: string }>;
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
    order_index: number;
  }>;
  checklists?: Array<{
    id: string;
    title: string;
    items: Array<{
      id: string;
      content: string;
      completed: boolean;
      order_index: number;
    }>;
    order_index: number;
  }>;
}

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
}

export const getStatusColor = (status: TaskStatus) => {
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

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
  }
};

const TaskDetails = ({ task, onClose, onEdit }: TaskDetailsProps) => {
  return (
    <div className="space-y-6">
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

      {task.labels && task.labels.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Labels</h4>
          <div className="flex flex-wrap gap-2">
            {task.labels.map((label) => (
              <Badge
                key={label.id}
                style={{ backgroundColor: label.color }}
                className="text-white"
              >
                {label.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {task.subtasks && task.subtasks.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Subtasks</h4>
          <div className="space-y-2">
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2">
                {subtask.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400" />
                )}
                <span className={subtask.completed ? "line-through text-gray-500" : ""}>
                  {subtask.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {task.checklists && task.checklists.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Checklists</h4>
          <div className="space-y-4">
            {task.checklists.map((checklist) => (
              <div key={checklist.id}>
                <h5 className="font-medium text-sm mb-2">{checklist.title}</h5>
                <div className="space-y-2">
                  {checklist.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      {item.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={item.completed ? "line-through text-gray-500" : ""}>
                        {item.content}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          profiles!hrm_tasks_assigned_to_fkey(full_name),
          hrm_task_label_assignments!inner(
            hrm_task_labels!inner(
              id,
              name,
              color
            )
          ),
          hrm_subtasks(
            id,
            title,
            completed,
            order_index
          ),
          hrm_task_checklists(
            id,
            title,
            order_index,
            hrm_checklist_items(
              id,
              content,
              completed,
              order_index
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (tasksData) {
        const formattedTasks: Task[] = tasksData.map(task => {
          // Ensure proper type casting for checklists and their items
          const checklists = (task.hrm_task_checklists || []).map(checklist => ({
            id: checklist.id,
            title: checklist.title,
            order_index: checklist.order_index,
            items: Array.isArray(checklist.hrm_checklist_items) 
              ? checklist.hrm_checklist_items.map(item => ({
                  id: item.id,
                  content: item.content,
                  completed: item.completed || false,
                  order_index: item.order_index
                }))
              : []
          }));

          return {
            ...task,
            profiles: task.profiles || { full_name: null },
            labels: task.hrm_task_label_assignments?.map(la => ({
              id: la.hrm_task_labels.id,
              name: la.hrm_task_labels.name,
              color: la.hrm_task_labels.color
            })) || [],
            subtasks: task.hrm_subtasks || [],
            checklists
          };
        });
        
        setTasks(formattedTasks);
      }
    } catch (error: any) {
      toast.error("Error fetching tasks: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = async (taskId: string, taskData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
      }

      const { error } = await supabase.functions.invoke("send-task-notification", {
        body: {
          taskId,
          assignedTo: taskData.assigned_to,
          taskTitle: taskData.title,
          taskDescription: taskData.description || "",
          dueDate: taskData.due_date,
          priority: taskData.priority,
          category: taskData.category,
        },
      });

      if (error) {
        console.error("Error sending task notification:", error);
        toast.error("Failed to send task notification email");
      }
    } catch (error) {
      console.error("Error invoking function:", error);
      toast.error("Failed to send task notification");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
                start_date: selectedTask.start_date ? new Date(selectedTask.start_date) : undefined,
              }}
              onSuccess={handleEditSuccess}
              onTaskCreated={handleTaskCreated}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
