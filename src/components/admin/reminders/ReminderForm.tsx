import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

interface ReminderFormProps {
  reminder?: any;
  onClose: () => void;
}

export const ReminderForm = ({ reminder, onClose }: ReminderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: reminder ? {
      ...reminder,
      reminder_date: format(new Date(reminder.reminder_date), 'yyyy-MM-dd'),
      reminder_time: reminder.reminder_time.slice(0, 5),
      recurrence: reminder.recurrence
    } : {
      title: '',
      description: '',
      reminder_date: format(new Date(), 'yyyy-MM-dd'),
      reminder_time: '09:00',
      recurrence: 'none',
      email_notify: true,
      status: true
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting reminder data:", data);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create reminders');
      }

      // Ensure the date is saved exactly as selected without timezone conversion
      const reminderData = {
        ...data,
        reminder_date: data.reminder_date,
        admin_id: user.id
      };

      console.log("Final reminder data being submitted:", reminderData);

      const { error } = reminder 
        ? await supabase
            .from('hrm_personal_reminders')
            .update(reminderData)
            .eq('id', reminder.id)
        : await supabase
            .from('hrm_personal_reminders')
            .insert([reminderData]);

      if (error) throw error;

      toast.success(reminder ? 'Reminder updated successfully' : 'Reminder created successfully');
      onClose();
    } catch (error: any) {
      console.error('Error saving reminder:', error);
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
          placeholder="Enter reminder title"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message?.toString()}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          {...register('description')}
          placeholder="Enter reminder description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Input
            type="date"
            {...register('reminder_date', { required: 'Date is required' })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Time</label>
          <Input
            type="time"
            {...register('reminder_time', { required: 'Time is required' })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Recurrence</label>
        <Select 
          defaultValue={reminder?.recurrence || 'none'}
          onValueChange={(value) => setValue('recurrence', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select recurrence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium">Email Notifications</label>
          <p className="text-sm text-gray-500">Receive email reminders</p>
        </div>
        <Switch
          defaultChecked={reminder?.email_notify ?? true}
          onCheckedChange={(checked) => setValue('email_notify', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium">Status</label>
          <p className="text-sm text-gray-500">Enable/disable reminder</p>
        </div>
        <Switch
          defaultChecked={reminder?.status ?? true}
          onCheckedChange={(checked) => setValue('status', checked)}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (reminder ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};