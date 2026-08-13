import { InspectionEntity } from '../../data/entities/inspection.entity';
import { InspectionOccupancyEntity } from '../../data/entities/inspection-occupancy.entity';
import { InspectionPatternEntity } from '../../data/entities/inspection-pattern.entity';

export interface ReportProfilePhoto {
  id: string;
  sequence: number;
  takenAt: string | null;
  url: string;
}

export interface ReportProfile {
  inspection: InspectionEntity;
  occupancy: InspectionOccupancyEntity | null;
  patterns: InspectionPatternEntity[];
  photos: ReportProfilePhoto[];
}