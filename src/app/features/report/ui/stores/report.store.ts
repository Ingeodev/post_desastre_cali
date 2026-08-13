import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Subscription } from 'rxjs';
import {
  ConstructionTypes,
  DamageCategories,
  DamagePatterns,
  DataSources,
  SeismicEvents,
} from '../../../../core/supabase-models/supabase-type-aliases';
import { IndexedDbReportRepository } from '../../data/local/indexeddb-report.repository';
import { ReportSource, ReportSummary } from '../../domain/models/report-summary.model';
import { GetConstructionTypes } from '../../domain/use-cases/get-construction-types';
import { GetDamageCategories } from '../../domain/use-cases/get-damage-categories';
import { GetDataSources } from '../../domain/use-cases/get-data-sources';
import { GetSeismicEvents } from '../../../../shared/use-cases/get-seismic-events';
import { GetDamageCatalog } from '../../domain/use-cases/get-damage-catalog';
import { GetReportSummaries } from '../../domain/use-cases/get-report-summaries';
import { GetLocalReportSummaries } from '../../domain/use-cases/get-local-report-summaries';
import { SyncReportsUseCase } from '../../domain/use-cases/sync-reports';

type ReportsState = {
  localSummaries: ReportSummary[];
  remoteSummaries: ReportSummary[];
  selectedReport: ReportSummary | null;
  isLoading: boolean;
  activeSource: ReportSource;
  filter: { query: string; order: 'asc' | 'desc' };
  damageCategories: DamageCategories[];
  constructionTypes: ConstructionTypes[];
  dataSources: DataSources[];
  currentSeismicEvent: SeismicEvents | null;
  damageCatalog: DamagePatterns[];
};

const initialState: ReportsState = {
  localSummaries: [],
  remoteSummaries: [],
  selectedReport: null,
  isLoading: false,
  activeSource: 'local',
  filter: { query: '', order: 'asc' },
  damageCategories: [],
  constructionTypes: [],
  dataSources: [],
  currentSeismicEvent: null,
  damageCatalog: [],
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
    getReportSummaries: inject(GetReportSummaries),
    getLocalReportSummaries: inject(GetLocalReportSummaries),
    localReportRepository: inject(IndexedDbReportRepository),
    syncReports: inject(SyncReportsUseCase),
  })),
  withComputed((store) => ({
    summaries: computed<ReportSummary[]>(() => {
      if (store.activeSource() === 'remote') {
        return store.remoteSummaries();
      }

      return store.localSummaries().map((summary) => ({
        ...summary,
        damageCategoryLabel:
          store.damageCategories().find(
            (category) => category.id === summary.damageCategoryId,
          )?.label ?? summary.damageCategoryLabel,
      }));
    }),
    localCount: computed(() => store.localSummaries().length),
    remoteCount: computed(() => store.remoteSummaries().length),
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
            if (damageCatalog.length > 0) {
              patchState(store, { damageCatalog: damageCatalog });
            }
          }),
        );
      },

      setSource(source: ReportSource): void {
        patchState(store, { activeSource: source });
      },

      async loadLocalSummaries(): Promise<void> {
        try {
          const localSummaries = await store.getLocalReportSummaries.execute();
          patchState(store, { localSummaries });
        } catch (error) {
          console.error('Failed to load local report summaries', error);
        }
      },

      async loadRemoteSummaries(): Promise<void> {
        try {
          const remoteSummaries = await store.getReportSummaries.execute();
          patchState(store, { remoteSummaries });
        } catch (error) {
          console.error('Failed to load remote report summaries', error);
        }
      },
    };
  }),
  withMethods((store) => ({
    async loadSummaries(): Promise<void> {
      if (store.isLoading()) {
        return;
      }

      patchState(store, { isLoading: true });

      try {
        await Promise.all([
          store.loadLocalSummaries(),
          store.loadRemoteSummaries(),
        ]);
      } finally {
        patchState(store, { isLoading: false });
      }
    },

    selectReport(summary: ReportSummary): void {
      patchState(store, { selectedReport: summary });
    },
  })),
  withHooks({
    onInit(store) {
      store.loadCatalogs();

      store.localReportRepository.changes$.subscribe(() => {
        void store.loadLocalSummaries();
      });

      store.syncReports.changed$.subscribe(() => {
        void store.loadRemoteSummaries();
      });
    },
  }),
);
