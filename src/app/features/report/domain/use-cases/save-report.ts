import { Injectable, inject } from '@angular/core';
import { IndexedDbReportRepository } from '../../data/local/indexeddb-report.repository';
import { ReportEntities } from '../models/report-entities.model';

@Injectable({ providedIn: 'root' })
export class SaveReport {
  private readonly reportRepository = inject(IndexedDbReportRepository);

  execute(entities: ReportEntities): Promise<void> {
    return this.reportRepository.save(entities);
  }
}
