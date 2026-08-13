import 'fake-indexeddb/auto';
import { IndexDb } from './db';
import { INDEX_DB_NAME, INDEX_DB_SCHEMA, INDEX_DB_VERSION } from './db-shcema';

async function deleteDatabase(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(INDEX_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function seedLegacyDatabase(): Promise<void> {
  // Reproduce el estado de una DB creada con el schema viejo (claves
  // camelCase usadas como nombre de store) en version 2.
  const legacySchema: Record<string, IDBObjectStoreParameters> = {
    reports: { keyPath: 'id' },
    attachments: { keyPath: 'id' },
    inspections: { keyPath: 'id' },
    inspectionPhotos: { keyPath: 'id' },
    inspectionOccupancy: { keyPath: 'id' },
    inspectionPatterns: { keyPath: ['inspectionId', 'patternId'] },
    syncQueue: { keyPath: 'id' },
    seismicEvents: { keyPath: 'id' },
    user: { keyPath: 'id' },
  };

  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(INDEX_DB_NAME, INDEX_DB_VERSION - 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      for (const [name, parameters] of Object.entries(legacySchema)) {
        if (!database.objectStoreNames.contains(name)) {
          database.createObjectStore(name, parameters);
        }
      }
    };

    request.onsuccess = () => {
      request.result.close();
      resolve();
    };

    request.onerror = () => reject(request.error);
  });
}

async function listStoreNames(): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    const request = indexedDB.open(INDEX_DB_NAME);
    request.onsuccess = () => {
      const database = request.result;
      resolve(Array.from(database.objectStoreNames));
      database.close();
    };
    request.onerror = () => reject(request.error);
  });
}

async function seedStuckDatabase(): Promise<void> {
  // Simula una DB que YA alcanzó la versión objetivo sin el schema alineado:
  // solo tiene los stores mal nombrados (camelCase), nunca se crearon los
  // snake_case; como la versión ya no aumenta, onupgradeneeded no volvería a correr.
  const misnamedSchema: Record<string, IDBObjectStoreParameters> = {
    inspectionPhotos: { keyPath: 'id' },
    inspectionOccupancy: { keyPath: 'id' },
    inspectionPatterns: { keyPath: ['inspectionId', 'patternId'] },
    syncQueue: { keyPath: 'id' },
    seismicEvents: { keyPath: 'id' },
    reports: { keyPath: 'id' },
    attachments: { keyPath: 'id' },
    inspections: { keyPath: 'id' },
    user: { keyPath: 'id' },
  };

  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(INDEX_DB_NAME, INDEX_DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      for (const [name, parameters] of Object.entries(misnamedSchema)) {
        database.createObjectStore(name, parameters);
      }
    };

    request.onsuccess = () => {
      request.result.close();
      resolve();
    };

    request.onerror = () => reject(request.error);
  });
}

async function seedFullDatabase(version: number): Promise<void> {
  // Base ya en una versión >= objetivo con todos los stores alineados.
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(INDEX_DB_NAME, version);

    request.onupgradeneeded = () => {
      const database = request.result;
      for (const [name, parameters] of Object.entries(INDEX_DB_SCHEMA)) {
        database.createObjectStore(name, parameters as IDBObjectStoreParameters);
      }
    };

    request.onsuccess = () => {
      request.result.close();
      resolve();
    };

    request.onerror = () => reject(request.error);
  });
}

describe('IndexDb', () => {
  beforeEach(async () => {
    await deleteDatabase();
  });

  it('opens a fresh database with all the aligned stores', async () => {
    const db = new IndexDb();

    await db.put('user', { id: 'u1', email: 'a@b.co' });
    await db.put('seismic_events', {
      id: 'evt-1',
      event_datetime: '2026-08-10 12:34:28+00',
      magnitude: 7.4,
      depth_km: 110.3,
      epicenter: 'xyz',
      source: 'USGS',
      created_at: '2026-08-12 14:39:52.951703+00',
      name: 'Sismo mock',
    });

    const users = await db.getAll<{ id: string; email: string }>('user');
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('a@b.co');

    const events = await db.getAll<{ id: string }>('seismic_events');
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe('evt-1');

    const names = await listStoreNames();
    expect(names).toEqual(
      expect.arrayContaining([
        'reports',
        'attachments',
        'inspections',
        'inspection_photos',
        'inspection_occupancy',
        'inspection_patterns',
        'sync_queue',
        'seismic_events',
        'user',
      ]),
    );
  });

  it('drops the misnamed legacy stores and creates the aligned ones', async () => {
    await seedLegacyDatabase();

    await expect(
      listStoreNames(),
    ).resolves.toEqual(
      expect.arrayContaining(['seismicEvents', 'inspectionPhotos']),
    );

    const db = new IndexDb();
    await db.put('user', { id: 'u1', email: 'a@b.co' });
    await db.put('seismic_events', {
      id: 'evt-1',
      event_datetime: '2026-08-10 12:34:28+00',
      magnitude: 7.4,
      depth_km: 110.3,
      epicenter: 'xyz',
      source: 'USGS',
      created_at: '2026-08-12 14:39:52.951703+00',
      name: 'Sismo mock',
    });

    const users = await db.getAll<{ id: string; email: string }>('user');
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('a@b.co');

    const events = await db.getAll<{ id: string }>('seismic_events');
    expect(events).toHaveLength(1);

    const names = await listStoreNames();
    expect(names).toEqual(
      expect.arrayContaining([
        'inspection_photos',
        'inspection_occupancy',
        'inspection_patterns',
        'sync_queue',
        'seismic_events',
        'user',
      ]),
    );
    expect(names).not.toEqual(
      expect.arrayContaining([
        'inspectionPhotos',
        'inspectionOccupancy',
        'inspectionPatterns',
        'syncQueue',
        'seismicEvents',
      ]),
    );
  });

  it('repairs a stuck database that reached the target version without the aligned stores', async () => {
    await seedStuckDatabase();

    const db = new IndexDb();
    await db.put('user', { id: 'u1', email: 'a@b.co' });
    await db.put('seismic_events', {
      id: 'evt-1',
      event_datetime: '2026-08-10 12:34:28+00',
      magnitude: 7.4,
      depth_km: 110.3,
      epicenter: 'xyz',
      source: 'USGS',
      created_at: '2026-08-12 14:39:52.951703+00',
      name: 'Sismo mock',
    });

    const users = await db.getAll<{ id: string; email: string }>('user');
    expect(users).toHaveLength(1);

    const events = await db.getAll<{ id: string }>('seismic_events');
    expect(events).toHaveLength(1);

    const names = await listStoreNames();
    expect(names).toEqual(
      expect.arrayContaining(['seismic_events', 'user']),
    );
    expect(names).not.toEqual(
      expect.arrayContaining(['seismicEvents', 'inspectionPhotos']),
    );
  });

  it('opens a database that is already on a higher version without a VersionError', async () => {
    await seedFullDatabase(INDEX_DB_VERSION + 1);

    const db = new IndexDb();
    await db.put('user', { id: 'u1', email: 'a@b.co' });
    await db.put('seismic_events', {
      id: 'evt-1',
      event_datetime: '2026-08-10 12:34:28+00',
      magnitude: 7.4,
      depth_km: 110.3,
      epicenter: 'xyz',
      source: 'USGS',
      created_at: '2026-08-12 14:39:52.951703+00',
      name: 'Sismo mock',
    });

    const users = await db.getAll<{ id: string; email: string }>('user');
    expect(users).toHaveLength(1);

    const events = await db.getAll<{ id: string }>('seismic_events');
    expect(events).toHaveLength(1);
  });
});