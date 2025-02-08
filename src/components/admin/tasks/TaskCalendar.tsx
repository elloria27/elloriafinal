
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/tasks";

export const TaskCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hrm_tasks")
        .select(`
          *,
          assigned_to:profiles!assigned_to(id, full_name),
          created_by:profiles!created_by(id, full_name)
        `)
        .order("due_date", { ascending: true });

      if (error) {
        toast.error("Failed to fetch tasks");
        throw error;
      }

      return data as Task[];
    },
  });

  // Group tasks by date
  const tasksByDate = tasks?.reduce((acc, task) => {
    const date = new Date(task.due_date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const selectedDayTasks = selectedDate
    ? tasksByDate?.[selectedDate.toISOString().split('T')[0]] || []
    : [];

  return (
    <div className="flex gap-8">
      <div className="border rounded-lg p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4">
          Tasks for {selectedDate?.toLocaleDateString()}
        </h3>
        <div className="space-y-4">
          {selectedDayTasks.length === 0 ? (
            <p className="text-muted-foreground">No tasks scheduled for this day.</p>
          ) : (
            selectedDayTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Assigned to: {task.assigned_to.full_name}
                    </p>
                    {task.description && (
                      <p className="text-sm mt-2">{task.description}</p>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      task.priority === "urgent"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "high"
                        ? "bg-orange-100 text-orange-800"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Due: {new Date(task.due_date).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
