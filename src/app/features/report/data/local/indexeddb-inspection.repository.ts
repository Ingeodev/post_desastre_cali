import { Injectable } from '@angular/core';
import { IndexDb } from '../../../../core/data/local/db';
import { INDEX_DB_STORES } from '../../../../core/data/local/db-stores';
import { InspectionRepository, InspectionInput } from '../../domain/interfaces/inspection.repository';
import { InspectionEntity } from '../entities/inspection.entity';

@Injectable({ providedIn: 'root' })
export class IndexedDbInspectionRepository implements InspectionRepository {
  constructor(private readonly db: IndexDb) {}

  async saveLocal(inspection: InspectionEntity): Promise<void> {
    await this.db.put(INDEX_DB_STORES.inspections, inspection);
  }

  saveRemote(_inspection: InspectionInput): Promise<{ id: string }> {
    throw new Error('IndexedDbInspectionRepository does not support saveRemote');
  }

  async getLocal(id: string): Promise<InspectionEntity | undefined> {
    return this.db.get<InspectionEntity>(INDEX_DB_STORES.inspections, id);
  }

  getRemote(_id: string): Promise<InspectionEntity | undefined> {
    throw new Error('IndexedDbInspectionRepository does not support getRemote');
  }

  async getByDeviceLocalId(
    deviceLocalId: string,
  ): Promise<InspectionEntity | undefined> {
    const inspections = await this.getAllLocal();

    return inspections.find(
      (inspection) => inspection.deviceLocalId === deviceLocalId,
    );
  }

  async getAllLocal(): Promise<InspectionEntity[]> {
    return this.db.getAll<InspectionEntity>(INDEX_DB_STORES.inspections);
  }

  getAllRemote(): Promise<InspectionEntity[]> {
    throw new Error('IndexedDbInspectionRepository does not support getAllRemote');
  }

  async deleteLocal(id: string): Promise<void> {
    await this.db.delete(INDEX_DB_STORES.inspections, id);
  }

  deleteRemote(_id: string): Promise<void> {
    throw new Error('IndexedDbInspectionRepository does not support deleteRemote');
  }
}