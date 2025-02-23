
export interface DatabaseError extends Error {
  code: string;
  column?: string;
  constraint?: string;
  dataType?: string;
  detail?: string;
  file?: string;
  hint?: string;
  internalPosition?: string;
  internalQuery?: string;
  line?: string;
  position?: string;
  routine?: string;
  schema?: string;
  severity?: string;
  table?: string;
  where?: string;
}

export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
}

export interface TransactionClient {
  query: <T = any>(text: string, values?: any[]) => Promise<QueryResult<T>>;
  release: () => void;
}
