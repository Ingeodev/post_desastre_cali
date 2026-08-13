export interface SeismicEventEntity {
  id: string;
  event_datetime: string;
  magnitude: number | null;
  depth_km: number | null;
  epicenter: unknown;
  source: string | null;
  created_at: string | null;
  name: string;
}