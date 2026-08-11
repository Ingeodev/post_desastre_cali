import { mapPhotoToAttachment } from '../../data/mappers/attachment.mapper';
import { AttachmentRepository } from '../../data/repositories/attachment.repository';
import { Photo } from '../models/photo.model';

export class SaveAttachment {
  constructor(private readonly repository: AttachmentRepository) {}

  async execute(photo: Photo, reportId: string): Promise<void> {
    const attachment = mapPhotoToAttachment(photo, reportId);

    await this.repository.save(attachment);
  }
}
