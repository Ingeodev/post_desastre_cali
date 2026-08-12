import { IndexDb } from '../../../../core/data/local/db';
import { INDEX_DB_STORES } from '../../../../core/data/local/db-stores';
import { InspectionPhotoRepository } from '../../domain/interfaces/inspection-photo.repository';
import { InspectionPhotoEntity } from '../entities/inspection-photo.entity';

export class IndexedDbInspectionPhotoRepository
  implements InspectionPhotoRepository
{
  constructor(private readonly db: IndexDb) {}

  async saveLocal(photo: InspectionPhotoEntity): Promise<void> {
    await this.db.put(INDEX_DB_STORES.inspectionPhotos, photo);
  }

  saveRemote(_photo: InspectionPhotoEntity): Promise<void> {
    throw new Error('IndexedDbInspectionPhotoRepository does not support saveRemote');
  }

  async getLocal(id: string): Promise<InspectionPhotoEntity | undefined> {
    return this.db.get<InspectionPhotoEntity>(
      INDEX_DB_STORES.inspectionPhotos,
      id,
    );
  }

  async getByInspectionId(
    inspectionId: string,
  ): Promise<InspectionPhotoEntity[]> {
    const photos = await this.getAllLocal();

    return photos.filter(
      (photo) => photo.inspectionId === inspectionId,
    );
  }

  async getAllLocal(): Promise<InspectionPhotoEntity[]> {
    return this.db.getAll<InspectionPhotoEntity>(
      INDEX_DB_STORES.inspectionPhotos,
    );
  }

  async getPendingUploads(): Promise<InspectionPhotoEntity[]> {
    const photos = await this.getAllLocal();

    return photos.filter(
      (photo) => photo.syncStatus === 'PENDING_UPLOAD',
    );
  }

  async deleteLocal(id: string): Promise<void> {
    await this.db.delete(INDEX_DB_STORES.inspectionPhotos, id);
  }

  deleteRemote(_id: string): Promise<void> {
    throw new Error('IndexedDbInspectionPhotoRepository does not support deleteRemote');
  }
}