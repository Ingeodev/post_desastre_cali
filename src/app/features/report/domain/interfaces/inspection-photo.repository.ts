import { InspectionPhotoEntity } from '../../data/entities/inspection-photo.entity';

export interface InspectionPhotoRepository {
  saveLocal(photo: InspectionPhotoEntity): Promise<void>;
  saveRemote(photo: InspectionPhotoEntity): Promise<void>;
  getLocal(id: string): Promise<InspectionPhotoEntity | undefined>;
  getByInspectionId(inspectionId: string): Promise<InspectionPhotoEntity[]>;
  getAllLocal(): Promise<InspectionPhotoEntity[]>;
  getPendingUploads(): Promise<InspectionPhotoEntity[]>;
  deleteLocal(id: string): Promise<void>;
  deleteRemote(id: string): Promise<void>;
}