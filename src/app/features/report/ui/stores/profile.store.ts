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
    getReportProfile: inject(GetReportProfile),
  })),
  withMethods((store) => ({
    async load(id: string): Promise<void> {
      if (store.isLoading()) {
        return;
      }

      patchState(store, { isLoading: true, error: null });

      try {
        const profile = await store.getReportProfile.execute(id);

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
