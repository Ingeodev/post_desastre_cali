import { Injectable } from '@angular/core';
import { IndexDb } from '../../../../core/data/local/db';
import { INDEX_DB_STORES } from '../../../../core/data/local/db-stores';
import { InspectionOccupancyRepository } from '../../domain/interfaces/inspection-occupancy.repository';
import { InspectionOccupancyEntity } from '../entities/inspection-occupancy.entity';

@Injectable({ providedIn: 'root' })
export class IndexedDbInspectionOccupancyRepository
  implements InspectionOccupancyRepository
{
  constructor(private readonly db: IndexDb) {}

  async saveLocal(occupancy: InspectionOccupancyEntity): Promise<void> {
    await this.db.put(INDEX_DB_STORES.inspectionOccupancy, occupancy);
  }

  saveRemote(_occupancy: InspectionOccupancyEntity): Promise<void> {
    throw new Error('IndexedDbInspectionOccupancyRepository does not support saveRemote');
  }

  async getByInspectionId(
    inspectionId: string,
  ): Promise<InspectionOccupancyEntity | undefined> {
    const occupancies = await this.db.getAll<InspectionOccupancyEntity>(
      INDEX_DB_STORES.inspectionOccupancy,
    );

    return occupancies.find(
      (occupancy) => occupancy.inspectionId === inspectionId,
    );
  }

  async deleteLocal(inspectionId: string): Promise<void> {
    await this.db.delete(INDEX_DB_STORES.inspectionOccupancy, inspectionId);
  }

  deleteRemote(_inspectionId: string): Promise<void> {
    throw new Error('IndexedDbInspectionOccupancyRepository does not support deleteRemote');
  }
}