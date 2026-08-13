import { Component, inject } from '@angular/core';
import { ReportStore } from '../../stores/report.store';
import { ReportList } from '../../components/report-list/report-list';

@Component({
  selector: 'app-list',
  imports: [ReportList],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  readonly store = inject(ReportStore);

  constructor() {
    this.store.loadSummaries();
  }
}