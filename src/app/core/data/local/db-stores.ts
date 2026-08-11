export const INDEX_DB_STORES = {
  reports: 'reports',
  attachments: 'attachments',
  syncQueue: 'sync_queue',
} as const;

export type IndexDbStore =
  typeof INDEX_DB_STORES[keyof typeof INDEX_DB_STORES];