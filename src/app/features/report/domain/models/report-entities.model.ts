import { InspectionEntity } from '../../data/entities/inspection.entity';
import { InspectionOccupancyEntity } from '../../data/entities/inspection-occupancy.entity';
import { InspectionPatternEntity } from '../../data/entities/inspection-pattern.entity';
import { InspectionPhotoEntity } from '../../data/entities/inspection-photo.entity';

export interface ReportEntities {
  inspection: InspectionEntity;
  occupancy: InspectionOccupancyEntity | null;
  patterns: InspectionPatternEntity[];
  photos: InspectionPhotoEntity[];
}
