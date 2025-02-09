
export interface Label {
  id: string;
  name: string;
  color: string;
  created_by?: string;
  created_at?: string;
}

export interface ChecklistItem {
  id: string;
  content: string;
  completed: boolean;
  order_index: number;
  created_by?: string;
  created_at?: string;
}

export interface Checklist {
  id: string;
  title: string;
  order_index: number;
  items: ChecklistItem[];
  created_by?: string;
  created_at?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order_index: number;
  created_by?: string;
  created_at?: string;
}

// Database table types - these match the actual table schemas
export interface TaskLabel {
  id: string;
  name: string;
  color: string;
  created_by?: string;
  created_at?: string;
}

export interface TaskLabelAssignment {
  id: string;
  task_id: string;
  label_id: string;
  created_at?: string;
}

export interface TaskChecklist {
  id: string;
  task_id: string;
  title: string;
  order_index: number;
  created_by?: string;
  created_at?: string;
}

export interface ChecklistItemDB {
  id: string;
  checklist_id: string;
  content: string;
  completed: boolean;
  order_index: number;
  created_by?: string;
  created_at?: string;
}

export interface SubtaskDB {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  order_index: number;
  created_by?: string;
  created_at?: string;
}
