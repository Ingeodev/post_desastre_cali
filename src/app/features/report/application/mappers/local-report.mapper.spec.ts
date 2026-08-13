import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InspectionPhotoEntity } from '../../data/entities/inspection-photo.entity';
import {
  toLocalPhotoUrl,
  toLocalReportProfile,
  toLocalReportSummary,
} from './local-report.mapper';
import { ReportEntities } from '../../domain/models/report-entities.model';

describe('local-report mapper', () => {
  beforeEach(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(() => 'blob:local-photo'),
    });
  });

  function buildPhoto(
    partial: Partial<InspectionPhotoEntity> = {},
  ): InspectionPhotoEntity {
    return {
      id: 'photo-1',
      inspectionId: 'ins-1',
      sequence: 0,
      storagePath: null,
      blob: null,
      mimeType: 'image/jpeg',
      takenAt: '2026-08-12T12:00:00.000Z',
      uploadedAt: null,
      syncStatus: 'PENDING_UPLOAD',
      ...partial,
    };
  }

  function buildReport(): ReportEntities {
    return {
      inspection: {
        id: 'ins-1',
        deviceLocalId: 'ins-1',
        capturedAt: '2026-08-12T12:00:00.000Z',
        geom: null,
        damageCategoryId: 2,
        dataSourceId: 1,
        seismicEventId: 'evt-1',
        constructionTypeId: null,
        deviceId: null,
        addressText: 'Calle 5 # 8-10',
        approxYearBuilt: null,
        notes: null,
        numFloors: null,
        reportedBy: null,
        createdAt: '2026-08-12T12:00:00.000Z',
        syncedAt: null,
      },
      occupancy: null,
      patterns: [],
      photos: [],
    };
  }

  it('should resolve a blob as an object URL', () => {
    const photo = buildPhoto({ blob: new Blob(['data']) });

    expect(toLocalPhotoUrl(photo, (path) => path)).toBe('blob:local-photo');
  });

  it('should resolve a storage path through the public url resolver', () => {
    const photo = buildPhoto({
      storagePath: 'ins-1/photo-1',
      syncStatus: 'CACHED_FROM_REMOTE',
    });

    expect(toLocalPhotoUrl(photo, () => 'https://cdn/photo-1')).toBe(
      'https://cdn/photo-1',
    );
  });

  it('should return null when there is no blob nor storage path', () => {
    expect(toLocalPhotoUrl(buildPhoto(), () => '')).toBeNull();
  });

  it('should map entities to a local summary', () => {
    const report = buildReport();
    report.photos = [buildPhoto({ blob: new Blob(['data']) })];

    const summary = toLocalReportSummary(report, () => '');

    expect(summary).toEqual({
      id: 'ins-1',
      addressText: 'Calle 5 # 8-10',
      damageCategoryId: 2,
      damageCategoryLabel: null,
      capturedAt: '2026-08-12T12:00:00.000Z',
      notes: null,
      firstPhotoUrl: 'blob:local-photo',
      source: 'local',
    });
  });

  it('should take the first photo by sequence for the summary', () => {
    const report = buildReport();
    report.photos = [
      buildPhoto({ id: 'photo-2', sequence: 1 }),
      buildPhoto({ id: 'photo-1', sequence: 0, blob: new Blob(['data']) }),
    ];

    const summary = toLocalReportSummary(report, () => '');

    expect(summary.firstPhotoUrl).toBe('blob:local-photo');
  });

  it('should map entities to a profile with photos ordered by sequence', () => {
    const report = buildReport();
    report.photos = [
      buildPhoto({ id: 'photo-2', sequence: 1, blob: new Blob(['data']) }),
      buildPhoto({ id: 'photo-1', sequence: 0, blob: new Blob(['data']) }),
    ];

    const profile = toLocalReportProfile(report, () => '');

    expect(profile.inspection.id).toBe('ins-1');
    expect(profile.photos.map((photo) => photo.id)).toEqual([
      'photo-1',
      'photo-2',
    ]);
    expect(profile.photos[0].url).toBe('blob:local-photo');
  });
});
