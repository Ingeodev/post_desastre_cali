import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import { DamageInspectionsInsert } from '../../../../core/supabase-models/supabase-type-aliases';
import { MapStore } from './map.store';

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
};

export const NewReportStore = signalStore(
  withState<NewReportDraft>(initialDraft),
  withMethods((store) => {
    const mapStore = inject(MapStore);

    return {
      updateDraft(partial: Partial<NewReportDraft>): void {
        patchState(store, partial);
      },

      resetDraft(): void {
        patchState(store, initialDraft);
      },

      buildReport(): DamageInspectionsInsert {
        const [lng, lat] = mapStore.center();

        return {
          captured_at: store.capturedAt(),
          damage_category_id: store.damageCategoryId() ?? 0,
          data_source_id: store.dataSourceId() ?? 0,
          seismic_event_id: store.seismicEventId() ?? '',
          construction_type_id: store.constructionTypeId(),
          device_local_id: crypto.randomUUID(),
          geom: { type: 'Point', coordinates: [lng, lat] },
          address_text: store.addressText() || null,
          approx_year_built: store.approxYearBuilt(),
          notes: store.notes() || null,
          num_floors: store.numFloors(),
          reported_by: store.reportedBy() || null,
        };
      },
    };
  }),
);