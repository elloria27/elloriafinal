export type PromoCodeType = 'percentage' | 'fixed_amount';

export type PromoCode = {
  id: string;
  code: string;
  description: string | null;
  type: PromoCodeType;
  value: number;
  min_purchase_amount: number;
  max_uses: number | null;
  uses_count: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};