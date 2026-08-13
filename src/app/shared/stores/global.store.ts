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
import { MessageService } from 'primeng/api';
import { ConnectivityService } from '../../core/connectivity/connectivity.service';
import { SupabaseAuthService } from '../../core/data/supabase/supabase-auth.service';
import { SyncReportsUseCase } from '../../features/report/domain/use-cases/sync-reports';

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Intenta nuevamente.';
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface GlobalState {
  syncStatus: SyncStatus;
  pendingCount: number;
  isRegistering: boolean;
}

const initialState: GlobalState = {
  syncStatus: 'idle',
  pendingCount: 0,
  isRegistering: false,
};

export const GlobalStore = signalStore(
  { providedIn: 'root' },
  withState<GlobalState>(initialState),
  withProps(() => ({
    connectivity: inject(ConnectivityService),
    syncReports: inject(SyncReportsUseCase),
    supabaseAuth: inject(SupabaseAuthService),
    messageService: inject(MessageService),
  })),
  withComputed((store) => ({
    isOnline: computed(() => store.connectivity.isOnline()),
    isSyncing: computed(() => store.syncStatus() === 'syncing'),
    syncProgress: computed(() => store.syncReports.progress()),
    canSync: computed(
      () =>
        store.connectivity.isOnline() &&
        store.pendingCount() > 0 &&
        !store.isRegistering() &&
        store.syncStatus() !== 'syncing',
    ),
  })),
  withMethods((store) => ({
    setRegistering(isRegistering: boolean): void {
      patchState(store, { isRegistering });
    },

    async refreshPendingCount(): Promise<void> {
      const pendingCount = await store.syncReports.pendingCount();
      patchState(store, { pendingCount });
    },
  })),
  withMethods((store) => ({
    async syncNow(): Promise<void> {
      if (!store.canSync()) {
        return;
      }

      patchState(store, { syncStatus: 'syncing' });

      try {
        await store.supabaseAuth.ensureSession();
        await store.syncReports.run();
        await store.refreshPendingCount();
        patchState(store, { syncStatus: 'idle' });
        store.messageService.add({
          severity: 'success',
          summary: 'Sincronización completada',
          detail: 'Tus reportes pendientes ya están almacenados de forma remota.',
        });
      } catch (error) {
        console.error('Sync failed', error);
        await store.refreshPendingCount();
        patchState(store, { syncStatus: 'error' });
        store.messageService.add({
          severity: 'error',
          summary: 'Error al sincronizar',
          detail: `No se pudieron sincronizar los reportes. ${errorMessage(error)}`,
        });
      }
    },
  })),
  withHooks((store) => ({
    onInit(): void {
      store.connectivity.start();

      void store.refreshPendingCount();
    },
  })),
);
