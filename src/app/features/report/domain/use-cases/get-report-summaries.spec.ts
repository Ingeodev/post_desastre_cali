import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { GetReportSummaries } from './get-report-summaries';
import { SupabaseReportRepository } from '../../data/remote/supabase-report.repository';
import { ReportSummary } from '../models/report-summary.model';

describe('GetReportSummaries', () => {
  let useCase: GetReportSummaries;
  let reportRepository: { getSummaries: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    reportRepository = { getSummaries: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        GetReportSummaries,
        {
          provide: SupabaseReportRepository,
          useValue: reportRepository,
        },
      ],
    });

    useCase = TestBed.inject(GetReportSummaries);
  });

  it('should delegate to the repository', async () => {
    const summaries: ReportSummary[] = [
      {
        id: '1',
        addressText: 'Calle 1',
        damageCategoryId: 2,
        damageCategoryLabel: 'Daño alto',
        capturedAt: '2026-08-10T00:00:00Z',
        notes: null,
        firstPhotoUrl: null,
        source: 'remote',
      },
    ];

    reportRepository.getSummaries.mockResolvedValue(summaries);

    await expect(useCase.execute()).resolves.toEqual(summaries);
    expect(reportRepository.getSummaries).toHaveBeenCalledTimes(1);
  });
});
