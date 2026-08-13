import { Injectable } from '@angular/core';
import { IndexDb } from '../../../../core/data/local/db';
import { INDEX_DB_STORES } from '../../../../core/data/local/db-stores';
import { SeismicEventEntity } from '../entities/seismic-event.entity';
import { SeismicEventRepository } from '../../domain/interfaces/seismic-event.repository';

@Injectable({ providedIn: 'root' })
export class IndexedDbSeismicEventRepository
  implements SeismicEventRepository
{
  constructor(private readonly db: IndexDb) {}

  async saveLocal(event: SeismicEventEntity): Promise<void> {
    await this.db.put(INDEX_DB_STORES.seismicEvents, event);
  }

  async getLocal(id: string): Promise<SeismicEventEntity | undefined> {
    return this.db.get<SeismicEventEntity>(INDEX_DB_STORES.seismicEvents, id);
  }

  async getAllLocal(): Promise<SeismicEventEntity[]> {
    return this.db.getAll<SeismicEventEntity>(INDEX_DB_STORES.seismicEvents);
  }

  async deleteLocal(id: string): Promise<void> {
    await this.db.delete(INDEX_DB_STORES.seismicEvents, id);
  }
}