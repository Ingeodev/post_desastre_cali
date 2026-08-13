import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ReportStore } from '../../stores/report.store';
import { InspectionPatternEntity } from '../../../data/entities/inspection-pattern.entity';

@Component({
  selector: 'app-report-detail-patterns',
  imports: [],
  templateUrl: './report-detail-patterns.html',
  styleUrl: './report-detail-patterns.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportDetailPatterns {
  readonly patterns = input.required<InspectionPatternEntity[]>();

  readonly store = inject(ReportStore);

  readonly labels = computed(() =>
    this.patterns().map((pattern) => {
      const catalog = this.store.damageCatalog().find(
        (item) => item.id === pattern.patternId,
      );

      return {
        id: pattern.patternId,
        label: catalog?.label ?? `Patrón #${pattern.patternId}`,
      };
    }),
  );
}