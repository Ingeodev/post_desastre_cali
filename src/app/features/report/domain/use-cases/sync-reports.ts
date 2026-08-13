import { Injectable, signal } from '@angular/core';
import { IndexedDbReportRepository } from '../../data/local/indexeddb-report.repository';
import { SupabaseInspectionRepository } from '../../data/remote/supabase-inspection.repository';
import { SupabaseInspectionOccupancyRepository } from '../../data/remote/supabase-occupancy.repository';
import { SupabaseInspectionPatternRepository } from '../../data/remote/supabase-pattern.repository';
import { SupabaseInspectionPhotoRepository } from '../../data/remote/supabase-photo.repository';
import { ReportEntities } from '../models/report-entities.model';

export interface SyncProgress {
  synced: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class SyncReportsUseCase {
  readonly progress = signal<SyncProgress>({ synced: 0, total: 0 });

  constructor(
    private readonly localRepository: IndexedDbReportRepository,
    private readonly inspectionRemote: SupabaseInspectionRepository,
    private readonly occupancyRemote: SupabaseInspectionOccupancyRepository,
    private readonly patternRemote: SupabaseInspectionPatternRepository,
    private readonly photoRemote: SupabaseInspectionPhotoRepository,
  ) {}

  async pendingCount(): Promise<number> {
    const reports = await this.localRepository.getAll();

    return reports.filter(
      (report) => report.inspection.syncedAt === null,
    ).length;
  }

  async run(): Promise<void> {
    const reports = await this.localRepository.getAll();

    const pending = reports.filter(
      (report) => report.inspection.syncedAt === null,
    );

    this.progress.set({ synced: 0, total: pending.length });

    for (const report of pending) {
      await this.syncReport(report);
      this.progress.update((progress) => ({
        ...progress,
        synced: progress.synced + 1,
      }));
    }
  }

  private async syncReport(report: ReportEntities): Promise<void> {
    const inspectionId = report.inspection.id;

    try {
      await this.inspectionRemote.saveRemote(report.inspection);

      if (report.occupancy) {
        await this.occupancyRemote.saveRemote(report.occupancy);
      }

      if (report.patterns.length > 0) {
        await this.patternRemote.saveManyRemote(report.patterns);
      }

      for (const photo of report.photos) {
        await this.syncPhoto(photo);
      }
    } catch (error) {
      throw error;
    }

    await this.localRepository.delete(inspectionId);
  }

  private async syncPhoto(photo: ReportEntities['photos'][number]): Promise<void> {
    let storagePath = photo.storagePath;

    if (photo.blob) {
      storagePath = await this.photoRemote.uploadToStorage(photo);
    }

    if (!storagePath) {
      throw new Error(`cannot sync photo without blob or storagePath (${photo.id})`);
    }

    await this.photoRemote.saveRemote({ ...photo, storagePath });
  }
}
