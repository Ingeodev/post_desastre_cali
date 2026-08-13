import { SeismicEventEntity } from '../../data/entities/seismic-event.entity';

export interface SeismicEventRepository {
  saveLocal(event: SeismicEventEntity): Promise<void>;
  getLocal(id: string): Promise<SeismicEventEntity | undefined>;
  getAllLocal(): Promise<SeismicEventEntity[]>;
  deleteLocal(id: string): Promise<void>;
}