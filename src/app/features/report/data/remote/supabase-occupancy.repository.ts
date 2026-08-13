import { Injectable } from '@angular/core';
import { supabase } from '../../../../core/data/supabase/supabase-client';
import { InspectionOccupancyRepository } from '../../domain/interfaces/inspection-occupancy.repository';
import { InspectionOccupancyEntity } from '../entities/inspection-occupancy.entity';

@Injectable({ providedIn: 'root' })
export class SupabaseInspectionOccupancyRepository
  implements InspectionOccupancyRepository
{
  async saveLocal(_occupancy: InspectionOccupancyEntity): Promise<void> {
    throw new Error('SupabaseInspectionOccupancyRepository does not support saveLocal');
  }

  async saveRemote(occupancy: InspectionOccupancyEntity): Promise<void> {
    const { error } = await supabase
      .from('damage_inspection_occupancy')
      .upsert(
        {
          inspection_id: occupancy.inspectionId,
          created_at: occupancy.createdAt,
          estimated_residents: occupancy.estimatedResidents,
          has_trapped_people: occupancy.hasTrappedPeople,
          is_currently_occupied: occupancy.isCurrentlyOccupied,
        },
        { onConflict: 'inspection_id' },
      );

    if (error) {
      throw error;
    }
  }

  async getByInspectionId(
    inspectionId: string,
  ): Promise<InspectionOccupancyEntity | undefined> {
    const { data } = await supabase
      .from('damage_inspection_occupancy')
      .select('*')
      .eq('inspection_id', inspectionId)
      .single();

    if (!data) {
      return undefined;
    }

    return {
      id: data.inspection_id,
      inspectionId: data.inspection_id,
      createdAt: data.created_at,
      estimatedResidents: data.estimated_residents,
      hasTrappedPeople: data.has_trapped_people,
      isCurrentlyOccupied: data.is_currently_occupied,
    };
  }

  async deleteLocal(_inspectionId: string): Promise<void> {
    throw new Error('SupabaseInspectionOccupancyRepository does not support deleteLocal');
  }

  async deleteRemote(inspectionId: string): Promise<void> {
    const { error } = await supabase
      .from('damage_inspection_occupancy')
      .delete()
      .eq('inspection_id', inspectionId);

    if (error) {
      throw error;
    }
  }
}