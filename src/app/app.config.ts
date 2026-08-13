import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

import { provideMaplibreWorker } from '@maplibre/ngx-maplibre-gl/config';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { IngeodevPreset } from '../ingeodev.theme';
import { IndexDb } from './core/data/local/db';
import { SupabaseAuthService } from './core/data/supabase/supabase-auth.service';
import { GlobalStore } from './shared/stores/global.store';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    { provide: IndexDb, useClass: IndexDb },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(() => {
      inject(GlobalStore);
      inject(SupabaseAuthService)
        .ensureSession()
        .catch((error) => {
          console.error('Failed to establish anonymous session', error);
        });
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    providePrimeNG({
      inputVariant: 'outlined',
      theme: {
        preset: IngeodevPreset,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideMaplibreWorker('maplibre-gl-worker.mjs'),
  ],
};
