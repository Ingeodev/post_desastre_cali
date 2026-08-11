import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/ui/pages/dashboard/dashboard';
import { List } from './features/report/ui/pages/list/list';
import { AddReport } from './features/report/ui/pages/add-report/add-report';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
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
    component: Dashboard,
  },
];
