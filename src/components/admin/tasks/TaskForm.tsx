
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

interface TaskFormProps {
  task?: any;
  onClose: () => void;
}

export const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: task ? {
      ...task,
      due_date: format(new Date(task.due_date), "yyyy-MM-dd'T'HH:mm"),
    } : {
      title: '',
      description: '',
      due_date: format(new Date().setHours(new Date().getHours() + 24), "yyyy-MM-dd'T'HH:mm"),
      priority: 'medium',
      status: 'new'
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log("Form data being submitted:", data);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create tasks');
      }

      const taskData = {
        ...data,
        created_by: user.id,
        assigned_to: user.id // For now, assign to self. Could be expanded with user selection
      };

      console.log("Final task data being submitted:", taskData);

      const { error } = task 
        ? await supabase
            .from('hrm_tasks')
            .update(taskData)
            .eq('id', task.id)
        : await supabase
            .from('hrm_tasks')
            .insert([taskData]);

      if (error) throw error;

      toast.success(task ? 'Task updated successfully' : 'Task created successfully');
      onClose();
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          {...register('title', { required: 'Title is required' })}
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message?.toString()}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          {...register('description')}
          placeholder="Enter task description"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Due Date</label>
        <Input
          type="datetime-local"
          {...register('due_date', { required: 'Due date is required' })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Priority</label>
        <Select 
          defaultValue={task?.priority || 'medium'}
          onValueChange={(value) => setValue('priority', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select 
          defaultValue={task?.status || 'new'}
          onValueChange={(value) => setValue('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (task ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};
