import { Photo } from '../../domain/models/photo.model';
import { AttachmentEntity } from '../entities/attachment.entity';

export function mapPhotoToAttachment(photo: Photo, reportId: string): AttachmentEntity {
  return {
    id: photo.id,
    reportId,
    blob: photo.file,
    mimeType: photo.file.type,
    createdAt: Date.now(),
  };
}

export function mapAttachmentToPhoto(attachment: AttachmentEntity): Photo {
  return {
    id: attachment.id,
    url: URL.createObjectURL(attachment.blob),
      //.replace('localhost', '192.168.1.5'),
    file: attachment.blob,
  };
}
