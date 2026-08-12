import { InspectionPatternEntity } from '../../data/entities/inspection-pattern.entity';

export interface InspectionPatternRepository {
  saveManyLocal(patterns: InspectionPatternEntity[]): Promise<void>;
  saveManyRemote(patterns: InspectionPatternEntity[]): Promise<void>;
  getByInspectionId(inspectionId: string): Promise<InspectionPatternEntity[]>;
  deleteByInspectionId(inspectionId: string): Promise<void>;
}