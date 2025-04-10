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
      brokers: {
        Row: {
          company: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          automatic_renewal: boolean
          broker_id: string
          construction_type: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          fire_safety_measures: string[] | null
          fire_safety_other: string | null
          full_name: string
          high_value_items: boolean | null
          id: string
          insurance_type: string
          is_occupied_full_time: boolean
          nearby_fire_station: boolean | null
          number_of_bathrooms: number | null
          number_of_floors: number | null
          number_of_rooms: number | null
          phone: string | null
          policy_duration: string
          policy_end_date: string
          policy_start_date: string
          premium: number | null
          property_type: string | null
          renewal_type: string
          residential_address: string
          security_features: string[] | null
          security_features_other: string | null
          status: string
          sum_insured: number
          total_square_area: number | null
          updated_at: string
          year_of_construction: number | null
        }
        Insert: {
          automatic_renewal?: boolean
          broker_id: string
          construction_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          fire_safety_measures?: string[] | null
          fire_safety_other?: string | null
          full_name: string
          high_value_items?: boolean | null
          id?: string
          insurance_type: string
          is_occupied_full_time?: boolean
          nearby_fire_station?: boolean | null
          number_of_bathrooms?: number | null
          number_of_floors?: number | null
          number_of_rooms?: number | null
          phone?: string | null
          policy_duration: string
          policy_end_date: string
          policy_start_date: string
          premium?: number | null
          property_type?: string | null
          renewal_type: string
          residential_address: string
          security_features?: string[] | null
          security_features_other?: string | null
          status?: string
          sum_insured: number
          total_square_area?: number | null
          updated_at?: string
          year_of_construction?: number | null
        }
        Update: {
          automatic_renewal?: boolean
          broker_id?: string
          construction_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          fire_safety_measures?: string[] | null
          fire_safety_other?: string | null
          full_name?: string
          high_value_items?: boolean | null
          id?: string
          insurance_type?: string
          is_occupied_full_time?: boolean
          nearby_fire_station?: boolean | null
          number_of_bathrooms?: number | null
          number_of_floors?: number | null
          number_of_rooms?: number | null
          phone?: string | null
          policy_duration?: string
          policy_end_date?: string
          policy_start_date?: string
          premium?: number | null
          property_type?: string | null
          renewal_type?: string
          residential_address?: string
          security_features?: string[] | null
          security_features_other?: string | null
          status?: string
          sum_insured?: number
          total_square_area?: number | null
          updated_at?: string
          year_of_construction?: number | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
