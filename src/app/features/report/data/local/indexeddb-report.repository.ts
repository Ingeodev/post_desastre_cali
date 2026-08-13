import { Injectable } from '@angular/core';
import { IndexDb, IndexDbRecord } from '../../../../core/data/local/db';
import { INDEX_DB_STORES } from '../../../../core/data/local/db-stores';
import { ReportEntities } from '../../domain/models/report-entities.model';
import { InspectionEntity } from '../entities/inspection.entity';
import { IndexedDbInspectionRepository } from './indexeddb-inspection.repository';
import { IndexedDbInspectionOccupancyRepository } from './indexeddb-occupancy.repository';
import { IndexedDbInspectionPatternRepository } from './indexeddb-pattern.repository';
import { IndexedDbInspectionPhotoRepository } from './indexeddb-photo.repository';

@Injectable({ providedIn: 'root' })
export class IndexedDbReportRepository {
  constructor(
    private readonly db: IndexDb,
    private readonly inspectionRepository: IndexedDbInspectionRepository,
    private readonly occupancyRepository: IndexedDbInspectionOccupancyRepository,
    private readonly patternRepository: IndexedDbInspectionPatternRepository,
    private readonly photoRepository: IndexedDbInspectionPhotoRepository,
  ) {}

  async save(entities: ReportEntities): Promise<void> {
    const records: IndexDbRecord[] = [
      { store: INDEX_DB_STORES.inspections, value: entities.inspection },
      ...(entities.occupancy
        ? [
            {
              store: INDEX_DB_STORES.inspectionOccupancy,
              value: entities.occupancy,
            },
          ]
        : []),
      ...entities.patterns.map((pattern) => ({
        store: INDEX_DB_STORES.inspectionPatterns,
        value: pattern,
      })),
      ...entities.photos.map((photo) => ({
        store: INDEX_DB_STORES.inspectionPhotos,
        value: photo,
      })),
    ];

    await this.db.putInTransaction(records);
  }

  async getById(id: string): Promise<ReportEntities | undefined> {
    const inspection = await this.inspectionRepository.getLocal(id);

    if (!inspection) {
      return undefined;
    }

    return this.hydrate(inspection);
  }

  async getAll(): Promise<ReportEntities[]> {
    const inspections = await this.inspectionRepository.getAllLocal();

    return Promise.all(inspections.map((inspection) => this.hydrate(inspection)));
  }

  async delete(id: string): Promise<void> {
    await this.inspectionRepository.deleteLocal(id);
    await this.occupancyRepository.deleteLocal(id);
    await this.patternRepository.deleteByInspectionId(id);

    const photos = await this.photoRepository.getByInspectionId(id);

    for (const photo of photos) {
      await this.photoRepository.deleteLocal(photo.id);
    }
  }

  private async hydrate(inspection: InspectionEntity): Promise<ReportEntities> {
    const [occupancy, patterns, photos] = await Promise.all([
      this.occupancyRepository.getByInspectionId(inspection.id),
      this.patternRepository.getByInspectionId(inspection.id),
      this.photoRepository.getByInspectionId(inspection.id),
    ]);

    return {
      inspection,
      occupancy: occupancy ?? null,
      patterns,
      photos,
    };
  }
}
