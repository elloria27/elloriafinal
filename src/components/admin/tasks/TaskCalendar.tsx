
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: { full_name: string };
  priority: "low" | "medium" | "high" | "urgent";
  status: "new" | "in_progress" | "completed" | "on_hold" | "canceled";
  due_date: string;
}

interface TaskCalendarProps {
  tasks?: Task[];
  onUpdateTask: (taskId: string, updates: { status?: string; priority?: string }) => void;
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  on_hold: "bg-yellow-100 text-yellow-800",
  canceled: "bg-gray-100 text-gray-800",
};

export const TaskCalendar = ({ tasks = [], onUpdateTask }: TaskCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = new Date(task.due_date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const selectedDayTasks = selectedDate
    ? tasksByDate[selectedDate.toISOString().split('T')[0]] || []
    : [];

  return (
    <div className="flex gap-8">
      <div className="border rounded-lg p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{
            booked: (date) => {
              const dateString = date.toISOString().split('T')[0];
              return !!tasksByDate[dateString]?.length;
            },
          }}
          modifiersStyles={{
            booked: {
              fontWeight: 'bold',
              backgroundColor: 'rgb(59, 130, 246)',
              color: 'white',
              borderRadius: '50%',
            },
          }}
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
                  <div className="space-y-2">
                    <Select
                      defaultValue={task.priority}
                      onValueChange={(value) =>
                        onUpdateTask(task.id, { priority: value })
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue>
                          <Badge className={priorityColors[task.priority]}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      defaultValue={task.status}
                      onValueChange={(value) =>
                        onUpdateTask(task.id, { status: value })
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue>
                          <Badge className={statusColors[task.status]}>
                            {task.status.split("_").map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(" ")}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
