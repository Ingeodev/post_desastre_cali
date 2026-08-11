export const INDEX_DB_NAME = 'post-desastre-cali';

export const INDEX_DB_VERSION = 1;

export const INDEX_DB_SCHEMA = {
  reports: {
    keyPath: 'id',
  },

  attachments: {
    keyPath: 'id',
    indexes: {
      reportId: {
        keyPath: 'reportId',
        options: {
          unique: false,
        },
      },
    },
  },

  syncQueue: {
    keyPath: 'id',
    indexes: {
      status: {
        keyPath: 'status',
        options: {
          unique: false,
        },
      },
    },
  },
} as const;