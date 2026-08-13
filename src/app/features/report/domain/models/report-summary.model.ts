export type ReportSource = 'local' | 'remote';

export interface ReportSummary {
  id: string;
  addressText: string | null;
  damageCategoryId: number;
  damageCategoryLabel: string | null;
  capturedAt: string;
  notes: string | null;
  firstPhotoUrl: string | null;
  source: ReportSource;
}
