export type TaxRate = {
  gst?: number;
  pst?: number;
  hst?: number;
};

export type ShippingOption = {
  id: string;
  name: string;
  price: number;
  currency: string;
  estimatedDays: string;
};

// Canadian tax rates by province
export const CANADIAN_TAX_RATES: Record<string, TaxRate> = {
  "Alberta": { gst: 5 },
  "British Columbia": { gst: 5, pst: 7 },
  "Manitoba": { gst: 5, pst: 7 },
  "New Brunswick": { hst: 15 },
  "Newfoundland and Labrador": { hst: 15 },
  "Nova Scotia": { hst: 15 },
  "Ontario": { hst: 13 },
  "Prince Edward Island": { hst: 15 },
  "Quebec": { gst: 5, pst: 9.975 },
  "Saskatchewan": { gst: 5, pst: 6 },
};

// US tax rates by state (simplified for example)
export const US_TAX_RATES: Record<string, TaxRate> = {
  "California": { pst: 7.25 },
  "New York": { pst: 4 },
  "Texas": { pst: 6.25 },
  // Add more states as needed
};

// Exchange rate (simplified - in real app would come from an API)
export const USD_TO_CAD = 1.35;