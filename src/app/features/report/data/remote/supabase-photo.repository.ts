import { Injectable } from '@angular/core';
import { supabase } from '../../../../core/data/supabase/supabase-client';
import { InspectionPhotoRepository } from '../../domain/interfaces/inspection-photo.repository';
import { InspectionPhotoEntity } from '../entities/inspection-photo.entity';

export const PHOTOS_BUCKET = 'inspection_images';

@Injectable({ providedIn: 'root' })
export class SupabaseInspectionPhotoRepository
  implements InspectionPhotoRepository
{
  async saveLocal(_photo: InspectionPhotoEntity): Promise<void> {
    throw new Error('SupabaseInspectionPhotoRepository does not support saveLocal');
  }

  async saveRemote(photo: InspectionPhotoEntity): Promise<void> {
    if (!photo.storagePath) {
      throw new Error('cannot persist a photo without storagePath');
    }

    if (!photo.inspectionId) {
      throw new Error('cannot persist a photo without inspectionId');
    }

    const { error } = await supabase
      .from('damage_inspection_photos')
      .upsert(
        {
          id: photo.id,
          inspection_id: photo.inspectionId,
          sequence: photo.sequence,
          storage_path: photo.storagePath,
          taken_at: photo.takenAt,
          uploaded_at: photo.uploadedAt,
        },
        { onConflict: 'id' },
      );

    if (error) {
      throw error;
    }
  }

  async getLocal(_id: string): Promise<InspectionPhotoEntity | undefined> {
    throw new Error('SupabaseInspectionPhotoRepository does not support getLocal');
  }

  async getByInspectionId(
    inspectionId: string,
  ): Promise<InspectionPhotoEntity[]> {
    const { data } = await supabase
      .from('damage_inspection_photos')
      .select('*')
      .order('sequence', { ascending: true })
      .eq('inspection_id', inspectionId);

    return (data ?? []).map(
      (row): InspectionPhotoEntity => ({
        id: row.id,
        inspectionId: row.inspection_id,
        sequence: row.sequence ?? 0,
        storagePath: row.storage_path,
        blob: null,
        mimeType: '',
        takenAt: row.taken_at ?? '',
        uploadedAt: row.uploaded_at,
        syncStatus: 'CACHED_FROM_REMOTE',
      }),
    );
  }

  async getAllLocal(): Promise<InspectionPhotoEntity[]> {
    throw new Error('SupabaseInspectionPhotoRepository does not support getAllLocal');
  }

  async getPendingUploads(): Promise<InspectionPhotoEntity[]> {
    throw new Error('SupabaseInspectionPhotoRepository does not support getPendingUploads');
  }

  async deleteLocal(_id: string): Promise<void> {
    throw new Error('SupabaseInspectionPhotoRepository does not support deleteLocal');
  }

  async deleteRemote(id: string): Promise<void> {
    const { error } = await supabase
      .from('damage_inspection_photos')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  async uploadToStorage(
    photo: InspectionPhotoEntity,
  ): Promise<string> {
    if (!photo.blob) {
      throw new Error('cannot upload a photo without blob');
    }

    const path = `${photo.inspectionId ?? 'pending'}/${photo.id}`;

    const { data, error } = await supabase.storage
      .from(PHOTOS_BUCKET)
      .upload(path, photo.blob, {
        contentType: photo.mimeType,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    return data.path;
  }

  getPublicUrl(storagePath: string): string {
    return supabase.storage
      .from(PHOTOS_BUCKET)
      .getPublicUrl(storagePath)
      .data.publicUrl;
  }
}