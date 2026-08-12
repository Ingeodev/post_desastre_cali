import { Json } from '../../../../core/supabase-models/database.types';

export type GeoJsonPoint = {
  type: 'Point';
  coordinates: [number, number];
};

export interface InspectionEntity {
  id: string;
  deviceLocalId: string;
  capturedAt: string;
  geom: GeoJsonPoint | null;
  damageCategoryId: number;
  dataSourceId: number;
  seismicEventId: string;
  constructionTypeId: number | null;
  deviceId: string | null;
  addressText: string | null;
  approxYearBuilt: number | null;
  notes: string | null;
  numFloors: number | null;
  reportedBy: string | null;
  createdAt: string | null;
  syncedAt: string | null;
}

export type InspectionRemote = Omit<
  InspectionEntity,
  'geom' | 'createdAt' | 'syncedAt'
> & {
  geom: Json;
  created_at: string | null;
  synced_at: string | null;
};