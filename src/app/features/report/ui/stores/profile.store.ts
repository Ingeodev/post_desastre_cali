import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { ReportProfile } from '../../domain/models/report-profile.model';
import { GetReportProfile } from '../../domain/use-cases/get-report-profile';
import { GetLocalReportProfile } from '../../domain/use-cases/get-local-report-profile';
import { ReportStore } from './report.store';

interface ProfileState {
  profile: ReportProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const ProfileStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    reportStore: inject(ReportStore),
    getReportProfile: inject(GetReportProfile),
    getLocalReportProfile: inject(GetLocalReportProfile),
  })),
  withMethods((store) => ({
    async load(id: string): Promise<void> {
      if (store.isLoading()) {
        return;
      }

      patchState(store, { isLoading: true, error: null });

      try {
        const hasData =
          store.reportStore.localSummaries().length > 0 ||
          store.reportStore.remoteSummaries().length > 0;

        if (!hasData) {
          await store.reportStore.loadSummaries();
        }

        const summary =
          store.reportStore.localSummaries().find((s) => s.id === id) ??
          store.reportStore.remoteSummaries().find((s) => s.id === id);

        const source = summary?.source ?? 'remote';

        const profile =
          source === 'local'
            ? await store.getLocalReportProfile.execute(id)
            : await store.getReportProfile.execute(id);

        if (!profile) {
          patchState(store, {
            isLoading: false,
            error: 'No existe un reporte con ese identificador.',
          });
          return;
        }

        patchState(store, { profile, isLoading: false });
      } catch (error) {
        console.error('Failed to load report profile', error);
        patchState(store, {
          isLoading: false,
          error: 'No se pudo cargar el detalle del reporte.',
        });
      }
    },

    reset(): void {
      patchState(store, initialState);
    },
  })),
);
