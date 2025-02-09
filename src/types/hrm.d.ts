
interface Label {
  id: string;
  name: string;
  color: string;
}

interface ChecklistItem {
  id: string;
  content: string;
  completed: boolean;
  order_index: number;
}

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  order_index: number;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order_index: number;
}

export type { Label, ChecklistItem, Checklist, Subtask };
