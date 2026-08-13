import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReportStore } from '../../stores/report.store';
import { ReportListItem } from '../report-list-item/report-list-item';

@Component({
  selector: 'app-report-list',
  imports: [ReportListItem],
  templateUrl: './report-list.html',
  styleUrl: './report-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportList {
  readonly store = inject(ReportStore);

  readonly placeholders = Array.from({ length: 4 }, (_, index) => index);
}