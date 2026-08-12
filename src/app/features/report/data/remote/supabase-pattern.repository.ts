import { supabase } from '../../../../core/data/supabase/supabase-client';
import { InspectionPatternRepository } from '../../domain/interfaces/inspection-pattern.repository';
import { InspectionPatternEntity } from '../entities/inspection-pattern.entity';

export class SupabaseInspectionPatternRepository
  implements InspectionPatternRepository
{
  async saveManyLocal(_patterns: InspectionPatternEntity[]): Promise<void> {
    throw new Error('SupabaseInspectionPatternRepository does not support saveManyLocal');
  }

  async saveManyRemote(patterns: InspectionPatternEntity[]): Promise<void> {
    if (patterns.length === 0) {
      return;
    }

    const { error } = await supabase
      .from('inspection_damage_patterns')
      .upsert(
        patterns.map((pattern) => ({
          inspection_id: pattern.inspectionId,
          pattern_id: pattern.patternId,
        })),
      );

    if (error) {
      throw error;
    }
  }

  async getByInspectionId(
    inspectionId: string,
  ): Promise<InspectionPatternEntity[]> {
    const { data } = await supabase
      .from('inspection_damage_patterns')
      .select('*')
      .eq('inspection_id', inspectionId);

    return (data ?? []).map((row) => ({
      inspectionId: row.inspection_id,
      patternId: row.pattern_id,
    }));
  }

  async deleteByInspectionId(inspectionId: string): Promise<void> {
    const { error } = await supabase
      .from('inspection_damage_patterns')
      .delete()
      .eq('inspection_id', inspectionId);

    if (error) {
      throw error;
    }
  }
}