export interface BlockEditorProps {
  block: {
    id: string;
    type: string;
    content: Record<string, unknown>;
    order_index: number;
  };
  onUpdate: (block: {
    id: string;
    type: string;
    content: Record<string, unknown>;
    order_index: number;
  }) => void;
}

export interface ContentBlock {
  id: string;
  type: string;
  content: Record<string, unknown>;
  order_index: number;
}