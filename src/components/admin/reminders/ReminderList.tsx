import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import { fromZonedTime } from 'date-fns-tz';
import { Edit, Trash2, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReminderListProps {
  reminders: any[];
  onEdit: (reminder: any) => void;
  onUpdate: () => void;
}

export const ReminderList = ({ reminders, onEdit, onUpdate }: ReminderListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('hrm_personal_reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Reminder deleted successfully');
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting reminder:', error);
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredReminders = reminders.filter(reminder =>
    reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reminder.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: string) => {
    const utcDate = fromZonedTime(new Date(date), 'America/Winnipeg');
    return format(utcDate, 'MMM d, yyyy');
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reminders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Recurrence</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReminders.map((reminder) => (
              <TableRow key={reminder.id}>
                <TableCell className="font-medium">
                  {reminder.title}
                  {reminder.description && (
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {reminder.description}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  {formatDate(reminder.reminder_date)}
                  <br />
                  <span className="text-sm text-gray-500">
                    {reminder.reminder_time.slice(0, 5)}
                  </span>
                </TableCell>
                <TableCell className="capitalize">
                  {reminder.recurrence}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    reminder.status 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {reminder.status ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(reminder)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(reminder.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredReminders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No reminders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};