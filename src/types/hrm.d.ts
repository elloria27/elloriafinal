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
  last_updated_at?: string;
}

export interface Checklist {
  id: string;
  title: string;
  order_index: number;
  items: ChecklistItem[];
  created_by?: string;
  created_at?: string;
  last_updated_at?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order_index: number;
  created_by?: string;
  created_at?: string;
  last_updated_at?: string;
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
  last_updated_at?: string;
}

export interface ChecklistItemDB {
  id: string;
  checklist_id: string;
  content: string;
  completed: boolean;
  order_index: number;
  created_by?: string;
  created_at?: string;
  last_updated_at?: string;
}

export interface SubtaskDB {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  order_index: number;
  created_by?: string;
  created_at?: string;
  last_updated_at?: string;
}

export interface InvoiceSettings {
  id: string;
  company_id?: string;
  logo_url?: string;
  company_info: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    tax_id?: string;
  };
  company_phone?: string;
  company_email?: string;
  invoice_template: string;
  default_due_days: number;
  late_fee_percentage: number;
  payment_instructions?: string;
  default_notes?: string;
  footer_text?: string;
}

export interface RecurringInvoice {
  id: string;
  customer_id: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  last_generated?: string;
  next_generation?: string;
  template_data: any;
  is_active: boolean;
  customer?: {
    name: string;
    email: string;
  };
}

export interface Estimate {
  id: string;
  estimate_number: string;
  customer_id: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  valid_until: string;
  subtotal_amount: number;
  tax_amount: number;
  total_amount: number;
  notes?: string;
  terms?: string;
  created_by?: string;
  created_at?: string;
  customer?: {
    name: string;
    email: string;
  };
}

export interface EstimateItem {
  id: string;
  estimate_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_percentage: number;
  total_price: number;
}

export interface CustomerPaymentMethod {
  id: string;
  customer_id: string;
  type: 'credit_card' | 'bank_account' | 'other';
  details: any;
  is_default: boolean;
}

export interface CreditNote {
  id: string;
  credit_note_number: string;
  invoice_id: string;
  customer_id: string;
  amount: number;
  reason?: string;
  status: 'issued' | 'applied' | 'void';
  created_by?: string;
  created_at?: string;
  customer?: {
    name: string;
    email: string;
  };
  invoice?: {
    invoice_number: string;
  };
}

export interface TaxRate {
  id: string;
  name: string;
  percentage: number;
  description?: string;
  is_compound: boolean;
  is_active: boolean;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  due_date: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  subtotal_amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  payment_terms?: string;
  late_fee_percentage?: number;
  discount_amount?: number;
  discount_type?: 'percentage' | 'fixed';
  reference_number?: string;
  shipping_amount?: number;
  last_sent_at?: string;
  last_sent_to?: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    tax_id?: string;
  };
}
