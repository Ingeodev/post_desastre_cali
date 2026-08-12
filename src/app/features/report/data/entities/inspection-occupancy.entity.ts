export interface InspectionOccupancyEntity {
  id: string;
  inspectionId: string;
  createdAt: string;
  estimatedResidents: number | null;
  hasTrappedPeople: boolean | null;
  isCurrentlyOccupied: boolean | null;
}