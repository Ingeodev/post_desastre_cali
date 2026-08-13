import { InspectionPhotoEntity } from '../../data/entities/inspection-photo.entity';
import { ReportEntities } from '../../domain/models/report-entities.model';
import { ReportProfile } from '../../domain/models/report-profile.model';
import { ReportSummary } from '../../domain/models/report-summary.model';

export type PublicUrlResolver = (storagePath: string) => string;

function sortBySequence(photos: InspectionPhotoEntity[]): InspectionPhotoEntity[] {
  return [...photos].sort((a, b) => a.sequence - b.sequence);
}

export function toLocalPhotoUrl(
  photo: InspectionPhotoEntity,
  publicUrl: PublicUrlResolver,
): string | null {
  if (photo.blob) {
    return URL.createObjectURL(photo.blob);
  }

  if (photo.storagePath) {
    return publicUrl(photo.storagePath);
  }

  return null;
}

export function toLocalReportSummary(
  report: ReportEntities,
  publicUrl: PublicUrlResolver,
): ReportSummary {
  const firstPhoto = sortBySequence(report.photos)[0];

  return {
    id: report.inspection.id,
    addressText: report.inspection.addressText,
    damageCategoryId: report.inspection.damageCategoryId,
    damageCategoryLabel: null,
    capturedAt: report.inspection.capturedAt,
    notes: report.inspection.notes,
    firstPhotoUrl: firstPhoto
      ? toLocalPhotoUrl(firstPhoto, publicUrl)
      : null,
    source: 'local',
  };
}

export function toLocalReportProfile(
  report: ReportEntities,
  publicUrl: PublicUrlResolver,
): ReportProfile {
  return {
    inspection: report.inspection,
    occupancy: report.occupancy,
    patterns: report.patterns,
    photos: sortBySequence(report.photos)
      .filter((photo) => toLocalPhotoUrl(photo, publicUrl) !== null)
      .map((photo) => ({
        id: photo.id,
        sequence: photo.sequence,
        takenAt: photo.takenAt,
        url: toLocalPhotoUrl(photo, publicUrl)!,
      })),
  };
}
