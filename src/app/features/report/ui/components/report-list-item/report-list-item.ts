import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ReportSummary } from '../../../domain/models/report-summary.model';

@Component({
  selector: 'app-report-list-item',
  imports: [ButtonModule, TagModule, DatePipe],
  templateUrl: './report-list-item.html',
  styleUrl: './report-list-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportListItem {
  readonly summary = input.required<ReportSummary>();

  private readonly router = inject(Router);

  goToDetail(): void {
    this.router.navigate(['/reportes', this.summary().id]);
  }
}