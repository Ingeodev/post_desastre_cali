import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReportStore } from '../../stores/report.store';

@Component({
  selector: 'app-add-report',
  imports: [],
  templateUrl: './add-report.html',
  styleUrl: './add-report.css',
    providers: [ReportStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddReport {

  store = inject(ReportStore)
  

  photoBlob: Blob | null = null;
  photoUrl: string | null = null;

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // File ya es un Blob, pero puedes conservarlo como Blob
    this.photoBlob = file;

    // Liberar la URL anterior si existía
    if (this.photoUrl) {
      URL.revokeObjectURL(this.photoUrl);
    }

    // Crear URL temporal para mostrar la imagen
    this.photoUrl = URL.createObjectURL(this.photoBlob);

    // Permitir seleccionar/tomar nuevamente
    input.value = '';

    console.log('Blob:', this.photoBlob);
    console.log('URL:', this.photoUrl);
  }

  ngOnDestroy(): void {
    if (this.photoUrl) {
      URL.revokeObjectURL(this.photoUrl);
    }
  }
}
