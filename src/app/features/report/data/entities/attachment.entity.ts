export interface AttachmentEntity {
  id: string;
  reportId: string;
  blob: Blob;
  mimeType: string;
  createdAt: number;
}