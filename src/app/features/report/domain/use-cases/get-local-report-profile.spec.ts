import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { GetLocalReportProfile } from './get-local-report-profile';
import { IndexedDbReportRepository } from '../../data/local/indexeddb-report.repository';
import { SupabaseInspectionPhotoRepository } from '../../data/remote/supabase-photo.repository';
import { ReportEntities } from '../models/report-entities.model';

describe('GetLocalReportProfile', () => {
  let useCase: GetLocalReportProfile;
  let localRepository: { getById: ReturnType<typeof vi.fn> };
  let photoRemote: { getPublicUrl: ReturnType<typeof vi.fn> };

  function buildReport(): ReportEntities {
    return {
      inspection: {
        id: 'ins-1',
        deviceLocalId: 'ins-1',
        capturedAt: '2026-08-12T12:00:00.000Z',
        geom: { type: 'Point', coordinates: [-76.5, 3.45] },
        damageCategoryId: 2,
        dataSourceId: 1,
        seismicEventId: 'evt-1',
        constructionTypeId: 3,
        deviceId: null,
        addressText: 'Calle 5 # 8-10',
        approxYearBuilt: 1985,
        notes: 'Colapsó la fachada',
        numFloors: 2,
        reportedBy: 'ana@test.co',
        createdAt: '2026-08-12T12:00:00.000Z',
        syncedAt: null,
      },
      occupancy: {
        id: 'ins-1',
        inspectionId: 'ins-1',
        createdAt: '2026-08-12T12:00:00.000Z',
        estimatedResidents: 3,
        hasTrappedPeople: false,
        isCurrentlyOccupied: true,
      },
      patterns: [{ inspectionId: 'ins-1', patternId: 7 }],
      photos: [
        {
          id: 'photo-1',
          inspectionId: 'ins-1',
          sequence: 0,
          storagePath: 'ins-1/photo-1',
          blob: null,
          mimeType: 'image/png',
          takenAt: '2026-08-12T12:00:00.000Z',
          uploadedAt: null,
          syncStatus: 'CACHED_FROM_REMOTE',
        },
      ],
    };
  }

  beforeEach(() => {
    localRepository = { getById: vi.fn() };
    photoRemote = { getPublicUrl: vi.fn(() => 'https://cdn/photo-1') };

    TestBed.configureTestingModule({
      providers: [
        GetLocalReportProfile,
        { provide: IndexedDbReportRepository, useValue: localRepository },
        {
          provide: SupabaseInspectionPhotoRepository,
          useValue: photoRemote,
        },
      ],
    });

    useCase = TestBed.inject(GetLocalReportProfile);
  });

  it('should return undefined when the report is not found locally', async () => {
    localRepository.getById.mockResolvedValue(undefined);

    await expect(useCase.execute('nope')).resolves.toBeUndefined();
  });

  it('should map the local report to a profile', async () => {
    localRepository.getById.mockResolvedValue(buildReport());

    const profile = await useCase.execute('ins-1');

    expect(profile?.inspection.id).toBe('ins-1');
    expect(profile?.occupancy?.estimatedResidents).toBe(3);
    expect(profile?.patterns).toHaveLength(1);
    expect(profile?.photos).toEqual([
      {
        id: 'photo-1',
        sequence: 0,
        takenAt: '2026-08-12T12:00:00.000Z',
        url: 'https://cdn/photo-1',
      },
    ]);
  });
});
