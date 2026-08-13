import { Injectable, inject } from '@angular/core';
import { toLocalReportSummary } from '../../application/mappers/local-report.mapper';
import { IndexedDbReportRepository } from '../../data/local/indexeddb-report.repository';
import { SupabaseInspectionPhotoRepository } from '../../data/remote/supabase-photo.repository';
import { ReportSummary } from '../models/report-summary.model';

@Injectable({ providedIn: 'root' })
export class GetLocalReportSummaries {
  private readonly localRepository = inject(IndexedDbReportRepository);
  private readonly photoRemote = inject(SupabaseInspectionPhotoRepository);

  async execute(): Promise<ReportSummary[]> {
    const reports = await this.localRepository.getAll();

    const summaries = reports.map((report) =>
      toLocalReportSummary(report, (path) => this.photoRemote.getPublicUrl(path)),
    );

    return summaries.sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
  }
}
