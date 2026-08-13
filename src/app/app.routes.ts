import { Routes } from '@angular/router';
import { List } from './features/report/ui/pages/list/list';
import { AddReport } from './features/report/ui/pages/add-report/add-report';
import { Settings } from './features/settings/ui/pages/settings/settings';
import { settingsGuard } from './features/settings/ui/guards/settings.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'settings',
  },
  {
    path: 'settings',
    component: Settings,
  },
  {
    path: 'reportes',
    component: List,
  },
  {
    path: 'nuevo-reporte',
    component: AddReport,
    canActivate: [settingsGuard],
  },
  {
    path: '**',
    redirectTo: 'settings',
  },
];