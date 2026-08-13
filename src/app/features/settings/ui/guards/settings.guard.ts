import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { SettingsStore } from '../stores/settings.store';

export const settingsGuard: CanActivateFn = async (): Promise<
  boolean | UrlTree
> => {
  const store = inject(SettingsStore);
  const router = inject(Router);

  await store.loadSettings();

  if (store.isConfigured()) {
    return true;
  }

  return router.createUrlTree(['/settings']);
};