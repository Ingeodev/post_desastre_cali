import { ReportSummary } from '../models/report-summary.model';
import { ReportProfile } from '../models/report-profile.model';

export interface ReportRepository {
  getSummaries(): Promise<ReportSummary[]>;
  getProfileById(id: string): Promise<ReportProfile | undefined>;
}