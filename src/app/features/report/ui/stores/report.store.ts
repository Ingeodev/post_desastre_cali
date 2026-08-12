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
import { IndexDb } from '../../../../core/data/local/db';
import { AttachmentRepository } from '../../data/repositories/attachment.repository';
import { Photo } from '../../domain/models/photo.model';
import { Report } from '../../domain/models/report.model';
import { GetAttachments } from '../../domain/use-cases/get-attachments';
import { GetConstructionTypes } from '../../domain/use-cases/get-construction-types';
import { GetDamageCategories } from '../../domain/use-cases/get-damage-categories';
import { GetDataSources } from '../../domain/use-cases/get-data-sources';
import { GetSeismicEvents } from '../../domain/use-cases/get-seismic-events';
import { SaveAttachment } from '../../domain/use-cases/save-attachment';
import { GetDamageCatalog } from '../../domain/use-cases/get-damage-catalog';
import { DamagePatterns } from '../../../../core/supabase-models/supabase-type-aliases';

const REPORT_ID = '1';

type ReportsState = {
  reports: Report[];
  selectedReport: string | null;
  photos: Photo[];
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
  photos: [],
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
  withProps(() => {
    const repository = new AttachmentRepository(new IndexDb());

    return {
      saveAttachment: new SaveAttachment(repository),
      getAttachments: new GetAttachments(repository),
      getDamageCategories: inject(GetDamageCategories),
      getConstructionTypes: inject(GetConstructionTypes),
      getDataSources: inject(GetDataSources),
      getSeismicEvents: inject(GetSeismicEvents),
      getDamageCatalog: inject(GetDamageCatalog)
    };
  }),
  withMethods((store) => ({
    async loadPhotos(): Promise<void> {
      const photos = await store.getAttachments.execute(REPORT_ID);

      patchState(store, { photos });
    },
  })),
  withMethods((store) => ({
    async savePhoto(file: Blob): Promise<void> {
      const photo: Photo = {
        id: crypto.randomUUID(),
        url: '',
        file,
      };

      await store.saveAttachment.execute(photo, REPORT_ID);
      await store.loadPhotos();
    },
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
