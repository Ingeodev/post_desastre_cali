import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { GetLocalReportSummaries } from './get-local-report-summaries';
import { IndexedDbReportRepository } from '../../data/local/indexeddb-report.repository';
import { SupabaseInspectionPhotoRepository } from '../../data/remote/supabase-photo.repository';
import { ReportEntities } from '../models/report-entities.model';

describe('GetLocalReportSummaries', () => {
  let useCase: GetLocalReportSummaries;
  let localRepository: { getAll: ReturnType<typeof vi.fn> };
  let photoRemote: { getPublicUrl: ReturnType<typeof vi.fn> };

  function buildReport(
    id: string,
    capturedAt: string,
    storagePath: string | null,
  ): ReportEntities {
    return {
      inspection: {
        id,
        deviceLocalId: id,
        capturedAt,
        geom: null,
        damageCategoryId: 2,
        dataSourceId: 1,
        seismicEventId: 'evt-1',
        constructionTypeId: null,
        deviceId: null,
        addressText: 'Calle 1',
        approxYearBuilt: null,
        notes: null,
        numFloors: null,
        reportedBy: null,
        createdAt: capturedAt,
        syncedAt: null,
      },
      occupancy: null,
      patterns: [],
      photos: storagePath
        ? [
            {
              id: `photo-${id}`,
              inspectionId: id,
              sequence: 0,
              storagePath,
              blob: null,
              mimeType: 'image/png',
              takenAt: capturedAt,
              uploadedAt: null,
              syncStatus: 'CACHED_FROM_REMOTE',
            },
          ]
        : [],
    };
  }

  beforeEach(() => {
    localRepository = { getAll: vi.fn() };
    photoRemote = { getPublicUrl: vi.fn(() => 'https://cdn/photo') };

    TestBed.configureTestingModule({
      providers: [
        GetLocalReportSummaries,
        { provide: IndexedDbReportRepository, useValue: localRepository },
        {
          provide: SupabaseInspectionPhotoRepository,
          useValue: photoRemote,
        },
      ],
    });

    useCase = TestBed.inject(GetLocalReportSummaries);
  });

  it('should return an empty list when there are no local reports', async () => {
    localRepository.getAll.mockResolvedValue([]);

    await expect(useCase.execute()).resolves.toEqual([]);
  });

  it('should map local reports to summaries sorted by capture date', async () => {
    localRepository.getAll.mockResolvedValue([
      buildReport('older', '2026-08-01T00:00:00Z', 'older/p'),
      buildReport('newer', '2026-08-12T00:00:00Z', 'newer/p'),
    ]);

    const summaries = await useCase.execute();

    expect(summaries.map((summary) => summary.id)).toEqual(['newer', 'older']);
    expect(summaries[0]).toEqual({
      id: 'newer',
      addressText: 'Calle 1',
      damageCategoryId: 2,
      damageCategoryLabel: null,
      capturedAt: '2026-08-12T00:00:00Z',
      notes: null,
      firstPhotoUrl: 'https://cdn/photo',
      source: 'local',
    });
  });

  it('should not include a photo url when the report has no photos', async () => {
    localRepository.getAll.mockResolvedValue([
      buildReport('no-photos', '2026-08-12T00:00:00Z', null),
    ]);

    const summaries = await useCase.execute();

    expect(summaries[0].firstPhotoUrl).toBeNull();
  });
});
