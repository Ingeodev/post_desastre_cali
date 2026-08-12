import { IndexDb } from '../../../../core/data/local/db';
import { INDEX_DB_STORES } from '../../../../core/data/local/db-stores';
import { InspectionPatternRepository } from '../../domain/interfaces/inspection-pattern.repository';
import { InspectionPatternEntity } from '../entities/inspection-pattern.entity';

export class IndexedDbInspectionPatternRepository
  implements InspectionPatternRepository
{
  constructor(private readonly db: IndexDb) {}

  async saveManyLocal(patterns: InspectionPatternEntity[]): Promise<void> {
    for (const pattern of patterns) {
      await this.db.put(INDEX_DB_STORES.inspectionPatterns, pattern);
    }
  }

  saveManyRemote(_patterns: InspectionPatternEntity[]): Promise<void> {
    throw new Error('IndexedDbInspectionPatternRepository does not support saveManyRemote');
  }

  async getByInspectionId(
    inspectionId: string,
  ): Promise<InspectionPatternEntity[]> {
    const patterns = await this.db.getAll<InspectionPatternEntity>(
      INDEX_DB_STORES.inspectionPatterns,
    );

    return patterns.filter(
      (pattern) => pattern.inspectionId === inspectionId,
    );
  }

  async deleteByInspectionId(inspectionId: string): Promise<void> {
    const patterns = await this.getByInspectionId(inspectionId);

    for (const pattern of patterns) {
      await this.db.delete(
        INDEX_DB_STORES.inspectionPatterns,
        [pattern.inspectionId, pattern.patternId],
      );
    }
  }
}