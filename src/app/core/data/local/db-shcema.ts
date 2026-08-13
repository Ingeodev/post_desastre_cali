export const INDEX_DB_NAME = 'post-desastre-cali';

export const INDEX_DB_VERSION = 3;

export const INDEX_DB_SCHEMA = {
  // Las claves SON los nombres reales de los object stores (snake_case),
  // y coinciden con los valores de INDEX_DB_STORES.
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

  inspections: {
    keyPath: 'id',
    indexes: {
      syncedAt: {
        keyPath: 'syncedAt',
        options: {
          unique: false,
        },
      },
    },
  },

  inspection_photos: {
    keyPath: 'id',
    indexes: {
      inspectionId: {
        keyPath: 'inspectionId',
        options: {
          unique: false,
        },
      },
      syncStatus: {
        keyPath: 'syncStatus',
        options: {
          unique: false,
        },
      },
    },
  },

  inspection_occupancy: {
    keyPath: 'id',
    indexes: {
      inspectionId: {
        keyPath: 'inspectionId',
        options: {
          unique: false,
        },
      },
    },
  },

  inspection_patterns: {
    keyPath: ['inspectionId', 'patternId'],
    indexes: {
      inspectionId: {
        keyPath: 'inspectionId',
        options: {
          unique: false,
        },
      },
    },
  },

  sync_queue: {
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

  seismic_events: {
    keyPath: 'id',
  },

  user: {
    keyPath: 'id',
  },
} as const;