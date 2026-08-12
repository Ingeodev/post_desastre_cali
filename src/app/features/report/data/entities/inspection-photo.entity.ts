export type PhotoSyncStatus =
  | 'PENDING_UPLOAD'
  | 'UPLOADED'
  | 'CACHED_FROM_REMOTE'
  | 'FAILED';

export interface InspectionPhotoEntity {
  id: string;
  inspectionId: string | null;
  sequence: number;
  storagePath: string | null;
  blob: Blob | null;
  mimeType: string;
  takenAt: string;
  uploadedAt: string | null;
  syncStatus: PhotoSyncStatus;
}

export type InspectionPhotoRemote = Omit<
  InspectionPhotoEntity,
  'blob' | 'syncStatus'
>;