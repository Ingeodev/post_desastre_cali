import { InspectionEntity, GeoJsonPoint } from '../../data/entities/inspection.entity';

export type InspectionInput = Omit<
  InspectionEntity,
  'id' | 'createdAt' | 'syncedAt' | 'geom'
> & {
  id?: string;
  geom?: GeoJsonPoint | null;
};

export interface InspectionRepository {
  saveLocal(inspection: InspectionEntity): Promise<void>;
  saveRemote(inspection: InspectionInput): Promise<{ id: string }>;
  getLocal(id: string): Promise<InspectionEntity | undefined>;
  getRemote(id: string): Promise<InspectionEntity | undefined>;
  getByDeviceLocalId(deviceLocalId: string): Promise<InspectionEntity | undefined>;
  getAllLocal(): Promise<InspectionEntity[]>;
  getAllRemote(): Promise<InspectionEntity[]>;
  deleteLocal(id: string): Promise<void>;
  deleteRemote(id: string): Promise<void>;
}