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
  const source = await decodePhoto(blob);
  const maxSide = window.innerWidth * maxSideRatio;

  const scale = Math.min(
    1,
    maxSide / source.width,
    maxSide / source.height,
  );

  if (scale >= 1) {
    closeSource(source);
    return blob;
  }

  const width = Math.round(source.width * scale);
  const height = Math.round(source.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  if (!context) {
    closeSource(source);
    return blob;
  }

  context.drawImage(source, 0, 0, width, height);
  closeSource(source);

  return canvasToJpegBlob(canvas);
}

async function decodePhoto(
  blob: Blob,
): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap !== 'undefined') {
    try {
      return await createImageBitmap(blob);
    } catch {
      // WebKit can fail to decode some formats (e.g. HEIC) via createImageBitmap.
    }
  }

  return decodeViaImageElement(blob);
}

function decodeViaImageElement(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode photo for resize'));
    };

    image.src = url;
  });
}

function closeSource(source: ImageBitmap | HTMLImageElement): void {
  if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
    source.close();
  }
}

async function canvasToJpegBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (output) => resolve(output ?? dataUrlToJpegBlob(canvas)),
      'image/jpeg',
      0.85,
    );
  });
}

function dataUrlToJpegBlob(canvas: HTMLCanvasElement): Blob {
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  const binary = atob(dataUrl.split(',')[1]);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: 'image/jpeg' });
}