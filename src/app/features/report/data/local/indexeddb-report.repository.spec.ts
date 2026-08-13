import 'fake-indexeddb/auto';
import { TestBed } from '@angular/core/testing';
import { IndexDb } from '../../../../core/data/local/db';
import { INDEX_DB_NAME } from '../../../../core/data/local/db-shcema';
import { ReportEntities } from '../../domain/models/report-entities.model';
import { IndexedDbReportRepository } from './indexeddb-report.repository';

function buildEntities(): ReportEntities {
  const now = '2026-08-12T12:00:00.000Z';

  return {
    inspection: {
      id: 'ins-1',
      deviceLocalId: 'ins-1',
      capturedAt: now,
      geom: { type: 'Point', coordinates: [-76.5, 3.45] },
      damageCategoryId: 2,
      dataSourceId: 1,
      seismicEventId: 'evt-1',
      constructionTypeId: 3,
      deviceId: null,
      addressText: 'Calle 5 # 8-10',
      approxYearBuilt: 1985,
      notes: null,
      numFloors: 2,
      reportedBy: null,
      createdAt: now,
      syncedAt: null,
    },
    occupancy: {
      id: 'ins-1',
      inspectionId: 'ins-1',
      createdAt: now,
      estimatedResidents: 3,
      hasTrappedPeople: false,
      isCurrentlyOccupied: true,
    },
    patterns: [
      { inspectionId: 'ins-1', patternId: 7 },
      { inspectionId: 'ins-1', patternId: 9 },
    ],
    photos: [
      {
        id: 'photo-1',
        inspectionId: 'ins-1',
        sequence: 0,
        storagePath: null,
        blob: new Blob(['data'], { type: 'image/jpeg' }),
        mimeType: 'image/jpeg',
        takenAt: now,
        uploadedAt: null,
        syncStatus: 'PENDING_UPLOAD',
      },
    ],
  };
}

async function deleteDatabase(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(INDEX_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

describe('IndexedDbReportRepository', () => {
  let repository: IndexedDbReportRepository;
  let db: IndexDb;

  beforeEach(async () => {
    await deleteDatabase();

    TestBed.configureTestingModule({
      providers: [{ provide: IndexDb, useClass: IndexDb }],
    });

    db = TestBed.inject(IndexDb);
    repository = TestBed.inject(IndexedDbReportRepository);
  });

  afterEach(() => {
    db.close();
  });

  it('should return undefined for an unknown id', async () => {
    await expect(repository.getById('nope')).resolves.toBeUndefined();
  });

  it('should save the report entities and hydrate them back', async () => {
    const entities = buildEntities();

    await repository.save(entities);

    const restored = await repository.getById(entities.inspection.id);

    expect(restored?.inspection).toEqual(entities.inspection);
    expect(restored?.occupancy).toEqual(entities.occupancy);
    expect(restored?.patterns).toEqual(entities.patterns);
    expect(restored?.photos).toHaveLength(1);
    expect(restored?.photos[0].id).toBe('photo-1');
    expect(restored?.photos[0].blob).toBeTruthy();
  });

  it('should list all saved reports', async () => {
    const first = buildEntities();
    const second = buildEntities();
    second.inspection.id = 'ins-2';
    second.inspection.deviceLocalId = 'ins-2';
    second.occupancy = {
      ...second.occupancy!,
      id: 'ins-2',
      inspectionId: 'ins-2',
    };
    second.patterns = second.patterns.map((pattern) => ({
      ...pattern,
      inspectionId: 'ins-2',
    }));
    second.photos = second.photos.map((photo) => ({
      ...photo,
      inspectionId: 'ins-2',
    }));

    await repository.save(first);
    await repository.save(second);

    const all = await repository.getAll();

    expect(all.map((report) => report.inspection.id).sort()).toEqual([
      'ins-1',
      'ins-2',
    ]);
  });

  it('should delete a report with all its related entities', async () => {
    const entities = buildEntities();

    await repository.save(entities);
    await repository.delete(entities.inspection.id);

    await expect(
      repository.getById(entities.inspection.id),
    ).resolves.toBeUndefined();
  });
});
