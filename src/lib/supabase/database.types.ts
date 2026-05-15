export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type TableDef<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<
        {
          id: string;
          email: string | null;
          full_name: string;
          role: "rider" | "shop";
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          email?: string | null;
          full_name?: string;
          role?: "rider" | "shop";
          created_at?: string;
          updated_at?: string;
        }
      >;
      markets: TableDef<
        {
          id: string;
          label: string;
          trip_types: string[];
          delivery_available: boolean;
        },
        {
          id: string;
          label: string;
          trip_types?: string[];
          delivery_available?: boolean;
        }
      >;
      shops: TableDef<
        {
          id: string;
          owner_id: string;
          market_id: string | null;
          shop_name: string;
          shop_email: string;
          address_line1: string;
          city: string;
          state: string;
          postal_code: string;
          logo_url: string;
          website_url: string;
          support_phone: string;
          service_area_notes: string;
          payment_provider: "stripe" | "square";
          payment_status: "not_connected" | "pending" | "connected" | "restricted";
          payouts_enabled: boolean;
          payment_account_label: string;
          stripe_account_id: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          owner_id: string;
          market_id?: string | null;
          shop_name?: string;
          shop_email?: string;
          address_line1?: string;
          city?: string;
          state?: string;
          postal_code?: string;
          logo_url?: string;
          website_url?: string;
          support_phone?: string;
          service_area_notes?: string;
          payment_provider?: "stripe" | "square";
          payment_status?: "not_connected" | "pending" | "connected" | "restricted";
          payouts_enabled?: boolean;
          payment_account_label?: string;
          stripe_account_id?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      bikes: TableDef<
        {
          id: string;
          shop_id: string;
          market_id: string | null;
          title: string;
          brand: string;
          model: string;
          bike_type: "Road" | "Mountain" | "Gravel" | "E-Bike";
          size: string;
          description: string;
          image_url: string;
          photo_urls: string[];
          status: "active" | "inactive";
          daily_rate: number;
          half_day_rate: number | null;
          weekly_rate: number;
          deposit: number;
          seasonal_note: string;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          shop_id: string;
          market_id?: string | null;
          title: string;
          brand?: string;
          model?: string;
          bike_type?: "Road" | "Mountain" | "Gravel" | "E-Bike";
          size?: string;
          description?: string;
          image_url?: string;
          photo_urls?: string[];
          status?: "active" | "inactive";
          daily_rate?: number;
          half_day_rate?: number | null;
          weekly_rate?: number;
          deposit?: number;
          seasonal_note?: string;
          created_at?: string;
          updated_at?: string;
        }
      >;
      bike_blocked_dates: TableDef<
        {
          bike_id: string;
          blocked_date: string;
          reason: string;
        },
        {
          bike_id: string;
          blocked_date: string;
          reason?: string;
        }
      >;
      reservations: TableDef<
        {
          id: string;
          bike_id: string;
          shop_id: string;
          rider_id: string;
          start_date: string;
          end_date: string;
          status: "pending_payment" | "confirmed" | "cancelled";
          total_cents: number;
          stripe_payment_intent_id: string | null;
          delivery_mode: string | null;
          add_ons: Json;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          bike_id: string;
          shop_id: string;
          rider_id: string;
          start_date: string;
          end_date: string;
          status?: "pending_payment" | "confirmed" | "cancelled";
          total_cents?: number;
          stripe_payment_intent_id?: string | null;
          delivery_mode?: string | null;
          add_ons?: Json;
          created_at?: string;
          updated_at?: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type DbBike = Database["public"]["Tables"]["bikes"]["Row"];
export type DbShop = Database["public"]["Tables"]["shops"]["Row"];
export type DbReservation = Database["public"]["Tables"]["reservations"]["Row"];
export type DbMarket = Database["public"]["Tables"]["markets"]["Row"];
