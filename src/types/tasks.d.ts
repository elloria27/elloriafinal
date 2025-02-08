
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'new' | 'in_progress' | 'completed' | 'on_hold' | 'canceled';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  assigned_to: {
    id: string;
    full_name: string;
  };
  created_by: {
    id: string;
    full_name: string;
  };
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}
