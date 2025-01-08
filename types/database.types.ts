export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          phone: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          phone: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          phone?: string
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          subtitle: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          subtitle?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          subtitle?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          category: string
          created_at: string
          currency: string
          description: string | null
          extra_info: string | null
          id: string
          image_url: string
          price: number
          title: string
          variations: Json | null
        }
        Insert: {
          category: string
          created_at?: string
          currency?: string
          description?: string | null
          extra_info?: string | null
          id?: string
          image_url?: string
          price: number
          title?: string
          variations?: Json | null
        }
        Update: {
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          extra_info?: string | null
          id?: string
          image_url?: string
          price?: number
          title?: string
          variations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          customer_company: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          customer_vatnumber: string | null
          delivery_address: Json | null
          delivery_method: string
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          order_id: string
          order_items: Json
          payment_method: string
          payment_status: string
          printed: boolean | null
          restaurant_id: string
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          customer_company?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          customer_vatnumber?: string | null
          delivery_address?: Json | null
          delivery_method: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          order_id: string
          order_items: Json
          payment_method: string
          payment_status: string
          printed?: boolean | null
          restaurant_id: string
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          customer_company?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          customer_vatnumber?: string | null
          delivery_address?: Json | null
          delivery_method?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          order_id?: string
          order_items?: Json
          payment_method?: string
          payment_status?: string
          printed?: boolean | null
          restaurant_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string | null
          customer_email: string
          customer_name: string
          date: string
          id: string
          message: string | null
          number_of_people: number
          phone_number: string | null
          restaurant_id: string | null
          time: string
        }
        Insert: {
          created_at?: string | null
          customer_email: string
          customer_name: string
          date: string
          id?: string
          message?: string | null
          number_of_people: number
          phone_number?: string | null
          restaurant_id?: string | null
          time: string
        }
        Update: {
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          date?: string
          id?: string
          message?: string | null
          number_of_people?: number
          phone_number?: string | null
          restaurant_id?: string | null
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant: {
        Row: {
          address: string
          allowed_postalcodes: string[]
          delivery_minimums: Json | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string
        }
        Insert: {
          address?: string
          allowed_postalcodes: string[]
          delivery_minimums?: Json | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string
        }
        Update: {
          address?: string
          allowed_postalcodes?: string[]
          delivery_minimums?: Json | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      delivery_method: "pickup" | "delivery"
      payment_method: "payconiq" | "cash"
      payment_status:
      | "pending"
      | "processing"
      | "completed"
      | "failed"
      | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
