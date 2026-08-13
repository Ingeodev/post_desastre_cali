import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { IndexedDbReportRepository } from '../../data/local/indexeddb-report.repository';
import { SupabaseInspectionRepository } from '../../data/remote/supabase-inspection.repository';
import { SupabaseInspectionOccupancyRepository } from '../../data/remote/supabase-occupancy.repository';
import { SupabaseInspectionPatternRepository } from '../../data/remote/supabase-pattern.repository';
import { SupabaseInspectionPhotoRepository } from '../../data/remote/supabase-photo.repository';
import { InspectionEntity } from '../../data/entities/inspection.entity';
import { InspectionPhotoEntity } from '../../data/entities/inspection-photo.entity';
import { ReportEntities } from '../models/report-entities.model';
import { SyncReportsUseCase } from './sync-reports';

describe('SyncReportsUseCase', () => {
  let useCase: SyncReportsUseCase;
  let localRepository: {
    getAll: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let inspectionRemote: { saveRemote: ReturnType<typeof vi.fn> };
  let occupancyRemote: { saveRemote: ReturnType<typeof vi.fn> };
  let patternRemote: { saveManyRemote: ReturnType<typeof vi.fn> };
  let photoRemote: {
    uploadToStorage: ReturnType<typeof vi.fn>;
    saveRemote: ReturnType<typeof vi.fn>;
  };

  function buildReport(overrides: Partial<ReportEntities> = {}): ReportEntities {
    const inspection: InspectionEntity = {
      id: 'inspection-1',
      deviceLocalId: 'device-1',
      geom: { type: 'Point', coordinates: [-76.5, 3.45] },
      capturedAt: '2026-08-10T12:00:00.000Z',
      damageCategoryId: 1,
      dataSourceId: 2,
      seismicEventId: 'evt-1',
      constructionTypeId: 3,
      deviceId: null,
      addressText: null,
      approxYearBuilt: null,
      numFloors: null,
      notes: null,
      reportedBy: 'user@example.com',
      createdAt: '2026-08-10T12:00:00.000Z',
      syncedAt: null,
    };

    const photo: InspectionPhotoEntity = {
      id: 'photo-1',
      inspectionId: 'inspection-1',
      sequence: 0,
      storagePath: null,
      blob: new Blob(['x'], { type: 'image/jpeg' }),
      mimeType: 'image/jpeg',
      takenAt: '2026-08-10T12:00:00.000Z',
      uploadedAt: null,
      syncStatus: 'PENDING_UPLOAD',
    };

    return {
      inspection,
      occupancy: {
        id: 'inspection-1',
        inspectionId: 'inspection-1',
        createdAt: '2026-08-10T12:00:00.000Z',
        estimatedResidents: 4,
        hasTrappedPeople: false,
        isCurrentlyOccupied: true,
      },
      patterns: [{ inspectionId: 'inspection-1', patternId: 1 }],
      photos: [photo],
      ...overrides,
    };
  }

  beforeEach(() => {
    localRepository = {
      getAll: vi.fn(),
      delete: vi.fn(),
    };
    inspectionRemote = { saveRemote: vi.fn().mockResolvedValue(undefined) };
    occupancyRemote = { saveRemote: vi.fn().mockResolvedValue(undefined) };
    patternRemote = { saveManyRemote: vi.fn().mockResolvedValue(undefined) };
    photoRemote = {
      uploadToStorage: vi.fn().mockResolvedValue('inspection-1/photo-1'),
      saveRemote: vi.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [
        SyncReportsUseCase,
        { provide: IndexedDbReportRepository, useValue: localRepository },
        { provide: SupabaseInspectionRepository, useValue: inspectionRemote },
        {
          provide: SupabaseInspectionOccupancyRepository,
          useValue: occupancyRemote,
        },
        {
          provide: SupabaseInspectionPatternRepository,
          useValue: patternRemote,
        },
        { provide: SupabaseInspectionPhotoRepository, useValue: photoRemote },
      ],
    });

    useCase = TestBed.inject(SyncReportsUseCase);
  });

  it('should count only pending inspections', async () => {
    const synced = buildReport();
    synced.inspection.syncedAt = '2026-08-10T13:00:00.000Z';

    localRepository.getAll.mockResolvedValue([buildReport(), synced]);

    expect(await useCase.pendingCount()).toBe(1);
  });

  it('should sync each report in order and delete it locally on success', async () => {
    const report = buildReport();
    localRepository.getAll.mockResolvedValue([report]);

    await useCase.run();

    expect(inspectionRemote.saveRemote).toHaveBeenCalledWith(report.inspection);
    expect(occupancyRemote.saveRemote).toHaveBeenCalledWith(report.occupancy);
    expect(patternRemote.saveManyRemote).toHaveBeenCalledWith(report.patterns);
    expect(photoRemote.uploadToStorage).toHaveBeenCalledWith(report.photos[0]);
    expect(photoRemote.saveRemote).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'photo-1', storagePath: 'inspection-1/photo-1' }),
    );
    expect(localRepository.delete).toHaveBeenCalledWith('inspection-1');
  });

  it('should skip already synced inspections', async () => {
    const synced = buildReport();
    synced.inspection.syncedAt = '2026-08-10T13:00:00.000Z';

    localRepository.getAll.mockResolvedValue([synced]);

    await useCase.run();

    expect(inspectionRemote.saveRemote).not.toHaveBeenCalled();
    expect(localRepository.delete).not.toHaveBeenCalled();
  });

  it('should not delete locally when a piece fails', async () => {
    inspectionRemote.saveRemote.mockRejectedValue(new Error('boom'));
    localRepository.getAll.mockResolvedValue([buildReport()]);

    await expect(useCase.run()).rejects.toThrow('boom');

    expect(localRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw when a photo has no blob nor storagePath', async () => {
    const report = buildReport();
    report.photos = [
      {
        id: 'photo-empty',
        inspectionId: 'inspection-1',
        sequence: 0,
        storagePath: null,
        blob: null,
        mimeType: 'image/jpeg',
        takenAt: '2026-08-10T12:00:00.000Z',
        uploadedAt: null,
        syncStatus: 'PENDING_UPLOAD',
      },
    ];

    localRepository.getAll.mockResolvedValue([report]);

    await expect(useCase.run()).rejects.toThrow(/without blob or storagePath/);
    expect(localRepository.delete).not.toHaveBeenCalled();
  });
});
