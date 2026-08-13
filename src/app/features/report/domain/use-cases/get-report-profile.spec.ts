import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { GetReportProfile } from './get-report-profile';
import { SupabaseReportRepository } from '../../data/remote/supabase-report.repository';
import { ReportProfile } from '../models/report-profile.model';
import { InspectionEntity } from '../../data/entities/inspection.entity';

describe('GetReportProfile', () => {
  let useCase: GetReportProfile;
  let reportRepository: { getProfileById: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    reportRepository = { getProfileById: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        GetReportProfile,
        {
          provide: SupabaseReportRepository,
          useValue: reportRepository,
        },
      ],
    });

    useCase = TestBed.inject(GetReportProfile);
  });

  it('should delegate to the repository with the given id', async () => {
    const inspection: InspectionEntity = {
      id: 'abc',
      deviceLocalId: 'device-1',
      capturedAt: '2026-08-10T00:00:00Z',
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
      createdAt: null,
      syncedAt: null,
    };

    const profile: ReportProfile = {
      inspection,
      occupancy: null,
      patterns: [],
      photos: [],
    };

    reportRepository.getProfileById.mockResolvedValue(profile);

    await expect(useCase.execute('abc')).resolves.toEqual(profile);
    expect(reportRepository.getProfileById).toHaveBeenCalledWith('abc');
  });

  it('should return undefined when the repository finds nothing', async () => {
    reportRepository.getProfileById.mockResolvedValue(undefined);

    await expect(useCase.execute('missing')).resolves.toBeUndefined();
  });
});