export interface PaymentMethods {
  stripe: boolean;
  cash_on_delivery: boolean;
}

export interface StripeSettings {
  secret_key: string;
  publishable_key: string;
}

export interface ShippingMethod {
  name: string;
  price: number;
  estimated_days: number;
}

export interface ShippingMethods {
  [countryCode: string]: ShippingMethod[];
}

export interface Json {
  [key: string]: any;
}
