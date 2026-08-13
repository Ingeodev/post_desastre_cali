import { Injectable, inject } from '@angular/core';
import { supabase } from '../../../../core/data/supabase/supabase-client';
import { ReportProfile } from '../../domain/models/report-profile.model';
import { ReportSummary } from '../../domain/models/report-summary.model';
import { ReportRepository } from '../../domain/interfaces/report.repository';
import { SupabaseInspectionRepository } from './supabase-inspection.repository';
import { SupabaseInspectionOccupancyRepository } from './supabase-occupancy.repository';
import { SupabaseInspectionPatternRepository } from './supabase-pattern.repository';
import { SupabaseInspectionPhotoRepository } from './supabase-photo.repository';

@Injectable({ providedIn: 'root' })
export class SupabaseReportRepository implements ReportRepository {
  private readonly inspectionRemote = inject(SupabaseInspectionRepository);
  private readonly occupancyRemote = inject(SupabaseInspectionOccupancyRepository);
  private readonly patternRemote = inject(SupabaseInspectionPatternRepository);
  private readonly photoRemote = inject(SupabaseInspectionPhotoRepository);

  async getSummaries(): Promise<ReportSummary[]> {
    const inspections = await this.inspectionRemote.getAllRemote();

    if (inspections.length === 0) {
      return [];
    }

    const inspectionIds = inspections.map((inspection) => inspection.id);
    const categoryIds = [
      ...new Set(inspections.map((inspection) => inspection.damageCategoryId)),
    ];

    const [{ data: categoryRows }, { data: photoRows }] = await Promise.all([
      supabase
        .from('damage_categories')
        .select('id, label')
        .in('id', categoryIds),
      supabase
        .from('damage_inspection_photos')
        .select('inspection_id, storage_path, sequence')
        .in('inspection_id', inspectionIds)
        .order('sequence', { ascending: true }),
    ]);

    const labelByCategoryId = new Map(
      (categoryRows ?? []).map((category) => [category.id, category.label]),
    );

    const firstPhotoUrlByInspectionId = new Map<string, string>();
    for (const photo of photoRows ?? []) {
      if (
        photo.inspection_id &&
        photo.storage_path &&
        !firstPhotoUrlByInspectionId.has(photo.inspection_id)
      ) {
        firstPhotoUrlByInspectionId.set(
          photo.inspection_id,
          this.photoRemote.getPublicUrl(photo.storage_path),
        );
      }
    }

    return inspections.map((inspection) => ({
      id: inspection.id,
      addressText: inspection.addressText,
      damageCategoryLabel:
        labelByCategoryId.get(inspection.damageCategoryId) ?? null,
      capturedAt: inspection.capturedAt,
      notes: inspection.notes,
      firstPhotoUrl: firstPhotoUrlByInspectionId.get(inspection.id) ?? null,
    }));
  }

  async getProfileById(id: string): Promise<ReportProfile | undefined> {
    const inspection = await this.inspectionRemote.getRemote(id);

    if (!inspection) {
      return undefined;
    }

    const [occupancy, patterns, photos] = await Promise.all([
      this.occupancyRemote.getByInspectionId(id),
      this.patternRemote.getByInspectionId(id),
      this.photoRemote.getByInspectionId(id),
    ]);

    return {
      inspection,
      occupancy: occupancy ?? null,
      patterns,
      photos: photos
        .filter((photo) => photo.storagePath !== null)
        .map((photo) => ({
          id: photo.id,
          sequence: photo.sequence,
          takenAt: photo.takenAt,
          url: this.photoRemote.getPublicUrl(photo.storagePath!),
        })),
    };
  }
}