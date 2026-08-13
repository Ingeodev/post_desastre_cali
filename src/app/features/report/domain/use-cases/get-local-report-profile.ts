import { Injectable, inject } from '@angular/core';
import { toLocalReportProfile } from '../../application/mappers/local-report.mapper';
import { IndexedDbReportRepository } from '../../data/local/indexeddb-report.repository';
import { SupabaseInspectionPhotoRepository } from '../../data/remote/supabase-photo.repository';
import { ReportProfile } from '../models/report-profile.model';

@Injectable({ providedIn: 'root' })
export class GetLocalReportProfile {
  private readonly localRepository = inject(IndexedDbReportRepository);
  private readonly photoRemote = inject(SupabaseInspectionPhotoRepository);

  async execute(id: string): Promise<ReportProfile | undefined> {
    const report = await this.localRepository.getById(id);

    if (!report) {
      return undefined;
    }

    return toLocalReportProfile(
      report,
      (path) => this.photoRemote.getPublicUrl(path),
    );
  }
}
