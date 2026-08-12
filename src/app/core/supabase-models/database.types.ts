export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      construction_types: {
        Row: {
          code: string
          id: number
          label: string
        }
        Insert: {
          code: string
          id: number
          label: string
        }
        Update: {
          code?: string
          id?: number
          label?: string
        }
        Relationships: []
      }
      damage_categories: {
        Row: {
          code: string
          description: string | null
          id: number
          label: string
        }
        Insert: {
          code: string
          description?: string | null
          id: number
          label: string
        }
        Update: {
          code?: string
          description?: string | null
          id?: number
          label?: string
        }
        Relationships: []
      }
      damage_inspection_photos: {
        Row: {
          id: string
          inspection_id: string | null
          sequence: number | null
          storage_path: string
          taken_at: string | null
          uploaded_at: string | null
        }
        Insert: {
          id?: string
          inspection_id?: string | null
          sequence?: number | null
          storage_path: string
          taken_at?: string | null
          uploaded_at?: string | null
        }
        Update: {
          id?: string
          inspection_id?: string | null
          sequence?: number | null
          storage_path?: string
          taken_at?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "damage_inspection_photos_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "damage_inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      damage_inspections: {
        Row: {
          address_text: string | null
          approx_year_built: number | null
          captured_at: string
          construction_type_id: number | null
          created_at: string | null
          damage_category_id: number
          data_source_id: number
          device_id: string | null
          device_local_id: string
          geom: unknown
          id: string
          notes: string | null
          num_floors: number | null
          reported_by: string | null
          seismic_event_id: string
          synced_at: string | null
        }
        Insert: {
          address_text?: string | null
          approx_year_built?: number | null
          captured_at: string
          construction_type_id?: number | null
          created_at?: string | null
          damage_category_id: number
          data_source_id: number
          device_id?: string | null
          device_local_id: string
          geom: unknown
          id?: string
          notes?: string | null
          num_floors?: number | null
          reported_by?: string | null
          seismic_event_id: string
          synced_at?: string | null
        }
        Update: {
          address_text?: string | null
          approx_year_built?: number | null
          captured_at?: string
          construction_type_id?: number | null
          created_at?: string | null
          damage_category_id?: number
          data_source_id?: number
          device_id?: string | null
          device_local_id?: string
          geom?: unknown
          id?: string
          notes?: string | null
          num_floors?: number | null
          reported_by?: string | null
          seismic_event_id?: string
          synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "damage_inspections_construction_type_id_fkey"
            columns: ["construction_type_id"]
            isOneToOne: false
            referencedRelation: "construction_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "damage_inspections_damage_category_id_fkey"
            columns: ["damage_category_id"]
            isOneToOne: false
            referencedRelation: "damage_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "damage_inspections_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "damage_inspections_seismic_event_id_fkey"
            columns: ["seismic_event_id"]
            isOneToOne: false
            referencedRelation: "seismic_events"
            referencedColumns: ["id"]
          },
        ]
      }
      damage_patterns: {
        Row: {
          active: boolean | null
          code: string
          description: string | null
          id: number
          label: string
          reference_image_url: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          description?: string | null
          id: number
          label: string
          reference_image_url?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          description?: string | null
          id?: number
          label?: string
          reference_image_url?: string | null
        }
        Relationships: []
      }
      data_sources: {
        Row: {
          code: string
          id: number
          label: string
        }
        Insert: {
          code: string
          id: number
          label: string
        }
        Update: {
          code?: string
          id?: number
          label?: string
        }
        Relationships: []
      }
      inspection_damage_patterns: {
        Row: {
          inspection_id: string
          pattern_id: number
        }
        Insert: {
          inspection_id: string
          pattern_id: number
        }
        Update: {
          inspection_id?: string
          pattern_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "inspection_damage_patterns_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "damage_inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_damage_patterns_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "damage_patterns"
            referencedColumns: ["id"]
          },
        ]
      }
      seismic_events: {
        Row: {
          created_at: string | null
          depth_km: number | null
          epicenter: unknown
          event_datetime: string
          id: string
          magnitude: number | null
          name: string
          source: string | null
        }
        Insert: {
          created_at?: string | null
          depth_km?: number | null
          epicenter?: unknown
          event_datetime: string
          id?: string
          magnitude?: number | null
          name: string
          source?: string | null
        }
        Update: {
          created_at?: string | null
          depth_km?: number | null
          epicenter?: unknown
          event_datetime?: string
          id?: string
          magnitude?: number | null
          name?: string
          source?: string | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
