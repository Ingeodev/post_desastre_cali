import { Routes } from '@angular/router';
import { List } from './features/report/ui/pages/list/list';
import { AddReport } from './features/report/ui/pages/add-report/add-report';
import { Settings } from './features/settings/ui/pages/settings/settings';

export const routes: Routes = [
  {
    path: '',
    component: Settings,
  },
  {
    path: 'reportes',
    component: List,
  },
  {
    path: 'nuevo-reporte',
    component: AddReport,
  },
  {
    path: '**',
    component: Settings,
  },
];