import { Injectable, inject } from '@angular/core';
import { SupabaseReportRepository } from '../../data/remote/supabase-report.repository';
import { ReportProfile } from '../models/report-profile.model';

@Injectable({ providedIn: 'root' })
export class GetReportProfile {
  private readonly reportRepository = inject(SupabaseReportRepository);

  execute(id: string): Promise<ReportProfile | undefined> {
    return this.reportRepository.getProfileById(id);
  }
}