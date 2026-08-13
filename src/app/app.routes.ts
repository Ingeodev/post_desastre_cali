import { Routes } from '@angular/router';
import { List } from './features/report/ui/pages/list/list';
import { AddReport } from './features/report/ui/pages/add-report/add-report';
import { ReportDetail } from './features/report/ui/pages/report-detail/report-detail';
import { Settings } from './features/settings/ui/pages/settings/settings';
import { settingsGuard } from './features/settings/ui/guards/settings.guard';
import { DefaultLayout } from './shared/layouts/default-layout/default-layout';
import { DetailLayout } from './shared/layouts/detail-layout/detail-layout';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'settings',
  },
  {
    path: 'settings',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: Settings,
      },
    ],
  },
  {
    path: 'reportes',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: List,
      },
    ],
  },
  {
    path: 'reportes/:id',
    component: DetailLayout,
    children: [
      {
        path: '',
        component: ReportDetail,
      },
    ],
  },
  {
    path: 'nuevo-reporte',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: AddReport,
        canActivate: [settingsGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'settings',
  },
];