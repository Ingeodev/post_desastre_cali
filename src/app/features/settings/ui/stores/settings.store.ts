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
import { SeismicEvents } from '../../../../core/supabase-models/supabase-type-aliases';
import { SeismicEventEntity } from '../../data/entities/seismic-event.entity';
import { GetSettings } from '../../domain/use-cases/get-settings';
import { UpdateSettings } from '../../domain/use-cases/update-settings';
import { GetSeismicEvents } from '../../../../shared/use-cases/get-seismic-events';

interface SettingsState {
  email: string | null;
  event: SeismicEventEntity | null;
  seismicEvents: SeismicEvents[];
  hydrated: boolean;
}

const initialState: SettingsState = {
  email: null,
  event: null,
  seismicEvents: [],
  hydrated: false,
};

export const SettingsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    getSettings: inject(GetSettings),
    updateSettings: inject(UpdateSettings),
    getSeismicEvents: inject(GetSeismicEvents),
  })),
  withComputed((store) => ({
    isConfigured: computed(
      () => store.email() !== null && store.event() !== null,
    ),
  })),
  withMethods((store) => {
    let loadSettingsPromise: Promise<void> | undefined;

    return {
      loadSettings(): Promise<void> {
        if (store.hydrated()) {
          return Promise.resolve();
        }

        if (loadSettingsPromise) {
          return loadSettingsPromise;
        }

        loadSettingsPromise = store
          .getSettings
          .execute()
          .then((settings) => {
            patchState(store, {
              email: settings?.email ?? null,
              event: settings?.event ?? null,
              hydrated: true,
            });
          })
          .finally(() => {
            loadSettingsPromise = undefined;
          });

        return loadSettingsPromise;
      },

      loadSeismicEvents(): void {
        if (store.seismicEvents().length > 0) {
          return;
        }

        store
          .getSeismicEvents
          .execute()
          .subscribe((seismicEvents) => {
            if (seismicEvents.length > 0) {
              patchState(store, { seismicEvents });
            }
          });
      },

      async saveSettings(
        email: string,
        event: SeismicEventEntity,
      ): Promise<void> {
        await store.updateSettings.execute({ email, event });
        patchState(store, { email, event, hydrated: true });
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.loadSettings();
      store.loadSeismicEvents();
    },
  }),
);