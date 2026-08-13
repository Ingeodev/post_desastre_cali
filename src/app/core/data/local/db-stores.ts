export const INDEX_DB_STORES = {
  reports: 'reports',
  attachments: 'attachments',
  inspections: 'inspections',
  inspectionPhotos: 'inspection_photos',
  inspectionOccupancy: 'inspection_occupancy',
  inspectionPatterns: 'inspection_patterns',
  syncQueue: 'sync_queue',
  seismicEvents: 'seismic_events',
  user: 'user',
} as const;

export type IndexDbStore =
  typeof INDEX_DB_STORES[keyof typeof INDEX_DB_STORES];