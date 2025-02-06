import { ReactNode } from 'react';
import { Json } from '@/integrations/supabase/types';

export interface PageComponent {
  id: string;
  type: string;
  content: Json;
  order: number;
  settings?: Json;
}

export interface PageBuilderProps {
  components: PageComponent[];
  onUpdate?: (components: PageComponent[]) => void;
  isEditing?: boolean;
}

export interface ComponentRegistryItem {
  type: string;
  name: string;
  description: string;
  icon: ReactNode;
  component: React.ComponentType<any>;
  defaultContent: Json;
  defaultSettings?: Json;
}