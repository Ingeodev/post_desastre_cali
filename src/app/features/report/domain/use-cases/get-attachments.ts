import { mapAttachmentToPhoto } from '../../data/mappers/attachment.mapper';
import { AttachmentRepository } from '../../data/repositories/attachment.repository';
import { Photo } from '../models/photo.model';

export class GetAttachments {
  constructor(private readonly repository: AttachmentRepository) {}

  async execute(reportId: string): Promise<Photo[]> {
    const attachments = await this.repository.getByReport(reportId);

    return attachments.map(mapAttachmentToPhoto);
  }
}
