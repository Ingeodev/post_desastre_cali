import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SupabaseReportRepository } from './supabase-report.repository';
import { SupabaseInspectionRepository } from './supabase-inspection.repository';
import { SupabaseInspectionOccupancyRepository } from './supabase-occupancy.repository';
import { SupabaseInspectionPatternRepository } from './supabase-pattern.repository';
import { SupabaseInspectionPhotoRepository } from './supabase-photo.repository';

describe('SupabaseReportRepository', () => {
  let repository: SupabaseReportRepository;
  let inspectionRemote: { getAllRemote: ReturnType<typeof vi.fn>; getRemote: ReturnType<typeof vi.fn> };
  let occupancyRemote: { getByInspectionId: ReturnType<typeof vi.fn> };
  let patternRemote: { getByInspectionId: ReturnType<typeof vi.fn> };
  let photoRemote: { getByInspectionId: ReturnType<typeof vi.fn>; getPublicUrl: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    inspectionRemote = { getAllRemote: vi.fn(), getRemote: vi.fn() };
    occupancyRemote = { getByInspectionId: vi.fn() };
    patternRemote = { getByInspectionId: vi.fn() };
    photoRemote = { getByInspectionId: vi.fn(), getPublicUrl: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        SupabaseReportRepository,
        { provide: SupabaseInspectionRepository, useValue: inspectionRemote },
        { provide: SupabaseInspectionOccupancyRepository, useValue: occupancyRemote },
        { provide: SupabaseInspectionPatternRepository, useValue: patternRemote },
        { provide: SupabaseInspectionPhotoRepository, useValue: photoRemote },
      ],
    });

    repository = TestBed.inject(SupabaseReportRepository);
  });

  it('should return an empty list when there are no inspections', async () => {
    inspectionRemote.getAllRemote.mockResolvedValue([]);

    await expect(repository.getSummaries()).resolves.toEqual([]);
  });
});