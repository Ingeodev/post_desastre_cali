import { Database } from './database.types';

// Tipos base de ayuda
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
export type Views<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Row'];
export type ViewsInsert<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Insert'];
export type ViewsUpdate<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
export type FunctionsArgs<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]['Args'];
export type FunctionsReturns<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]['Returns'];

/* ==========================================================================
   TABLE ALIASES
   ========================================================================== */

// --- ConstructionTypes ---
export type ConstructionTypes = Tables<'construction_types'>;
export type ConstructionTypesInsert = TablesInsert<'construction_types'>;
export type ConstructionTypesUpdate = TablesUpdate<'construction_types'>;

// --- DamageCategories ---
export type DamageCategories = Tables<'damage_categories'>;
export type DamageCategoriesInsert = TablesInsert<'damage_categories'>;
export type DamageCategoriesUpdate = TablesUpdate<'damage_categories'>;

// --- DamageInspectionOccupancy ---
export type DamageInspectionOccupancy = Tables<'damage_inspection_occupancy'>;
export type DamageInspectionOccupancyInsert = TablesInsert<'damage_inspection_occupancy'>;
export type DamageInspectionOccupancyUpdate = TablesUpdate<'damage_inspection_occupancy'>;

// --- DamageInspectionPhotos ---
export type DamageInspectionPhotos = Tables<'damage_inspection_photos'>;
export type DamageInspectionPhotosInsert = TablesInsert<'damage_inspection_photos'>;
export type DamageInspectionPhotosUpdate = TablesUpdate<'damage_inspection_photos'>;

// --- DamageInspections ---
export type DamageInspections = Tables<'damage_inspections'>;
export type DamageInspectionsInsert = TablesInsert<'damage_inspections'>;
export type DamageInspectionsUpdate = TablesUpdate<'damage_inspections'>;

// --- DamagePatterns ---
export type DamagePatterns = Tables<'damage_patterns'>;
export type DamagePatternsInsert = TablesInsert<'damage_patterns'>;
export type DamagePatternsUpdate = TablesUpdate<'damage_patterns'>;

// --- DataSources ---
export type DataSources = Tables<'data_sources'>;
export type DataSourcesInsert = TablesInsert<'data_sources'>;
export type DataSourcesUpdate = TablesUpdate<'data_sources'>;

// --- InspectionDamagePatterns ---
export type InspectionDamagePatterns = Tables<'inspection_damage_patterns'>;
export type InspectionDamagePatternsInsert = TablesInsert<'inspection_damage_patterns'>;
export type InspectionDamagePatternsUpdate = TablesUpdate<'inspection_damage_patterns'>;

// --- SeismicEvents ---
export type SeismicEvents = Tables<'seismic_events'>;
export type SeismicEventsInsert = TablesInsert<'seismic_events'>;
export type SeismicEventsUpdate = TablesUpdate<'seismic_events'>;

