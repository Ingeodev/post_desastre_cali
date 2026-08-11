import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/ui/pages/dashboard/dashboard';
import { List } from './features/report/ui/pages/list/list';

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
    path: '**',
    component: Dashboard,
  },
];
