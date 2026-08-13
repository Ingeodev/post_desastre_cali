import { Injectable, inject } from '@angular/core';
import { SupabaseReportRepository } from '../../data/remote/supabase-report.repository';
import { ReportSummary } from '../models/report-summary.model';

@Injectable({ providedIn: 'root' })
export class GetReportSummaries {
  private readonly reportRepository = inject(SupabaseReportRepository);

  execute(): Promise<ReportSummary[]> {
    return this.reportRepository.getSummaries();
  }
}