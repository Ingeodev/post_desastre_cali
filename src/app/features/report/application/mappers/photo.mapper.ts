import { InspectionPhotoEntity } from '../../data/entities/inspection-photo.entity';

export function toLocalPhoto(input: {
  id: string;
  inspectionId: string | null;
  blob: Blob;
  takenAt?: string;
  sequence?: number;
}): InspectionPhotoEntity {
  return {
    id: input.id,
    inspectionId: input.inspectionId,
    sequence: input.sequence ?? 0,
    storagePath: null,
    blob: input.blob,
    mimeType: input.blob.type,
    takenAt: input.takenAt ?? new Date().toISOString(),
    uploadedAt: null,
    syncStatus: 'PENDING_UPLOAD',
  };
}

export function getLocalPhotoUrl(photo: InspectionPhotoEntity): string | null {
  return photo.blob ? URL.createObjectURL(photo.blob) : null;
}

export async function resizePhoto(
  blob: Blob,
  maxSideRatio = 0.6,
): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  const maxSide = window.innerWidth * maxSideRatio;

  const scale = Math.min(
    1,
    maxSide / bitmap.width,
    maxSide / bitmap.height,
  );

  if (scale >= 1) {
    bitmap.close();
    return blob;
  }

  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  if (!context) {
    bitmap.close();
    return blob;
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (output) =>
        output
          ? resolve(output)
          : reject(new Error('Failed to resize photo')),
      'image/jpeg',
      0.85,
    );
  });
}