import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Subscription } from 'rxjs';
import {
  ConstructionTypes,
  DamageCategories,
  DataSources,
  SeismicEvents,
} from '../../../../core/supabase-models/supabase-type-aliases';
import { Report } from '../../domain/models/report.model';
import { GetConstructionTypes } from '../../domain/use-cases/get-construction-types';
import { GetDamageCategories } from '../../domain/use-cases/get-damage-categories';
import { GetDataSources } from '../../domain/use-cases/get-data-sources';
import { GetSeismicEvents } from '../../domain/use-cases/get-seismic-events';
import { GetDamageCatalog } from '../../domain/use-cases/get-damage-catalog';
import { DamagePatterns } from '../../../../core/supabase-models/supabase-type-aliases';

type ReportsState = {
  reports: Report[];
  selectedReport: string | null;
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
  damageCategories: DamageCategories[];
  constructionTypes: ConstructionTypes[];
  dataSources: DataSources[];
  currentSeismicEvent: SeismicEvents | null;
  damageCatalog: DamagePatterns[]
};

const initialState: ReportsState = {
  reports: [],
  selectedReport: null,
  isLoading: false,
  filter: { query: '', order: 'asc' },
  damageCategories: [],
  constructionTypes: [],
  dataSources: [],
  currentSeismicEvent: null,
  damageCatalog: []
};

export const ReportStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    getDamageCategories: inject(GetDamageCategories),
    getConstructionTypes: inject(GetConstructionTypes),
    getDataSources: inject(GetDataSources),
    getSeismicEvents: inject(GetSeismicEvents),
    getDamageCatalog: inject(GetDamageCatalog),
  })),
  withMethods((store) => {
    let catalogsSubscription: Subscription | undefined;

    return {
      loadCatalogs(): void {
        if (catalogsSubscription) {
          return;
        }

        catalogsSubscription = new Subscription();
        catalogsSubscription.add(
          store.getDamageCategories.execute().subscribe((damageCategories) =>
            patchState(store, { damageCategories }),
          ),
        );
        catalogsSubscription.add(
          store.getConstructionTypes.execute().subscribe((constructionTypes) =>
            patchState(store, { constructionTypes }),
          ),
        );
        catalogsSubscription.add(
          store.getDataSources.execute().subscribe((dataSources) =>
            patchState(store, { dataSources }),
          ),
        );
        catalogsSubscription.add(
          store.getSeismicEvents.execute().subscribe((seismicEvents) => {
            if (seismicEvents.length > 0) {
              patchState(store, { currentSeismicEvent: seismicEvents[0] });
            }
          }),
        );
        catalogsSubscription.add(
          store.getDamageCatalog.execute().subscribe((damageCatalog) => {
            if(damageCatalog.length > 0) {
              patchState(store, { damageCatalog: damageCatalog});
            }
          })
        )
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.loadCatalogs();
    },
  }),
);
