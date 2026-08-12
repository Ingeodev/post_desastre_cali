import { Routes } from '@angular/router';
import { List } from './features/report/ui/pages/list/list';
import { AddReport } from './features/report/ui/pages/add-report/add-report';
import { AddReport2 } from './features/report/ui/pages/add-report-2/add-report-2';

export const routes: Routes = [
  {
    path: '',
    component: AddReport2,
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
    component: AddReport2,
  },
];
