import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Fab } from '../../../../../shared/components/fab/fab';
import { ReportStore } from '../../stores/report.store';
import { MapForm } from "../../components/map-form/map-form";
import { NewReportForm } from "../../components/new-report-form/new-report-form";
import { NewReportStore } from '../../stores/new-report.store';
import { DamagePatternCatalogComponent } from "../../components/damage-catalog/damage-catalog";

@Component({
  selector: 'app-add-report',
  imports: [Fab, MapForm, NewReportForm, DamagePatternCatalogComponent],
  templateUrl: './add-report.html',
  styleUrl: './add-report.css',
  providers: [ReportStore, NewReportStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddReport {

  store = inject(ReportStore);

  photoBlob: Blob | null = null;

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.photoBlob = file;
    input.value = '';
  }

  onDamagePatternsChange($event: { active: boolean|null; code: string; description: string|null; id: number; label: string; reference_image_url: string|null; }[]) {
    throw new Error('Method not implemented.');
  }
}
