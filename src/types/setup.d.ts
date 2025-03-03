
export interface SetupFormData {
  url: string;
  key: string;
}

export interface MigrationLogEntry {
  table: string;
  operation: 'create' | 'data_insert' | 'policy';
  status: 'success' | 'error';
  details?: string;
  timestamp: string;
}

export interface DatabaseTable {
  name: string;
  columns: Column[];
  data: any[];
}

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  default?: any;
}
