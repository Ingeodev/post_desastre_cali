import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Fab } from '../../../../../shared/components/fab/fab';
import { ReportStore } from '../../stores/report.store';

@Component({
  selector: 'app-add-report',
  imports: [Fab],
  templateUrl: './add-report.html',
  styleUrl: './add-report.css',
  providers: [ReportStore],
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
}
