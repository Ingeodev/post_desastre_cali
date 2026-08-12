import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import { DamageInspectionsInsert } from '../../../../core/supabase-models/supabase-type-aliases';
import { MapStore } from './map.store';
import { InspectionPhotoEntity } from '../../data/entities/inspection-photo.entity';
import { resizePhoto, toLocalPhoto } from '../../application/mappers/photo.mapper';

export interface NewReportDraft {
  addressText: string;
  approxYearBuilt: number | null;
  capturedAt: string;
  constructionTypeId: number | null;
  damageCategoryId: number | null;
  dataSourceId: number | null;
  notes: string;
  numFloors: number | null;
  reportedBy: string;
  seismicEventId: string | null;
  geom: { type: 'Point', coordinates: [number, number]}| null
}

const initialDraft: NewReportDraft = {
  addressText: '',
  approxYearBuilt: null,
  capturedAt: new Date().toISOString(),
  constructionTypeId: null,
  damageCategoryId: null,
  dataSourceId: null,
  notes: '',
  numFloors: null,
  reportedBy: '',
  seismicEventId: null,
  geom: null
};

interface NewReportState {
  report: NewReportDraft
  photos: InspectionPhotoEntity[]
}

const initilState = {
  report: initialDraft,
  photos: [] as InspectionPhotoEntity[],
}

export const NewReportStore = signalStore(
  withState<NewReportState>(initilState),
  withMethods((store) => {
    const mapStore = inject(MapStore);

    return {
      updateDraft(partial: Partial<NewReportDraft>): void {
        patchState(store, {report: { ...store.report(), ...partial}});
      },

      resetDraft(): void {
        patchState(store, {report: initialDraft});
      },

      setCoordinates(coordinates: [number, number] ) {
        patchState(store, { report: {
          ...store.report(),
          geom: { type: 'Point', coordinates: coordinates},
        }})
      },

      async addPhoto(blob: Blob): Promise<void> {
        const resized = await resizePhoto(blob);

        const photo = toLocalPhoto({
          id: crypto.randomUUID(),
          inspectionId: null,
          blob: resized,
          sequence: store.photos().length,
        });

        patchState(store, { photos: [...store.photos(), photo]});
      },

      removePhoto(id: string): void {
        patchState(store, {
          photos: store.photos().filter(photo => photo.id !== id),
        });
      },

      buildReport(): DamageInspectionsInsert {

        return {
          captured_at: store.report.capturedAt(),
          damage_category_id: store.report.damageCategoryId() ?? 0,
          data_source_id: store.report.dataSourceId() ?? 0,
          seismic_event_id: store.report.seismicEventId() ?? '',
          construction_type_id: store.report.constructionTypeId(),
          device_local_id: crypto.randomUUID(),
          geom: store.report.geom(),
          address_text: store.report.addressText() || null,
          approx_year_built: store.report.approxYearBuilt(),
          notes: store.report.notes() || null,
          num_floors: store.report.numFloors(),
          reported_by: store.report.reportedBy() || null,
        };
      },
    };
  }),
);