import { InspectionOccupancyEntity } from '../../data/entities/inspection-occupancy.entity';

export interface InspectionOccupancyRepository {
  saveLocal(occupancy: InspectionOccupancyEntity): Promise<void>;
  saveRemote(occupancy: InspectionOccupancyEntity): Promise<void>;
  getByInspectionId(inspectionId: string): Promise<InspectionOccupancyEntity | undefined>;
  deleteLocal(inspectionId: string): Promise<void>;
  deleteRemote(inspectionId: string): Promise<void>;
}