import { supabase } from '../../../../core/data/supabase/supabase-client';
import {
  DamageInspections,
  DamageInspectionsInsert,
} from '../../../../core/supabase-models/supabase-type-aliases';
import { InspectionRepository, InspectionInput } from '../../domain/interfaces/inspection.repository';
import { InspectionEntity } from '../entities/inspection.entity';
import { toInspectionEntity, toRemoteInput } from '../../application/mappers/geom.mapper';

export class SupabaseInspectionRepository implements InspectionRepository {
  async saveLocal(_inspection: InspectionEntity): Promise<void> {
    throw new Error('SupabaseInspectionRepository does not support saveLocal');
  }

  async saveRemote(input: InspectionInput): Promise<{ id: string }> {
    const entity: InspectionEntity = {
      id: input.id ?? crypto.randomUUID(),
      geom: input.geom ?? null,
      deviceLocalId: input.deviceLocalId,
      capturedAt: input.capturedAt,
      damageCategoryId: input.damageCategoryId,
      dataSourceId: input.dataSourceId,
      seismicEventId: input.seismicEventId,
      constructionTypeId: input.constructionTypeId,
      deviceId: input.deviceId,
      addressText: input.addressText,
      approxYearBuilt: input.approxYearBuilt,
      notes: input.notes,
      numFloors: input.numFloors,
      reportedBy: input.reportedBy,
      createdAt: null,
      syncedAt: new Date().toISOString(),
    };

    const row = toRemoteInput(entity);

    const insert: DamageInspectionsInsert = {
      id: row.id,
      device_local_id: row.deviceLocalId,
      captured_at: row.capturedAt,
      geom: row.geom as unknown,
      damage_category_id: row.damageCategoryId,
      data_source_id: row.dataSourceId,
      seismic_event_id: row.seismicEventId,
      construction_type_id: row.constructionTypeId,
      device_id: row.deviceId,
      address_text: row.addressText,
      approx_year_built: row.approxYearBuilt,
      notes: row.notes,
      num_floors: row.numFloors,
      reported_by: row.reportedBy,
      created_at: row.createdAt,
      synced_at: row.syncedAt,
    };

    const { error } = await supabase
      .from('damage_inspections')
      .upsert(insert, { onConflict: 'id' });

    if (error) {
      throw error;
    }

    return { id: row.id };
  }

  async getLocal(_id: string): Promise<InspectionEntity | undefined> {
    throw new Error('SupabaseInspectionRepository does not support getLocal');
  }

  async getRemote(id: string): Promise<InspectionEntity | undefined> {
    const { data } = await supabase
      .from('damage_inspections')
      .select('*')
      .eq('id', id)
      .single();

    if (!data) {
      return undefined;
    }

    return this.mapRemoteToEntity(data);
  }

  getByDeviceLocalId(_deviceLocalId: string): Promise<InspectionEntity | undefined> {
    throw new Error(
      'SupabaseInspectionRepository does not support getByDeviceLocalId',
    );
  }

  async getAllLocal(): Promise<InspectionEntity[]> {
    throw new Error('SupabaseInspectionRepository does not support getAllLocal');
  }

  async getAllRemote(): Promise<InspectionEntity[]> {
    const { data } = await supabase
      .from('damage_inspections')
      .select('*')
      .order('captured_at', { ascending: false });

    return (data ?? []).map((row) => this.mapRemoteToEntity(row));
  }

  async deleteLocal(_id: string): Promise<void> {
    throw new Error('SupabaseInspectionRepository does not support deleteLocal');
  }

  async deleteRemote(id: string): Promise<void> {
    const { error } = await supabase
      .from('damage_inspections')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  private mapRemoteToEntity(row: DamageInspections): InspectionEntity {
    return toInspectionEntity({
      id: row.id,
      deviceLocalId: row.device_local_id,
      capturedAt: row.captured_at,
      geom: typeof row.geom === 'string' ? row.geom : null,
      damageCategoryId: row.damage_category_id,
      dataSourceId: row.data_source_id,
      seismicEventId: row.seismic_event_id,
      constructionTypeId: row.construction_type_id,
      deviceId: row.device_id,
      addressText: row.address_text,
      approxYearBuilt: row.approx_year_built,
      notes: row.notes,
      numFloors: row.num_floors,
      reportedBy: row.reported_by,
      createdAt: row.created_at,
      syncedAt: row.synced_at,
    });
  }
}