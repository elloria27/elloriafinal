import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReminderForm } from "@/components/admin/reminders/ReminderForm";
import { ReminderList } from "@/components/admin/reminders/ReminderList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PersonalReminders = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);

  const { data: reminders, isLoading, refetch } = useQuery({
    queryKey: ['personal-reminders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hrm_personal_reminders')
        .select('*')
        .order('reminder_date', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const handleEditReminder = (reminder: any) => {
    setSelectedReminder(reminder);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedReminder(null);
    setIsFormOpen(false);
    refetch();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Personal Reminders</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      <ReminderList 
        reminders={reminders || []} 
        onEdit={handleEditReminder}
        onUpdate={refetch}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedReminder ? 'Edit Reminder' : 'Create New Reminder'}
            </DialogTitle>
          </DialogHeader>
          <ReminderForm 
            reminder={selectedReminder}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalReminders;