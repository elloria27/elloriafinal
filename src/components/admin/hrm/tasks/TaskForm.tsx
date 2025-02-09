
import { useState, useEffect } from "react";
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
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TaskLabels from "./TaskLabels";
import TaskChecklist from "./TaskChecklist";
import TaskSubtasks from "./TaskSubtasks";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

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

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      assigned_to: initialData?.assigned_to || "",
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

  // Fetch admin users on component mount
  useEffect(() => {
    const fetchAdmins = async () => {
      const { data, error } = await supabase
        .rpc('get_admin_users')
        .order('full_name');

      if (!error && data) {
        setAdmins(data);
      }
    };

    fetchAdmins();
  }, []);

  // Fetch task data if editing
  useEffect(() => {
    const fetchTaskData = async () => {
      if (!initialData?.id) return;

      try {
        // Fetch labels
        const { data: labelAssignments, error: labelError } = await supabase
          .from('hrm_task_label_assignments')
          .select('label_id, hrm_task_labels!inner(*)')
          .eq('task_id', initialData.id);

        if (labelError) throw labelError;

        if (labelAssignments) {
          const fetchedLabels = labelAssignments.map(la => ({
            id: la.hrm_task_labels.id,
            name: la.hrm_task_labels.name,
            color: la.hrm_task_labels.color,
          }));
          setLabels(fetchedLabels);
        }

        // Fetch subtasks
        const { data: subtasks, error: subtasksError } = await supabase
          .from('hrm_subtasks')
          .select('*')
          .eq('task_id', initialData.id)
          .order('order_index');

        if (subtasksError) throw subtasksError;

        if (subtasks) {
          setSubtasks(subtasks);
        }

        // Fetch checklists and their items
        const { data: checklists, error: checklistsError } = await supabase
          .from('hrm_task_checklists')
          .select(`
            id,
            title,
            order_index,
            hrm_checklist_items (
              id,
              content,
              completed,
              order_index
            )
          `)
          .eq('task_id', initialData.id)
          .order('order_index');

        if (checklistsError) throw checklistsError;

        if (checklists) {
          const formattedChecklists = checklists.map(checklist => ({
            ...checklist,
            items: checklist.hrm_checklist_items.sort((a, b) => a.order_index - b.order_index)
          }));
          setChecklists(formattedChecklists);
        }
      } catch (error: any) {
        toast.error(`Error loading task data: ${error.message}`);
      }
    };

    fetchTaskData();
  }, [initialData?.id]);

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
        status: values.status,
        estimated_hours: values.estimated_hours || null,
        actual_hours: values.actual_hours || null,
        start_date: values.start_date?.toISOString() || null,
      };

      let taskId: string;

      if (initialData) {
        // Update existing task
        const { error: updateError } = await supabase
          .from("hrm_tasks")
          .update(taskData)
          .eq('id', initialData.id);
        
        if (updateError) throw updateError;
        taskId = initialData.id;

        // Delete existing relationships
        const { error: labelDeleteError } = await supabase
          .from("hrm_task_label_assignments")
          .delete()
          .eq('task_id', taskId);
        if (labelDeleteError) throw labelDeleteError;

        const { error: subtaskDeleteError } = await supabase
          .from("hrm_subtasks")
          .delete()
          .eq('task_id', taskId);
        if (subtaskDeleteError) throw subtaskDeleteError;

        // Delete checklist items first
        const { data: existingChecklists } = await supabase
          .from("hrm_task_checklists")
          .select('id')
          .eq('task_id', taskId);

        if (existingChecklists) {
          for (const checklist of existingChecklists) {
            const { error: itemsDeleteError } = await supabase
              .from("hrm_checklist_items")
              .delete()
              .eq('checklist_id', checklist.id);
            if (itemsDeleteError) throw itemsDeleteError;
          }
        }

        const { error: checklistDeleteError } = await supabase
          .from("hrm_task_checklists")
          .delete()
          .eq('task_id', taskId);
        if (checklistDeleteError) throw checklistDeleteError;

      } else {
        // Create new task
        const { data: newTask, error: createError } = await supabase
          .from("hrm_tasks")
          .insert(taskData)
          .select()
          .single();
        
        if (createError) throw createError;
        if (!newTask) throw new Error("Failed to create task");
        taskId = newTask.id;
      }

      // Insert new relationships
      if (labels.length > 0) {
        const labelAssignments = labels.map(label => ({
          task_id: taskId,
          label_id: label.id
        }));
        
        const { error: labelError } = await supabase
          .from("hrm_task_label_assignments")
          .insert(labelAssignments);
        if (labelError) throw labelError;
      }

      if (subtasks.length > 0) {
        const subtasksData = subtasks.map((subtask, index) => ({
          task_id: taskId,
          title: subtask.title,
          completed: subtask.completed,
          order_index: index,
          created_by: user.id
        }));

        const { error: subtasksError } = await supabase
          .from("hrm_subtasks")
          .insert(subtasksData);
        if (subtasksError) throw subtasksError;
      }

      // Insert new checklists and their items
      for (const [index, checklist] of checklists.entries()) {
        const { data: newChecklist, error: checklistError } = await supabase
          .from("hrm_task_checklists")
          .insert({
            task_id: taskId,
            title: checklist.title,
            order_index: index,
            created_by: user.id
          })
          .select()
          .single();

        if (checklistError) throw checklistError;
        if (!newChecklist) throw new Error("Failed to create checklist");

        if (checklist.items && checklist.items.length > 0) {
          const checklistItems = checklist.items.map((item, itemIndex) => ({
            checklist_id: newChecklist.id,
            content: item.content,
            completed: item.completed,
            order_index: itemIndex,
            created_by: user.id
          }));

          const { error: itemsError } = await supabase
            .from("hrm_checklist_items")
            .insert(checklistItems);
          if (itemsError) throw itemsError;
        }
      }

      toast.success(initialData ? "Task updated successfully" : "Task created successfully");
      if (!initialData) {
        form.reset();
        setLabels([]);
        setSubtasks([]);
        setChecklists([]);
      }
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const DatePickerField = ({ name, label }: { name: "start_date" | "due_date" | "completion_date"; label: string }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
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
                onSelect={(date) => {
                  field.onChange(date);
                  if (date) {
                    form.setValue(name, date);
                  }
                }}
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
  );

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
          <DatePickerField name="start_date" label="Start Date" />
          <DatePickerField name="due_date" label="Due Date" />
        </div>

        <DatePickerField name="completion_date" label="Completion Date" />

        <FormField
          control={form.control}
          name="assigned_to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign To</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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
              <Select onValueChange={field.onChange} value={field.value}>
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                <Select onValueChange={field.onChange} value={field.value}>
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

