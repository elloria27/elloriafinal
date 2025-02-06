export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  Tables: {
    profiles: {
      Row: {
        id: string;
        full_name: string;
        email: string;
        phone_number: string;
        address: string;
        country: string;
        region: string;
        language: string;
        currency: string;
        email_notifications: boolean;
        marketing_emails: boolean;
        completed_initial_setup: boolean;
        selected_delivery_method: string;
        updated_at: string;
      };
    };
    pages: {
      Row: {
        id: string;
        title: string;
        slug: string;
        created_at: string;
        updated_at: string;
      };
    };
    page_components: {
      Row: {
        id: string;
        page_id: string;
        type: string;
        content: Json;
        order_index: number;
        created_at: string;
        updated_at: string;
      };
    };
  };
  Enums: {
    supported_language: "en" | "fr" | "uk";
    supported_currency: "USD" | "EUR" | "UAH" | "CAD";
    post_status: "draft" | "published" | "archived";
  };
}

export type Tables = Database["Tables"];