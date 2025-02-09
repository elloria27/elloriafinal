
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TaskLabels from "./TaskLabels";
import TaskChecklist from "./TaskChecklist";
import TaskSubtasks from "./TaskSubtasks";
import { cn } from "@/lib/utils";

type TaskStatus = "todo" | "in_progress" | "completed" | "on_hold";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assigned_to: z.string().uuid("Invalid user selected"),
  due_date: z.date().optional(),
  completion_date: z.date().optional(),
  priority: z.enum(["low", "medium", "high"]),
  category: z.enum(["hr", "finance", "operations", "other"]),
  status: z.enum(["todo", "in_progress", "completed", "on_hold"]).default("todo"),
  estimated_hours: z.number().min(0).optional(),
  actual_hours: z.number().min(0).optional(),
  start_date: z.date().optional(),
});

interface TaskFormProps {
  onSuccess?: () => void;
  initialData?: z.infer<typeof formSchema> & { 
    id: string;
    labels?: Array<{ id: string; name: string; color: string }>;
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
    subtasks?: Array<{
      id: string;
      title: string;
      completed: boolean;
      order_index: number;
    }>;
  };
}

const TaskForm = ({ onSuccess, initialData }: TaskFormProps) => {
  const [admins, setAdmins] = useState<Array<{ id: string; full_name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState(initialData?.labels || []);
  const [checklists, setChecklists] = useState(initialData?.checklists || []);
  const [subtasks, setSubtasks] = useState(initialData?.subtasks || []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      start_date: initialData?.start_date ? new Date(initialData.start_date) : undefined,
      due_date: initialData?.due_date ? new Date(initialData.due_date) : undefined,
      completion_date: initialData?.completion_date ? new Date(initialData.completion_date) : undefined,
      priority: initialData?.priority || "medium",
      category: initialData?.category || "other",
      status: initialData?.status || "todo",
      estimated_hours: initialData?.estimated_hours || undefined,
      actual_hours: initialData?.actual_hours || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("No user found");

      const taskData = {
        title: values.title,
        description: values.description,
        assigned_to: values.assigned_to,
        created_by: user.id,
        due_date: values.due_date?.toISOString() || null,
        completion_date: values.completion_date?.toISOString() || null,
        priority: values.priority,
        category: values.category,
        status: values.status as TaskStatus,
        estimated_hours: values.estimated_hours || null,
        actual_hours: values.actual_hours || null,
        start_date: values.start_date?.toISOString() || null,
      };

      if (initialData) {
        const { error } = await supabase
          .from("hrm_tasks")
          .update(taskData)
          .eq('id', initialData.id);
        if (error) throw error;
        toast.success("Task updated successfully");
      } else {
        const { data: newTask, error } = await supabase
          .from("hrm_tasks")
          .insert(taskData)
          .select()
          .single();
        if (error) throw error;
        toast.success("Task created successfully");
      }

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin users on component mount
  useState(() => {
    const fetchAdmins = async () => {
      const { data, error } = await supabase
        .rpc('get_admin_users')
        .order('full_name');

      if (!error && data) {
        setAdmins(data);
      }
    };

    fetchAdmins();
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="font-medium">Labels</h3>
          <TaskLabels
            taskId={initialData?.id || ""}
            selectedLabels={labels}
            onLabelsChange={setLabels}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Subtasks</h3>
          <TaskSubtasks
            taskId={initialData?.id || ""}
            subtasks={subtasks}
            onSubtasksChange={setSubtasks}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Checklists</h3>
          <TaskChecklist
            taskId={initialData?.id || ""}
            checklists={checklists}
            onChecklistsChange={setChecklists}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="estimated_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Hours</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.5"
                    {...field}
                    onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="actual_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual Hours</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.5"
                    {...field}
                    onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="assigned_to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign To</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an admin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {admins.map((admin) => (
                    <SelectItem key={admin.id} value={admin.id}>
                      {admin.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onSuccess?.()} 
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Task" : "Create Task")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
