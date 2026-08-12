import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReportStore } from '../../stores/report.store';
import { MapForm } from "../../components/map-form/map-form";
import { NewReportForm } from "../../components/new-report-form/new-report-form";
import { DamagePatternCatalogComponent } from "../../components/damage-catalog/damage-catalog";

@Component({
  selector: 'app-add-report',
  imports: [MapForm, NewReportForm, DamagePatternCatalogComponent],
  templateUrl: './add-report.html',
  styleUrl: './add-report.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddReport {

  store = inject(ReportStore);

  onDamagePatternsChange($event: { active: boolean|null; code: string; description: string|null; id: number; label: string; reference_image_url: string|null; }[]) {
    throw new Error('Method not implemented.');
  }
}
